import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { statusColors } from "../assets/assets";
import { ClockIcon, MapPinIcon, PackageIcon, ArrowRightIcon } from "lucide-react";

export default function Orders() {
    const { orders, currency } = useApp();

    return (
        <div className="pb-16 space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="border-b border-app-border pb-4">
                <h1 className="text-3xl font-extrabold text-app-green font-serif">Your Orders</h1>
                <p className="text-sm text-zinc-500 mt-1">Track status and view details of your recent purchases.</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white border border-app-border rounded-2xl">
                    <PackageIcon className="size-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">No orders found</h3>
                    <p className="text-sm text-zinc-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link to="/products" className="px-6 py-2.5 bg-app-green hover:bg-app-green-light text-white text-sm font-semibold rounded-xl transition-colors">
                        Shop Groceries
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        return (
                            <div key={order._id} className="bg-white border border-app-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                                {/* Top Bar */}
                                <div className="px-6 py-4 bg-app-cream/30 border-b border-app-border flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Order Placed</p>
                                            <p className="text-sm font-semibold text-zinc-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Price</p>
                                            <p className="text-sm font-bold text-zinc-900">{currency}{order.total.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Order ID</p>
                                            <p className="text-sm font-mono text-zinc-500">#{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-zinc-100 text-zinc-600"}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    {/* Items List images preview */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap gap-2.5">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className="size-14 border border-app-border rounded-xl p-1 bg-app-cream/20 flex-center">
                                                        <img src={item.image} alt={item.name} className="h-full object-contain" />
                                                    </div>
                                                    <span className="absolute -top-1.5 -right-1.5 size-5 bg-zinc-800 text-white text-[10px] font-bold rounded-full flex-center border border-white">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                            <MapPinIcon className="size-3.5 text-app-green" /> Deliver to: {order.shippingAddress.address}, {order.shippingAddress.city}
                                        </p>
                                    </div>

                                    {/* Action button */}
                                    <div className="shrink-0 flex items-center gap-3">
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="px-5 py-2.5 bg-app-green hover:bg-app-green-light text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 active:scale-[0.98]"
                                        >
                                            Track Order <ArrowRightIcon className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
