import { useEffect, useState } from "react";
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

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Skeleton } from "../components/ui/skeleton";

export default function PosItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [activeTab, setActiveTab] = useState("Hot Drink & Fresh Juice");

  const categories = [
    "Hot Drink & Fresh Juice",
    "Food",
    "Snacks",
    "Furniture",
    "Electronic",
  ];

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    amount: "",
    image_url: "",
    category: "Hot Drink & Fresh Juice",
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/pos/items");
      setItems(res.data.items);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();

    try {
      await api.post("/pos/items", form);

      setForm({
        product_name: "",
        description: "",
        amount: "",
        image_url: "",
        category: "Hot Drink & Fresh Juice",
      });

      setShowAdd(false);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(
    (item) => item.category === activeTab
  );

  return (
    <Card className="w-full rounded-2xl border border-blue-200 shadow-md">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between bg-blue-600 rounded-t-2xl px-6 py-4">
        <CardTitle className="text-white text-lg font-semibold">
          POS Items
        </CardTitle>

        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-white text-blue-700 hover:bg-blue-100"
        >
          {showAdd ? "Close" : "Add Item"}
        </Button>
      </CardHeader>

      <CardContent className="p-6 bg-blue-50 space-y-6">

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`${
                activeTab === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-700 border"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* ADD ITEM FORM */}
        {showAdd && (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-blue-200 rounded-xl p-4"
            onSubmit={addItem}
          >
            <Input
              placeholder="Product Name"
              className="border-blue-300"
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              required
            />

            <Input
              placeholder="Price"
              type="number"
              className="border-blue-300"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              required
            />

            <Input
              placeholder="Image URL"
              className="border-blue-300"
              value={form.image_url}
              onChange={(e) =>
                setForm({ ...form, image_url: e.target.value })
              }
            />

            {/* CATEGORY DROPDOWN */}
            <select
              className="border border-blue-300 rounded-md p-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <Textarea
              placeholder="Description"
              className="border-blue-300 md:col-span-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="md:col-span-2 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Item
              </Button>
            </div>
          </form>
        )}

        {/* TABLE */}
        {loading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-blue-500">
            No items in this category
          </p>
        ) : (
          <div className="rounded-xl overflow-hidden border border-blue-200 bg-white">
            <Table>
              <TableHeader className="bg-blue-100">
                <TableRow>
                  <TableHead className="text-blue-700">Image</TableHead>
                  <TableHead className="text-blue-700">Name</TableHead>
                  <TableHead className="text-blue-700">Description</TableHead>
                  <TableHead className="text-blue-700">Price</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.product_id}
                    className="hover:bg-blue-50 transition"
                  >
                    <TableCell>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-10 w-10 rounded-lg object-cover border"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      {item.product_name}
                    </TableCell>

                    <TableCell className="max-w-xs truncate text-gray-600">
                      {item.description}
                    </TableCell>

                    <TableCell className="font-semibold text-blue-700">
                      ₹{item.amount}
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