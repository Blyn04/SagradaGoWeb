import React from "react";
import { Badge, Calendar } from "antd";
import dayjs from "dayjs";
import "../styles/custom-calendar.css";

const CustomCalendar = ({ events = [], onEventClick }) => {
  const dateCellRender = (value) => {
    if (!events || events.length === 0) {
      return null;
    }

    const dateStr = dayjs(value).format("YYYY-MM-DD"); 
    const dayEvents = events.filter((event) => event && event.date === dateStr);

    if (dayEvents.length === 0) {
      return null;
    }

    return (
      <div style={{ minHeight: 50, position: "relative" }}>
        {dayEvents.map((item, index) => (
          <Badge
            key={index}
            status={
              item.type === "Wedding"
                ? "success"
                : item.type === "Baptism"
                ? "processing"
                : item.type === "Burial"
                ? "error"
                : item.type === "Communion"
                ? "warning"
                : item.type === "Confirmation"
                ? "processing"
                : item.type === "Anointing"
                ? "default"
                : item.type === "Confession"
                ? "default"
                : "default"
            }
            text={item.name || "Event"}
            style={{
              display: "block",
              marginBottom: 2,
              fontSize: "11px",
              cursor: onEventClick ? "pointer" : "default",
            }}
            onClick={() => onEventClick && onEventClick(item)}
          />
        ))}
      </div>
    );
  };

  const monthCellRender = (value) => {
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
