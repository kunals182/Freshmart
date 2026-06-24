import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartIcon, SearchIcon, MenuIcon, XIcon, ShieldAlertIcon, BikeIcon, StoreIcon, ChevronDownIcon, MapPinIcon, ShoppingBagIcon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
    const { cart, user, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [portalMenuOpen, setPortalMenuOpen] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const isAdminRoute = location.pathname.startsWith("/admin");
    const isDeliveryRoute = location.pathname.startsWith("/delivery");

    return (
        <header className="bg-white border-b border-app-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 text-[22px] font-semibold text-app-green shrink-0 font-sans">
                        <div className="size-8 rounded-lg bg-app-green flex-center text-white shrink-0">
                            <StoreIcon className="size-4.5" />
                        </div>
                        <span className="tracking-tight font-serif text-[20px] font-bold">FreshMart</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
                        <Link to="/" className={`hover:text-app-green transition-colors ${location.pathname === "/" ? "text-app-green font-semibold" : ""}`}>
                            Home
                        </Link>
                        <Link to="/products" className={`hover:text-app-green transition-colors ${location.pathname === "/products" ? "text-app-green font-semibold" : ""}`}>
                            Products
                        </Link>
                        <Link to="/deals" className={`text-app-orange hover:text-app-orange-dark transition-colors font-medium ${location.pathname === "/deals" ? "font-semibold" : ""}`}>
                            Deals
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-sm relative text-xs sm:text-sm">
                        <div className="relative w-full">
                            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search for groceries..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30 outline-none text-zinc-800 border-0"
                            />
                        </div>
                        <button type="submit" className="hidden" />
                    </form>

                    {/* Actions Panel */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* Shopping Cart */}
                        {!isAdminRoute && !isDeliveryRoute && (
                            <Link to="/cart" className="p-2 text-zinc-700 hover:text-app-green hover:bg-app-cream/50 rounded-xl relative transition-all">
                                <ShoppingCartIcon className="size-5 text-zinc-900" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] font-bold rounded-full flex-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Premium Avatar Profile Switcher Dropdown */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-zinc-100 transition-all focus:outline-none cursor-pointer"
                                >
                                    <div className="size-7 rounded-full bg-app-green text-white flex-center font-bold text-xs uppercase shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <ChevronDownIcon className="size-3.5 text-zinc-500" />
                                </button>

                                {portalMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setPortalMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2.5 w-56 bg-white border border-app-border rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                                            <div className="px-4 py-2 border-b border-app-border mb-1">
                                                <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                                                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                            </div>
                                            <div onClick={() => setPortalMenuOpen(false)}>
                                                <Link to="/orders" className="dropdown-link">
                                                    <ShoppingBagIcon className="size-4 text-zinc-500" />
                                                    <span>My Orders</span>
                                                </Link>
                                                <Link to="/addresses" className="dropdown-link">
                                                    <MapPinIcon className="size-4 text-zinc-500" />
                                                    <span>Addresses</span>
                                                </Link>

                                                <div className="border-t border-app-border my-1.5" />

                                                <Link to="/" className="dropdown-link">
                                                    <StoreIcon className="size-4 text-app-green" />
                                                    <span>Customer Store</span>
                                                </Link>
                                                {user.isAdmin && (
                                                    <Link to="/admin" className="dropdown-link">
                                                        <ShieldAlertIcon className="size-4 text-orange-500" />
                                                        <span className="text-app-orange-dark font-medium">Admin Panel</span>
                                                    </Link>
                                                )}
                                                <Link to="/delivery/login" className="dropdown-link">
                                                    <BikeIcon className="size-4 text-blue-500" />
                                                    <span>Delivery Portal</span>
                                                </Link>

                                                <div className="border-t border-app-border my-1.5 pt-1" />

                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        navigate("/");
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-app-error hover:bg-red-50 w-full transition-colors font-medium text-left cursor-pointer"
                                                >
                                                    <XIcon className="size-4 text-app-error" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-app-green rounded-full hover:bg-app-green-light transition-colors cursor-pointer"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-zinc-700 hover:bg-app-cream rounded-xl"
                        >
                            {mobileMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-app-border bg-white px-4 py-4 space-y-4 shadow-inner animate-fade-in">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <div className="relative w-full text-sm">
                            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search for groceries..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30 outline-none text-zinc-800 border-0"
                            />
                        </div>
                    </form>
                    <nav className="flex flex-col gap-3 font-medium text-zinc-600">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-app-cream rounded-lg">
                            Home
                        </Link>
                        <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-app-cream rounded-lg">
                            Products
                        </Link>
                        <Link to="/deals" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-app-cream rounded-lg text-app-orange">
                            Deals
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

