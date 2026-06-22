import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function CustomEvent({ event }) {
  return (
    <div
      style={{
        fontSize: "13px",
        fontWeight: "600",
        lineHeight: "1.2",
        overflow: "hidden",
      }}
    >
      {event.title}
    </div>
  );
}

export default function CleanerCalendar({
  events,
  onSelectEvent,
}) {
  const [date, setDate] = useState(
    new Date()
  );

  const [view, setView] = useState(
    "week"
  );

  return (
    <div
      style={{
        height: "90vh",
        width: "100%",
        background: "white",
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      <style>
        {`
          .rbc-event-label {
            display: none !important;
          }

          .rbc-event-content {
            overflow: hidden !important;
          }

          .rbc-time-content {
            border-top: 1px solid #e5e7eb;
          }

          .rbc-header {
            padding: 10px 0;
            font-weight: 600;
          }

          .rbc-toolbar {
            margin-bottom: 20px;
          }

          .rbc-toolbar button {
            border-radius: 8px;
          }
        `}
      </style>

      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onView={(newView) =>
          setView(newView)
        }
        onNavigate={(newDate) =>
          setDate(newDate)
        }
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        views={["day", "week"]}
        min={new Date(2026, 0, 1, 7, 0)}
        max={new Date(2026, 0, 1, 19, 0)}
        scrollToTime={
          new Date(2026, 0, 1, 8, 0)
        }
        onSelectEvent={onSelectEvent}
        formats={{
          eventTimeRangeFormat: () => "",
        }}
        components={{
          event: CustomEvent,
        }}
        eventPropGetter={(event) => {
          const status =
            event.resource?.status;

          let backgroundColor =
            "#F59E0B";

          if (
            status === "In Progress"
          ) {
            backgroundColor =
              "#3B82F6";
          }

          if (
            status === "Completed"
          ) {
            backgroundColor =
              "#22C55E";
          }

          return {
            style: {
              backgroundColor,
              borderRadius: "8px",
              border: "none",
              color: "white",
              fontWeight: "600",
              padding: "4px",
            },
          };
        }}
      />
    </div>
  );
}