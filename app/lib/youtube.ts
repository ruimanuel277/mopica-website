// Extrai o ID de um link do YouTube (watch, youtu.be, shorts, embed, live).
// Devolve null se o link não for do YouTube.
export function youtubeId(url: string): string | null {
  try {
    const texto = url.trim();
    const u = new URL(/^https?:\/\//i.test(texto) ? texto : `https://${texto}`);
    const host = u.hostname.replace(/^(www\.|m\.|music\.)/, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const partes = u.pathname.split("/").filter(Boolean);
      if (partes[0] === "watch") id = u.searchParams.get("v");
      else if (["shorts", "embed", "live", "v"].includes(partes[0])) id = partes[1] ?? null;
    }
    return id && /^[\w-]{6,}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

// Título do vídeo via oEmbed público do YouTube (sem chave de API); null se falhar
export async function youtubeTitulo(id: string): Promise<string | null> {
  try {
    const resposta = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`
    );
    if (!resposta.ok) return null;
    const dados = await resposta.json();
    return typeof dados.title === "string" && dados.title.trim() ? dados.title.trim() : null;
  } catch {
    return null;
  }
}
