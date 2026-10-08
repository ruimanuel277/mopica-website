"use client";

import { useState } from "react";
import { uploadImagem } from "../lib/uploadImagem";

type Progresso = { feitas: number; total: number; atual: string };

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

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ficheiros = Array.from(e.target.files ?? []);
    e.target.value = "";
    setErros([]);
    setAviso("");
    if (ficheiros.length === 0) {
      setAviso("Nenhuma foto foi recebida do telemóvel. Tente escolher de novo, a partir da Galeria ou de Ficheiros.");
      return;
    }

    setProgresso({ feitas: 0, total: ficheiros.length, atual: ficheiros[0].name });
    onEnviando?.(true);

    // Uma foto de cada vez: no telemóvel, descodificar várias fotos grandes em
    // simultâneo pode esgotar a memória e recarregar a página.
    const urls: string[] = [];
    const falhas: string[] = [];
    for (let i = 0; i < ficheiros.length; i++) {
      setProgresso({ feitas: i, total: ficheiros.length, atual: ficheiros[i].name });
      try {
        urls.push(await uploadImagem(ficheiros[i], pasta, true));
        // mostra logo cada foto enviada, para não se perder nada se algo falhar a meio
        onChange([...valores, ...urls]);
      } catch (err) {
        falhas.push(`"${ficheiros[i].name}": ${(err as Error).message}`);
      }
    }

    setProgresso(null);
    onEnviando?.(false);
    setErros(falhas);
    if (urls.length > 0) {
      setAviso(
        `${urls.length} de ${ficheiros.length} foto(s) enviada(s). Carregue em "Guardar" para as gravar na atividade.`
      );
    }
  };

  const remover = (url: string) => {
    onChange(valores.filter((v) => v !== url));
  };

  const percentagem = progresso ? Math.round((progresso.feitas / progresso.total) * 100) : 0;

  return (
    <div className="upload-box">
      <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>
        {label ?? "Imagens"}
        {valores.length > 0 && ` · ${valores.length} foto(s)`}
      </label>
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
      <input type="file" accept="image/*,.heic,.heif" multiple onChange={handleFiles} disabled={!!progresso} />
      {progresso && (
        <div role="status" aria-live="polite">
          <div className="upload-progress-track">
            <div className="upload-progress-fill" style={{ width: `${Math.max(percentagem, 4)}%` }} />
          </div>
          <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
            A enviar foto {progresso.feitas + 1} de {progresso.total} ({percentagem}%) — não feche esta página.
          </span>
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
