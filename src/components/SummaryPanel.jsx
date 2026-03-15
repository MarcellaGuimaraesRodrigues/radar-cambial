function SummaryPanel({ assetName, assetSymbol, summary }) {
  return (
    <aside className="summary-panel">
      <div className="summary-box">
        <span className="summary-eyebrow">Resumo do ativo</span>
        <h3>{assetName}</h3>
        <p>{assetSymbol}</p>
      </div>

      <div className="summary-box">
        <div className="summary-item">
          <span>Abertura</span>
          <strong>R$ {Number(summary.open || 0).toLocaleString("pt-BR")}</strong>
        </div>

        <div className="summary-item">
          <span>Fechamento</span>
          <strong>R$ {Number(summary.close || 0).toLocaleString("pt-BR")}</strong>
        </div>

        <div className="summary-item">
          <span>Máxima</span>
          <strong>R$ {Number(summary.high || 0).toLocaleString("pt-BR")}</strong>
        </div>

        <div className="summary-item">
          <span>Mínima</span>
          <strong>R$ {Number(summary.low || 0).toLocaleString("pt-BR")}</strong>
        </div>
      </div>

      <div className="summary-box summary-note">
        Os períodos 1H, 1D, 1S e 1M usam o histórico local acumulado pelo app.
      </div>
    </aside>
  );
}

export default SummaryPanel;