import { useState } from "react";
import Customers from "./pages/Customers";
import Cleaners from "./pages/Cleaners";
import Bookings from "./pages/Bookings";

function App() {
  const [page, setPage] = useState("customers");

  return (
    <div>
      <div style={{ padding: 20 }}>
        <button onClick={() => setPage("customers")}>
          Customers
        </button>

        <button
          onClick={() => setPage("cleaners")}
          style={{ marginLeft: 10 }}
        >
          Cleaners
        </button>

        <button
          onClick={() => setPage("bookings")}
          style={{ marginLeft: 10 }}
        >
          Bookings
        </button>
      </div>

      {page === "customers" && <Customers />}
      {page === "cleaners" && <Cleaners />}
      {page === "bookings" && <Bookings />}
    </div>
  );
}

export default App;