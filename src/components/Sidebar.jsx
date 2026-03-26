import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-52 border-r h-screen p-4 space-y-3">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/items">Items</Link>
      <Link to="/reports">Reports</Link>
    </div>
  );
}
