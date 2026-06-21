import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cleaners, setCleaners] = useState([]);

  async function loadData() {
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("cleaning_time");

    const { data: customersData } = await supabase
      .from("customers")
      .select("*");

    const { data: cleanersData } = await supabase
      .from("cleaners")
      .select("*");

    setBookings(bookingsData || []);
    setCustomers(customersData || []);
    setCleaners(cleanersData || []);
  }

  function getCustomer(id) {
    return customers.find(
      (c) => Number(c.id) === Number(id)
    );
  }

  function getCleaner(id) {
    return cleaners.find(
      (c) => Number(c.id) === Number(id)
    );
  }

  function getStatusBadge(status) {
    let background = "#E5E7EB";
    let color = "#374151";

    if (status === "Scheduled") {
      background = "#FEF3C7";
      color = "#92400E";
    }

    if (status === "In Progress") {
      background = "#DBEAFE";
      color = "#1E40AF";
    }

    if (status === "Completed") {
      background = "#DCFCE7";
      color = "#166534";
    }

    return (
      <span
        style={{
          background,
          color,
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {status}
      </span>
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todaysBookings = bookings.filter(
    (booking) => booking.cleaning_date === today
  );

  const scheduledCount = todaysBookings.filter(
    (b) => b.status === "Scheduled"
  ).length;

  const inProgressCount = todaysBookings.filter(
    (b) => b.status === "In Progress"
  ).length;

  const completedCount = todaysBookings.filter(
    (b) => b.status === "Completed"
  ).length;

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "36px",
            fontWeight: "700",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: "#6B7280",
            marginTop: "8px",
          }}
        >
          View and manage today's cleaning appointments
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Today's Jobs
          </div>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "8px",
            }}
          >
            {todaysBookings.length}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Scheduled
          </div>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#92400E",
              marginTop: "8px",
            }}
          >
            {scheduledCount}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            In Progress
          </div>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1E40AF",
              marginTop: "8px",
            }}
          >
            {inProgressCount}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Completed
          </div>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#166534",
              marginTop: "8px",
            }}
          >
            {completedCount}
          </div>
        </div>
      </div>

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Today's Jobs
      </h2>

      {todaysBookings.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          No jobs scheduled for today.
        </div>
      ) : (
        todaysBookings.map((booking) => {
          const customer = getCustomer(
            booking.customer_id
          );

          const cleaner = getCleaner(
            booking.cleaner_id
          );

          return (
            <div
              key={booking.id}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                {customer?.first_name} {customer?.last_name}
              </h3>

              <div
                style={{
                  color: "#6B7280",
                  marginBottom: "16px",
                }}
              >
                {customer?.street_address}, {customer?.city}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                }}
              >
                <div>
                  <strong>Cleaner</strong>
                  <br />
                  {cleaner?.first_name} {cleaner?.last_name}
                </div>

                <div>
                  <strong>Time</strong>
                  <br />
                  {booking.cleaning_time}
                </div>

                <div>
                  <strong>Service</strong>
                  <br />
                  {booking.service_type}
                </div>

                <div>
                  <strong>Frequency</strong>
                  <br />
                  {booking.frequency}
                </div>

                <div>
                  <strong>Status</strong>
                  <br />
                  {getStatusBadge(
                    booking.status || "Scheduled"
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}