"use client";

import { useState } from "react";
import { uploadImagem } from "../lib/uploadImagem";

export default function ImagensUpload({
  pasta,
  valores,
  onChange,
  label,
}: {
  pasta: string;
  valores: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const [aEnviar, setAEnviar] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ficheiros = Array.from(e.target.files ?? []);
    if (ficheiros.length === 0) return;
    setAEnviar(true);
    try {
      const urls = await Promise.all(ficheiros.map((file) => uploadImagem(file, pasta)));
      onChange([...valores, ...urls]);
    } catch (err) {
      alert("Erro ao enviar imagens: " + (err as Error).message);
    } finally {
      setAEnviar(false);
      e.target.value = "";
    }
  };

  const remover = (url: string) => {
    onChange(valores.filter((v) => v !== url));
  };

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1.5px solid rgba(27,27,22,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>{label ?? "Imagens"}</label>
      {valores.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {valores.map((url) => (
            <div key={url} style={{ position: "relative" }}>
              <img
                src={url}
                alt=""
                style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", display: "block" }}
              />
              <button
                type="button"
                onClick={() => remover(url)}
                aria-label="Remover imagem"
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(27,27,22,0.85)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  lineHeight: "20px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={aEnviar} />
      {aEnviar && <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>A enviar...</span>}
    </div>
  );
}
