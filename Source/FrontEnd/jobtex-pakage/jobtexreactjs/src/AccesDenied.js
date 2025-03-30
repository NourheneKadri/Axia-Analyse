// AccessDenied.js
import React from "react";

const AccessDenied = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Access Denied</h1>
        <p style={styles.text}>You do not have permission to view this page.</p>
        <p style={styles.text}>Please contact your administrator if you believe this is an error.</p>
        <button onClick={() => window.location.href = "/"} style={styles.button}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "0 20px",
  },
  content: {
    textAlign: "center",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#ff4d4f",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.1rem",
    color: "#333",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

export default AccessDenied;
