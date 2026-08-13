"use client";

import { useState } from "react";
import { uploadImagem } from "../lib/uploadImagem";

export default function ImagemUpload({
  pasta,
  valor,
  onChange,
  label,
}: {
  pasta: string;
  valor: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [aEnviar, setAEnviar] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAEnviar(true);
    try {
      const url = await uploadImagem(file, pasta);
      onChange(url);
    } catch (err) {
      alert("Erro ao enviar imagem: " + (err as Error).message);
    } finally {
      setAEnviar(false);
      e.target.value = "";
    }
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
      <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>{label ?? "Imagem"}</label>
      {valor && (
        <img
          src={valor}
          alt=""
          style={{ maxHeight: "80px", borderRadius: "8px", objectFit: "cover" }}
        />
      )}
      <input type="file" accept="image/*" onChange={handleFile} disabled={aEnviar} />
      {aEnviar && <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>A enviar...</span>}
    </div>
  );
}
