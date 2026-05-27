import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getUserBookingShouldDisableTime,
  isUserBookingTimeAllowed,
  USER_BOOKING_CUTOFF_HOUR,
} from "../utils/bookingRules";

const MAX_USER_BOOKING_TIME = dayjs("2000-01-01T19:59:00");

export { USER_BOOKING_TIME_ERROR } from "../utils/bookingRules";
export { isUserBookingTimeAllowed, validateUserBookingTime } from "../utils/bookingRules";

export default function BookingTimePicker({
  value,
  onChange,
  error = false,
  className = "time-container",
  style,
}) {
  return (
    <div
      className={`${className}${error ? " input-error" : ""}`}
      style={style}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileTimePicker
          value={value ? dayjs(`2000-01-01 ${value}`) : null}
          onChange={(picked) => {
            if (!picked) {
              onChange("");
              return;
            }
            const formatted = dayjs(picked).format("HH:mm");
            if (!isUserBookingTimeAllowed(formatted)) {
              return;
            }
            onChange(formatted);
          }}
          maxTime={MAX_USER_BOOKING_TIME}
          shouldDisableTime={getUserBookingShouldDisableTime()}
          slotProps={{
            textField: {
              variant: "standard",
              fullWidth: true,
              InputProps: { disableUnderline: true },
              placeholder: `Before ${USER_BOOKING_CUTOFF_HOUR}:00`,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
