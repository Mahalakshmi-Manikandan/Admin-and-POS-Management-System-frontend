import React, { useState } from "react";
import api from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("If email exists, you'll receive a reset link. Check backend log.");
    } catch (err) {
      setMsg("Failed to send reset link. Try again.");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>

          {msg && (
            <div className="p-2 mb-4 text-center text-green-700 bg-green-100 rounded">
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
