"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const LINKS = [
  { href: "/admin", label: "Atividades" },
  { href: "/admin/parceiros", label: "Parceiros" },
  { href: "/admin/testemunhos", label: "Testemunhos" },
  { href: "/admin/videos", label: "Vídeos" },
  { href: "/admin/sobre", label: "Sobre" },
  { href: "/admin/voluntarios", label: "Voluntários" },
  { href: "/admin/contactos", label: "Contactos" },
  { href: "/admin/doacoes", label: "Doações" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="admin-nav">
      <div className="admin-nav-links">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "admin-nav-link active" : "admin-nav-link"}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button onClick={handleLogout} className="btn-ghost">Sair</button>
    </div>
  );
}
