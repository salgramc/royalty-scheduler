import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Bookings() {
  const [customers, setCustomers] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [cleanerId, setCleanerId] = useState("");
  const [cleaningDate, setCleaningDate] = useState("");
  const [cleaningTime, setCleaningTime] = useState("");
  const [frequency, setFrequency] = useState("one_time");
  const [serviceType, setServiceType] = useState("Recurring Cleaning");

  async function loadData() {
    const { data: customersData } = await supabase
      .from("customers")
      .select("*")
      .order("first_name");

    const { data: cleanersData } = await supabase
      .from("cleaners")
      .select("*")
      .order("first_name");

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("cleaning_date", {
        ascending: true,
      });

    setCustomers(customersData || []);
    setCleaners(cleanersData || []);
    setBookings(bookingsData || []);
  }

  async function addBooking() {
    if (
        !customerId ||
        !cleanerId ||
        !cleaningDate ||
        !serviceType
    ) {
        alert("Please fill out all required fields.");
        return;
    }

    const bookingsToInsert = [];

    let repeatCount = 1;

    if (serviceType === "Recurring Cleaning") {
        if (frequency === "weekly") repeatCount = 12;
        if (frequency === "biweekly") repeatCount = 12;
        if (frequency === "monthly") repeatCount = 6;
    }

    for (let i = 0; i < repeatCount; i++) {
        const date = new Date(cleaningDate + "T00:00:00");

        if (frequency === "weekly") {
        date.setDate(date.getDate() + i * 7);
        }

        if (frequency === "biweekly") {
        date.setDate(date.getDate() + i * 14);
        }

        if (frequency === "monthly") {
        date.setMonth(date.getMonth() + i);
        }

        bookingsToInsert.push({
        customer_id: customerId,
        cleaner_id: cleanerId,
        cleaning_date: date.toISOString().split("T")[0],
        cleaning_time: cleaningTime,
        frequency,
        service_type: serviceType,
        status: "Scheduled",
        });
    }

    const { error } = await supabase
        .from("bookings")
        .insert(bookingsToInsert);

    if (error) {
        alert(error.message);
        return;
    }

    setCustomerId("");
    setCleanerId("");
    setCleaningDate("");
    setCleaningTime("");
    setFrequency("one_time");
    setServiceType("Recurring Cleaning");

    loadData();
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Bookings</h1>

      <select
        value={customerId}
        onChange={(e) =>
          setCustomerId(e.target.value)
        }
      >
        <option value="">
          Select Customer
        </option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.first_name} {customer.last_name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={cleanerId}
        onChange={(e) =>
          setCleanerId(e.target.value)
        }
      >
        <option value="">
          Select Cleaner
        </option>

        {cleaners.map((cleaner) => (
          <option
            key={cleaner.id}
            value={cleaner.id}
          >
            {cleaner.first_name}{" "}
            {cleaner.last_name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="date"
        value={cleaningDate}
        onChange={(e) =>
          setCleaningDate(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="time"
        value={cleaningTime}
        onChange={(e) =>
          setCleaningTime(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={frequency}
        onChange={(e) =>
          setFrequency(e.target.value)
        }
      >
        <option value="one_time">
          One Time
        </option>

        <option value="weekly">
          Weekly
        </option>

        <option value="biweekly">
          Biweekly
        </option>

        <option value="monthly">
          Monthly
        </option>
      </select>

      <br />
      <br />

      <select
        value={serviceType}
        onChange={(e) =>
          setServiceType(e.target.value)
        }
      >
        <option value="Deep Clean">
          Deep Clean
        </option>

        <option value="Recurring Cleaning">
          Recurring Cleaning
        </option>

        <option value="Move In / Move Out">
          Move In / Move Out
        </option>

        <option value="Airbnb Turnover">
          Airbnb Turnover
        </option>
      </select>

      <br />
      <br />

      <button onClick={addBooking}>
        Create Booking
      </button>

      <hr />

      <h2>Upcoming Bookings</h2>

      {bookings.map((booking) => {
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
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>
              {customer?.first_name} {customer?.last_name}
            </strong>

            <br />

            📍{" "}
            {customer?.street_address && customer?.city ? `${customer.street_address}, ${customer.city}` : customer?.street_address || customer?.city || "No Address"}

            <br />

            👤 Assigned To:{" "}
            {cleaner?.first_name}{" "}
            {cleaner?.last_name}

            <br />

            📅 {booking.cleaning_date}

            <br />

            ⏰{" "}
            {booking.cleaning_time ||
              "Not Set"}

            <br />

            🧹{" "}
            {booking.service_type}

            <br />

            🔄 {booking.frequency}

            <br />

            ✅{" "}
            {booking.status ||
              "Scheduled"}
          </div>
        );
      })}
    </div>
  );
}