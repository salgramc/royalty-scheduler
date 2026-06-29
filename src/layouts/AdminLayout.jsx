import { useState } from "react";
import { supabase } from "../lib/supabase";

import AdminDashboard from "../pages/AdminDashboard";
import Customers from "../pages/Customers";
import Hosts from "../pages/Hosts";
import Cleaners from "../pages/Cleaners";
import Bookings from "../pages/Bookings";

export default function AdminLayout() {
  const [page, setPage] = useState("dashboard");

  async function logout() {
    await supabase.auth.signOut();
  }

  function NavButton({
    label,
    pageName,
  }) {
    const active =
      page === pageName;

    return (
      <button
        onClick={() =>
          setPage(pageName)
        }
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          border: active
            ? "2px solid white"
            : "1px solid rgba(255,255,255,.15)",
          background: active
            ? "#FFFFFF"
            : "transparent",
          color: active
            ? "#0E5EA8"
            : "#FFFFFF",
          fontWeight: active
            ? "600"
            : "500",
          cursor: "pointer",
          transition:
            "all .2s ease",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#F8FAFC",
      }}
    >
      <div
        style={{
          width: "220px",
          background:
            "#0E5EA8",
          color: "white",
          padding: "24px 16px",
          display: "flex",
          flexDirection:
            "column",
          boxSizing:
            "border-box",
        }}
      >
        <div
          style={{
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Scheduler
          </h2>

          <div
            style={{
              fontSize: "12px",
              opacity: 0.8,
              marginTop: "4px",
            }}
          >
            Royalty House Cleaning
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "10px",
          }}
        >
          <NavButton
            label="Dashboard"
            pageName="dashboard"
          />

          <NavButton
            label="Bookings"
            pageName="bookings"
          />

          <NavButton
            label="Customers"
            pageName="customers"
          />

          <NavButton
            label="Hosts"
            pageName="hosts"
          />

          <NavButton
            label="Cleaners"
            pageName="cleaners"
          />
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
          }}
        >
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding:
                "12px 16px",
              borderRadius:
                "10px",
              border:
                "1px solid rgba(255,255,255,.2)",
              background:
                "transparent",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background:
            "#F8FAFC",
          padding: "24px",
          overflow: "auto",
        }}
      >
        {page ===
          "dashboard" && (
          <AdminDashboard />
        )}

        {page ===
          "bookings" && (
          <Bookings />
        )}

        {page ===
          "customers" && (
          <Customers />
        )}

        {page ===
          "hosts" && (
          <Hosts />
        )}

        {page ===
          "cleaners" && (
          <Cleaners />
        )}
      </div>
    </div>
  );
}