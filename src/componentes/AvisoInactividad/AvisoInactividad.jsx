import { AlertTriangleIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const isUrgent = remainingSeconds < 10;

  return (
    <AlertDialog open={isVisible}>
      <AlertDialogContent className="bg-[rgba(26,26,26,0.98)] backdrop-blur-xl border-white/10 max-w-[420px] text-center flex flex-col items-center gap-5 p-10">
        <AlertDialogHeader className="flex flex-col items-center gap-5">
          {/* Warning icon */}
          <div className="w-16 h-16 rounded-full bg-[rgba(255,61,36,0.12)] border border-[rgba(255,61,36,0.3)] flex items-center justify-center">
            <AlertTriangleIcon className="w-7 h-7 text-[#ff3d24]" aria-hidden="true" />
          </div>

          <AlertDialogTitle className="text-[var(--texto-principal)] text-2xl font-bold m-0">
            Sesion Inactiva
          </AlertDialogTitle>

          <AlertDialogDescription className="text-[var(--texto-secundario)] text-[0.95rem] leading-relaxed m-0">
            Su sesion se cerrara automaticamente por inactividad. Haga clic en
            continuar para permanecer conectado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-1 py-4 px-6 bg-white/[0.04] border border-white/10 rounded-xl w-full">
          <span className="text-[var(--texto-secundario)] text-xs uppercase tracking-widest font-medium">
            Tiempo restante
          </span>
          <span
            className={`font-bold tabular-nums leading-none transition-all duration-300 ${
              isUrgent ? "text-[#ff3d24] text-[3.5rem]" : "text-[var(--texto-principal)] text-[3rem]"
            }`}
          >
            {formatCountdown(remainingSeconds)}
          </span>
        </div>

        <AlertDialogFooter className="w-full sm:justify-center">
          <AlertDialogAction
            onClick={onStayLoggedIn}
            className="bg-[#ff3d24] hover:bg-[#e02912] text-white rounded-xl py-[0.85rem] px-8 text-base font-semibold w-full shadow-[0_4px_16px_rgba(255,61,36,0.3)] hover:shadow-[0_8px_24px_rgba(255,61,36,0.45)] tracking-wide"
          >
            Continuar Sesion
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InactivityWarningModal;

/* COMPONENTE LEGADO - Reemplazado por shadcn AlertDialog
import { useState } from "react";
import PropTypes from "prop-types";

const InactivityWarningModal = ({ isVisible, remainingSeconds, onStayLoggedIn }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  const isUrgent = remainingSeconds < 10;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-modal-title"
      aria-describedby="inactivity-modal-description"
    >
      <div className="bg-[rgba(26,26,26,0.98)] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] p-10 max-w-[420px] w-[90%] text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[rgba(255,61,36,0.12)] border border-[rgba(255,61,36,0.3)] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path
              fill="#ff3d24"
              d="M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"
            />
          </svg>
        </div>

        <h2
          id="inactivity-modal-title"
          className="text-[var(--texto-principal)] text-2xl font-bold m-0"
        >
          Sesion Inactiva
        </h2>

        <p
          id="inactivity-modal-description"
          className="text-[var(--texto-secundario)] text-[0.95rem] leading-relaxed m-0"
        >
          Su sesion se cerrara automaticamente por inactividad. Haga clic en
          continuar para permanecer conectado.
        </p>

        <div className="flex flex-col items-center gap-1 py-4 px-6 bg-white/[0.04] border border-white/10 rounded-xl w-full">
          <span className="text-[var(--texto-secundario)] text-xs uppercase tracking-widest font-medium">
            Tiempo restante
          </span>
          <span
            className={`font-bold tabular-nums leading-none transition-all duration-300 ${
              isUrgent ? "text-[#ff3d24] text-[3.5rem]" : "text-[var(--texto-principal)] text-[3rem]"
            }`}
          >
            {formatCountdown(remainingSeconds)}
          </span>
        </div>

        <button
          type="button"
          className={`bg-[#ff3d24] text-white border-none rounded-xl py-[0.85rem] px-8 text-base font-semibold cursor-pointer w-full shadow-[0_4px_16px_rgba(255,61,36,0.3)] transition-all duration-200 tracking-wide ${
            isHovered ? "bg-[#e02912] -translate-y-px shadow-[0_8px_24px_rgba(255,61,36,0.45)]" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onStayLoggedIn}
        >
          Continuar Sesion
        </button>
      </div>
    </div>
  );
};

InactivityWarningModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  remainingSeconds: PropTypes.number.isRequired,
  onStayLoggedIn: PropTypes.func.isRequired,
};
COMPONENTE LEGADO */
