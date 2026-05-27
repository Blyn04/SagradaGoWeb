import dayjs from "dayjs";

export const MIN_PRIEST_AGE_YEARS = 25;

/**
 * @param {string} birthday - YYYY-MM-DD or parseable date
 * @param {{ isPriest?: boolean }} [options]
 */
export function validateBirthday(birthday, options = {}) {
  const { isPriest = false } = options;

  if (!birthday) {
    return "Birthday is required";
  }

  let date = dayjs(birthday, "YYYY-MM-DD", true);
  if (!date.isValid()) {
    date = dayjs(birthday);
  }

  const today = dayjs();
  const minDate = dayjs().subtract(120, "years");

  if (!date.isValid()) {
    return "Please enter a valid date (MM/DD/YYYY)";
  }

  if (date.isAfter(today, "day")) {
    return "Birthday cannot be in the future";
  }

  if (date.isBefore(minDate, "day")) {
    return "Please enter a valid birthday (not more than 120 years ago)";
  }

  if (isPriest) {
    const age = today.diff(date, "year");
    if (age < MIN_PRIEST_AGE_YEARS) {
      return `Priests must be at least ${MIN_PRIEST_AGE_YEARS} years old.`;
    }
  }

  return "";
}

/** Latest selectable birthday for a new priest (must be 25+ today). */
export function getPriestMaxBirthdayDate() {
  return dayjs().subtract(MIN_PRIEST_AGE_YEARS, "year").endOf("day");
}

/**
 * @param {string} residency
 * @param {string|null|undefined} startDate
 * @param {string|null|undefined} endDate
 */
export function validateFloatingPriestDates(residency, startDate, endDate) {
  if (residency !== "Floating") {
    return "";
  }

  if (!startDate) {
    return "Start date is required for floating priests";
  }

  if (!endDate) {
    return "End date is required for floating priests";
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return "Please enter valid start and end dates";
  }

  if (end.isBefore(start, "day")) {
    return "End date must be on or after start date";
  }

  return "";
}

/**
 * Whether a priest can be assigned to bookings today.
 * @param {object} priest
 * @param {string} [referenceDate] - YYYY-MM-DD, defaults to today
 */
export function isPriestAssignable(priest, referenceDate) {
  if (!priest) return false;

  const residency = priest.residency || "Permanent";

  if (residency !== "Floating") {
    return true;
  }

  const today = referenceDate
    ? dayjs(referenceDate).startOf("day")
    : dayjs().startOf("day");

  const start = priest.start_date || priest.floating_start_date;
  const end = priest.end_date || priest.floating_end_date;

  if (!start || !end) {
    return false;
  }

  const startDay = dayjs(start).startOf("day");
  const endDay = dayjs(end).startOf("day");

  if (!startDay.isValid() || !endDay.isValid()) {
    return false;
  }

  return (
    !today.isBefore(startDay, "day") && !today.isAfter(endDay, "day")
  );
}

export function formatDateTimeStamp(value) {
  if (!value) return "N/A";
  const d = dayjs(value);
  return d.isValid() ? d.format("MMM DD, YYYY hh:mm A") : "N/A";
}

export function formatDateOnly(value) {
  if (!value) return "N/A";
  const d = dayjs(value);
  return d.isValid() ? d.format("MMM DD, YYYY") : "N/A";
}
