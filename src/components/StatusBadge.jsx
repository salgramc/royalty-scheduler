export default function StatusBadge({ status }) {
  let style = {
    background: "#E5E7EB",
    color: "#374151",
  };

  if (status === "Scheduled") {
    style = {
      background: "#FEF3C7",
      color: "#92400E",
    };
  }

  if (status === "In Progress") {
    style = {
      background: "#DBEAFE",
      color: "#1E40AF",
    };
  }

  if (status === "Completed") {
    style = {
      background: "#DCFCE7",
      color: "#166534",
    };
  }

  return (
    <span
      style={{
        ...style,
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}