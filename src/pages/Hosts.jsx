import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Hosts() {
  const [hosts, setHosts] = useState([]);

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

  async function loadHosts() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER:", user);

    const { data, error } =
      await supabase
        .from("hosts")
        .select("*")
        .order("first_name");

    console.log(
      "HOSTS DATA:",
      data
    );

    console.log(
      "HOSTS ERROR:",
      error
    );

    if (error) {
      console.error(error);
      return;
    }

    setHosts(data || []);
  }

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

  async function addHost() {
    console.log("ADDING HOST");

    const { data: host, error } =
      await supabase
        .from("hosts")
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
        })
        .select()
        .single();

    console.log("HOST:", host);
    console.log("ERROR:", error);

    if (error) {
      console.error(error);

      alert(
        JSON.stringify(error)
      );

      return;
    }

    const propertyRows =
      properties
        .filter(
          (p) => p.property_name
        )
        .map((property) => ({
          host_id: host.id,
          property_name:
            property.property_name,
          street_address:
            property.street_address,
          city: property.city,
          door_code:
            property.door_code,
          inventory_code:
            property.inventory_code,
          notes: property.notes,
        }));

    if (
      propertyRows.length > 0
    ) {
      const {
        error:
          propertyError,
      } = await supabase
        .from("properties")
        .insert(propertyRows);

      if (
        propertyError
      ) {
        console.error(
          propertyError
        );
      }
    }

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

    loadHosts();
  }

  useEffect(() => {
    loadHosts();
  }, []);

  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      <h1>Hosts</h1>

      <div
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "1000px",
          marginBottom: "30px",
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

        <h2
          style={{
            marginTop: "20px",
          }}
        >
          Properties
        </h2>

        {properties.map(
          (
            property,
            index
          ) => (
            <div
              key={index}
              style={{
                border:
                  "1px solid #D1D5DB",
                borderRadius:
                  "12px",
                padding:
                  "16px",
                display:
                  "grid",
                gap: "10px",
                background:
                  "#FFFFFF",
              }}
            >
              <h3>
                Property #
                {index + 1}
              </h3>

              <input
                placeholder="Property Name"
                value={
                  property.property_name
                }
                onChange={(
                  e
                ) => {
                  const updated =
                    [
                      ...properties,
                    ];

                  updated[
                    index
                  ].property_name =
                    e.target.value;

                  setProperties(
                    updated
                  );
                }}
              />

              <input
                placeholder="Street Address"
                value={
                  property.street_address
                }
                onChange={(
                  e
                ) => {
                  const updated =
                    [
                      ...properties,
                    ];

                  updated[
                    index
                  ].street_address =
                    e.target.value;

                  setProperties(
                    updated
                  );
                }}
              />

              <input
                placeholder="City"
                value={
                  property.city
                }
                onChange={(
                  e
                ) => {
                  const updated =
                    [
                      ...properties,
                    ];

                  updated[
                    index
                  ].city =
                    e.target.value;

                  setProperties(
                    updated
                  );
                }}
              />

              <input
                placeholder="Door Code"
                value={
                  property.door_code
                }
                onChange={(
                  e
                ) => {
                  const updated =
                    [
                      ...properties,
                    ];

                  updated[
                    index
                  ].door_code =
                    e.target.value;

                  setProperties(
                    updated
                  );
                }}
              />

              <input
                placeholder="Inventory Code"
                value={
                  property.inventory_code
                }
                onChange={(
                  e
                ) => {
                  const updated =
                    [
                      ...properties,
                    ];

                  updated[
                    index
                  ].inventory_code =
                    e.target.value;

                  setProperties(
                    updated
                  );
                }}
              />

              <textarea
                rows={4}
                placeholder="Notes"
                value={
                  property.notes
                }
                onChange={(
                  e
                ) => {
                  const updated =
                    [
                      ...properties,
                    ];

                  updated[
                    index
                  ].notes =
                    e.target.value;

                  setProperties(
                    updated
                  );
                }}
              />
            </div>
          )
        )}

        <button
          type="button"
          onClick={
            addPropertyRow
          }
        >
          + Add Another Property
        </button>

        <button
          onClick={addHost}
        >
          Add Host
        </button>
      </div>

      <h2>
        Existing Hosts
      </h2>

      {hosts.map((host) => (
        <div
          key={host.id}
          style={{
            background:
              "white",
            padding:
              "16px",
            borderRadius:
              "12px",
            marginBottom:
              "10px",
          }}
        >
          <strong>
            {
              host.first_name
            }{" "}
            {
              host.last_name
            }
          </strong>

          <div>
            {host.phone}
          </div>

          <div>
            {host.email}
          </div>
        </div>
      ))}
    </div>
  );
}