"use client";

import { useId, useRef, useState } from "react";
import { uploadImagem, type Etapa } from "../lib/uploadImagem";

type Progresso = { feitas: number; total: number; etapa: Etapa };

function descreverFicheiro(f: File) {
  return `${f.type || "tipo desconhecido"}, ${(f.size / 1024 / 1024).toFixed(1)} MB`;
}

export default function ImagensUpload({
  pasta,
  valores,
  onChange,
  label,
  onEnviando,
}: {
  pasta: string;
  valores: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  onEnviando?: (enviando: boolean) => void;
}) {
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const [aviso, setAviso] = useState("");
  const cancelado = useRef(false);
  // permite cancelar de imediato, mesmo que a foto atual esteja pendurada
  const pararEspera = useRef<(() => void) | null>(null);
  const inputId = useId();

  const cancelar = () => {
    cancelado.current = true;
    pararEspera.current?.();
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ficheiros = Array.from(e.target.files ?? []);
    e.target.value = "";
    setErros([]);
    setAviso("");
    if (ficheiros.length === 0) {
      setAviso("Nenhuma foto foi recebida do telemóvel. Tente escolher de novo, a partir da Galeria ou de Ficheiros.");
      return;
    }

    cancelado.current = false;
    setProgresso({ feitas: 0, total: ficheiros.length, etapa: "a preparar" });
    onEnviando?.(true);

    // Uma foto de cada vez: no telemóvel, descodificar várias fotos grandes em
    // simultâneo pode esgotar a memória e recarregar a página.
    const urls: string[] = [];
    const falhas: string[] = [];
    try {
      for (let i = 0; i < ficheiros.length && !cancelado.current; i++) {
        const f = ficheiros[i];
        setProgresso({ feitas: i, total: ficheiros.length, etapa: "a preparar" });
        try {
          const url = await Promise.race([
            uploadImagem(f, pasta, true, (etapa) => {
              if (!cancelado.current) setProgresso({ feitas: i, total: ficheiros.length, etapa });
            }),
            new Promise<never>((_, reject) => {
              pararEspera.current = () => reject(new Error("cancelado"));
            }),
          ]);
          if (cancelado.current) break;
          urls.push(url);
          // mostra logo cada foto enviada, para não se perder nada se algo falhar a meio
          onChange([...valores, ...urls]);
        } catch (err) {
          if (cancelado.current) break;
          console.error("Falha ao enviar foto", f.name, err);
          falhas.push(`"${f.name}" (${descreverFicheiro(f)}): ${(err as Error).message}`);
        }
      }
    } finally {
      // aconteça o que acontecer, o campo de fotos volta a ficar disponível
      pararEspera.current = null;
      setProgresso(null);
      onEnviando?.(false);
    }

    setErros(falhas);
    if (cancelado.current) {
      setAviso(`Envio cancelado. ${urls.length} foto(s) já tinham sido enviadas.`);
    } else if (urls.length > 0) {
      setAviso(`${urls.length} de ${ficheiros.length} foto(s) enviada(s). Carregue em "Guardar" para as gravar na atividade.`);
    }
  };

  const remover = (url: string) => {
    onChange(valores.filter((v) => v !== url));
  };

  const percentagem = progresso ? Math.round((progresso.feitas / progresso.total) * 100) : 0;

  return (
    <div className="upload-box">
      <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
        {label ?? "Imagens"}
        {valores.length > 0 && ` · ${valores.length} foto(s)`}
      </span>
      {valores.length > 0 && (
        <div className="upload-grid">
          {valores.map((url, i) => (
            <div key={url} className="upload-thumb">
              <img src={url} alt={`Foto ${i + 1}`} />
              <button
                type="button"
                onClick={() => remover(url)}
                aria-label={`Remover foto ${i + 1}`}
                title="Remover foto"
                disabled={!!progresso}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* o controlo nativo é minúsculo no telemóvel: fica escondido e usa-se um botão grande */}
      <input
        id={inputId}
        className="upload-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={!!progresso}
      />
      {!progresso && (
        <label htmlFor={inputId} className="btn-ghost upload-escolher">
          📷 {valores.length > 0 ? "Adicionar mais fotos" : "Escolher fotos"}
        </label>
      )}

      {progresso && (
        <div role="status" aria-live="polite">
          <div className="upload-progress-track">
            <div className="upload-progress-fill" style={{ width: `${Math.max(percentagem, 4)}%` }} />
          </div>
          <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
            Foto {progresso.feitas + 1} de {progresso.total} ({percentagem}%): {progresso.etapa}... não feche esta página.
          </span>
          <button
            type="button"
            className="btn-small btn-delete"
            style={{ display: "block", marginTop: "8px" }}
            onClick={cancelar}
          >
            Cancelar envio
          </button>
        </div>
      )}
      {aviso && !progresso && <p className={erros.length ? "form-error" : "form-success"}>{aviso}</p>}
      {erros.length > 0 && (
        <div className="form-error" role="alert">
          <strong>Não foi possível enviar {erros.length} foto(s):</strong>
          <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
            {erros.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      <span style={{ fontSize: "0.75rem", opacity: 0.55 }}>
        Pode escolher várias fotos de uma vez (incluindo HEIC). São convertidas para JPG e reduzidas antes do
        envio. As fotos removidas só são apagadas definitivamente ao guardar a atividade.
      </span>
    </div>
  );
}
