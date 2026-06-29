import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CustomerModal from "../components/CustomerModal";

export default function Customers() {
  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  async function loadCustomers() {
    const { data, error } =
      await supabase
        .from("customers")
        .select("*")
        .order("first_name");

    if (error) {
      console.error(error);
      return;
    }

    setCustomers(data || []);
  }

  async function saveCustomer(
    customerData
  ) {
    let error;

    if (selectedCustomer) {
      ({ error } = await supabase
        .from("customers")
        .update(customerData)
        .eq(
          "id",
          selectedCustomer.id
        ));
    } else {
      ({ error } = await supabase
        .from("customers")
        .insert(customerData));
    }

    if (error) {
      alert(error.message);
      return;
    }

    setModalOpen(false);
    setSelectedCustomer(null);

    loadCustomers();
  }

  async function deleteCustomer(
    id
  ) {
    const confirmed =
      window.confirm(
        "Delete this customer?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCustomers();
  }

  function openAddCustomer() {
    setSelectedCustomer(null);
    setModalOpen(true);
  }

  function openEditCustomer(
    customer
  ) {
    setSelectedCustomer(customer);
    setModalOpen(true);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers =
    customers.filter(
      (customer) => {
        const value =
          `${customer.first_name || ""} ${customer.last_name || ""} ${customer.phone || ""} ${customer.city || ""}`.toLowerCase();

        return value.includes(
          search.toLowerCase()
        );
      }
    );

  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Customers
        </h1>

        <button
          onClick={
            openAddCustomer
          }
          style={{
            background:
              "#0E5EA8",
            color: "#FFFFFF",
            border: "none",
            borderRadius:
              "10px",
            padding:
              "10px 16px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Add Customer
        </button>
      </div>

      <input
        placeholder="Search customers..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "12px",
          border:
            "1px solid #D1D5DB",
          borderRadius: "10px",
          marginBottom: "20px",
          boxSizing:
            "border-box",
        }}
      />

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {filteredCustomers.map(
          (customer) => (
            <div
              key={customer.id}
              style={{
                background:
                  "#FFFFFF",
                border:
                  "1px solid #E5E7EB",
                borderRadius:
                  "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  flexWrap:
                    "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight:
                        "600",
                      fontSize:
                        "16px",
                    }}
                  >
                    {
                      customer.first_name
                    }{" "}
                    {
                      customer.last_name
                    }
                  </div>

                  <div
                    style={{
                      color:
                        "#6B7280",
                    }}
                  >
                    {
                      customer.phone
                    }
                  </div>

                  <div
                    style={{
                      color:
                        "#6B7280",
                    }}
                  >
                    {
                      customer.city
                    }
                  </div>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() =>
                      openEditCustomer(
                        customer
                      )
                    }
                    style={{
                      padding:
                        "8px 12px",
                      borderRadius:
                        "8px",
                      border:
                        "1px solid #D1D5DB",
                      cursor:
                        "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteCustomer(
                        customer.id
                      )
                    }
                    style={{
                      padding:
                        "8px 12px",
                      borderRadius:
                        "8px",
                      border:
                        "1px solid #FCA5A5",
                      background:
                        "#FEF2F2",
                      color:
                        "#B91C1C",
                      cursor:
                        "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <CustomerModal
        isOpen={modalOpen}
        customer={
          selectedCustomer
        }
        onClose={() => {
          setModalOpen(false);
          setSelectedCustomer(
            null
          );
        }}
        onSave={saveCustomer}
      />
    </div>
  );
}