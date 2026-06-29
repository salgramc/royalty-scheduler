import { useState, useEffect } from "react";

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  customer,
}) {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [streetAddress, setStreetAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    if (customer) {
      setFirstName(
        customer.first_name || ""
      );

      setLastName(
        customer.last_name || ""
      );

      setPhone(
        customer.phone || ""
      );

      setEmail(
        customer.email || ""
      );

      setStreetAddress(
        customer.street_address || ""
      );

      setCity(
        customer.city || ""
      );

      setNotes(
        customer.notes || ""
      );
    } else {
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setStreetAddress("");
      setCity("");
      setNotes("");
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          background: "#fff",
          width: "600px",
          maxWidth: "100%",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2>
          {customer
            ? "Edit Customer"
            : "Add Customer"}
        </h2>

        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) =>
              setFirstName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) =>
              setLastName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) =>
              setStreetAddress(
                e.target.value
              )
            }
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
          />

          <textarea
            rows={4}
            placeholder="Notes"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              onSave({
                first_name:
                  firstName,
                last_name:
                  lastName,
                phone,
                email,
                street_address:
                  streetAddress,
                city,
                notes,
              })
            }
          >
            Save
          </button>

          <button
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}