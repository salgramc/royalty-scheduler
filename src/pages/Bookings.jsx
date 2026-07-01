import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import BookingModal from "../components/BookingModal";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");

  const [showBookingModal, setShowBookingModal] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  async function loadData() {
    const [
      bookingsRes,
      customersRes,
      propertiesRes,
    ] = await Promise.all([
      supabase
        .from("bookings")
        .select("*")
        .order("cleaning_date"),

      supabase
        .from("customers")
        .select("*"),

      supabase
        .from("properties")
        .select("*"),
    ]);

    setBookings(bookingsRes.data || []);
    setCustomers(customersRes.data || []);
    setProperties(propertiesRes.data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  function getCustomer(id) {
    return customers.find(
      (c) => Number(c.id) === Number(id)
    );
  }

  function getProperty(id) {
    return properties.find(
      (p) => Number(p.id) === Number(id)
    );
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const customer = getCustomer(
        booking.customer_id
      );

      const property = getProperty(
        booking.property_id
      );

      const searchText = [
        customer?.first_name,
        customer?.last_name,
        customer?.street_address,
        customer?.city,
        property?.property_name,
        property?.street_address,
        property?.city,
      ]
        .join(" ")
        .toLowerCase();

      return searchText.includes(
        search.toLowerCase()
      );
    });
  }, [
    bookings,
    customers,
    properties,
    search,
  ]);

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: 30,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 36,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              margin: 0,
              color: "#111827",
            }}
          >
            Bookings
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#6B7280",
              fontSize: 18,
            }}
          >
            Search and manage customer bookings
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBooking(null);
            setShowBookingModal(true);
          }}
          style={{
            background: "#0E5EA8",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 14,
            padding: "16px 28px",
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow:
              "0 8px 20px rgba(14,94,168,.18)",
          }}
        >
          + Add Booking
        </button>
      </div>

      {/* SEARCH */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 36,
        }}
      >
        <input
          type="text"
          placeholder="Search customer, host, property or address..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: 700,
            maxWidth: "100%",
            padding: "18px 22px",
            borderRadius: 16,
            border: "1px solid #D1D5DB",
            outline: "none",
            fontSize: 18,
            background: "#FFFFFF",
          }}
        />
      </div>

      {/* RESULTS START */}
      {filteredBookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#6B7280",
            padding: "80px 0",
            fontSize: 18,
          }}
        >
          No bookings found.
        </div>
      ) : (
        Object.entries(
          filteredBookings.reduce(
            (groups, booking) => {
              const customer =
                booking.booking_type ===
                "Residential"
                  ? getCustomer(
                      booking.customer_id
                    )
                  : getProperty(
                      booking.property_id
                    );

              const key =
                booking.booking_type ===
                "Residential"
                  ? `customer-${booking.customer_id}`
                  : `property-${booking.property_id}`;

              if (!groups[key]) {
                groups[key] = {
                  info: customer,
                  type: booking.booking_type,
                  bookings: [],
                };
              }

              groups[key].bookings.push(
                booking
              );

              return groups;
            },
            {}
          )
        ).map(([key, group]) => (
          <div
            key={key}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 18,
              padding: 24,
              marginBottom: 24,
              boxShadow:
                "0 1px 3px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                  }}
                >
                  {group.type ===
                  "Residential"
                    ? `${group.info?.first_name || ""} ${group.info?.last_name || ""}`
                    : group.info
                        ?.property_name}
                </h2>

                <div
                  style={{
                    color: "#6B7280",
                    marginTop: 6,
                  }}
                >
                  {group.type ===
                  "Residential"
                    ? `${group.info?.street_address || ""}, ${group.info?.city || ""}`
                    : `${group.info?.street_address || ""}, ${group.info?.city || ""}`}
                </div>
              </div>

              <div
                style={{
                  fontWeight: 600,
                  color: "#6B7280",
                }}
              >
                {group.bookings.length}{" "}
                Booking
                {group.bookings.length !==
                1
                  ? "s"
                  : ""}
              </div>
            </div>

            {/* MONTHS GO HERE */}
            {Object.entries(
              group.bookings.reduce(
                (months, booking) => {
                  const month =
                    new Date(
                      booking.cleaning_date
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    );

                  if (!months[month]) {
                    months[month] = [];
                  }

                  months[month].push(
                    booking
                  );

                  return months;
                },
                {}
              )
            ).map(
              ([month, monthBookings]) => (
                <div
                  key={month}
                  style={{
                    borderTop:
                      "1px solid #F3F4F6",
                    paddingTop: 18,
                    marginTop: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      cursor: "pointer",
                      marginBottom: 18,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 22,
                      }}
                    >
                      ▼ {month}
                    </h3>

                    <span
                      style={{
                        color: "#6B7280",
                        fontWeight: 600,
                      }}
                    >
                      {
                        monthBookings.length
                      }{" "}
                      Booking
                      {monthBookings.length !==
                      1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  {monthBookings.map(
                    (booking) => (
                      <div
                        key={booking.id}
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          padding:
                            "18px 20px",
                          border:
                            "1px solid #E5E7EB",
                          borderRadius: 14,
                          marginBottom: 14,
                          background:
                            "#FAFAFA",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: "#111827",
                            }}
                          >
                            {new Date(
                              booking.cleaning_date
                            ).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              color: "#6B7280",
                              fontSize: 15,
                            }}
                          >
                            {booking.cleaning_time}
                          </div>

                          <div
                            style={{
                              marginTop: 10,
                              fontWeight: 600,
                            }}
                          >
                            {booking.service_type}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <span
                            style={{
                              padding: "8px 14px",
                              borderRadius: 999,
                              fontSize: 13,
                              fontWeight: 700,
                              background:
                                booking.status ===
                                "Completed"
                                  ? "#DCFCE7"
                                  : booking.status ===
                                    "In Progress"
                                  ? "#DBEAFE"
                                  : "#FEF3C7",
                              color:
                                booking.status ===
                                "Completed"
                                  ? "#166534"
                                  : booking.status ===
                                    "In Progress"
                                  ? "#1E40AF"
                                  : "#92400E",
                            }}
                          >
                            {booking.status}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedBooking(
                                booking
                              );
                              setShowBookingModal(
                                true
                              );
                            }}
                            style={{
                              border: "none",
                              background: "#0E5EA8",
                              color: "#fff",
                              padding:
                                "10px 18px",
                              borderRadius: 10,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Edit
                          </button>

                          <button
                            style={{
                              border:
                                "1px solid #EF4444",
                              background:
                                "#FFFFFF",
                              color: "#DC2626",
                              padding:
                                "10px 18px",
                              borderRadius: 10,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        ))
      )}

      {showBookingModal && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setSelectedBooking(null);
            setShowBookingModal(false);
          }}
          onSaved={() => {
            loadData();
            setSelectedBooking(null);
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
}