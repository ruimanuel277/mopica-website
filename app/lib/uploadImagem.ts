import { supabase } from "./supabase";

const BUCKET = "imagens";

export async function uploadImagem(file: File, pasta: string): Promise<string> {
  const extensao = file.name.split(".").pop() || "jpg";
  const caminho = `${pasta}/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(caminho);
  return data.publicUrl;
}
