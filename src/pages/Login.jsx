import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      // Save tokens & user info
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      // Better error handling
      if (err.response?.status === 401) {
        alert("Invalid email or password");
      } else {
        alert("Something went wrong. Please try again.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Welcome Back!</h1>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email ID"
              value={form.email}
              onChange={update}
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={update}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="flex justify-between text-sm">
            <Link to="/register">Create Account</Link>
            <Link to="/forgot">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
