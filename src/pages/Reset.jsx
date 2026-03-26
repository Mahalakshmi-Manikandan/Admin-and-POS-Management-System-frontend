import React, { useState } from "react";
import api from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Reset() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { email, token, password });
      setMsg("Password reset! Redirecting...");
      setTimeout(() => nav("/login"), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={email} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
          {msg && (
            <div className={`mt-4 text-center ${msg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
              {msg}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
