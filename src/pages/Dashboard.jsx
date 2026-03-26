import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../auth";

import {
  Home,
  ShoppingCart,
  User,
  Shield,
  LogOut,
  ChevronDown,
  ChevronUp,
  Package,
  Receipt,
  Users,
  BarChart3,
  Gift
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

import Profile from "./Profile";
import AdminPanel from "./AdminPanel";
import Unauthorized from "./NoAccess";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const [posOpen, setPosOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderContent = () => {
    // POS pages are rendered by nested routes
    if (location.pathname.startsWith("/pos")) {
      return <Outlet />;
    }

    if (location.pathname === "/dashboard/profile") {
      return <Profile />;
    }

    if (location.pathname === "/dashboard/admin") {
      return user.role === "admin" ? (
        <AdminPanel />
      ) : (
        <Unauthorized />
      );
    }

    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="mt-2">Welcome, {user.email}</p>
        <p className="text-sm text-gray-600">Role: {user.role}</p>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6 text-indigo-700">
            GOANDROY
          </h1>

          {/* DASHBOARD */}
          <Menu
            icon={<Home size={18} />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />

          {/* POS DROPDOWN */}
          <Button
            variant="ghost"
            onClick={() => setPosOpen(!posOpen)}
            className="w-full justify-between gap-3"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={18} />
              POS
            </span>
            {posOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          {posOpen && (
            <div className="ml-6 mt-2 space-y-1">
              <SubMenu
                icon={<Home size={16} />}
                label="Home"
                onClick={() => navigate("/pos")}
              />
              <SubMenu
                icon={<Home size={16} />}
                label="PosDashboard"
                onClick={() => navigate("/pos/dashboard")}
              />
              <SubMenu
                icon={<Package size={16} />}
                label="Items"
                onClick={() => navigate("/pos/items")}
              />
              <SubMenu
                icon={<Receipt size={16} />}
                label="Orders"
                onClick={() => navigate("/pos/orders")}
              />
              <SubMenu
                icon={<Users size={16} />}
                label="Customers"
                onClick={() => navigate("/pos/customers")}
              />
              <SubMenu
                icon={<BarChart3 size={16} />}
                label="Reports"
                onClick={() => navigate("/pos/reports")}
              />
              <SubMenu
                icon={<Gift size={16} />}
                label="Promotion"
                onClick={() => navigate("/pos/promotions")}
              />
            </div>
          )}

          {/* PROFILE */}
          <Menu
            icon={<User size={18} />}
            label="Profile"
            onClick={() => navigate("/dashboard/profile")}
          />

          {/* ADMIN */}
          <Menu
            icon={<Shield size={18} />}
            label="Admin"
            onClick={() => navigate("/dashboard/admin")}
          />

          {/* LOGOUT */}
          <Menu
            icon={<LogOut size={18} />}
            label="Logout"
            danger
            onClick={logout}
          />
        </div>

        <p className="text-xs text-center text-gray-400">
           © {new Date().getFullYear()} GOANDROY. All rights reserved.
        </p>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

/* ================= MENU COMPONENTS ================= */

function Menu({ icon, label, onClick, danger }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start gap-3 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      {label}
    </Button>
  );
}

function SubMenu({ icon, label, onClick }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-full justify-start gap-3 text-sm"
    >
      {icon}
      {label}
    </Button>
  );
}
