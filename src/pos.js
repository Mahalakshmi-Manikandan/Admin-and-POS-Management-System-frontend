import api from "./api";

export const getItems = () => api.get("/pos/items");
export const createOrder = (data) => api.post("/pos/orders", data);
export const getReports = () => api.get("/pos/reports");
export const searchCustomer = (phone) =>
  api.get(`/pos/customers/search?phone=${phone}`);
export const getReceipt = (id) =>
  api.get(`/pos/orders/receipt/${id}`);
