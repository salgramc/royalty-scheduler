import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import JobDetailsModal from "../components/JobDetailsModal";

export default function CleanerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: cleanerData } = await supabase
      .from("cleaners")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!cleanerData) return;

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("cleaner_id", cleanerData.id);

    const { data: customersData } = await supabase
      .from("customers")
      .select("*");

    setBookings(bookingsData || []);
    setCustomers(customersData || []);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("bookings")
      .update({
        status,
      })
      .eq("id", id);

    loadData();
  }

  function getCustomer(id) {
    return customers.find(
      (c) => Number(c.id) === Number(id)
    );
  }

  function changeDate(days) {
    const date = new Date(selectedDate);

    date.setDate(date.getDate() + days);

    setSelectedDate(
      date.toISOString().split("T")[0]
    );
  }

  function formatTime(time) {
    if (!time) return "No Time";

    const [hours, minutes] =
      time.split(":");

    return new Date(
      2000,
      0,
      1,
      Number(hours),
      Number(minutes)
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  function formatDateLabel(dateString) {
  const [year, month, day] = dateString.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

  useEffect(() => {
    loadData();
  }, []);

  const selectedBookings = bookings
    .filter(
      (booking) =>
        booking.cleaning_date === selectedDate
    )
    .sort((a, b) =>
      (a.cleaning_time || "").localeCompare(
        b.cleaning_time || ""
      )
    );

  const todoJobs = selectedBookings.filter(
    (b) => b.status === "Scheduled"
  );

  const inProgressJobs =
    selectedBookings.filter(
      (b) => b.status === "In Progress"
    );

  const completedJobs =
    selectedBookings.filter(
      (b) => b.status === "Completed"
    );

  function JobCard({
    booking,
    customer,
    background,
    border,
    buttonText,
    buttonAction,
  }) {
    return (
    <div
    onClick={() => setSelectedJob(booking)}
    style={{
        cursor: "pointer",
        background,
        border,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "14px",
        boxShadow: "0 1px 3px rgba(0,0,0,.08)",
    }}
    >
    <div
        style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        }}
    >
        <h3
        style={{
            margin: 0,
        }}
        >
        {customer?.first_name} {customer?.last_name}
        </h3>

        <div
        style={{
            fontWeight: "600",
        }}
        >
        {formatTime(booking.cleaning_time)}
        </div>
    </div>

    <div
        style={{
        color: "#6B7280",
        marginBottom: "16px",
        }}
    >
        {customer?.street_address && customer?.city ? `${customer.street_address}, ${customer.city}` : customer?.street_address || customer?.city || "No Address"}
    </div>

    <div
        style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        }}
    >
        <span
        style={{
            background:
            booking.status === "Completed"
                ? "#DCFCE7"
                : booking.status === "In Progress"
                ? "#DBEAFE"
                : "#FEF3C7",
            color:
            booking.status === "Completed"
                ? "#166534"
                : booking.status === "In Progress"
                ? "#1E40AF"
                : "#92400E",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
        }}
        >
        {booking.status}
        </span>

        <div
        style={{
            color: "#1693E6",
            fontWeight: "600",
        }}
        >
        View Details →
        </div>
    </div>

    {buttonText && (
        <button
        onClick={(e) => {
            e.stopPropagation();
            buttonAction();
        }}
        style={{
            background: "#1693E6",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
        }}
        >
        {buttonText}
        </button>
    )}
    </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
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
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "700",
            }}
          >
            My Jobs
          </h1>

          <p
            style={{
              margin: "6px 0 0 0",
              color: "#6B7280",
            }}
          >
            House Cleaning Schedule
          </p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          style={{
            background: "#1693E6",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#FEF3C7",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <div>TO DO</div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            {todoJobs.length}
          </div>
        </div>

        <div
          style={{
            background: "#DBEAFE",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <div>WORKING</div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            {inProgressJobs.length}
          </div>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <div>DONE</div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            {completedJobs.length}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <button
          onClick={() =>
            changeDate(-1)
          }
        >
          ←
        </button>

        <h2>
            {formatDateLabel(selectedDate)}
        </h2>

        <button
          onClick={() =>
            changeDate(1)
          }
        >
          →
        </button>
      </div>

      <h2>To Do ({todoJobs.length})</h2>

      {todoJobs.map((booking) => (
        <JobCard
          key={booking.id}
          booking={booking}
          customer={getCustomer(
            booking.customer_id
          )}
          background="#FFFFFF"
          border="1px solid #E5E7EB"
          buttonText="Start Job"
          buttonAction={() =>
            updateStatus(
              booking.id,
              "In Progress"
            )
          }
        />
      ))}

      <h2 style={{ marginTop: 40 }}>
        In Progress ({inProgressJobs.length})
      </h2>

      {inProgressJobs.map(
        (booking) => (
          <JobCard
            key={booking.id}
            booking={booking}
            customer={getCustomer(
              booking.customer_id
            )}
            background="#EFF6FF"
            border="1px solid #93C5FD"
            buttonText="Complete Job"
            buttonAction={() =>
              updateStatus(
                booking.id,
                "Completed"
              )
            }
          />
        )
      )}

      <h2 style={{ marginTop: 40 }}>
        Completed ({completedJobs.length})
      </h2>

      {completedJobs.map(
        (booking) => (
          <JobCard
            key={booking.id}
            booking={booking}
            customer={getCustomer(
              booking.customer_id
            )}
            background="#F0FDF4"
            border="1px solid #86EFAC"
          />
        )
      )}

      {selectedJob && (
        <JobDetailsModal
          booking={selectedJob}
          customer={getCustomer(
            selectedJob.customer_id
          )}
          onClose={() =>
            setSelectedJob(null)
          }
          onRefresh={loadData}
        />
      )}
    </div>
  );
}