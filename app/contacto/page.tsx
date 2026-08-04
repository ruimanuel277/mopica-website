export default function Contacto() {
  return (
    <section className="pad wrap">
      <div className="section-head">
        <div>
          <div className="eyebrow">Fale connosco</div>
          <h2>Contacto</h2>
        </div>
        <p>Estamos disponíveis para responder a qualquer questão sobre a nossa missão.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>Informações de contacto</h3>
          <div style={{ marginBottom: "14px" }}>
            <strong>Email:</strong><br />
            <a href="mailto:ong@mopica.org">ong@mopica.org</a>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <strong>Telefone:</strong><br />
            +244 935 518 305 · +244 924 250 525
          </div>
          <div style={{ marginBottom: "14px" }}>
            <strong>Morada:</strong><br />
            Bairro Baixa de Cassange, Vila Nova da Boa-fé, Casa Nº 86, Q.1, Zona 5,
            por detrás da Escola Nº 5093, Ex-9093 — Luanda/Angola
          </div>
        </div>

        <div className="donate-panel" style={{ padding: "30px" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>Envie-nos uma mensagem</h3>
          <form style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              type="text"
              placeholder="O seu nome"
              style={{ padding: "13px 16px", borderRadius: "10px", border: "1.5px solid rgba(27,27,22,0.15)", fontFamily: "inherit", fontSize: "0.9rem" }}
            />
            <input
              type="email"
              placeholder="O seu email"
              style={{ padding: "13px 16px", borderRadius: "10px", border: "1.5px solid rgba(27,27,22,0.15)", fontFamily: "inherit", fontSize: "0.9rem" }}
            />
            <textarea
              placeholder="A sua mensagem"
              rows={5}
              style={{ padding: "13px 16px", borderRadius: "10px", border: "1.5px solid rgba(27,27,22,0.15)", fontFamily: "inherit", fontSize: "0.9rem", resize: "vertical" }}
            />
            <button type="submit" className="btn-donate-full">Enviar mensagem</button>
          </form>
        </div>
      </div>
    </section>
  );
} 