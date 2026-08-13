"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErro("Email ou password incorretos.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <section className="pad wrap" style={{ maxWidth: "420px", margin: "0 auto" }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Área reservada</div>
          <h2>Entrar no painel</h2>
        </div>
      </div>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "13px 16px", borderRadius: "10px", border: "1.5px solid rgba(27,27,22,0.15)", fontFamily: "inherit", fontSize: "0.9rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "13px 16px", borderRadius: "10px", border: "1.5px solid rgba(27,27,22,0.15)", fontFamily: "inherit", fontSize: "0.9rem" }}
        />
        {erro && <p style={{ color: "var(--coral)", fontSize: "0.85rem" }}>{erro}</p>}
        <button type="submit" className="btn-donate-full">Entrar</button>
      </form>
    </section>
  );
} 