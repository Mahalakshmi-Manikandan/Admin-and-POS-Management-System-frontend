import { Routes, Route, useLocation, Navigate } from "react-router-dom";

/* ================= PUBLIC ================= */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

/* ================= PROTECTED ================= */
import Dashboard from "./pages/Dashboard";
import NoAccess from "./pages/NoAccess";

/* ================= POS PAGES ================= */
import PosHome from "./pages/PosHome";
import PosDashboard from "./pages/PosDashboard";
import PosItems from "./pages/PosItems";
import PosOrders from "./pages/PosOrders";
import PosCustomers from "./pages/PosCustomers";
import PosReports from "./pages/PosReports";
import Promotions from "./pages/Promotions"


/* ================= AUTH ================= */
import PrivateRoute from "./components/PrivateRoute";

/* ================= APP ================= */
export default function App() {
  const location = useLocation();

  const hideFooter = [
    "/",
    "/login",
    "/register",
    "/forgot",
    "/reset",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>

        {/* ---------- HOME ---------- */}
        <Route path="/" element={<HomePage />} />

        {/* ---------- PUBLIC ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />

        {/* ---------- DASHBOARD ---------- */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ---------- POS ---------- */}
        <Route
          path="/pos"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<PosHome />} />
          <Route path="dashboard" element={<PosDashboard />} />
          <Route path="items" element={<PosItems />} />
          <Route path="orders" element={<PosOrders />} />
          <Route path="customers" element={<PosCustomers />} />
          <Route path="reports" element={<PosReports />} />
          <Route path="promotions" element={<Promotions/>}/>
        </Route>

        {/* ---------- NO ACCESS ---------- */}
        <Route path="/no-access" element={<NoAccess />} />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
{/* 
      {!hideFooter && (
        <footer className="bg-white py-3 text-center text-gray-500 text-sm border-t">
          © {new Date().getFullYear()} GOANDROY. All rights reserved.
        </footer>
      )} */}
    </div>
  );
}

/* ================= HOME PAGE ================= */
function HomePage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT */}
      <div className="min-h-screen p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo/download.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-extrabold text-sky-500">
            GOANDROY
          </h1>
        </div>

        <div className="flex-1 flex justify-center items-center bg-gray-50">
          <div className="w-full max-w-md">
            <Login />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex relative">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/037/999/169/small/ai-generated-workspace-technology-highlight-the-integration-of-technology-in-the-office-background-image-generative-ai-photo.jpg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to GoAndRoy
            </h1>
            <p className="text-xl italic">
              Empowering Innovation Through Technology
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
