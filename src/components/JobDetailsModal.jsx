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

  async function saveNotes() {
    const { error } = await supabase
      .from("bookings")
      .update({
        cleaner_notes: notes,
      })
      .eq("id", booking.id);

    if (error) {
      alert(error.message);
      return;
    }

    onRefresh();
    alert("Notes saved");
  }

  function getStatusStyle(status) {
    if (status === "Scheduled") {
      return {
        background: "#FEF3C7",
        color: "#92400E",
      };
    }

    if (status === "In Progress") {
      return {
        background: "#DBEAFE",
        color: "#1E40AF",
      };
    }

    if (status === "Completed") {
      return {
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    return {
      background: "#F3F4F6",
      color: "#374151",
    };
  }

  const statusStyle = getStatusStyle(
    booking.status
  );

  const isAirbnb =
    booking.booking_type === "Airbnb";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          background: "#fff",
          width: "700px",
          maxWidth: "100%",
          borderRadius: "16px",
          padding: "24px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              {isAirbnb
                ? property?.property_name
                : `${customer?.first_name || ""} ${customer?.last_name || ""}`}
            </h2>

            <div
              style={{
                color: "#6B7280",
                marginTop: "4px",
              }}
            >
              Job Details
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background:
                "transparent",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <strong>Address</strong>

            <div
              style={{
                marginTop: "4px",
              }}
            >
              {isAirbnb
                ? `${property?.street_address || ""}, ${property?.city || ""}`
                : `${customer?.street_address || ""}, ${customer?.city || ""}`}
            </div>
          </div>

          {isAirbnb && (
            <>
              <div>
                <strong>
                  Door Code
                </strong>

                <div
                  style={{
                    marginTop: "4px",
                  }}
                >
                  {property?.door_code ||
                    "Not Set"}
                </div>
              </div>

              <div>
                <strong>
                  Inventory Code
                </strong>

                <div
                  style={{
                    marginTop: "4px",
                  }}
                >
                  {property?.inventory_code ||
                    "Not Set"}
                </div>
              </div>

              {property?.notes && (
                <div>
                  <strong>
                    Property Notes
                  </strong>

                  <div
                    style={{
                      background:
                        "#F9FAFB",
                      padding:
                        "14px",
                      borderRadius:
                        "10px",
                      marginTop:
                        "8px",
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {property.notes}
                  </div>
                </div>
              )}
            </>
          )}

          {!isAirbnb && (
            <>
              <div>
                <strong>
                  Service
                </strong>

                <div
                  style={{
                    marginTop: "4px",
                  }}
                >
                  {booking.service_type}
                </div>
              </div>

              <div>
                <strong>
                  Frequency
                </strong>

                <div
                  style={{
                    marginTop: "4px",
                  }}
                >
                  {booking.frequency}
                </div>
              </div>
            </>
          )}

          <div>
            <strong>Status</strong>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  background:
                    statusStyle.background,
                  color:
                    statusStyle.color,
                  padding:
                    "6px 12px",
                  borderRadius:
                    "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {booking.client_notes && (
            <div>
              <strong>
                Client Notes
              </strong>

              <div
                style={{
                  background:
                    "#FEF3C7",
                  padding:
                    "14px",
                  borderRadius:
                    "10px",
                  marginTop: "8px",
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {booking.client_notes}
              </div>
            </div>
          )}

          <div>
            <strong>
              Cleaner Notes
            </strong>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              rows={8}
              placeholder="Optional notes about the cleaning..."
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "12px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #D1D5DB",
                resize:
                  "vertical",
                boxSizing:
                  "border-box",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={saveNotes}
            style={{
              background:
                "#1693E6",
              color: "#fff",
              border: "none",
              padding:
                "10px 18px",
              borderRadius:
                "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Save Notes
          </button>

          <button
            onClick={onClose}
            style={{
              background:
                "#F3F4F6",
              border: "none",
              padding:
                "10px 18px",
              borderRadius:
                "10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}