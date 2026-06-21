import StatusBadge from "./StatusBadge";

export default function JobCard({
  customer,
  cleaner,
  booking,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        boxShadow:
          "0 1px 3px rgba(0,0,0,.08)",
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 8,
        }}
      >
        {customer?.first_name} {customer?.last_name}
      </h3>

      <div>{customer?.street_address && customer?.city}</div>

      <div
        style={{
          marginTop: 10,
        }}
      >
        <strong>Cleaner:</strong>{" "}
        {cleaner?.first_name} {cleaner?.last_name}
      </div>

      <div>
        <strong>Time:</strong>{" "}
        {booking.cleaning_time}
      </div>

      <div>
        <strong>Service:</strong>{" "}
        {booking.service_type}
      </div>

      <div>
        <strong>Frequency:</strong>{" "}
        {booking.frequency}
      </div>

      <div
        style={{
          marginTop: 12,
        }}
      >
        <StatusBadge
          status={
            booking.status ||
            "Scheduled"
          }
        />
      </div>
    </div>
  );
}