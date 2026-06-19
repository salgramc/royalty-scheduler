import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  async function loadCustomers() {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("id", { ascending: false });

    setCustomers(data || []);
  }

  async function addCustomer() {
    await supabase.from("customers").insert({
      name,
      phone,
      email,
      address,
      notes,
    });

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setNotes("");

    loadCustomers();
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Customers</h1>

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

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br /><br />

      <button onClick={addCustomer}>
        Add Customer
      </button>

      <hr />

      {customers.map((customer) => (
        <div key={customer.id}>
          <strong>{customer.name}</strong>
          <br />
          {customer.phone}
          <br />
          {customer.address}
          <hr />
        </div>
      ))}
    </div>
  );
}