import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Cleaners() {
  const [cleaners, setCleaners] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  async function loadCleaners() {
    const { data } = await supabase
      .from("cleaners")
      .select("*")
      .order("id", { ascending: false });

    setCleaners(data || []);
  }

  async function addCleaner() {
    if (!firstName || !lastName) {
      alert("First name and last name are required.");
      return;
    }

    const { error } = await supabase
      .from("cleaners")
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");

    loadCleaners();
  }

  useEffect(() => {
    loadCleaners();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Cleaners</h1>

      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) =>
          setFirstName(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) =>
          setLastName(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={addCleaner}>
        Add Cleaner
      </button>

      <hr />

      {cleaners.map((cleaner) => (
        <div
          key={cleaner.id}
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <strong>
            {cleaner.first_name} {cleaner.last_name}
          </strong>

          <br />

          {cleaner.email}

          <br />

          {cleaner.phone}
        </div>
      ))}
    </div>
  );
}