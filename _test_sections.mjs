import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rcncktclacyhiimfeqiq.supabase.co",
  "sb_publishable_IWE9POzD9_gIyN41aPl20A_EPpMInr_"
);

const p = await supabase
  .from("Parceiros")
  .select("id, nome:Nome, logo_url:Logo_url, site_url:Site_url")
  .order("id", { ascending: false });
console.log("Parceiros error:", JSON.stringify(p.error));
console.log("Parceiros data:", JSON.stringify(p.data, null, 2));

const t = await supabase
  .from("Testemunhas")
  .select("id, autor:Autor, cargo:Cargo, mensagem:Mensagem")
  .order("id", { ascending: false });
console.log("Testemunhas error:", JSON.stringify(t.error));
console.log("Testemunhas data:", JSON.stringify(t.data, null, 2));

const v = await supabase
  .from("Videos")
  .select("id, titulo:Titulo, video_url:Video_url")
  .order("id", { ascending: false });
console.log("Videos error:", JSON.stringify(v.error));
console.log("Videos data:", JSON.stringify(v.data, null, 2));
