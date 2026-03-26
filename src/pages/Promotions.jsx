import { useEffect, useState } from "react"
import api from "../api"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"


export default function Promotions() {

    const [promotions, setPromotions] = useState([])
    const [tab, setTab] = useState("promotions")
    const [editing, setEditing] = useState(null)

    useEffect(() => {
        loadPromotions()
    }, [])

    const loadPromotions = async () => {
        const res = await api.get("/pos/promotions")
        setPromotions(res.data.promotions || [])
    }

    /* SAVE */

    const save = async (data) => {
        await api.post("/pos/promotions", data)
        loadPromotions()
    }

    /* DELETE */

    const deletePromotion = async (id) => {
        if (!window.confirm("Delete promotion?")) return
        await api.put(`/pos/promotions/${id}`, { active: false })
        loadPromotions()
    }

    /* EDIT */

    const editPromotion = (p) => {
        setEditing(p)
    }

    const updatePromotion = async () => {
        await api.put(`/pos/promotions/${editing.id}`, editing)
        setEditing(null)
        loadPromotions()
    }

    /* FORMS */

    const [customer, setCustomer] = useState({ name: "", customer_type: "VIP", discount_percent: "" })
    const [order, setOrder] = useState({ name: "", min_order_value: "", discount_percent: "" })
    const [bogo, setBogo] = useState({ name: "", product_id: "", buy_qty: "", get_qty: "" })
    const [product, setProduct] = useState({ name: "", product_id: "", discount_percent: "" })
    const [coupon, setCoupon] = useState({ name: "", discount_percent: "", discount_amount: "" })
    const [festival, setFestival] = useState({ name: "", discount_percent: "", start_date: "", end_date: "" })

    /* FILTER */

    const promotionList = promotions.filter(p =>
        ["BOGO", "PRODUCT_DISCOUNT", "COUPON", "FESTIVAL"].includes(p.promotion_type)
    )

    const discountList = promotions.filter(p =>
        ["CUSTOMER_DISCOUNT", "ORDER_VALUE"].includes(p.promotion_type)
    )

    return (

        <div className="p-6 space-y-6">

            {/* CREATE CARDS */}

            <div className="grid md:grid-cols-3 gap-4">

                {/* CUSTOMER */}

                <Card>

                    <CardHeader>
                        <CardTitle>Customer Discount</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">

                        <Input
                            placeholder="Name"
                            value={customer.name}
                            onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        />

                        <Input
                            placeholder="Customer Type"
                            value={customer.customer_type}
                            onChange={e => setCustomer({ ...customer, customer_type: e.target.value })}
                        />

                        <Input
                            type="number"
                            placeholder="Discount %"
                            value={customer.discount_percent}
                            onChange={e => setCustomer({ ...customer, discount_percent: e.target.value })}
                        />

                        <Button
                            className="w-full"
                            onClick={() => save({ ...customer, promotion_type: "CUSTOMER_DISCOUNT" })}
                        >
                            Create
                        </Button>

                    </CardContent>
                </Card>


                {/* ORDER */}

                <Card>

                    <CardHeader>
                        <CardTitle>Order Value</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">

                        <Input
                            placeholder="Name"
                            value={order.name}
                            onChange={e => setOrder({ ...order, name: e.target.value })}
                        />

                        <Input
                            type="number"
                            placeholder="Min Order"
                            value={order.min_order_value}
                            onChange={e => setOrder({ ...order, min_order_value: e.target.value })}
                        />

                        <Input
                            type="number"
                            placeholder="Discount %"
                            value={order.discount_percent}
                            onChange={e => setOrder({ ...order, discount_percent: e.target.value })}
                        />

                        <Button
                            className="w-full"
                            onClick={() => save({ ...order, promotion_type: "ORDER_VALUE" })}
                        >
                            Create
                        </Button>

                    </CardContent>
                </Card>


                {/* BOGO */}

                <Card>
                    <CardHeader>
                        <CardTitle>BOGO</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <Input
                            placeholder="Name"
                            value={bogo.name}
                            onChange={e => setBogo({ ...bogo, name: e.target.value })}
                        />

                        <Input
                            placeholder="Product ID"
                            value={bogo.product_id}
                            onChange={e => setBogo({ ...bogo, product_id: e.target.value })}
                        />


                        <div className="flex gap-2">
                            <Input
                                type="number"
                                className="w-1/2"
                                placeholder="Buy Qty"
                                value={bogo.buy_qty}
                                onChange={e =>
                                    setBogo({ ...bogo, buy_qty: e.target.value })
                                }
                            />

                            <Input
                                type="number"
                                className="w-1/2"
                                placeholder="Get Qty"
                                value={bogo.get_qty}
                                onChange={e =>
                                    setBogo({ ...bogo, get_qty: e.target.value })
                                }
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={() => save({ ...bogo, promotion_type: "BOGO" })}
                        >
                            Create
                        </Button>
                    </CardContent>
                </Card>


                {/* PRODUCT */}

                <Card>

                    <CardHeader>
                        <CardTitle>Product Discount</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">

                        <Input
                            placeholder="Name"
                            value={product.name}
                            onChange={e => setProduct({ ...product, name: e.target.value })}
                        />

                        <Input
                            placeholder="Product ID"
                            value={product.product_id}
                            onChange={e => setProduct({ ...product, product_id: e.target.value })}
                        />

                        <Input
                            type="number"
                            placeholder="Discount %"
                            value={product.discount_percent}
                            onChange={e => setProduct({ ...product, discount_percent: e.target.value })}
                        />

                        <Button
                            className="w-full"
                            onClick={() => save({ ...product, promotion_type: "PRODUCT_DISCOUNT" })}
                        >
                            Create
                        </Button>

                    </CardContent>
                </Card>


                {/* COUPON */}

                <Card>

                    <CardHeader>
                        <CardTitle>Coupon</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">

                        <Input
                            placeholder="Coupon Code"
                            value={coupon.name}
                            onChange={e => setCoupon({ ...coupon, name: e.target.value })}
                        />

                        <Input
                            type="number"
                            placeholder="Discount %"
                            value={coupon.discount_percent}
                            onChange={e => setCoupon({ ...coupon, discount_percent: e.target.value })}
                        />

                        <Input
                            type="number"
                            placeholder="Discount Amount"
                            value={coupon.discount_amount}
                            onChange={e => setCoupon({ ...coupon, discount_amount: e.target.value })}
                        />

                        <Button
                            className="w-full"
                            onClick={() => save({ ...coupon, promotion_type: "COUPON" })}
                        >
                            Create
                        </Button>

                    </CardContent>
                </Card>


                {/* FESTIVAL */}



                <Card> <CardHeader> 
                    <CardTitle>Festival Promotion</CardTitle>
                 </CardHeader>
                  <CardContent className="space-y-2"> 
                    <Input placeholder="Festival Name" value={festival.name} onChange={e => setFestival({ ...festival, name: e.target.value })} /> 
                    <Input type="number" placeholder="Discount %" value={festival.discount_percent} onChange={e => setFestival({ ...festival, discount_percent: e.target.value })} /> 
                    <Input type="date" value={festival.start_date} onChange={e => setFestival({ ...festival, start_date: e.target.value })} />
                     <Input type="date" value={festival.end_date} onChange={e => setFestival({ ...festival, end_date: e.target.value })} /> 
                     <Button className="w-full" onClick={() => save({ ...festival, promotion_type: "FESTIVAL" })} > Create </Button> 
                     </CardContent> 
                     </Card>

            </div>


            {/* TABS */}

            <div className="flex gap-3">

                <Button
                    variant={tab === "promotions" ? "default" : "outline"}
                    onClick={() => setTab("promotions")}
                >
                    Promotions
                </Button>

                <Button
                    variant={tab === "discounts" ? "default" : "outline"}
                    onClick={() => setTab("discounts")}
                >
                    Discounts
                </Button>

            </div>


            {/* LIST */}

            <div className="grid md:grid-cols-3 gap-4">

                {(tab === "promotions" ? promotionList : discountList).map(p => (

                    <Card key={p.id}>

                        <CardContent className="p-4 space-y-2 text-sm">

                            <p className="font-bold">{p.name}</p>

                            <p>Type: {p.promotion_type}</p>

                            {p.discount_percent && <p>{p.discount_percent}% off</p>}
                            {p.product_id && <p> Product: {p.product_id}</p>}
                            {p.discount_amount && <p>₹{p.discount_amount}</p>}
                            {p.min_order_value && <p>Min: ₹{p.min_order_value}</p>}
                            {p.customer_type && <p>Customer: {p.customer_type}</p>}
                            {p.buy_qty && <p>Buy: {p.buy_qty} Get: {p.get_qty}</p>}

                            <div className="flex gap-2 pt-2">

                                <Button
                                    size="sm"
                                    onClick={() => editPromotion(p)}
                                >
                                    Edit
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deletePromotion(p.id)}
                                >
                                    Delete
                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                ))}

            </div>


            {/* EDIT MODAL */}

            {editing && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <Card className="w-96">

                        <CardHeader>
                            <CardTitle>Edit Promotion</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">

                            <Input
                                value={editing.name}
                                onChange={e => setEditing({ ...editing, name: e.target.value })}
                            />

                            <Input
                                value={editing.discount_percent || ""}
                                onChange={e => setEditing({ ...editing, discount_percent: e.target.value })}
                            />

                            <Button
                                className="w-full"
                                onClick={updatePromotion}
                            >
                                Update
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setEditing(null)}
                            >
                                Cancel
                            </Button>

                        </CardContent>

                    </Card>

                </div>

            )}

        </div>

    )

}
