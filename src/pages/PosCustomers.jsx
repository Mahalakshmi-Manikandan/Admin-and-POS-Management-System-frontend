import { useEffect, useState } from "react";
import api from "../api";

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";

export default function PosCustomers() {

const [customers,setCustomers] = useState([]);
const [filteredCustomers,setFilteredCustomers] = useState([]);

const [loading,setLoading] = useState(true);

const [search,setSearch] = useState("");
const [customerType,setCustomerType] = useState("all");

const [page,setPage] = useState(1);
const rowsPerPage = 8;

const [historyCustomer,setHistoryCustomer] = useState(null);
const [purchaseHistory,setPurchaseHistory] = useState([]);

/* FETCH CUSTOMERS */

useEffect(()=>{

api.get("/pos/customers")
.then(res=>{
setCustomers(res.data.customers);
setFilteredCustomers(res.data.customers);
})
.catch(console.error)
.finally(()=>setLoading(false));

},[]);

/* FILTER */

useEffect(()=>{

let data = [...customers];

if(customerType !== "all"){
data = data.filter(
c => c.customer_type?.toLowerCase() === customerType
);
}

if(search){
data = data.filter(
c =>
c.name.toLowerCase().includes(search.toLowerCase()) ||
c.phone_number.includes(search)
);
}

setFilteredCustomers(data);
setPage(1);

},[search,customerType,customers]);

/* PAGINATION */

const last = page * rowsPerPage;
const first = last - rowsPerPage;

const currentCustomers = filteredCustomers.slice(first,last);

const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

/* PURCHASE HISTORY */

const openHistory = async(customer)=>{

setHistoryCustomer(customer);

try{

const res = await api.get(`/pos/customers/${customer.id}/orders`);

setPurchaseHistory(res.data.orders || []);

}catch(err){
console.error(err);
}

};

/* BADGE */

const badge = (type)=>{

if(!type) return "-";

const t = type.toLowerCase();

if(t==="vip")
return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">⭐ VIP</span>;

if(t==="members")
return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">MEMBERS</span>;

if(t==="staff")
return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">STAFF</span>;

return type;

};

return(

<Card className="w-full rounded-2xl border-blue-100 shadow-md">

<CardHeader className="bg-blue-600 rounded-t-2xl flex justify-between items-center">

<CardTitle className="text-white text-lg">POS Customers</CardTitle>

<div className="flex gap-2">

<Input
placeholder="Search name or phone"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-white"
/>

<select
value={customerType}
onChange={(e)=>setCustomerType(e.target.value)}
className="border rounded px-3"
>
<option value="all">All</option>
<option value="vip">VIP</option>
<option value="members">Members</option>
<option value="staff">Staff</option>
</select>

</div>

</CardHeader>

<CardContent className="p-6 bg-blue-50">

{loading ? (

<Skeleton className="h-32 w-full"/>

) : (

<>

<div className="rounded-xl overflow-hidden border bg-white">

<Table>

<TableHeader className="bg-blue-100">

<TableRow>
<TableHead>Name</TableHead>
<TableHead>Phone</TableHead>
<TableHead>Type</TableHead>
<TableHead>Loyalty</TableHead>
<TableHead>Action</TableHead>
</TableRow>

</TableHeader>

<TableBody>

{currentCustomers.map(c=>(
<TableRow key={c.id}>

<TableCell>{c.name}</TableCell>

<TableCell>{c.phone_number}</TableCell>

<TableCell>{badge(c.customer_type)}</TableCell>

<TableCell>
<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
{c.loyalty_points || 0} pts
</span>
</TableCell>

<TableCell className="flex gap-2">

<Button size="sm" onClick={()=>openHistory(c)}>
History
</Button>

</TableCell>

</TableRow>
))}

</TableBody>

</Table>

</div>

<div className="flex justify-between mt-4">

<Button disabled={page===1} onClick={()=>setPage(page-1)}>
Prev
</Button>

<span>Page {page} / {totalPages}</span>

<Button disabled={page===totalPages} onClick={()=>setPage(page+1)}>
Next
</Button>

</div>

</>

)}

</CardContent>

{historyCustomer && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded-xl w-[600px]">

<h2 className="text-lg font-semibold mb-4">
Purchase History - {historyCustomer.name}
</h2>

{purchaseHistory.length===0 ? (
<p>No purchases found</p>
) : (

<Table>

<TableHeader>
<TableRow>
<TableHead>Order</TableHead>
<TableHead>Total</TableHead>
<TableHead>Payment</TableHead>
<TableHead>Date</TableHead>
</TableRow>
</TableHeader>

<TableBody>

{purchaseHistory.map(o=>(
<TableRow key={o.order_id}>
<TableCell>{o.order_id}</TableCell>
<TableCell>₹{o.total_amount}</TableCell>
<TableCell>{o.payment_mode}</TableCell>
<TableCell>{new Date(o.date_time).toLocaleString()}</TableCell>
</TableRow>
))}

</TableBody>

</Table>

)}

<div className="flex justify-end mt-4">

<Button onClick={()=>setHistoryCustomer(null)}>
Close
</Button>

</div>

</div>

</div>

)}

</Card>

);

}