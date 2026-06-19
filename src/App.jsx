import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");

  async function loadCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("id", { ascending: false });

    console.log("LOAD DATA:", data);
    console.log("LOAD ERROR:", error);

    if (!error) {
      setCustomers(data || []);
    }
  }

  async function addCustomer() {
    if (!name) return;

    const { data, error } = await supabase
      .from("customers")
      .insert({
        name,
      })
      .select();

    console.log("INSERT DATA:", data);
    console.log("INSERT ERROR:", error);

    if (error) {
      alert(JSON.stringify(error, null, 2));
      return;
    }

    setName("");
    loadCustomers();
  }

  useEffect(() => {
    console.log("ENV:", import.meta.env);

    async function testConnection() {
      const { data, error } = await supabase
        .from("customers")
        .select("*");

      console.log("TEST DATA:", data);
      console.log("TEST ERROR:", error);
    }

    testConnection();
    loadCustomers();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Royalty Scheduler</h1>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addCustomer}>
        Add Customer
      </button>

      <hr />

      <h2>Customers</h2>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        customers.map((customer) => (
          <div key={customer.id}>
            {customer.id} - {customer.name}
          </div>
        ))
      )}
    </div>
  );
}

export default App;