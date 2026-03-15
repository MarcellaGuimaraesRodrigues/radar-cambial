function CurrencyCard({
  title,
  symbol,
  assetCode,
  info,
  changeInfo,
  selected,
  onSelect,
}) {
  if (!info) {
    return (
      <div className="asset-card">
        <h2>{title}</h2>
        <p>Carregando...</p>
      </div>
    );
  }

  const positiveDay = Number(info.varBid) >= 0;

  const flashClass =
    changeInfo.direction === "up"
      ? "flash-up"
      : changeInfo.direction === "down"
      ? "flash-down"
      : "";

  function formatPrice(value) {
    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: assetCode === "BTCBRL" ? 2 : 4,
      maximumFractionDigits: assetCode === "BTCBRL" ? 2 : 4,
    });
  }

  function formatDiff(value) {
    return Math.abs(value).toLocaleString("pt-BR", {
      minimumFractionDigits: assetCode === "BTCBRL" ? 2 : 4,
      maximumFractionDigits: assetCode === "BTCBRL" ? 2 : 4,
    });
  }

  return (
    <button
      type="button"
      className={`asset-card ${selected ? "asset-card-selected" : ""} ${flashClass}`}
      onClick={() => onSelect(assetCode)}
    >
      <div className="asset-card-header">
        <div>
          <span className="asset-name">{title}</span>
          <span className="asset-symbol">{symbol}</span>
        </div>
        <span className="asset-chip">{symbol}</span>
      </div>

      <div className="asset-price">R$ {formatPrice(info.bid)}</div>

      <div className="asset-row">
        <span className={positiveDay ? "badge-up" : "badge-down"}>
          {positiveDay ? "▲" : "▼"} {info.pctChange}%
        </span>

        <span className="badge-neutral">
          {changeInfo.direction === "up" && `+${Math.abs(changeInfo.diffPct).toFixed(2)}%`}
          {changeInfo.direction === "down" && `-${Math.abs(changeInfo.diffPct).toFixed(2)}%`}
          {changeInfo.direction === "neutral" && "0.00%"}
        </span>
      </div>

      <div className="asset-change">
        {changeInfo.direction === "up" && (
          <span className="live-change live-change-up">
            +R$ {formatDiff(changeInfo.diff)}
          </span>
        )}

        {changeInfo.direction === "down" && (
          <span className="live-change live-change-down">
            -R$ {formatDiff(changeInfo.diff)}
          </span>
        )}

        {changeInfo.direction === "neutral" && (
          <span className="live-change live-change-neutral">
            Sem alteração
          </span>
        )}
      </div>

      <div className="asset-stats">
        <div className="asset-stat-box">
          <span className="asset-stat-label">Máxima</span>
          <strong>R$ {Number(info.high).toLocaleString("pt-BR")}</strong>
        </div>

        <div className="asset-stat-box">
          <span className="asset-stat-label">Mínima</span>
          <strong>R$ {Number(info.low).toLocaleString("pt-BR")}</strong>
        </div>
      </div>
    </button>
  );
}

export default CurrencyCard;