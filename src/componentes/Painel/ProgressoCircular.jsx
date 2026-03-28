import PropTypes from "prop-types";

const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#ff3d24",
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  label,
  value,
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          style={{
            transform: "rotate(-90deg)",
            filter: "drop-shadow(0 0 10px rgba(255, 61, 36, 0.3))",
          }}
        >
          {/* Círculo de fundo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Círculo de progresso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease-in-out",
              filter: `drop-shadow(0 0 6px ${color}50)`,
            }}
          />
        </svg>

        {/* Conteúdo central */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "var(--heading-color)",
              fontFamily: "var(--heading-font-family)",
              lineHeight: "1",
            }}
          >
            {value || `${Math.round(percentage)}${showPercentage ? "%" : ""}`}
          </div>
          {label && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--body-color)",
                opacity: 0.8,
                marginTop: "4px",
                textAlign: "center",
                maxWidth: "80px",
                lineHeight: "1.2",
              }}
            >
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showPercentage: PropTypes.bool,
};

export default CircularProgress;
