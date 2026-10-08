"use client";

import { useState } from "react";

async function copiarTexto(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Fallback para browsers sem Clipboard API (ex.: http ou WebViews antigas)
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

export default function CopiarBotao({
  texto,
  label = "Copiar",
  semEspacos = true,
}: {
  texto: string;
  label?: string;
  semEspacos?: boolean;
}) {
  const [estado, setEstado] = useState<"" | "ok" | "erro">("");

  const handleClick = async () => {
    const ok = await copiarTexto(semEspacos ? texto.replace(/\s+/g, "") : texto);
    setEstado(ok ? "ok" : "erro");
    setTimeout(() => setEstado(""), 2000);
  };

  return (
    <button type="button" className="copy-btn" onClick={handleClick} aria-live="polite">
      {estado === "ok" ? "Copiado ✓" : estado === "erro" ? "Erro ao copiar" : label}
    </button>
  );
}
