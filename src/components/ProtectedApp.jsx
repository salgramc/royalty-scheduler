import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import AdminLayout from "../layouts/AdminLayout";
import CleanerDashboard from "../pages/CleanerDashboard";

export default function ProtectedApp() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setRole(data?.role);
    }

    loadRole();
  }, []);

  if (!role) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (role === "admin") {
    return <AdminLayout />;
  }

  if (role === "cleaner") {
    return <CleanerDashboard />;
  }

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      No access
    </div>
  );
}