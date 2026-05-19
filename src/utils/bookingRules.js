/** Latest allowed start time for user bookings (exclusive of 8:00 PM). */
export const USER_BOOKING_CUTOFF_HOUR = 20;

/** Hours a priest remains unavailable after a booking ends (duration + buffer). */
export const PRIEST_BUFFER_HOURS_AFTER_BOOKING = 3;

export const USER_BOOKING_TIME_ERROR =
  "Bookings cannot be scheduled at 8:00 PM or later. Please choose an earlier time.";

export const PRIEST_CONFLICT_ERROR =
  "This priest has a conflicting schedule on this day. They must be free for the booking duration plus 3 hours afterward.";

/** Default ceremony length in minutes per sacrament type. */
const BOOKING_DURATION_MINUTES = {
  Wedding: 120,
  Baptism: 90,
  Burial: 90,
  Communion: 60,
  Confirmation: 90,
  Anointing: 45,
  Confession: 30,
};

const DEFAULT_DURATION_MINUTES = 60;

/**
 * @param {string} timeStr - "HH:mm" or ISO / Date-parsable string
 * @returns {{ hours: number, minutes: number } | null}
 */
export function parseTimeParts(timeStr) {
  if (timeStr === null || timeStr === undefined || timeStr === "") {
    return null;
  }

  const raw = String(timeStr).trim();
  if (!raw || raw === "null" || raw === "undefined") {
    return null;
  }

  const hhmm = raw.match(/^(\d{1,2}):(\d{2})/);
  if (hhmm) {
    const hours = parseInt(hhmm[1], 10);
    const minutes = parseInt(hhmm[2], 10);
    if (
      !Number.isNaN(hours) &&
      !Number.isNaN(minutes) &&
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    ) {
      return { hours, minutes };
    }
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return { hours: parsed.getHours(), minutes: parsed.getMinutes() };
  }

  return null;
}

/**
 * User bookings must start before 8:00 PM (20:00).
 * @param {string} timeStr
 */
export function isUserBookingTimeAllowed(timeStr) {
  const parts = parseTimeParts(timeStr);
  if (!parts) return false;
  return parts.hours < USER_BOOKING_CUTOFF_HOUR;
}

export function validateUserBookingTime(timeStr) {
  return isUserBookingTimeAllowed(timeStr);
}

/**
 * MUI TimePicker helpers — blocks hour 20+ and any time at/after 8:00 PM.
 */
export function getUserBookingShouldDisableTime() {
  return (value, view) => {
    if (!value) return false;
    const hour = value.hour?.() ?? value.hour;
    if (view === "hours") {
      return hour >= USER_BOOKING_CUTOFF_HOUR;
    }
    return hour >= USER_BOOKING_CUTOFF_HOUR;
  };
}

export function getBookingDurationMinutes(bookingType) {
  return BOOKING_DURATION_MINUTES[bookingType] ?? DEFAULT_DURATION_MINUTES;
}

/**
 * @param {string|Date} dateValue
 * @param {string} timeValue
 * @returns {Date | null}
 */
export function parseBookingDateTime(dateValue, timeValue) {
  if (!dateValue) return null;

  const base = new Date(dateValue);
  if (Number.isNaN(base.getTime())) return null;

  const parts = parseTimeParts(timeValue);
  if (parts) {
    base.setHours(parts.hours, parts.minutes, 0, 0);
    return base;
  }

  return base;
}

/**
 * @param {string|Date} a
 * @param {string|Date} b
 */
export function isSameCalendarDay(a, b) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
    return false;
  }
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

/**
 * Blocked window: [start, start + duration + buffer)
 * @param {string|Date} dateValue
 * @param {string} timeValue
 * @param {string} bookingType
 */
export function getPriestBlockedWindow(dateValue, timeValue, bookingType) {
  const start = parseBookingDateTime(dateValue, timeValue);
  if (!start) return null;

  const durationMs = getBookingDurationMinutes(bookingType) * 60 * 1000;
  const bufferMs = PRIEST_BUFFER_HOURS_AFTER_BOOKING * 60 * 60 * 1000;

  return {
    start,
    end: new Date(start.getTime() + durationMs + bufferMs),
    durationEnd: new Date(start.getTime() + durationMs),
  };
}

function windowsOverlap(windowA, windowB) {
  return windowA.start < windowB.end && windowB.start < windowA.end;
}

/**
 * Client-side priest schedule conflict check (same day, duration + buffer).
 * @param {object} params
 * @param {string} params.priestId
 * @param {string|Date} params.bookingDate
 * @param {string} params.bookingTime
 * @param {string} params.bookingType
 * @param {Array} params.allBookings
 * @param {string|null} [params.excludeTransactionId]
 */
export function checkPriestScheduleConflict({
  priestId,
  bookingDate,
  bookingTime,
  bookingType,
  allBookings,
  excludeTransactionId = null,
}) {
  if (!priestId || !bookingDate || !bookingTime) {
    return { hasConflict: false };
  }

  const candidateWindow = getPriestBlockedWindow(
    bookingDate,
    bookingTime,
    bookingType,
  );
  if (!candidateWindow) {
    return { hasConflict: false };
  }

  const conflicts = (allBookings || []).filter((booking) => {
    if (!booking || booking.status !== "confirmed") return false;
    if (booking.priest_id !== priestId) return false;
    if (
      excludeTransactionId &&
      booking.transaction_id === excludeTransactionId
    ) {
      return false;
    }
    if (!isSameCalendarDay(booking.date, bookingDate)) return false;
    if (!booking.time) return false;

    const existingWindow = getPriestBlockedWindow(
      booking.date,
      booking.time,
      booking.bookingType,
    );
    if (!existingWindow) return false;

    return windowsOverlap(candidateWindow, existingWindow);
  });

  if (conflicts.length > 0) {
    const existing = conflicts[0];
    return {
      hasConflict: true,
      message: `${PRIEST_CONFLICT_ERROR} Conflicts with ${existing.bookingType || "booking"} (${existing.transaction_id || "existing"}).`,
      conflictingBooking: existing,
    };
  }

  return { hasConflict: false };
}
