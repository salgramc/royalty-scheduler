import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function BookingModal({
  booking,
  onClose,
  onSaved,
}) {
  const editing = !!booking;

  const [customers, setCustomers] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [properties, setProperties] = useState([]);

  const [bookingType, setBookingType] =
    useState(
      booking?.booking_type ||
        "Residential"
    );

  const [customerId, setCustomerId] =
    useState(
      booking?.customer_id || ""
    );

  const [propertyId, setPropertyId] =
    useState(
      booking?.property_id || ""
    );

  const [hostId, setHostId] =
    useState(
      booking?.host_id || ""
    );

  const [cleanerId, setCleanerId] =
    useState(
      booking?.cleaner_id || ""
    );

  const [serviceType, setServiceType] =
    useState(
      booking?.service_type ||
        "Recurring Cleaning"
    );

  const [frequency, setFrequency] =
    useState(
      booking?.frequency ||
        "One Time"
    );

  const [cleaningDate, setCleaningDate] =
    useState(
      booking?.cleaning_date || ""
    );

  const [cleaningTime, setCleaningTime] =
    useState(
      booking?.cleaning_time || ""
    );

  const [status, setStatus] =
    useState(
      booking?.status ||
        "Scheduled"
    );

  const [clientNotes, setClientNotes] =
    useState(
      booking?.client_notes || ""
    );

  useEffect(() => {
    loadDropdowns();
  }, []);

  async function loadDropdowns() {
    const [
      customersRes,
      cleanersRes,
      hostsRes,
      propertiesRes,
    ] = await Promise.all([
      supabase
        .from("customers")
        .select("*")
        .order("first_name"),

      supabase
        .from("cleaners")
        .select("*")
        .order("first_name"),

      supabase
        .from("hosts")
        .select("*")
        .order("host_name"),

      supabase
        .from("properties")
        .select("*")
        .order("property_name"),
    ]);

    setCustomers(
      customersRes.data || []
    );

    setCleaners(
      cleanersRes.data || []
    );

    setHosts(hostsRes.data || []);

    setProperties(
      propertiesRes.data || []
    );
  }
  async function saveBooking() {
    const payload = {
      booking_type: bookingType,
      customer_id:
        bookingType === "Residential"
          ? customerId || null
          : null,
      property_id:
        bookingType === "Airbnb"
          ? propertyId || null
          : null,
      host_id:
        bookingType === "Airbnb"
          ? hostId || null
          : null,
      cleaner_id: cleanerId || null,
      service_type: serviceType,
      frequency: frequency,
      cleaning_date: cleaningDate,
      cleaning_time: cleaningTime,
      status: status,
      client_notes: clientNotes,
    };

    let error;

    if (editing) {
      ({ error } = await supabase
        .from("bookings")
        .update(payload)
        .eq("id", booking.id));
    } else {
      ({ error } = await supabase
        .from("bookings")
        .insert(payload));
    }

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width: 760,
          maxWidth: "100%",
          background: "#FFFFFF",
          borderRadius: 20,
          padding: 30,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 34,
              }}
            >
              {editing
                ? "Edit Booking"
                : "Add Booking"}
            </h2>

            <div
              style={{
                color: "#6B7280",
                marginTop: 6,
              }}
            >
              Create or update a booking
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
            gap: 22,
          }}
        >
          <div>
            <label>Booking Type</label>

            <select
              value={bookingType}
              onChange={(e) =>
                setBookingType(e.target.value)
              }
              style={inputStyle}
            >
              <option>
                Residential
              </option>
              <option>Airbnb</option>
            </select>
          </div>

          {bookingType ===
          "Residential" ? (
            <div>
              <label>Customer</label>

              <select
                value={customerId}
                onChange={(e) =>
                  setCustomerId(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.first_name}{" "}
                    {c.last_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label>Host</label>

                <select
                  value={hostId}
                  onChange={(e) =>
                    setHostId(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select Host
                  </option>

                  {hosts.map((host) => (
                    <option
                      key={host.id}
                      value={host.id}
                    >
                      {host.host_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Property</label>

                <select
                  value={propertyId}
                  onChange={(e) =>
                    setPropertyId(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select Property
                  </option>

                  {properties.map(
                    (property) => (
                      <option
                        key={property.id}
                        value={
                          property.id
                        }
                      >
                        {
                          property.property_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}

          <div>
            <label>Cleaner</label>

            <select
              value={cleanerId}
              onChange={(e) =>
                setCleanerId(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="">
                Unassigned
              </option>

              {cleaners.map(
                (cleaner) => (
                  <option
                    key={cleaner.id}
                    value={cleaner.id}
                  >
                    {cleaner.first_name}{" "}
                    {cleaner.last_name}
                  </option>
                )
              )}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 18,
            }}
          >
            <div>
              <label>Date</label>

              <input
                type="date"
                value={cleaningDate}
                onChange={(e) =>
                  setCleaningDate(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label>Time</label>

              <input
                type="time"
                value={cleaningTime}
                onChange={(e) =>
                  setCleaningTime(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
            }}
          >
            <div>
              <label>Service</label>

              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value)
                }
                style={inputStyle}
              >
                <option>
                  Recurring Cleaning
                </option>
                <option>
                  Deep Cleaning
                </option>
                <option>
                  Move In
                </option>
                <option>
                  Move Out
                </option>
                <option>
                  Airbnb Turnover
                </option>
              </select>
            </div>

            <div>
              <label>Frequency</label>

              <select
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value)
                }
                style={inputStyle}
              >
                <option>One Time</option>
                <option>Weekly</option>
                <option>Biweekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label>Status</label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={inputStyle}
            >
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label>Booking Notes</label>

            <textarea
              rows={5}
              value={clientNotes}
              onChange={(e) =>
                setClientNotes(
                  e.target.value
                )
              }
              placeholder="Optional notes..."
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 14,
              marginTop: 10,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "14px 24px",
                borderRadius: 12,
                border: "1px solid #D1D5DB",
                background: "#FFFFFF",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              onClick={saveBooking}
              style={{
                padding: "14px 24px",
                borderRadius: 12,
                border: "none",
                background: "#0E5EA8",
                color: "#FFFFFF",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {editing
                ? "Save Changes"
                : "Create Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  border: "1px solid #D1D5DB",
  borderRadius: 12,
  fontSize: 15,
  marginTop: 6,
  boxSizing: "border-box",
  background: "#FFFFFF",
};