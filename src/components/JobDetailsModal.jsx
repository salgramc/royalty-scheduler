import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function JobDetailsModal({
  booking,
  customer,
  property,
  onClose,
  onRefresh,
}) {
  const [notes, setNotes] = useState(
    booking.cleaner_notes || ""
  );

  const [status, setStatus] = useState(
    booking.status || "Scheduled"
  );

  const isAirbnb =
    booking.booking_type === "Airbnb";

  const address = isAirbnb
    ? `${property?.street_address || ""} ${property?.city || ""}`
    : `${customer?.street_address || ""} ${customer?.city || ""}`;

  async function saveChanges() {
    const { error } = await supabase
      .from("bookings")
      .update({
        cleaner_notes: notes,
        status,
      })
      .eq("id", booking.id);

    if (error) {
      alert(error.message);
      return;
    }

    onRefresh();
    onClose();
  }

  const statusColors = {
    Scheduled: {
      bg: "#FEF3C7",
      text: "#92400E",
    },
    "In Progress": {
      bg: "#DBEAFE",
      text: "#1E40AF",
    },
    Completed: {
      bg: "#DCFCE7",
      text: "#166534",
    },
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: 760,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 18,
          padding: 28,
          boxShadow:
            "0 20px 50px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 30,
              }}
            >
              {isAirbnb
                ? property?.property_name
                : `${customer?.first_name} ${customer?.last_name}`}
            </h2>

            <div
              style={{
                color: "#6B7280",
                marginTop: 6,
              }}
            >
              {isAirbnb
                ? "Airbnb Turnover"
                : booking.service_type}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#F3F4F6",
              width: 42,
              height: 42,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          {/* NAVIGATION */}

          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  address
                )}`,
                "_blank"
              )
            }
            style={{
              width: "100%",
              background: "#F8FAFC",
              border: "1px solid #E5E7EB",
              borderRadius: 14,
              padding: 18,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#0E5EA8",
                fontSize: 18,
              }}
            >
              Navigate
            </div>

            <div
              style={{
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {address}
            </div>

            <div
              style={{
                marginTop: 8,
                color: "#0E5EA8",
                fontWeight: 600,
              }}
            >
              Open Google Maps →
            </div>
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 20,
            }}
          >
            {!isAirbnb ? (
              <>
                <div>
                  <small>Service</small>
                  <h3>{booking.service_type}</h3>
                </div>

                <div>
                  <small>Frequency</small>
                  <h3
                    style={{
                      textTransform:
                        "capitalize",
                    }}
                  >
                    {booking.frequency}
                  </h3>
                </div>
              </>
            ) : (
              <>
                <div>
                  <small>Door Code</small>
                  <h3>
                    {property?.door_code ||
                      "Not Set"}
                  </h3>
                </div>

                <div>
                  <small>
                    Inventory Code
                  </small>
                  <h3>
                    {property?.inventory_code ||
                      "Not Set"}
                  </h3>
                </div>
              </>
            )}
          </div>

          {booking.client_notes && (
            <div>
              <h3>Booking Notes</h3>

              <div
                style={{
                  background: "#FEF3C7",
                  padding: 16,
                  borderRadius: 12,
                  whiteSpace: "pre-wrap",
                }}
              >
                {booking.client_notes}
              </div>
            </div>
          )}

          {isAirbnb &&
            property?.notes && (
              <div>
                <h3>Property Notes</h3>

                <div
                  style={{
                    background: "#F9FAFB",
                    padding: 16,
                    borderRadius: 12,
                    whiteSpace:
                      "pre-wrap",
                  }}
                >
                  {property.notes}
                </div>
              </div>
            )}

          <div>
            <h3>Status</h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {Object.keys(
                statusColors
              ).map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setStatus(item)
                  }
                  style={{
                    padding:
                      "10px 18px",
                    borderRadius: 999,
                    border:
                      status === item
                        ? "none"
                        : "1px solid #D1D5DB",
                    background:
                      status === item
                        ? statusColors[
                            item
                          ].bg
                        : "#fff",
                    color:
                      status === item
                        ? statusColors[
                            item
                          ].text
                        : "#374151",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Cleaner Notes</h3>

            <textarea
              rows={7}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border:
                  "1px solid #D1D5DB",
                boxSizing:
                  "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={
                saveChanges
              }
              style={{
                flex: 1,
                background:
                  "#0E5EA8",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>

            <button
              onClick={onClose}
              style={{
                padding:
                  "14px 22px",
                borderRadius: 12,
                border:
                  "1px solid #D1D5DB",
                background:
                  "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}