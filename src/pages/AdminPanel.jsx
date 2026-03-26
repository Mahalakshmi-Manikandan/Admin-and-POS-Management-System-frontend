import { useEffect, useState } from "react";
import api from "../api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
  try {
    setLoading(true);
    const { data } = await api.get("/users/list");
    setUsers(data);
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

  //  Added handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { data } = await api.put(`/users/update/${editingUser.id}`, form);
        setUsers(users.map((u) => (u.id === editingUser.id ? data : u)));
        setMsg("User updated successfully");
      } else {
        const { data } = await api.post("/users/create", form);
        setUsers([...users, data.user]);
        setMsg("User created successfully");
      }
      setError("");
      setDialogOpen(false);
      setEditingUser(null);
      setForm({ name: "", email: "", password: "", role: "user", status: "active" });
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Operation failed. Session may have expired."
      );
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status || "active",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/delete/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setMsg("User deleted successfully");
      setError("");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Delete failed. Session may have expired."
      );
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Employees</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={loadUsers} variant="secondary">
              🔄
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">+</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
                  <div>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label>Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value) => setForm({ ...form, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(value) => setForm({ ...form, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    {editingUser ? "Update User" : "Create User"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

     <CardContent>
        {msg && <p className="text-green-600 mb-2">{msg}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{u.id}</td>
                    <td className="border px-4 py-2">{u.name}</td>
                    <td className="border px-4 py-2">{u.email}</td>
                    <td className="border px-4 py-2 capitalize">{u.role}</td>
                    <td className="border px-4 py-2 capitalize">{u.status || "active"}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <Button size="sm" onClick={() => handleEdit(u)}>✏️ Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>🗑️ Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
