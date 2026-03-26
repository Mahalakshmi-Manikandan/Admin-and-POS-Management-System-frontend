import React, { useEffect, useState } from "react";
import api from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("active");
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

 useEffect(() => {
  const loadProfile = async () => {
    try {
      const { data } = await api.get("/users/profile");
      setProfile(data);
      setName(data.name || "");
      setRole(data.role || "user");
      setStatus(data.status || "active");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Session expired. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);


  const saveProfile = async () => {
    try {
      await api.put("/users/profile", { name, role, status });
      setMsg("Profile updated successfully");
      setError("");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.current.value;
    const newPassword = e.target.next.value;

    try {
      await api.post("/users/profile/change-password", { currentPassword, newPassword });
      setMsg("Password changed successfully");
      setError("");
      e.target.reset();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Password change failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>{error || "No profile found"}</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-4 mt-4">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Input value={profile.email} disabled />
              <Button onClick={saveProfile}>Save</Button>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <form onSubmit={changePassword} className="space-y-4 mt-4">
              <Input type="password" name="current" placeholder="Current password" required />
              <Input type="password" name="next" placeholder="New password" required />
              <Button type="submit">Change Password</Button>
            </form>
          </TabsContent>
        </Tabs>

        {msg && <p className="text-green-600 mt-2">{msg}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
