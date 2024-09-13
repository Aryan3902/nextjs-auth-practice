"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";

const RegisterPage = () => {
  const { register } = useRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await register(email, password);
      if (user) {
        router.push("/dashboard"); // Redirect to dashboard upon successful register
      }
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-black"
        />
        {error && <p>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
