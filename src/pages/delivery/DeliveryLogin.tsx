import { useState } from "react";
import { BikeIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";

export default function DeliveryLogin() {
    const { partners } = useApp();
    const navigate = useNavigate();
    const [email, setEmail] = useState("rahul@example.com");
    const [password, setPassword] = useState("password");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            const found = partners.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
            if (!found) {
                toast.error("Invalid delivery partner email");
                return;
            }
            localStorage.setItem("freshmart_delivery_partner", JSON.stringify(found));
            toast.success(`Successfully logged in as ${found.name}!`);
            navigate("/delivery");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex animate-fade-in relative">
            {/* Portal Switcher */}
            <div className="absolute top-6 right-6 hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-app-border text-xs font-semibold shadow-xs z-50">
                <span className="text-zinc-400 font-medium">Portal:</span>
                <Link to="/login" className="text-zinc-500 hover:text-app-green transition-colors">
                    Customer
                </Link>
                <span className="text-zinc-300">|</span>
                <span className="px-2 py-0.5 rounded-full bg-app-orange/10 text-app-orange text-[10px]">Delivery Partner</span>
            </div>

            {/* Left Side Visual Banner */}
            <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
                <img src={heroSectionData.hero_image} alt="" className="absolute inset-0 object-cover h-full bg-center opacity-10" />
                <div className="relative text-center px-12">
                    <h2 className="text-4xl font-semibold text-white mb-4">Delivery Partner Portal</h2>
                    <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">Manage your deliveries and keep customers happy.</p>
                </div>
            </div>

            {/* Right Side Login Form */}
            <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex-center gap-2 mb-4">
                            <BikeIcon className="size-7 text-app-green" />
                            <span className="text-2xl font-semibold text-app-green font-serif">FreshMart</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-app-green mb-2">Delivery Partner Login</h1>
                        <p className="text-sm text-app-text-light font-medium">Sign in to manage your deliveries</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5 border border-app-border shadow-xs">
                        <div>
                            <label className="block text-sm font-semibold text-app-green mb-1.5">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-app-border text-sm outline-none focus:border-app-green" placeholder="partner@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-app-green mb-1.5">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-app-border text-sm outline-none focus:border-app-green" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 bg-app-green text-white font-bold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-60">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Switcher Footer */}
                    <div className="mt-6 text-center text-xs text-zinc-400 font-medium space-x-2">
                        <span>Are you a Customer?</span>
                        <Link to="/login" className="text-app-green hover:underline font-bold transition-all">
                            Go to Store Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
