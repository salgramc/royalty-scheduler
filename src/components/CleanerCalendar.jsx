import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import MiniCalendar from "react-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-calendar/dist/Calendar.css";

const localizer = momentLocalizer(moment);

function CustomEvent({ event }) {
  return (
    <div
      style={{
        fontSize: "clamp(10px, 1vw, 13px)",
        fontWeight: 600,
        lineHeight: 1.2,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%",
      }}
      title={event.title}
    >
      {event.title}
    </div>
  );
}

export default function CleanerCalendar({
  events,
  onSelectEvent,
}) {
  const [date, setDate] = useState(new Date());

  const [view, setView] = useState("day");

  const isMobile =
    typeof window !== "undefined" &&
    window.innerWidth < 768;

  function getBookingCount(day) {
    return events.filter((event) => {
      const eventDate = new Date(event.start);

      return (
        eventDate.getFullYear() ===
          day.getFullYear() &&
        eventDate.getMonth() ===
          day.getMonth() &&
        eventDate.getDate() ===
          day.getDate()
      );
    }).length;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: isMobile ? 10 : 20,
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      {/* MINI CALENDAR */}

      <div
        style={{
          width: isMobile ? 170 : 300,
          minWidth: isMobile ? 170 : 300,
          background: "#FFFFFF",
          borderRadius: 12,
          padding: isMobile ? 10 : 16,
          boxShadow:
            "0 1px 3px rgba(0,0,0,.08)",
          height: "fit-content",
        }}
      >
        <MiniCalendar
          value={date}
          onChange={setDate}
          tileContent={({ date, view }) => {
            if (view !== "month")
              return null;

            const count =
              getBookingCount(date);

            if (count === 0)
              return null;

            return (
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "center",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                {Array.from({
                  length: Math.min(
                    count,
                    3
                  ),
                }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius:
                        "50%",
                      background:
                        "#0E5EA8",
                    }}
                  />
                ))}
              </div>
            );
          }}
        />
      </div>

      {/* BIG CALENDAR */}

      <div
        style={{
          flex: 1,
          height: isMobile
            ? "72vh"
            : "90vh",
          background: "#FFFFFF",
          borderRadius: 12,
          padding: isMobile ? 8 : 12,
          boxShadow:
            "0 1px 3px rgba(0,0,0,.08)",
        }}
      >
        <style>{`
          .rbc-event-label{
            display:none!important;
          }

          .rbc-event-content{
            overflow:hidden!important;
          }

          .rbc-time-content{
            border-top:1px solid #E5E7EB;
          }

          .rbc-toolbar{
            margin-bottom:20px;
            display:flex;
            flex-wrap:wrap;
            gap:8px;
          }

          .rbc-toolbar-label{
            font-weight:600;
          }

          .rbc-toolbar button{
            border-radius:8px;
            min-height:40px;
            padding:6px 12px;
          }

          .rbc-header{
            padding:10px 0;
            font-weight:600;
          }

          .react-calendar{
            width:100%;
            border:none;
            font-family:inherit;
          }

          .react-calendar__navigation button{
            font-weight:600;
          }

          .react-calendar__tile{
            border-radius:8px;
            position:relative;
          }

          .react-calendar__tile--active{
            background:#0E5EA8!important;
            color:#FFFFFF!important;
          }

          .react-calendar__tile--now{
            background:#DBEAFE!important;
            color:#0E5EA8!important;
            font-weight:600;
          }

          .react-calendar__month-view__days__day--weekend{
            color:#111827!important;
          }

          .react-calendar__month-view__days__day--neighboringMonth{
            color:#9CA3AF!important;
          }

          @media (max-width:768px){

            .rbc-toolbar{
              justify-content:center;
            }

            .rbc-toolbar-label{
              width:100%;
              text-align:center;
              margin-bottom:8px;
            }

            .rbc-toolbar button{
              flex:1;
              min-width:70px;
              font-size:12px;
            }

            .rbc-header{
              font-size:12px;
            }

            .rbc-event-content{
              font-size:10px;
            }

            .react-calendar{
              font-size:13px;
            }

            .rbc-time-gutter{
              font-size:11px;
            }
          }
        `}</style>

        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          views={
            isMobile
              ? ["day"]
              : ["day", "week"]
          }
          min={
            new Date(
              2026,
              0,
              1,
              6,
              0
            )
          }
          max={
            new Date(
              2026,
              0,
              1,
              19,
              0
            )
          }
          scrollToTime={
            new Date(
              2026,
              0,
              1,
              6,
              0
            )
          }
          onSelectEvent={
            onSelectEvent
          }
          formats={{
            eventTimeRangeFormat:
              () => "",
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
              status ===
              "In Progress"
            ) {
              backgroundColor =
                "#3B82F6";
            }

            if (
              status ===
              "Completed"
            ) {
              backgroundColor =
                "#22C55E";
            }

            return {
              style: {
                backgroundColor,
                border: "none",
                borderRadius: 8,
                color: "#FFFFFF",
                fontWeight: 600,
                padding: isMobile
                  ? "2px"
                  : "4px",
              },
            };
          }}
        />
      </div>
    </div>
  );
}