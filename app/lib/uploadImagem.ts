import { supabase } from "./supabase";

const BUCKET = "imagens";
const LARGURA_MAXIMA = 1600;
const QUALIDADE_JPEG = 0.82;

// Reduz a foto para no máximo 1600px de largura (JPEG) antes de enviar.
// Se o browser não conseguir ler o formato (ex.: HEIC fora do Safari) ou a
// versão reduzida não ficar mais leve, envia o ficheiro original.
async function reduzirImagem(file: File): Promise<Blob> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const escala = Math.min(1, LARGURA_MAXIMA / bitmap.width);
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    // fundo branco para PNGs com transparência (JPEG não tem canal alfa)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, largura, altura);
    ctx.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALIDADE_JPEG)
    );
    if (!blob || (escala === 1 && blob.size >= file.size)) return file;
    return blob;
  } catch {
    return file;
  }
}

// `reduzir` só para fotos: converte em JPEG, por isso não convém a logótipos PNG transparentes
export async function uploadImagem(file: File, pasta: string, reduzir = false): Promise<string> {
  const conteudo = reduzir ? await reduzirImagem(file) : file;
  const extensao = conteudo === file ? file.name.split(".").pop() || "jpg" : "jpg";
  const caminho = `${pasta}/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, conteudo, {
    cacheControl: "3600",
    upsert: false,
    contentType: conteudo === file ? file.type || undefined : "image/jpeg",
  });
  if (error) throw error;

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
