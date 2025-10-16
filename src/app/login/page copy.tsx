"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false, // important for getting JSON response
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      console.log("Login successful!", res);
      // You can redirect manually, e.g.
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Credentials Login */}
      <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign In
        </button>
        <hr className="my-4" />
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-white text-black p-2 rounded"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
