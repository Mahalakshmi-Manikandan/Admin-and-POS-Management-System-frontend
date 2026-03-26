import { useEffect, useState } from "react";
import api from "../api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ================== COLORS ================== */
const COLORS = [
  "#2563eb", "#3b82f6", "#60a5fa",
  "#93c5fd", "#1e40af", "#0ea5e9"
];

/* ================== HELPERS ================== */
const getCurrentWeekDates = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const formatDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

/* ================== COMPONENT ================== */
export default function PosDashboard() {
  const [stats, setStats] = useState({});
  const [sales, setSales] = useState([]);
  const [itemSales, setItemSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [statsRes, salesRes, itemSalesRes] = await Promise.all([
        api.get("/pos/home/stats"),
        api.get("/pos/home/sales"),
        api.get("/pos/home/item-sales"),
      ]);

      setStats(statsRes.data);

      const backendSales = salesRes.data.data || [];
      const week = getCurrentWeekDates();

      setSales(
        week.map(d => {
          const found = backendSales.find(
            s => new Date(s.date).toDateString() === d.toDateString()
          );
          return {
            date: formatDate(d),
            total: found ? Number(found.total) : 0,
          };
        })
      );

      setItemSales(itemSalesRes.data.data || []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-8 bg-blue-50 min-h-screen">

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))
        ) : (
          <>
            <Stat title="Items" value={stats.items} />
            <Stat title="Orders" value={stats.orders} />
            <Stat title="Customers" value={stats.customers} />
          </>
        )}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Sales */}
        <Card className="rounded-2xl border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-700">Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={sales}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2563eb" radius={[8,8,0,0]} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Item Sales Pie */}
        <Card className="rounded-2xl border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-700">Item Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={itemSales}
                    dataKey="total"
                    nameKey="item"
                    outerRadius={110}
                    label
                  >
                    {itemSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

/* ================= STAT ================= */
function Stat({ title, value }) {
  return (
    <Card className="bg-blue-600 text-white rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
