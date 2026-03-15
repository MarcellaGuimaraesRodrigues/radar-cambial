import { useMemo, useState } from "react";
import CurrencyCard from "./components/CurrencyCard";
import ChartPanel from "./components/ChartPanel";
import SummaryPanel from "./components/SummaryPanel";
import useMarketData from "./hooks/useMarketData";

function App() {
  const {
    data,
    history,
    changes,
    lastUpdate,
    countdown,
    loading,
    error,
    refreshNow,
  } = useMarketData();

  const [selectedAsset, setSelectedAsset] = useState("USDBRL");
  const [selectedRange, setSelectedRange] = useState("1D");

  const assetNames = {
    USDBRL: "Dólar",
    EURBRL: "Euro",
    BTCBRL: "Bitcoin",
  };

  const assetSymbols = {
    USDBRL: "USD/BRL",
    EURBRL: "EUR/BRL",
    BTCBRL: "BTC/BRL",
  };

  const selectedHistory = useMemo(() => {
    const all = history[selectedAsset] || [];
    const limits = {
      "1H": 20,
      "1D": 50,
      "1S": 120,
      "1M": 240,
    };
    return all.slice(-limits[selectedRange]);
  }, [history, selectedAsset, selectedRange]);

  const summary = useMemo(() => {
    if (!selectedHistory.length) {
      return {
        open: 0,
        close: 0,
        high: 0,
        low: 0,
      };
    }

    const values = selectedHistory.map((item) => item.value);

    return {
      open: values[0],
      close: values[values.length - 1],
      high: Math.max(...values),
      low: Math.min(...values),
    };
  }, [selectedHistory]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">RADAR CAMBIAL</span>
          <h1>Monitor de câmbio em tempo real</h1>
          <p className="topbar-subtitle">
            Acompanhamento de dólar, euro e bitcoin em relação ao real.
          </p>
        </div>

        <div className="topbar-actions">
          <button className="primary-btn" onClick={refreshNow}>
            Atualizar agora
          </button>
          <span className="meta-text">
            Última atualização: {lastUpdate || "aguardando..."}
          </span>
          <span className="meta-text highlight-text">
            Próxima atualização em {countdown}s
          </span>
        </div>
      </header>

      {loading && <p className="status-message">Carregando dados...</p>}
      {error && <p className="status-error">{error}</p>}

      <section className="cards-grid">
        <CurrencyCard
          title="Dólar"
          symbol="USD/BRL"
          assetCode="USDBRL"
          info={data.USDBRL}
          changeInfo={changes.USDBRL}
          selected={selectedAsset === "USDBRL"}
          onSelect={setSelectedAsset}
        />

        <CurrencyCard
          title="Euro"
          symbol="EUR/BRL"
          assetCode="EURBRL"
          info={data.EURBRL}
          changeInfo={changes.EURBRL}
          selected={selectedAsset === "EURBRL"}
          onSelect={setSelectedAsset}
        />

        <CurrencyCard
          title="Bitcoin"
          symbol="BTC/BRL"
          assetCode="BTCBRL"
          info={data.BTCBRL}
          changeInfo={changes.BTCBRL}
          selected={selectedAsset === "BTCBRL"}
          onSelect={setSelectedAsset}
        />
      </section>

      <section className="dashboard-grid">
        <ChartPanel
          assetCode={selectedAsset}
          assetName={assetNames[selectedAsset]}
          assetSymbol={assetSymbols[selectedAsset]}
          assetInfo={data[selectedAsset]}
          changeInfo={changes[selectedAsset]}
          history={selectedHistory}
          selectedRange={selectedRange}
          onChangeRange={setSelectedRange}
        />

        <SummaryPanel
          assetName={assetNames[selectedAsset]}
          assetSymbol={assetSymbols[selectedAsset]}
          summary={summary}
        />
      </section>
    </div>
  );
}

export default App;