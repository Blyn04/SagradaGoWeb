import React from "react";
import { Badge, Calendar } from "antd";
import dayjs from "dayjs";
import "../styles/custom-calendar.css";

const CustomCalendar = ({ events }) => {
  const dateCellRender = (value) => {
    const dateStr = dayjs(value).format("YYYY-MM-DD");
    const dayEvents = events.filter((event) => event.date === dateStr);

    if (dayEvents.length === 0) return null;

    return (
      <ul className="events" style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {dayEvents.map((item, index) => (
          <li key={index} style={{ marginBottom: 4 }}>
            <Badge
              status={
                item.type === "Wedding"
                  ? "success"
                  : item.type === "Baptism"
                  ? "processing"
                  : item.type === "Burial"
                  ? "error"
                  : "default"
              }
              text={item.name}
            />
          </li>
        ))}
      </ul>
    );
  };

  // Optionally, you can show month data if needed
  const monthCellRender = (value) => {
    // Example: return number of events in the month
    const monthStr = dayjs(value).format("YYYY-MM");
    const monthEventsCount = events.filter((event) =>
      event.date.startsWith(monthStr)
    ).length;

    return monthEventsCount ? (
      <div className="notes-month">
        <section>{monthEventsCount}</section>
        <span>Events</span>
      </div>
    ) : null;
  };

  const cellRender = (current, info) => {
    if (info.type === "date") {
      return dateCellRender(current);
    }
    if (info.type === "month") {
      return monthCellRender(current);
    }
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default CustomCalendar;
