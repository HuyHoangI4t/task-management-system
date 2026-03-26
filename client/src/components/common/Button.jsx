function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        border: "none",
        padding: "10px 16px",
        borderRadius: 8,
        cursor: "pointer",
        background: "#2563eb",
        color: "#fff"
      }}
    >
      {children}
    </button>
  );
}

export default Button;
