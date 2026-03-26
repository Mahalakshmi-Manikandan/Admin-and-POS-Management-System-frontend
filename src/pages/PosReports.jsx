import React, { useEffect, useState } from "react";
import api from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function POSReport() {
  const [orderItemData, setOrderItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [range, setRange] = useState("today");
  const [productFilter, setProductFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const companyName = "Goandroy";

  // Fetch all items for dropdown
  const fetchItems = async () => {
    try {
      const res = await api.get("/pos/items");
      setProducts(res.data.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Fetch order items
  const fetchOrderItemReport = async (range) => {
    try {
      setLoading(true);
      const res = await api.get(`/pos/reports/order-items?range=${range}`);
      if (res.data.status) setOrderItemData(res.data.data || []);
    } catch (error) {
      console.error("Fetch Order Item Report Error:", error);
      setOrderItemData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchOrderItemReport(range);
  }, [range]);

  useEffect(() => {
    if (!productFilter) return setFilteredData(orderItemData);
    const filtered = orderItemData.filter(
      (item) => item.product_name === productFilter
    );
    setFilteredData(filtered);
  }, [productFilter, orderItemData]);

  const handlePrint = () => {
    const totalOrders = filteredData.length;
    const totalQuantity = filteredData.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = filteredData.reduce((sum, i) => sum + i.total, 0);

    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1E40AF;">
        <h1 style="text-align:center; color:#1E40AF;">${companyName}</h1>
        <h2 style="text-align:center; color:#2563EB;">Order Item Report</h2>
        <p><strong>Date Range:</strong> ${range}</p>
        <p><strong>Product Filter:</strong> ${productFilter || "All"}</p>
        <table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse: collapse;">
          <thead style="background-color:#3B82F6; color:white;">
            <tr>
              <th>Date</th><th>Customer</th><th>Product</th>
              <th>Quantity</th><th>Price</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(
                (item) => `
              <tr>
                <td>${new Date(item.date).toLocaleString()}</td>
                <td>${item.customer_name || ""}</td>
                <td>${item.product_name || ""}</td>
                <td>${item.qty}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <br/>
        <div>
          <p><strong>Total Orders:</strong> ${totalOrders}</p>
          <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    `;

    const win = window.open("", "", "width=900,height=700");
    win.document.write(printContent);
    win.document.close();
    win.print();
  };

  const handleDownload = () => {
    const headers = ["Date", "Customer", "Product", "Quantity", "Price", "Total"];
    const rows = filteredData.map((i) => [
      new Date(i.date).toLocaleString(),
      i.customer_name || "",
      i.product_name || "",
      i.qty,
      i.price.toFixed(2),
      i.total.toFixed(2),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `order-item-report-${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-6 bg-blue-50 min-h-screen">
      <Card>
        <CardContent>
          {/* Report Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-blue-900">{companyName}</h1>
            <h2 className="text-xl font-semibold text-blue-700">Order Item Report</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-blue-900">Date Range:</label>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="border border-blue-300 rounded px-2 py-1"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-blue-900">Product:</label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="border border-blue-300 rounded px-2 py-1"
              >
                <option value="">All Products</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_name}>
                    {p.product_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </div>

          {/* Report Summary */}
          {loading ? (
            <p className="text-blue-700 mt-4">Loading...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-blue-500 mt-4">
              No data found for selected filters
            </p>
          ) : (
            <div className="mt-4 text-blue-900 space-y-1">
              <p>
                <strong>Total Orders:</strong> {filteredData.length}
              </p>
              <p>
                <strong>Total Quantity:</strong>{" "}
                {filteredData.reduce((sum, i) => sum + i.qty, 0)}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {filteredData.reduce((sum, i) => sum + i.total, 0).toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
