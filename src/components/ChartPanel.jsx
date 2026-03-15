import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const hoverLinePlugin = {
  id: "hoverLinePlugin",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      tooltip,
      chartArea: { top, bottom },
    } = chart;

    if (tooltip && tooltip._active && tooltip._active.length) {
      const x = tooltip._active[0].element.x;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
    }
  },
};

function ChartPanel({
  assetCode,
  assetName,
  assetSymbol,
  assetInfo,
  changeInfo,
  history,
  selectedRange,
  onChangeRange,
}) {
  const colors = {
    USDBRL: "#4da3ff",
    EURBRL: "#8b5cf6",
    BTCBRL: "#f59e0b",
  };

  const areaColors = {
    USDBRL: "rgba(77, 163, 255, 0.10)",
    EURBRL: "rgba(139, 92, 246, 0.10)",
    BTCBRL: "rgba(245, 158, 11, 0.10)",
  };

  const currentColor = colors[assetCode];

  const data = {
    labels: history.map((item) => item.time),
    datasets: [
      {
        data: history.map((item) => item.value),
        borderColor: currentColor,
        backgroundColor: areaColors[assetCode],
        fill: true,
        tension: 0.42,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: currentColor,
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
        borderWidth: 2.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 850,
      easing: "easeOutQuart",
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length ? "crosshair" : "default";
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#0f1722",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        displayColors: false,
        padding: 12,
        callbacks: {
          title: function (context) {
            return `Horário: ${context[0].label}`;
          },
          label: function (context) {
            return `Preço: R$ ${Number(context.parsed.y).toLocaleString("pt-BR")}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
          maxTicksLimit: 8,
        },
        grid: {
          color: "rgba(255,255,255,0.04)",
        },
        border: {
          color: "rgba(255,255,255,0.06)",
        },
      },
      y: {
        ticks: {
          color: "#64748b",
          callback: function (value) {
            return `R$ ${Number(value).toLocaleString("pt-BR")}`;
          },
        },
        grid: {
          color: "rgba(255,255,255,0.04)",
        },
        border: {
          color: "rgba(255,255,255,0.06)",
        },
      },
    },
  };

  return (
    <div className="chart-panel">
      <div className="chart-panel-header">
        <div>
          <span className="chart-tag">{assetSymbol}</span>
          <h2>{assetName}</h2>
          <p>Últimos pontos coletados em tempo real</p>
        </div>

        <div className="chart-panel-side">
          <div className="chart-price-badge">
            {assetInfo ? `R$ ${Number(assetInfo.bid).toLocaleString("pt-BR")}` : "--"}
          </div>

          <div>
            {changeInfo.direction === "up" && (
              <span className="chart-status chart-status-up">
                +{Math.abs(changeInfo.diffPct).toFixed(2)}%
              </span>
            )}

            {changeInfo.direction === "down" && (
              <span className="chart-status chart-status-down">
                -{Math.abs(changeInfo.diffPct).toFixed(2)}%
              </span>
            )}

            {changeInfo.direction === "neutral" && (
              <span className="chart-status chart-status-neutral">0.00%</span>
            )}
          </div>
        </div>
      </div>

      <div className="range-buttons">
        {["1H", "1D", "1S", "1M"].map((range) => (
          <button
            key={range}
            type="button"
            className={`range-button ${selectedRange === range ? "range-button-active" : ""}`}
            onClick={() => onChangeRange(range)}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="chart-area">
        <Line data={data} options={options} plugins={[hoverLinePlugin]} />
      </div>
    </div>
  );
}

export default ChartPanel;