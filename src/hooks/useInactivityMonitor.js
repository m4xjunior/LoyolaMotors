import { useState, useEffect, useRef, useCallback } from "react";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];
const DEFAULT_TIMEOUT = 900000;    // 15 minutes
const DEFAULT_WARNING_TIME = 60000; // 60 seconds
const THROTTLE_INTERVAL = 1000;    // 1 second throttle on activity resets

/**
 * useInactivityMonitor
 *
 * Monitors user activity and triggers callbacks when the user has been
 * inactive for a configurable period. Provides a warning countdown before
 * the full timeout fires.
 *
 * @param {object}   options
 * @param {number}   [options.timeout=900000]     - Total inactivity timeout in ms (default: 15 min)
 * @param {number}   [options.warningTime=60000]  - Warning period before timeout in ms (default: 60 s)
 * @param {function} [options.onTimeout]          - Called when full timeout elapses
 * @param {function} [options.onWarning]          - Called when warning period starts
 * @param {boolean}  [options.enabled=true]       - Toggle monitoring on/off
 *
 * @returns {{ isWarning: boolean, remainingSeconds: number, resetTimer: function }}
 */
const useInactivityMonitor = ({
  timeout = DEFAULT_TIMEOUT,
  warningTime = DEFAULT_WARNING_TIME,
  onTimeout,
  onWarning,
  enabled = true,
} = {}) => {
  const [isWarning, setIsWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.floor(warningTime / 1000)
  );

  // ── Refs ──────────────────────────────────────────────────────────────────
  // Timer IDs
  const warningTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Track last activity timestamp for throttling
  const lastActivityRef = useRef(Date.now());

  // Mirror isWarning in a ref so the activity handler (captured in a closure)
  // can read the latest value without becoming stale.
  const isWarningRef = useRef(false);

  // Keep latest callback refs so callers can pass new inline functions on
  // each render without forcing the entire effect to re-run.
  const onTimeoutRef = useRef(onTimeout);
  const onWarningRef = useRef(onWarning);
  useEffect(() => { onTimeoutRef.current = onTimeout; }, [onTimeout]);
  useEffect(() => { onWarningRef.current = onWarning; }, [onWarning]);

  // Keep latest timeout / warningTime in refs so the activity handler always
  // uses the current values even if they change between renders.
  const timeoutRef = useRef(timeout);
  const warningTimeRef = useRef(warningTime);
  useEffect(() => { timeoutRef.current = timeout; }, [timeout]);
  useEffect(() => { warningTimeRef.current = warningTime; }, [warningTime]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Clear all running timers / intervals. */
  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current !== null) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (timeoutTimerRef.current !== null) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  /**
   * Start the 1-second countdown interval.
   * Reads warningTime from the ref so it uses the current value.
   */
  const startCountdown = useCallback(() => {
    const totalSeconds = Math.floor(warningTimeRef.current / 1000);
    setRemainingSeconds(totalSeconds);

    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []); // warningTimeRef is a ref — no dep needed

  /**
   * Enter warning state: set flag, fire onWarning callback, start countdown,
   * and schedule the final timeout.
   */
  const enterWarning = useCallback(() => {
    isWarningRef.current = true;
    setIsWarning(true);

    if (onWarningRef.current) {
      onWarningRef.current();
    }

    startCountdown();

    timeoutTimerRef.current = setTimeout(() => {
      if (onTimeoutRef.current) {
        onTimeoutRef.current();
      }
    }, warningTimeRef.current);
  }, [startCountdown]);

  /**
   * Schedule the warning timer to fire after (timeout - warningTime) ms.
   * Reads both values from refs.
   */
  const scheduleWarning = useCallback(() => {
    const warningDelay = timeoutRef.current - warningTimeRef.current;
    warningTimerRef.current = setTimeout(() => {
      enterWarning();
    }, warningDelay > 0 ? warningDelay : 0);
  }, [enterWarning]);

  /**
   * Reset everything to the idle state and reschedule the warning timer.
   * Exposed to consumers as the "Stay logged in" action.
   */
  const resetTimer = useCallback(() => {
    clearAllTimers();
    isWarningRef.current = false;
    setIsWarning(false);
    setRemainingSeconds(Math.floor(warningTimeRef.current / 1000));
    lastActivityRef.current = Date.now();

    if (enabled) {
      scheduleWarning();
    }
  }, [clearAllTimers, enabled, scheduleWarning]);

  // ── Main effect ───────────────────────────────────────────────────────────
  // Re-runs whenever enabled, timeout, or warningTime change so that a change
  // to the timing configuration takes effect immediately.
  useEffect(() => {
    if (!enabled) {
      clearAllTimers();
      isWarningRef.current = false;
      setIsWarning(false);
      setRemainingSeconds(Math.floor(warningTimeRef.current / 1000));
      return;
    }

    // Throttled activity handler — only resets the timer once per THROTTLE_INTERVAL
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < THROTTLE_INTERVAL) {
        return;
      }
      lastActivityRef.current = now;

      if (isWarningRef.current) {
        // User acted during the warning — cancel everything and start fresh
        clearAllTimers();
        isWarningRef.current = false;
        setIsWarning(false);
        setRemainingSeconds(Math.floor(warningTimeRef.current / 1000));
        scheduleWarning();
      } else {
        // Normal activity — just push the warning deadline back
        clearAllTimers();
        scheduleWarning();
      }
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    // Kick off the initial warning timer
    scheduleWarning();

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      clearAllTimers();
    };
  }, [enabled, timeout, warningTime, clearAllTimers, scheduleWarning]);

  return { isWarning, remainingSeconds, resetTimer };
};

export default useInactivityMonitor;
