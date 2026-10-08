"use client";

import { useState } from "react";
import { uploadImagem } from "../lib/uploadImagem";

// Quantas fotos são reduzidas/enviadas ao mesmo tempo
const ENVIOS_EM_PARALELO = 3;

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
  const [progresso, setProgresso] = useState<{ feitas: number; total: number } | null>(null);
  const [erro, setErro] = useState("");

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ficheiros = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (ficheiros.length === 0) return;

    setErro("");
    setProgresso({ feitas: 0, total: ficheiros.length });
    onEnviando?.(true);

    // Mantém a ordem escolhida; posições das fotos que falharem ficam null
    const urls: (string | null)[] = new Array(ficheiros.length).fill(null);
    const falhas: string[] = [];
    let proximo = 0;
    let feitas = 0;

    const trabalhador = async () => {
      while (proximo < ficheiros.length) {
        const i = proximo++;
        try {
          urls[i] = await uploadImagem(ficheiros[i], pasta, true);
        } catch (err) {
          falhas.push(`${ficheiros[i].name} (${(err as Error).message})`);
        }
        feitas++;
        setProgresso({ feitas, total: ficheiros.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(ENVIOS_EM_PARALELO, ficheiros.length) }, trabalhador));

    onChange([...valores, ...urls.filter((u): u is string => !!u)]);
    setProgresso(null);
    onEnviando?.(false);
    if (falhas.length > 0) {
      setErro(`Não foi possível enviar ${falhas.length} foto(s): ${falhas.join("; ")}`);
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
                aria-label={`Apagar foto ${i + 1}`}
                title="Apagar foto"
                disabled={!!progresso}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={!!progresso} />
      {progresso && (
        <div>
          <div className="upload-progress-track">
            <div className="upload-progress-fill" style={{ width: `${percentagem}%` }} />
          </div>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            A enviar {progresso.feitas} de {progresso.total} fotos ({percentagem}%)...
          </span>
        </div>
      )}
      {erro && <p className="form-error">{erro}</p>}
      <span style={{ fontSize: "0.75rem", opacity: 0.55 }}>
        Pode escolher várias fotos de uma vez. São reduzidas automaticamente antes do envio. As fotos
        apagadas só são removidas definitivamente ao guardar a atividade.
      </span>
    </div>
  );
}
