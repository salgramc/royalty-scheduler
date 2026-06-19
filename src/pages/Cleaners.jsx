import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Cleaners() {
  const [cleaners, setCleaners] = useState([]);

  const [name, setName] = useState("");
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
    await supabase.from("cleaners").insert({
      name,
      phone,
      email,
    });

    setName("");
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
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={addCleaner}>
        Add Cleaner
      </button>

      <hr />

      {cleaners.map((cleaner) => (
        <div key={cleaner.id}>
          <strong>{cleaner.name}</strong>
          <br />
          {cleaner.phone}
          <hr />
        </div>
      ))}
    </div>
  );
}