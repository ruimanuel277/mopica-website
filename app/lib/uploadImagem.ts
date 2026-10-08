import { supabase } from "./supabase";

const BUCKET = "imagens";
const LARGURA_MAXIMA = 1600;
const QUALIDADE_JPEG = 0.82;

// Marcas do cabeçalho "ftyp" usadas por ficheiros HEIC/HEIF (Samsung, iPhone)
const MARCAS_HEIC = ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"];

async function eHeic(file: File): Promise<boolean> {
  if (/^image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) return true;
  try {
    const cabecalho = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const texto = String.fromCharCode(...cabecalho);
    return texto.slice(4, 8) === "ftyp" && MARCAS_HEIC.includes(texto.slice(8, 12));
  } catch {
    return false;
  }
}

async function descodificar(file: File): Promise<ImageBitmap> {
  if (await eHeic(file)) {
    // Biblioteca de conversão (~3 MB) só é descarregada quando aparece uma foto HEIC
    const { heicTo } = await import("heic-to/next");
    try {
      return await heicTo({ blob: file, type: "bitmap", options: { imageOrientation: "from-image" } });
    } catch {
      throw new Error("não foi possível converter a foto HEIC para JPG");
    }
  }
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // browsers antigos: sem suporte às opções, ou o formato não é uma imagem que saibam ler
    try {
      return await createImageBitmap(file);
    } catch {
      throw new Error("o formato desta foto não é suportado (use JPG, PNG ou HEIC)");
    }
  }
}

// Limites de tempo: no telemóvel uma etapa pode ficar pendurada (rede móvel, pouca
// memória) e sem limite o envio nunca terminava, deixando o campo de fotos bloqueado.
const LIMITE_HEIC_MS = 120_000;
const LIMITE_PREPARAR_MS = 45_000;
const LIMITE_ENVIO_MS = 120_000;

function comLimite<T>(promessa: Promise<T>, ms: number, mensagem: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(mensagem)), ms);
    promessa.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

export type Etapa = "a preparar" | "a converter HEIC para JPG" | "a enviar";

// Converte para JPEG com no máximo 1600px de largura. Fotos já pequenas em JPEG/PNG/WebP
// que não fiquem mais leves são enviadas como estão.
async function prepararFoto(
  file: File,
  onEtapa?: (etapa: Etapa) => void
): Promise<{ conteudo: Blob; extensao: string; tipo: string }> {
  if (file.type === "image/gif") return { conteudo: file, extensao: "gif", tipo: file.type };
  const heic = await eHeic(file);
  onEtapa?.(heic ? "a converter HEIC para JPG" : "a preparar");
  const original = { conteudo: file as Blob, extensao: file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg", tipo: file.type };
  try {
    return await comLimite(
      reduzir(file),
      heic ? LIMITE_HEIC_MS : LIMITE_PREPARAR_MS,
      heic ? "a conversão da foto HEIC demorou demasiado" : "a preparação da foto demorou demasiado"
    );
  } catch (err) {
    // Se não der para reduzir uma foto que o browser já sabe mostrar, envia-a como está
    if (/^image\/(jpeg|png|webp)$/.test(file.type)) return original;
    throw err;
  }
}

async function reduzir(file: File): Promise<{ conteudo: Blob; extensao: string; tipo: string }> {
  const bitmap = await descodificar(file);
  const escala = Math.min(1, LARGURA_MAXIMA / bitmap.width);
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("o telemóvel não conseguiu processar a foto");
  // fundo branco para PNGs com transparência (JPEG não tem canal alfa)
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, largura, altura);
  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALIDADE_JPEG));
  // liberta já a memória do canvas (importante no telemóvel com muitas fotos)
  canvas.width = canvas.height = 0;
  if (!blob) throw new Error("o telemóvel não conseguiu converter a foto para JPG");

  const jaLeve = escala === 1 && blob.size >= file.size && /^image\/(jpeg|png|webp)$/.test(file.type);
  if (jaLeve) return { conteudo: file, extensao: file.type.split("/")[1].replace("jpeg", "jpg"), tipo: file.type };
  return { conteudo: blob, extensao: "jpg", tipo: "image/jpeg" };
}

// Traduz os erros do Supabase/rede para mensagens claras
function mensagemErro(err: unknown): string {
  const texto = err instanceof Error ? err.message : String(err);
  if (/failed to fetch|network|load failed|timeout/i.test(texto)) return "sem ligação à internet ou ligação muito lenta";
  if (/row-level security|unauthorized|jwt|403/i.test(texto)) return "a sessão expirou — saia e entre novamente no admin";
  if (/exceeded|too large|413/i.test(texto)) return "a foto é demasiado grande";
  return texto;
}

// `reduzir` só para fotos: converte em JPEG, por isso não convém a logótipos PNG transparentes
export async function uploadImagem(
  file: File,
  pasta: string,
  reduzirFoto = false,
  onEtapa?: (etapa: Etapa) => void
): Promise<string> {
  let conteudo: Blob = file;
  let extensao = file.name.split(".").pop() || "jpg";
  let tipo = file.type || undefined;
  if (reduzirFoto) ({ conteudo, extensao, tipo } = await prepararFoto(file, onEtapa));

  onEtapa?.("a enviar");
  // randomUUID não existe em browsers antigos de alguns telemóveis
  const id = crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  const caminho = `${pasta}/${id}.${extensao.toLowerCase()}`;
  let resultado;
  try {
    resultado = await comLimite(
      supabase.storage.from(BUCKET).upload(caminho, conteudo, { cacheControl: "3600", upsert: false, contentType: tipo }),
      LIMITE_ENVIO_MS,
      "o envio demorou demasiado (ligação lenta?)"
    );
  } catch (err) {
    throw new Error(mensagemErro(err));
  }
  if (resultado.error) throw new Error(mensagemErro(resultado.error));

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(caminho);
  return data.publicUrl;
}

// Apaga do bucket as imagens indicadas pelo URL público (ignora URLs externos)
export async function apagarImagens(urls: string[]) {
  const marcador = `/storage/v1/object/public/${BUCKET}/`;
  const caminhos = urls
    .map((url) => {
      const i = url.indexOf(marcador);
      return i === -1 ? null : decodeURIComponent(url.slice(i + marcador.length));
    })
    .filter((c): c is string => !!c);
  if (caminhos.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(caminhos);
  if (error) throw error;
}
