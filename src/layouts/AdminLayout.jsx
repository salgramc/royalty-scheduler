import { useState } from "react";
import { supabase } from "../lib/supabase";

import AdminDashboard from "../pages/AdminDashboard";
import Customers from "../pages/Customers";
import Cleaners from "../pages/Cleaners";
import Bookings from "../pages/Bookings";

export default function AdminLayout() {
  const [page, setPage] = useState("dashboard");

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "250px",
          background: "#0E5EA8",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Scheduler</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <button onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("bookings")}>
            Bookings
          </button>

          <button onClick={() => setPage("customers")}>
            Customers
          </button>

          <button onClick={() => setPage("cleaners")}>
            Cleaners
          </button>

          <button
            onClick={logout}
            style={{
              marginTop: "30px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: "#F8FAFC",
        }}
      >
        {page === "dashboard" && (
          <AdminDashboard />
        )}

        {page === "bookings" && (
          <Bookings />
        )}

        {page === "customers" && (
          <Customers />
        )}

        {page === "cleaners" && (
          <Cleaners />
        )}
      </div>
    </div>
  );
}