import PropTypes from "prop-types";

const SimpleChart = ({ data, title, color = "#ff3d24" }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const chartHeight = 200;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(16, 16, 16, 0.95) 0%, rgba(24, 24, 24, 0.98) 100%)",
        border: "1px solid rgba(255, 61, 36, 0.2)",
        borderRadius: "16px",
        padding: "24px",
        width: "100%",
      }}
    >
      <h4
        style={{
          fontSize: "18px",
          fontWeight: "600",
          margin: "0 0 20px 0",
          color: "var(--heading-color)",
          fontFamily: "var(--heading-font-family)",
        }}
      >
        {title}
      </h4>

      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: "12px",
          height: `${chartHeight}px`,
          paddingBottom: "30px",
          position: "relative",
        }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Barra do gráfico */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "40px",
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                  borderRadius: "4px 4px 0 0",
                  border: `1px solid ${color}40`,
                  position: "relative",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scaleY(1.05)";
                  e.target.style.filter = "brightness(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scaleY(1)";
                  e.target.style.filter = "brightness(1)";
                }}
              >
                {/* Tooltip com valor */}
                <div
                  style={{
                    position: "absolute",
                    top: "-35px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                  className="chart-tooltip"
                >
                  {item.value}
                </div>
              </div>

              {/* Label da barra */}
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "var(--body-color)",
                  textAlign: "center",
                  opacity: 0.8,
                  wordBreak: "break-word",
                  maxWidth: "60px",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Linha de base */}
      <div
        style={{
          position: "absolute",
          bottom: "54px",
          left: "24px",
          right: "24px",
          height: "1px",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
    </div>
  );
};

SimpleChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default SimpleChart;
