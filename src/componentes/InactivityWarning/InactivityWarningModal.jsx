import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Formats a number of seconds into "M:SS" display format.
 * e.g. 30 → "0:30", 60 → "1:00", 90 → "1:30"
 */
const formatCountdown = (totalSeconds) => {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const InactivityWarningModal = ({ isVisible, remainingSeconds, onStayLoggedIn }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  const isUrgent = remainingSeconds < 10;

  return (
    <div
      style={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-modal-title"
      aria-describedby="inactivity-modal-description"
    >
      <div style={styles.card}>
        {/* Warning icon */}
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>⚠️</span>
        </div>

        {/* Title */}
        <h2 id="inactivity-modal-title" style={styles.title}>Sessão Inativa</h2>

        {/* Message */}
        <p id="inactivity-modal-description" style={styles.message}>
          Sua sessão será encerrada automaticamente por inatividade. Clique em
          continuar para permanecer conectado.
        </p>

        {/* Countdown */}
        <div style={styles.countdownWrapper}>
          <span style={styles.countdownLabel}>Tempo restante</span>
          <span
            style={{
              ...styles.countdown,
              color: isUrgent ? "#ff3d24" : "var(--heading-color)",
              fontSize: isUrgent ? "3.5rem" : "3rem",
            }}
          >
            {formatCountdown(remainingSeconds)}
          </span>
        </div>

        {/* Action button */}
        <button
          type="button"
          style={{
            ...styles.button,
            ...(isHovered
              ? {
                  backgroundColor: "#e02912",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 24px rgba(255, 61, 36, 0.45)",
                }
              : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onStayLoggedIn}
        >
          Continuar Sessão
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
  },
  card: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
    padding: "2.5rem 2rem",
    maxWidth: "420px",
    width: "90%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.25rem",
  },
  iconWrapper: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 61, 36, 0.12)",
    border: "1px solid rgba(255, 61, 36, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "28px",
    lineHeight: 1,
  },
  title: {
    color: "var(--heading-color)",
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: 0,
  },
  message: {
    color: "var(--body-color)",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    margin: 0,
  },
  countdownWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
    padding: "1rem 1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    width: "100%",
  },
  countdownLabel: {
    color: "var(--body-color)",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: "500",
  },
  countdown: {
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
    transition: "color 0.3s ease, font-size 0.3s ease",
  },
  button: {
    backgroundColor: "#ff3d24",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "0.85rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 4px 16px rgba(255, 61, 36, 0.3)",
    transition: "background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
    letterSpacing: "0.02em",
  },
};

InactivityWarningModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  remainingSeconds: PropTypes.number.isRequired,
  onStayLoggedIn: PropTypes.func.isRequired,
};

export default InactivityWarningModal;
