import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import { MapPinIcon, CreditCardIcon, CheckCircle2Icon } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, user, placeOrder, currency } = useApp();

    const [step, setStep] = useState<string>("address"); // address, payment, review
    const [loading, setLoading] = useState(false);

    // Initial Address selection
    const defaultAddress = user?.addresses?.find((a: any) => a.isDefault) || user?.addresses?.[0] || {
        label: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        lat: 12.9716,
        lng: 77.6412,
    };

    const [address, setAddress] = useState<any>(defaultAddress);
    const [paymentMethod, setPaymentMethod] = useState<string>("card");

    useEffect(() => {
        if (cart.length === 0) {
            toast.error("Your cart is empty!");
            navigate("/cart");
        }
    }, [cart, navigate]);

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const deliveryFee = subtotal > 200 ? 0 : 40.00;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    const handlePlaceOrder = () => {
        setLoading(true);
        setTimeout(() => {
            try {
                const newOrder = placeOrder(address, paymentMethod);
                setLoading(false);
                toast.success("Order placed successfully!");
                navigate(`/orders/${newOrder._id}`);
            } catch (err) {
                setLoading(false);
                toast.error("Failed to place order.");
            }
        }, 1500);
    };

    const steps = [
        { id: "address", label: "Address", icon: MapPinIcon },
        { id: "payment", label: "Payment", icon: CreditCardIcon },
        { id: "review", label: "Review", icon: CheckCircle2Icon },
    ];

    return (
        <div className="pb-16 space-y-8 max-w-4xl mx-auto animate-fade-in">
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between bg-white border border-app-border rounded-2xl p-4 sm:p-6">
                {steps.map((s, idx) => {
                    const isActive = step === s.id;
                    const isCompleted = idx < steps.findIndex((x) => x.id === step);
                    return (
                        <div key={s.id} className="flex items-center flex-1 last:flex-none">
                            <div className="flex items-center gap-2">
                                <div className={`size-8 rounded-full flex-center ${isCompleted || isActive ? "bg-app-green text-white" : "bg-app-cream text-zinc-400"}`}>
                                    <s.icon className="size-4" />
                                </div>
                                <span className={`text-xs sm:text-sm font-bold max-sm:hidden ${isActive ? "text-app-green" : "text-zinc-500"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-4 max-sm:mx-2 ${isCompleted ? "bg-app-green" : "bg-app-border"}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Layout Columns */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                    {step === "address" && (
                        <CheckoutAddress
                            user={user}
                            address={address}
                            setAddress={setAddress}
                            setStep={setStep}
                        />
                    )}
                    {step === "payment" && (
                        <CheckoutPayment
                            setStep={setStep}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                    )}
                    {step === "review" && (
                        <CheckoutReview
                            address={address}
                            items={cart}
                            handlePlaceOrder={handlePlaceOrder}
                            loading={loading}
                            total={total}
                        />
                    )}
                </div>

                {/* Right Side Summary Panel */}
                <div className="bg-white rounded-2xl border border-app-border p-5 space-y-4">
                    <h3 className="font-bold text-app-green text-sm">Summary</h3>
                    <hr className="border-app-border" />
                    <div className="space-y-2 text-xs text-zinc-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold">{currency}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span className="font-semibold text-green-600">{deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span className="font-semibold">{currency}{tax.toFixed(2)}</span>
                        </div>
                        <hr className="border-app-border my-1" />
                        <div className="flex justify-between text-sm font-extrabold text-zinc-950">
                            <span>Total</span>
                            <span>{currency}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
