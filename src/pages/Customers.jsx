import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
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
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      street_address: streetAddress,
      city,
      notes,
    });

    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setStreetAddress("");
    setCity("");
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
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
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
        placeholder="Street Address"
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
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
          <strong>{customer.first_name} {customer.last_name}</strong>
          <br />
          {customer.phone}
          <br />
          {customer.street_address}, {customer.city}
          <hr />
        </div>
      ))}
    </div>
  );
}