"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminGuard from "./AdminGuard";
import AdminNav from "./AdminNav";
import ImagensUpload from "./ImagensUpload";
import { apagarImagens } from "../lib/uploadImagem";

// Limpeza do bucket: se falhar, a atividade já está gravada, por isso só regista o erro
async function apagarSemErro(urls: string[]) {
  try {
    await apagarImagens(urls);
  } catch (err) {
    console.error("Erro ao apagar fotos do bucket:", err);
  }
}

type Atividade = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  local: string;
  data: string;
  imagem_url: string;
  imagens: string[] | null;
};

type AtividadeRow = Omit<Atividade, "descricao"> & { "descriçao": string };

const FORM_VAZIO = { titulo: "", descricao: "", categoria: "", local: "", data: "", imagens: [] as string[] };

// Se o telemóvel recarregar a página (ex.: ao abrir o seletor de fotos), o que já foi
// escrito no formulário não se perde.
const CHAVE_RASCUNHO = "mopica-rascunho-atividade";
type Rascunho = { form: typeof FORM_VAZIO; editandoId: number | null; originais: string[] };

export default function AdminPanel() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  // Fotos já gravadas na atividade em edição, e todas as que passaram pelo formulário
  // (gravadas + enviadas agora): serve para apagar do bucket as que forem removidas.
  const [originais, setOriginais] = useState<string[]>([]);
  const [conhecidas, setConhecidas] = useState<string[]>([]);
  const [enviandoFotos, setEnviandoFotos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Fotos enviadas nesta edição que ainda não foram gravadas na atividade
  const fotosPorGuardar = form.imagens.filter((u) => !originais.includes(u));

  const carregarAtividades = async () => {
    const { data } = await supabase.from("atividades").select("*").order("id", { ascending: false });
    if (data) {
      setAtividades(
        (data as AtividadeRow[]).map((r) => ({ ...r, descricao: r["descriçao"] }))
      );
    }
  };

  useEffect(() => {
    carregarAtividades();
  }, []);

  const [rascunhoLido, setRascunhoLido] = useState(false);
  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem(CHAVE_RASCUNHO) ?? "null") as Rascunho | null;
      if (r?.form) {
        setForm({ ...FORM_VAZIO, ...r.form });
        setEditandoId(r.editandoId);
        setOriginais(r.originais ?? []);
        setConhecidas(Array.from(new Set([...(r.originais ?? []), ...(r.form.imagens ?? [])])));
        setMensagem({ tipo: "ok", texto: "Recuperámos o que tinha preenchido antes de a página recarregar." });
      }
    } catch {
      // rascunho inválido ou sem sessionStorage: começa vazio
    }
    setRascunhoLido(true);
  }, []);

  useEffect(() => {
    if (!rascunhoLido) return;
    try {
      const vazio = editandoId === null && JSON.stringify(form) === JSON.stringify(FORM_VAZIO);
      if (vazio) sessionStorage.removeItem(CHAVE_RASCUNHO);
      else sessionStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({ form, editandoId, originais } satisfies Rascunho));
    } catch {
      // sem sessionStorage: não há rascunho
    }
  }, [rascunhoLido, form, editandoId, originais]);

  // Avisa antes de sair da página com fotos enviadas mas por guardar
  useEffect(() => {
    if (fotosPorGuardar.length === 0 && !enviandoFotos) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [fotosPorGuardar.length, enviandoFotos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviandoFotos) return;
    // evita gravar sem fotos sem dar por isso (ex.: as fotos escolhidas não chegaram)
    const tinhaFotos = originais.length > 0;
    if (
      form.imagens.length === 0 &&
      !confirm(
        tinhaFotos
          ? "Removeu todas as fotos desta atividade. Guardar sem fotos?"
          : 'Esta atividade não tem fotos (devem aparecer em miniatura acima do botão "Escolher fotos"). Guardar mesmo assim, sem fotos?'
      )
    )
      return;
    const dadosParaEnviar = {
      titulo: form.titulo,
      "descriçao": form.descricao,
      categoria: form.categoria,
      local: form.local,
      data: form.data === "" ? null : form.data,
      imagens: form.imagens,
      // ao editar, a coluna antiga imagem_url fica vazia: as fotos vivem todas em `imagens`
      // (texto vazio e não null, para não depender de a coluna aceitar null)
      ...(editandoId ? { imagem_url: "" } : {}),
    };
    setSalvando(true);
    setMensagem(null);
    // .select() devolve a linha gravada: confirma que a gravação aconteceu mesmo
    const { data, error } = editandoId
      ? await supabase.from("atividades").update(dadosParaEnviar).eq("id", editandoId).select("id, imagens")
      : await supabase.from("atividades").insert([dadosParaEnviar]).select("id, imagens");
    if (error || !data || data.length === 0) {
      setSalvando(false);
      setMensagem({
        tipo: "erro",
        texto: error
          ? "Não foi possível guardar a atividade: " + error.message
          : "Não foi possível guardar a atividade (a sessão pode ter expirado — saia e entre novamente).",
      });
      return;
    }
    await apagarSemErro(conhecidas.filter((u) => !form.imagens.includes(u)));
    setSalvando(false);
    const nFotos = (data[0].imagens as string[] | null)?.length ?? 0;
    setMensagem({
      tipo: "ok",
      texto: `Atividade "${form.titulo}" guardada com ${nFotos} foto(s).`,
    });
    limparFormulario();
    carregarAtividades();
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setOriginais([]);
    setConhecidas([]);
  };

  // Pede confirmação antes de descartar fotos enviadas mas ainda não guardadas
  const podeDescartar = () =>
    fotosPorGuardar.length === 0 ||
    confirm(
      `Tem ${fotosPorGuardar.length} foto(s) enviada(s) que ainda não foram guardadas. Se continuar, perdem-se. Continuar?`
    );

  const irParaFormulario = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleEditar = async (a: Atividade) => {
    // tocar outra vez em "Editar" na mesma atividade só leva ao formulário (não perde nada)
    if (editandoId === a.id) {
      irParaFormulario();
      return;
    }
    if (enviandoFotos || !podeDescartar()) return;
    await apagarSemErro(conhecidas.filter((u) => !originais.includes(u)));
    const imagens = a.imagens && a.imagens.length > 0 ? a.imagens : a.imagem_url ? [a.imagem_url] : [];
    setMensagem(null);
    setEditandoId(a.id);
    setOriginais(imagens);
    setConhecidas(imagens);
    setForm({
      titulo: a.titulo ?? "",
      descricao: a.descricao ?? "",
      categoria: a.categoria ?? "",
      local: a.local ?? "",
      data: a.data ?? "",
      imagens,
    });
    // no telemóvel o formulário fica fora do ecrã: leva o utilizador até ele
    requestAnimationFrame(irParaFormulario);
  };

  const cancelarEdicao = async () => {
    if (enviandoFotos || !podeDescartar()) return;
    await apagarSemErro(conhecidas.filter((u) => !originais.includes(u)));
    limparFormulario();
  };

  const handleDelete = async (a: Atividade) => {
    if (!confirm(`Apagar a atividade "${a.titulo}" e as suas fotos? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("atividades").delete().eq("id", a.id);
    if (error) {
      setMensagem({ tipo: "erro", texto: "Não foi possível apagar a atividade: " + error.message });
      return;
    }
    await apagarSemErro([...(a.imagens ?? []), ...(a.imagem_url ? [a.imagem_url] : [])]);
    if (editandoId === a.id) limparFormulario();
    carregarAtividades();
  };

  const tituloEmEdicao = atividades.find((a) => a.id === editandoId)?.titulo;

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Gerir atividades</h2>
          </div>
        </div>

        <div className="donate-panel" ref={formRef} style={{ marginBottom: "40px", scrollMarginTop: "90px" }}>
          {editandoId && (
            <div className="edit-banner">A editar: <strong>{tituloEmEdicao ?? form.titulo}</strong></div>
          )}
          <h3 style={{ marginBottom: "16px" }}>{editandoId ? "Editar atividade" : "Adicionar nova atividade"}</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input className="form-field" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            <textarea className="form-field" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            <input className="form-field" placeholder="Categoria (ex: Educação, Saúde)" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
            <input className="form-field" placeholder="Local (ex: Huambo)" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />
            <input className="form-field" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            <ImagensUpload
              pasta="atividades"
              valores={form.imagens}
              onChange={(urls) => {
                // forma funcional: o envio demora e o resto do formulário pode ter mudado entretanto
                setForm((atual) => ({ ...atual, imagens: urls }));
                setConhecidas((atual) => Array.from(new Set([...atual, ...urls])));
              }}
              onEnviando={setEnviandoFotos}
              label="Fotos (opcional)"
            />
            {mensagem && (
              <p className={mensagem.tipo === "ok" ? "form-success" : "form-error"} role="status">{mensagem.texto}</p>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-donate-full" disabled={enviandoFotos || salvando}>
                {enviandoFotos
                  ? "Aguarde o envio das fotos..."
                  : salvando
                    ? "A guardar..."
                    : editandoId
                      ? "Guardar alterações"
                      : "Adicionar atividade"}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="btn-ghost" disabled={enviandoFotos}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <h3 style={{ marginBottom: "16px" }}>Atividades existentes ({atividades.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {atividades.map((a) => (
            <div key={a.id} className={editandoId === a.id ? "method admin-row em-edicao" : "method admin-row"}>
              <div>
                <strong>{a.titulo}</strong> — {a.categoria} · {a.local}
                <span style={{ opacity: 0.6 }}> · {(a.imagens?.length || (a.imagem_url ? 1 : 0))} foto(s)</span>
              </div>
              <div className="admin-row-actions">
                {editandoId === a.id ? (
                  <span className="edit-tag">A editar</span>
                ) : (
                  <button onClick={() => handleEditar(a)} className="btn-small btn-edit">Editar</button>
                )}
                <button onClick={() => handleDelete(a)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
