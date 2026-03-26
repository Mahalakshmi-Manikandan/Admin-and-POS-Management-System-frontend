import { useEffect, useState } from "react";
import api from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Banknote,
  CreditCard,
  QrCode,
  Plus,
  Minus,
  UserPlus,
  Printer,
} from "lucide-react";

const SHOP_NAME = "Goandroy";

export default function PosHome(){

const [items,setItems]=useState([])
const [cart,setCart]=useState([])
const [customers,setCustomers]=useState([])
const [filteredCustomers,setFilteredCustomers]=useState([])
const [promotions,setPromotions]=useState([])

const [searchPhone,setSearchPhone]=useState("")
const [customer,setCustomer]=useState(null)

const [showCustomerPopup,setShowCustomerPopup]=useState(false)

const [customerForm,setCustomerForm]=useState({
name:"",
phone_number:"",
email:"",
address:"",
customer_type:"VIP"
})

// const [coupon,setCoupon]=useState("")
const [appliedPromotions,setAppliedPromotions]=useState([])
const [promoDiscount,setPromoDiscount]=useState(0)

const [qty,setQty]=useState({})
const [activeTab,setActiveTab]=useState("Hot Drink & Fresh Juice")

const TAX_PERCENT=10
const LOYALTY_RATE=1

const [paymentMethod,setPaymentMethod]=useState("Cash")
const [step,setStep]=useState("home")
const [orderId,setOrderId]=useState(null)

/* NEW PROMO STATES */

const [promoType,setPromoType]=useState("")
const [filteredPromos,setFilteredPromos]=useState([])
const [selectedPromo,setSelectedPromo]=useState(null)

const categories=[
"Hot Drink & Fresh Juice",
"Food",
"Snacks",
"Furniture",
"Electronic"
]

const gridCols=cart.length ? "grid-cols-3":"grid-cols-4"

/* LOAD */

useEffect(()=>{

async function load(){

const i=await api.get("/pos/items")
const c=await api.get("/pos/customers")
const p=await api.get("/pos/promotions")

setItems(i.data.items||[])
setCustomers(c.data.customers||[])
setPromotions(p.data.promotions||[])

}

load()

},[])

const filteredItems=items.filter(i=>i.category===activeTab)

useEffect(()=>{

if(!searchPhone) return setFilteredCustomers([])

setFilteredCustomers(
customers.filter(c=>c.phone_number?.includes(searchPhone))
)

},[searchPhone,customers])

/* PROMO SEARCH */

useEffect(()=>{

if(!promoType){
setFilteredPromos([])
return
}

const list = promotions.filter(
p=>p.promotion_type===promoType && p.active
)

setFilteredPromos(list)

},[promoType,promotions])

/* CREATE CUSTOMER */

const createCustomer=async()=>{

const res=await api.post("/pos/customers",customerForm)

setCustomers([...customers,res.data.customer])
setCustomer(res.data.customer)

setShowCustomerPopup(false)

}

/* CART */

const addToCart=item=>{

const q=qty[item.product_id]||1

setCart(prev=>{

const exist=prev.find(p=>p.product_id===item.product_id)

if(exist){

return prev.map(p=>
p.product_id===item.product_id
?{...p,qty:p.qty+q}
:p
)

}

return [...prev,{...item,qty:q}]

})

}

const incQty=id=>setQty(p=>({...p,[id]:(p[id]||1)+1}))
const decQty=id=>setQty(p=>({...p,[id]:p[id]>1?p[id]-1:1}))

const incCart=id=>setCart(p=>p.map(i=>
i.product_id===id?{...i,qty:i.qty+1}:i
))
const decCart = (id) => {
  setCart(prev =>
    prev
      .map(item =>
        item.product_id === id
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter(item => item.qty > 0) 
  );
};

/* PROMOTIONS */

const applyPromotions=()=>{

if(!selectedPromo) return

let discountValue = 0
let applied = []

const subtotal = cart.reduce((s,i)=>s+i.amount*i.qty,0)

if(selectedPromo.promotion_type==="ORDER_VALUE"){

if(subtotal >= selectedPromo.min_order_value){

const d = subtotal*(selectedPromo.discount_percent/100)

discountValue += d
applied.push(selectedPromo.name)

}

}

if(selectedPromo.promotion_type==="BOGO"){

const item = cart.find(i=>i.product_id===selectedPromo.product_id)

if(item){

const free = Math.floor(item.qty/selectedPromo.buy_qty) * selectedPromo.get_qty
const d = free * item.amount

discountValue += d
applied.push(selectedPromo.name)

}

}

if(selectedPromo.promotion_type==="PRODUCT_DISCOUNT"){

const item = cart.find(i=>i.product_id===selectedPromo.product_id)

if(item){

const d = item.amount * item.qty * (selectedPromo.discount_percent/100)

discountValue += d
applied.push(selectedPromo.name)

}

}

setPromoDiscount(discountValue)
setAppliedPromotions(applied)

}

const applyCustomerDiscount=(cust)=>{

if(!cust) return

let discountValue = promoDiscount
let applied = [...appliedPromotions]

const subtotal = cart.reduce((s,i)=>s+i.amount*i.qty,0)

let percent = 0

if(cust.customer_type==="VIP") percent = 10
if(cust.customer_type==="Members") percent = 5
if(cust.customer_type==="Staff") percent = 15

if(percent>0){

const d = subtotal*(percent/100)

discountValue += d

applied.push(`Customer ${cust.customer_type} Discount ${percent}%`)

}

setPromoDiscount(discountValue)
setAppliedPromotions(applied)

}

/* TOTAL */

const subtotal=cart.reduce((s,i)=>s+i.amount*i.qty,0)
const tax=(subtotal*TAX_PERCENT)/100
const total=subtotal+tax-promoDiscount
const loyaltyPoints = Math.floor(total / 10);



/* ORDER */

const confirmOrder=async()=>{

const res=await api.post("/pos/orders",{

customer:{id:customer?.id},

payment_mode:paymentMethod,

loyalty_points:loyaltyPoints,

items:cart.map(i=>({
product_id:i.product_id,
quantity:i.qty,
price:i.amount
}))

})

setOrderId(res.data.order_id)
setStep("receipt")

}

/* RECEIPT */

if(step==="receipt"){

return(

<Receipt
orderId={orderId}
cart={cart}
customer={customer}
subtotal={subtotal}
tax={tax}
discount={promoDiscount}
total={total}
appliedPromotions={appliedPromotions}
onContinue={()=>{
setCart([])
setCustomer(null)
setPromoDiscount(0)
setAppliedPromotions([])
setStep("home")
}}
/>

)

}


return(

<div className="h-screen flex flex-col bg-blue-50 overflow-hidden">

{/* CATEGORY */}

<div className="flex gap-2 p-2">

{categories.map(c=>(

<Button
key={c}
onClick={()=>setActiveTab(c)}
className={
activeTab===c
?"bg-blue-600 text-white"
:"bg-white border text-blue-700"
}
>

{c}

</Button>

))}

</div>

<div className="flex flex-col lg:flex-row flex-1 gap-3 p-3">

{/* PRODUCTS */}

<div
className={`grid grid-cols-2 md:grid-cols-4 lg:${gridCols} gap-3 flex-1`}
style={{gridTemplateRows:"repeat(2,1fr)"}}
>

{filteredItems.slice(0,8).map(i=>(

<Card
key={i.product_id}
className="border border-blue-200 flex flex-col"
>

<img
src={i.image_url}
className="h-36 w-full object-cover rounded-t-lg"
/>

<CardContent className="flex flex-col justify-between flex-1 p-2 text-sm">

<div>

<p className="font-semibold">{i.product_name}</p>

<p className="text-xs text-gray-500">
{i.description}
</p>

</div>

<div className="flex justify-between items-center">

<span className="font-bold text-blue-700">
₹{i.amount}
</span>

<div className="flex items-center gap-1">

<Button size="icon" onClick={()=>decQty(i.product_id)} className="bg-blue-600 text-white">
<Minus size={12}/>
</Button>

<span>{qty[i.product_id]||1}</span>

<Button size="icon" onClick={()=>incQty(i.product_id)} className="bg-blue-600 text-white">
<Plus size={12}/>
</Button>

<Button size="sm" onClick={()=>addToCart(i)} className="bg-blue-600 text-white">
Add
</Button>

</div>

</div>

</CardContent>

</Card>

))}

</div>

{/* CART */}

{cart.length>0&&(

<div className="w-full lg:w-80 flex flex-col bg-white border rounded-xl h-[90vh]">

  {/* TOP SCROLLABLE AREA */}
  <div className="p-3 space-y-2 flex-1 overflow-y-auto">

    {/* Search */}
    <div className="flex gap-2">
      <Input
        placeholder="Customer phone"
        value={searchPhone}
        onChange={(e)=>setSearchPhone(e.target.value)}
      />

      <Button
        onClick={()=>setShowCustomerPopup(true)}
        className="bg-green-600 text-white"
      >
        <UserPlus size={16}/>
      </Button>
    </div>

    {/* Customer List */}
    {filteredCustomers.map(c=>(
      <div
        key={c.id}
        className="cursor-pointer text-sm"
        onClick={()=>{
          setCustomer(c)
          applyCustomerDiscount(c)
          setSearchPhone("") 
        }}
      >
        {c.name} — {c.phone_number}
      </div>
    ))}

    {/* Selected Customer */}
    {customer && (
      <div className="bg-blue-50 p-2 rounded text-xs">
        <p><b>{customer.name}</b></p>
        <p>{customer.phone_number}</p>
        <p>{customer.customer_type}</p>
        <p>Loyalty: {customer.loyalty_points || 0}</p>
      </div>
    )}

    {/* Promo Dropdown */}
    <select
      className="w-full border rounded p-2"
      value={promoType}
      onChange={e=>setPromoType(e.target.value)}
    >
      <option value="">Discount & Promo</option>
      <option value="ORDER_VALUE">Order Value</option>
      <option value="BOGO">BOGO</option>
      <option value="PRODUCT_DISCOUNT">Product Discount</option>
      <option value="COUPON">Coupon</option>
      <option value="FESTIVAL">Festival</option>
    </select>

    {filteredPromos.length>0 &&(
      <select
        className="w-full border rounded p-2"
        onChange={e=>{
          const p=filteredPromos.find(pr=>pr.id==e.target.value)
          setSelectedPromo(p)
        }}
      >
        <option>Select Promotion Offer</option>
        {filteredPromos.map(p=>(
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    )}

    <Button
      onClick={applyPromotions}
      className="w-full bg-purple-600 text-white"
    >
      Apply Promo/Discount
    </Button>

    {appliedPromotions.map((p,i)=>(
      <p key={i} className="text-xs text-green-700">✔ {p}</p>
    ))}

    {/* CART ITEMS */}
    {cart.map(i=>(
      <div key={i.product_id} className="flex justify-between text-sm items-center">

        <span>{i.product_name} × {i.qty}</span>

        <div className="flex gap-1">
          <Button size="icon" onClick={()=>decCart(i.product_id)}>
            <Minus size={12}/>
          </Button>

          <Button size="icon" onClick={()=>incCart(i.product_id)}>
            <Plus size={12}/>
          </Button>
        </div>

      </div>
    ))}

  </div>

  {/* 🔥 FIXED FOOTER */}
  <div className="border-t p-3 text-sm space-y-1 bg-blue-50 sticky bottom-0">

    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>

    <div className="flex justify-between">
      <span>Tax</span>
      <span>₹{tax.toFixed(2)}</span>
    </div>

    <div className="flex justify-between text-green-700">
      <span>Loyalty Points</span>
      <span>+{loyaltyPoints}</span>
    </div>

    <div className="flex justify-between">
      <span>Discount</span>
      <span>-₹{promoDiscount.toFixed(2)}</span>
    </div>

    <div className="flex justify-between font-bold text-lg">
      <span>Total</span>
      <span>₹{total.toFixed(2)}</span>
    </div>

    <PaymentMethod value={paymentMethod} onChange={setPaymentMethod}/>

    <Button onClick={confirmOrder} className="w-full bg-blue-600 text-white">
      Confirm Order
    </Button>

  </div>

</div>

)}

</div>

{/* CUSTOMER POPUP */}

{showCustomerPopup&&(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded-xl w-96 space-y-3">

<h2 className="font-bold text-lg">Add Customer</h2>

<Input placeholder="Name" onChange={e=>setCustomerForm({...customerForm,name:e.target.value})}/>
<Input placeholder="Phone" onChange={e=>setCustomerForm({...customerForm,phone_number:e.target.value})}/>
<Input placeholder="Email" onChange={e=>setCustomerForm({...customerForm,email:e.target.value})}/>
<Input placeholder="Address" onChange={e=>setCustomerForm({...customerForm,address:e.target.value})}/>

<select
className="w-full border rounded p-2"
value={customerForm.customer_type}
onChange={e=>setCustomerForm({...customerForm,customer_type:e.target.value})}
>
<option value="VIP">VIP</option>
<option value="Members">Members</option>
<option value="Staff">Staff</option>
</select>

<div className="flex gap-2">

<Button onClick={createCustomer} className="bg-blue-600 text-white flex-1">
Save
</Button>

<Button onClick={()=>setShowCustomerPopup(false)} className="flex-1">
Cancel
</Button>

</div>

</div>

</div>

)}

</div>

)

}

/* PAYMENT */

function PaymentMethod({value,onChange}){

const methods=[
{name:"Cash",icon:<Banknote size={16}/>},
{name:"Card",icon:<CreditCard size={16}/>},
{name:"UPI",icon:<QrCode size={16}/>}
]

return(

<div className="flex gap-2">

{methods.map(m=>(

<button
key={m.name}
onClick={()=>onChange(m.name)}
className={`flex-1 border p-2 rounded-lg text-xs
${value===m.name
?"bg-blue-600 text-white"
:"bg-white"}`}
>

{m.icon}
<p>{m.name}</p>

</button>

))}

</div>

)

}

/* RECEIPT COMPONENT */

function Receipt({
  orderId,
  cart,
  customer,
  subtotal,
  tax,
  discount,
  total,
  appliedPromotions,
  onContinue,
}) {
  const handlePrint = () => {
    const printContents = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=450,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: sans-serif; padding: 10px; }
            h1 { text-align: center; }
            .flex { display: flex; justify-content: space-between; }
            .text-sm { font-size: 14px; }
            hr { border: 1px dashed #ccc; margin: 8px 0; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div id="printArea" className="bg-white p-6 w-96 rounded shadow">
        <h1 className="text-center text-xl font-bold">{SHOP_NAME}</h1>

        <div className="flex justify-between text-sm mt-2">
          <p>Order ID: {orderId}</p>
          <p>Customer ID: {customer?.id || "-"}</p>
        </div>

        <hr className="my-2" />

        {cart.map((i) => (
          <div key={i.product_id} className="flex justify-between text-sm">
            <span>{i.product_name} x{i.qty}</span>
            <span>₹{(i.qty * i.amount).toFixed(2)}</span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <hr className="my-2" />

        <div className="text-xs">
          {appliedPromotions?.map((p, i) => (
            <p key={i}>✔ {p}</p>
          ))}
        </div>

        <p className="text-center mt-4 text-sm">
          Thank You!! <br />
          Come Again!!
        </p>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1 bg-blue-600 text-white" onClick={onContinue}>
            New Order
          </Button>

          <Button className="flex-1 bg-blue-600 text-white" onClick={handlePrint}>
            <Printer size={14} className="mr-1" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
}



