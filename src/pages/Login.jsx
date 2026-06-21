import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #F8FAFC 0%, #EEF7FF 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "500px",
          maxWidth: "100%",
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "40px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,.08)",
          border: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <img
            src="/logo.jpg"
            alt="Royalty House Cleaning"
            style={{
              width: "280px",
              maxWidth: "100%",
              marginBottom: "24px",
            }}
          />

          <h1
            style={{
              margin: 0,
              color: "#0E5EA8",
              fontSize: "36px",
              fontWeight: "700",
              letterSpacing: "-1px",
            }}
          >
            Scheduler
          </h1>
        </div>

        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #D1D5DB",
            marginBottom: "16px",
            fontSize: "16px",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #D1D5DB",
            marginBottom: "24px",
            fontSize: "16px",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        <button
          onClick={signIn}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "12px",
            background: "#1693E6",
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}