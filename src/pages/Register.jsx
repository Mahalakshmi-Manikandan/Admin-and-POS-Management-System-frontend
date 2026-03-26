import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";

import api from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!role || !status) {
      setError("Please select both role and status");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        status,
      });

      if (res.data.success) {
        setSuccess("Registration successful! Redirecting...");

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setStatus("");

        setTimeout(() => nav("/login"), 1500);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/037/999/169/small/ai-generated-workspace-technology-highlight-the-integration-of-technology-in-the-office-background-image-generative-ai-photo.jpg"
          alt="Workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center bg-black/30">
          <h1 className="text-5xl font-extrabold mb-4">GoAndRoy</h1>
          <p className="text-lg italic">
            "Empowering Innovation Through Technology"
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-10 ">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-black text-center mb-4">
            Create an account
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Already have an account?{" "}
            <div className="text-blue-500 hover:underline">
               <a href="/" >
              Login
            </a>
            </div>
          </p>

          {error && <div className="text-red-500 text-center mb-2">{error}</div>}
          {success && (
            <div className="text-green-500 text-center mb-2">{success}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-black font-medium">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-black font-medium">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-black font-medium">Password</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="placeholder-gray-400"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-black font-medium">Confirm Password</label>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type="password"
                className="placeholder-gray-400"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-black font-medium">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-black font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div  className="px-6 py-3 text-center text-white">
               <Button
              type="submit"
            >
              Register
            </Button>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
}
