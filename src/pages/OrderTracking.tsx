import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import { ArrowLeftIcon, MapPinIcon, CheckCircle2Icon, BikeIcon } from "lucide-react";

export default function OrderTracking() {
    const { id } = useParams();
    const { orders, currency } = useApp();

    const order = orders.find(o => o._id === id);

    if (!order) {
        return (
            <div className="text-center py-20">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Order not found</h3>
                <Link to="/orders" className="text-app-green hover:underline">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="pb-16 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/orders"
                    className="p-2.5 bg-white hover:bg-app-cream border border-app-border text-zinc-500 rounded-xl transition-all"
                >
                    <ArrowLeftIcon className="size-5" />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-app-green font-serif">Track Order #{order._id.slice(-6).toUpperCase()}</h1>
                    <p className="text-xs sm:text-sm text-zinc-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left Panel: Items & OTP Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Live Map Panel */}
                    <div className="bg-white rounded-3xl border border-app-border p-6 space-y-4">
                        <h2 className="text-lg font-bold text-app-green flex items-center gap-2">
                            <BikeIcon className="size-5 text-app-orange" /> Delivery Location
                        </h2>
                        <LiveMap order={order} liveLocation={order.liveLocation} />
                        {order.status === "Out for Delivery" && (
                            <p className="text-xs text-app-orange font-semibold flex items-center gap-1.5 animate-pulse bg-orange-50 p-2.5 rounded-lg">
                                🚚 Your delivery partner is on the way! Watch their location live on the map.
                            </p>
                        )}
                    </div>

                    {/* Order OTP details */}
                    <OrderOTP order={order} />

                    {/* Order Items List details */}
                    <div className="bg-white rounded-3xl border border-app-border p-6 space-y-4">
                        <h2 className="text-lg font-bold text-app-green">Items Ordered</h2>
                        <div className="divide-y divide-app-border">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-lg border border-app-border p-1 bg-app-cream/10 flex-center">
                                            <img src={item.image} alt={item.name} className="h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                                            <p className="text-xs text-zinc-400">Qty: {item.quantity} • {item.unit}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-zinc-900">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <hr className="border-app-border pt-2" />

                        <div className="space-y-2 text-sm text-zinc-600 pt-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-zinc-900">{currency}{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="font-semibold text-zinc-900">{order.deliveryFee === 0 ? "FREE" : `${currency}${order.deliveryFee.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span className="font-semibold text-zinc-900">{currency}{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-2 border-t border-app-border">
                                <span>Total Price</span>
                                <span>{currency}{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Delivery Progress Steps Timeline */}
                <div className="space-y-6">
                    <OrderTimeLine order={order} />

                    {/* Delivery Agent Card */}
                    {order.deliveryPartner && (
                        <div className="bg-white rounded-2xl border border-app-border p-5 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Delivery Partner</h3>
                            <div className="flex items-center gap-3">
                                <div className="size-11 rounded-full bg-app-green text-white flex-center font-bold text-lg">
                                    {order.deliveryPartner.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 text-sm">{order.deliveryPartner.name}</p>
                                    <p className="text-xs text-zinc-500 capitalize">{order.deliveryPartner.vehicleType} • Active</p>
                                </div>
                            </div>
                            <div className="bg-app-cream/35 border border-app-border rounded-xl p-3 text-xs text-zinc-600">
                                📞 Contact Number: <span className="font-semibold text-zinc-800">{order.deliveryPartner.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
