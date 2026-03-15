import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "radar_cambial_history_v1";
const AUTO_REFRESH_SECONDS = 10;

function useCryptoPrices() {
  const [data, setData] = useState({
    USDBRL: null,
    EURBRL: null,
    BTCBRL: null,
  });

  const [history, setHistory] = useState({
    USDBRL: [],
    EURBRL: [],
    BTCBRL: [],
  });

  const [changes, setChanges] = useState({
    USDBRL: { direction: "neutral", diff: 0, diffPct: 0 },
    EURBRL: { direction: "neutral", diff: 0, diffPct: 0 },
    BTCBRL: { direction: "neutral", diff: 0, diffPct: 0 },
  });

  const [lastUpdate, setLastUpdate] = useState("");
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resetTimersRef = useRef({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.USDBRL && parsed?.EURBRL && parsed?.BTCBRL) {
          setHistory(parsed);
        }
      } catch (err) {
        console.error("Erro ao ler histórico salvo:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  function calculateChange(assetCode, newValue) {
    const previous = data[assetCode] ? Number(data[assetCode].bid) : null;

    if (previous === null || Number.isNaN(previous)) {
      return { direction: "neutral", diff: 0, diffPct: 0 };
    }

    const diff = newValue - previous;
    const diffPct = previous !== 0 ? (diff / previous) * 100 : 0;

    if (diff > 0) return { direction: "up", diff, diffPct };
    if (diff < 0) return { direction: "down", diff, diffPct };

    return { direction: "neutral", diff: 0, diffPct: 0 };
  }

  async function fetchMarketData() {
    try {
      setError("");

      const response = await fetch(
        "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL"
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar dados.");
      }

      const json = await response.json();
      const now = new Date();
      const time = now.toLocaleTimeString();
      const timestamp = now.getTime();

      const usdChange = calculateChange("USDBRL", Number(json.USDBRL.bid));
      const eurChange = calculateChange("EURBRL", Number(json.EURBRL.bid));
      const btcChange = calculateChange("BTCBRL", Number(json.BTCBRL.bid));

      setData(json);
      setLastUpdate(time);
      setCountdown(AUTO_REFRESH_SECONDS);

      setChanges({
        USDBRL: usdChange,
        EURBRL: eurChange,
        BTCBRL: btcChange,
      });

      setHistory((prev) => ({
        USDBRL: [
          ...prev.USDBRL,
          { time, value: Number(json.USDBRL.bid), timestamp },
        ].slice(-400),

        EURBRL: [
          ...prev.EURBRL,
          { time, value: Number(json.EURBRL.bid), timestamp },
        ].slice(-400),

        BTCBRL: [
          ...prev.BTCBRL,
          { time, value: Number(json.BTCBRL.bid), timestamp },
        ].slice(-400),
      }));

      ["USDBRL", "EURBRL", "BTCBRL"].forEach((assetCode) => {
        if (resetTimersRef.current[assetCode]) {
          clearTimeout(resetTimersRef.current[assetCode]);
        }

        resetTimersRef.current[assetCode] = setTimeout(() => {
          setChanges((prev) => ({
            ...prev,
            [assetCode]: { ...prev[assetCode], direction: "neutral" },
          }));
        }, 1800);
      });
    } catch (err) {
      setError("Não foi possível carregar as cotações.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarketData();

    const fetchInterval = setInterval(() => {
      fetchMarketData();
    }, AUTO_REFRESH_SECONDS * 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? AUTO_REFRESH_SECONDS : prev - 1));
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(countdownInterval);

      Object.values(resetTimersRef.current).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  return {
    data,
    history,
    changes,
    lastUpdate,
    countdown,
    loading,
    error,
    refreshNow: fetchMarketData,
  };
}

export default useCryptoPrices;