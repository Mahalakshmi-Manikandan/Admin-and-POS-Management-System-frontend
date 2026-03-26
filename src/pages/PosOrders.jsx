import { useEffect, useMemo, useState } from "react";
import api from "../api";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/table";

import { Skeleton } from "../components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function PosOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/pos/orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ===== UNIQUE PAYMENT TYPES ===== */
  const paymentTypes = useMemo(() => {
    const types = orders.map(o => o.payment_mode).filter(Boolean);
    return ["all", ...new Set(types)];
  }, [orders]);

  /* ===== FILTERED ORDERS ===== */
  const filteredOrders = useMemo(() => {
    if (paymentFilter === "all") return orders;
    return orders.filter(o => o.payment_mode === paymentFilter);
  }, [orders, paymentFilter]);

  return (
    <Card className="w-full rounded-2xl border border-blue-200 shadow-md">
      {/* ===== HEADER ===== */}
      <CardHeader className="bg-blue-600 rounded-t-2xl px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg font-semibold">
          POS Orders
        </CardTitle>

        {/* ===== PAYMENT FILTER ===== */}
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-40 bg-white text-blue-700">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type === "all" ? "All Payments" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      {/* ===== CONTENT ===== */}
      <CardContent className="p-6 bg-blue-50">
        {loading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-blue-500">
            No orders found
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-blue-200 bg-white">
            <Table>
              <TableHeader className="bg-blue-100">
                <TableRow>
                  <TableHead className="text-blue-700">Order ID</TableHead>
                  <TableHead className="text-blue-700">Customer ID</TableHead>
                  <TableHead className="text-blue-700">No. of Items</TableHead>
                  <TableHead className="text-blue-700">Total Amount</TableHead>
                  <TableHead className="text-blue-700">Payment</TableHead>
                  <TableHead className="text-blue-700">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((o) => (
                  <TableRow
                    key={o.order_id}
                    className="hover:bg-blue-50 transition"
                  >
                    <TableCell className="font-medium">
                      #{o.order_id}
                    </TableCell>
                    <TableCell>{o.customer_id ?? "-"}</TableCell>
                    <TableCell>{o.no_of_item_order}</TableCell>
                    <TableCell className="font-semibold text-blue-700">
                      ₹{o.total_amount}
                    </TableCell>
                    <TableCell className="capitalize">
                      {o.payment_mode}
                    </TableCell>
                    <TableCell>
                      {new Date(o.date_time).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
