import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import JobDetailsModal from "../components/JobDetailsModal";
import CleanerCalendar from "../components/CleanerCalendar";

export default function CleanerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

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

  function getCustomer(id) {
    return customers.find(
      (c) => Number(c.id) === Number(id)
    );
  }

  function formatTime(time) {
    if (!time) return "";

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

  useEffect(() => {
    loadData();
  }, []);

  const calendarEvents = bookings.map(
    (booking) => {
      const customer = getCustomer(
        booking.customer_id
      );

      const title = customer
        ? `${formatTime(
            booking.cleaning_time
          )} - ${customer.first_name} ${customer.last_name}`
        : "Customer";

      const [hours, minutes] = (
        booking.cleaning_time || "09:00"
      ).split(":");

      const start = new Date(
        booking.cleaning_date
      );

      start.setHours(
        Number(hours),
        Number(minutes)
      );

      const end = new Date(start);

      end.setHours(
        start.getHours() + 1
      );

      return {
        title,
        start,
        end,
        resource: booking,
      };
    }
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1800px",
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

      <CleanerCalendar
        events={calendarEvents}
        onSelectEvent={(event) =>
          setSelectedJob(event.resource)
        }
      />

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