import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { UserIcon, MailIcon, LockIcon, StoreIcon, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const { login, signup } = useApp();
    const [isSignIn, setIsSignIn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignIn) {
                await login(email, password);
                if (email.toLowerCase().includes("admin")) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                await signup(name, email, password);
                if (email.toLowerCase().includes("admin")) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (err: any) {
            toast.error(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-app-cream flex flex-col justify-center items-center p-4 relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6">
                <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-app-green transition-colors font-medium text-sm">
                    <ArrowLeftIcon className="size-4" /> Back to Store
                </Link>
            </div>

            {/* Portal Switcher */}
            <div className="absolute top-6 right-6 hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-app-border text-xs font-semibold shadow-xs">
                <span className="text-zinc-400 font-medium">Portal:</span>
                <span className="px-2 py-0.5 rounded-full bg-app-green/10 text-app-green text-[10px]">Customer</span>
                <span className="text-zinc-300">|</span>
                <Link to="/delivery/login" className="text-zinc-500 hover:text-app-orange transition-colors">
                    Delivery Partner
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl border border-app-border p-8 shadow-lg space-y-6">
                {/* Logo and Greeting */}
                <div className="text-center space-y-2">
                    <div className="size-12 rounded-2xl bg-app-green flex-center text-white mx-auto shadow-md">
                        <StoreIcon className="size-6" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif text-app-green">
                        {isSignIn ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-xs text-zinc-500">
                        {isSignIn 
                            ? "Sign in to track orders, manage addresses, and checkout" 
                            : "Join FreshMart to order fresh organic groceries in minutes"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isSignIn && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-600">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-app-border focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-600">Email Address</label>
                        <div className="relative">
                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input
                                required
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-app-border focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-600">Password</label>
                        <div className="relative">
                            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-app-border focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                            />
                        </div>
                    </div>

                    {isSignIn && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => toast.error("Password reset is not implemented in mock mode")}
                                className="text-xs text-app-orange hover:text-app-orange-dark hover:underline transition-all font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-app-green hover:bg-app-green-light text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm mt-2"
                    >
                        {loading ? "Authenticating..." : isSignIn ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                {/* Toggle Link */}
                <div className="text-center pt-2">
                    <p className="text-xs text-zinc-500">
                        {isSignIn ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignIn(!isSignIn);
                                setName("");
                                setEmail("");
                                setPassword("");
                            }}
                            className="text-app-orange font-bold hover:underline hover:text-app-orange-dark ml-1 transition-all"
                        >
                            {isSignIn ? "Create one" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>

            {/* Subtle Portal Footer switcher */}
            <div className="mt-8 text-center text-xs text-zinc-400 font-medium space-y-2.5 flex flex-col items-center">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-xs px-4 py-2 rounded-full border border-app-border shadow-xs hover:bg-white/80 transition-colors">
                    <span>Are you a Partner?</span>
                    <span className="h-3 w-px bg-zinc-200"></span>
                    <Link to="/delivery/login" className="text-app-green hover:underline font-bold transition-all">
                        Go to Delivery Portal
                    </Link>
                </div>
                <div className="text-[10px] text-zinc-400/70">
                    * Admins can log in directly using the Customer Store portal.
                </div>
            </div>
        </div>
    );
}
