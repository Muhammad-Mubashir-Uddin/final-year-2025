import { useState } from "react";
import axios from "axios";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/register", { email, password });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Admin Registration</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
