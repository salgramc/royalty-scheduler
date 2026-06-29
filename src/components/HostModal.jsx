import { useEffect, useState } from "react";

export default function HostModal({
  isOpen,
  onClose,
  onSave,
  host,
}) {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [properties, setProperties] =
    useState([
      {
        property_name: "",
        street_address: "",
        city: "",
        door_code: "",
        inventory_code: "",
        notes: "",
      },
    ]);

  useEffect(() => {
    if (!isOpen) return;

    if (host) {
      setFirstName(
        host.first_name || ""
      );

      setLastName(
        host.last_name || ""
      );

      setPhone(
        host.phone || ""
      );

      setEmail(
        host.email || ""
      );

      setProperties(
        host.properties?.length
          ? host.properties
          : [
              {
                property_name: "",
                street_address: "",
                city: "",
                door_code: "",
                inventory_code: "",
                notes: "",
              },
            ]
      );
    } else {
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");

      setProperties([
        {
          property_name: "",
          street_address: "",
          city: "",
          door_code: "",
          inventory_code: "",
          notes: "",
        },
      ]);
    }
  }, [host, isOpen]);

  function addPropertyRow() {
    setProperties([
      ...properties,
      {
        property_name: "",
        street_address: "",
        city: "",
        door_code: "",
        inventory_code: "",
        notes: "",
      },
    ]);
  }

  function updateProperty(
    index,
    field,
    value
  ) {
    const updated = [
      ...properties,
    ];

    updated[index][field] =
      value;

    setProperties(updated);
  }

  function removeProperty(
    index
  ) {
    const updated =
      properties.filter(
        (_, i) => i !== index
      );

    setProperties(
      updated.length
        ? updated
        : [
            {
              property_name: "",
              street_address: "",
              city: "",
              door_code: "",
              inventory_code: "",
              notes: "",
            },
          ]
    );
  }

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
          width: "900px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            {host
              ? "Edit Host"
              : "Add Host"}
          </h2>

          <button
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
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
        </div>

        <h3
          style={{
            marginTop: "24px",
          }}
        >
          Properties
        </h3>

        {properties.map(
          (
            property,
            index
          ) => (
            <div
              key={index}
              style={{
                border:
                  "1px solid #E5E7EB",
                borderRadius:
                  "12px",
                padding:
                  "16px",
                marginBottom:
                  "12px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "10px",
                }}
              >
                <strong>
                  Property #
                  {index + 1}
                </strong>

                <button
                  onClick={() =>
                    removeProperty(
                      index
                    )
                  }
                >
                  Remove
                </button>
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(250px,1fr))",
                  gap: "10px",
                }}
              >
                <input
                  placeholder="Property Name"
                  value={
                    property.property_name
                  }
                  onChange={(e) =>
                    updateProperty(
                      index,
                      "property_name",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Street Address"
                  value={
                    property.street_address
                  }
                  onChange={(e) =>
                    updateProperty(
                      index,
                      "street_address",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="City"
                  value={
                    property.city
                  }
                  onChange={(e) =>
                    updateProperty(
                      index,
                      "city",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Door Code"
                  value={
                    property.door_code
                  }
                  onChange={(e) =>
                    updateProperty(
                      index,
                      "door_code",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Inventory Code"
                  value={
                    property.inventory_code
                  }
                  onChange={(e) =>
                    updateProperty(
                      index,
                      "inventory_code",
                      e.target.value
                    )
                  }
                />
              </div>

              <textarea
                rows={3}
                placeholder="Notes"
                value={
                  property.notes
                }
                onChange={(e) =>
                  updateProperty(
                    index,
                    "notes",
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  marginTop:
                    "10px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>
          )
        )}

        <button
          onClick={
            addPropertyRow
          }
          style={{
            marginBottom:
              "20px",
          }}
        >
          Add Property
        </button>

        <div>
          <button
            onClick={() =>
              onSave({
                first_name:
                  firstName,
                last_name:
                  lastName,
                phone,
                email,
                properties,
              })
            }
            style={{
              background:
                "#0E5EA8",
              color: "#fff",
              border: "none",
              padding:
                "10px 16px",
              borderRadius:
                "8px",
            }}
          >
            Save Host
          </button>
        </div>
      </div>
    </div>
  );
}