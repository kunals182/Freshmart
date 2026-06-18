import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Trash2Icon, PlusIcon, MinusIcon, ShoppingBagIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react";

export default function Cart() {
    const navigate = useNavigate();
    const { cart, updateCartQuantity, removeFromCart, currency } = useApp();

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const deliveryFee = subtotal === 0 ? 0 : subtotal > 200 ? 0 : 40.00;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    if (cart.length === 0) {
        return (
            <div className="max-w-md mx-auto text-center py-20 space-y-6">
                <div className="size-24 rounded-full bg-app-cream-dark/50 flex-center mx-auto text-app-green">
                    <ShoppingBagIcon className="size-10 text-app-green/60" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-app-green font-serif">Your cart is empty</h2>
                    <p className="text-sm text-zinc-500">Add fresh organic fruits, vegetables, beverages, and pantry staples to fill it up.</p>
                </div>
                <Link
                    to="/products"
                    className="inline-block px-8 py-3 bg-app-green hover:bg-app-green-light text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                    Browse Groceries
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-16 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/products"
                    className="p-2.5 bg-white hover:bg-app-cream border border-app-border text-zinc-500 rounded-xl transition-all"
                >
                    <ArrowLeftIcon className="size-5" />
                </Link>
                <h1 className="text-3xl font-extrabold text-app-green font-serif">Your Cart</h1>
            </div>

            {/* Main Cart Body */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-3xl border border-app-border p-6 divide-y divide-app-border">
                        {cart.map((item) => (
                            <div key={item.product._id} className="flex items-center gap-4 py-5 first:pt-0 last:pb-0">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="size-20 rounded-xl object-contain bg-app-cream/20 border border-app-border p-2"
                                />

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-zinc-950 text-base truncate">{item.product.name}</h3>
                                    <p className="text-xs text-zinc-500 mb-1">{item.product.unit}</p>
                                    <span className="text-sm font-semibold text-app-green">{currency}{item.product.price.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Qty Manager */}
                                    <div className="flex items-center border border-app-border rounded-xl bg-app-cream/20 p-1">
                                        <button
                                            onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                                            className="p-1 hover:bg-white text-zinc-500 rounded-lg"
                                        >
                                            <MinusIcon className="size-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-bold text-zinc-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                                            className="p-1 hover:bg-white text-zinc-500 rounded-lg"
                                        >
                                            <PlusIcon className="size-3.5" />
                                        </button>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2Icon className="size-4.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-3xl border border-app-border p-6 space-y-6 sticky top-24">
                    <h2 className="text-lg font-bold text-app-green">Order Summary</h2>

                    {/* Calculations List */}
                    <div className="space-y-3 text-sm text-zinc-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-zinc-900">{currency}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="font-semibold text-zinc-900">
                                {deliveryFee === 0 ? (
                                    <span className="text-green-600 font-bold">FREE</span>
                               ) : (
                                    `${currency}${deliveryFee.toFixed(2)}`
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated Tax (5% GST)</span>
                            <span className="font-semibold text-zinc-900">{currency}{tax.toFixed(2)}</span>
                        </div>

                        {subtotal < 200 && (
                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700 font-semibold flex items-center gap-1.5 mt-2">
                                <SparklesIcon className="size-3.5 text-app-orange" />
                                Add {currency}{(200 - subtotal).toFixed(2)} more for FREE delivery!
                            </div>
                        )}

                        <hr className="border-app-border pt-1" />

                        <div className="flex justify-between text-base font-extrabold text-zinc-950">
                            <span>Total</span>
                            <span>{currency}{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full py-3.5 bg-app-orange hover:bg-app-orange-dark text-white font-bold rounded-xl transition-all shadow-md text-center active:scale-[0.98]"
                    >
                        Proceed to Checkout
                    </button>

                    <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                        Orders are delivered by local delivery partners directly to your doorstep. Satisfied or refunded guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
}
