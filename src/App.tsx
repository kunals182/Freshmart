import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { footerData } from "./assets/assets";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// Customer Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import Addresses from "./pages/Addresses";
import Deals from "./pages/Deals";
import Login from "./pages/Login";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";

// Delivery Pages
import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";

// Layout wrapper for customer pages to include Navbar and Footer
function ClientLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-app-cream text-app-text">
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <Outlet />
            </main>

            {/* Dynamic Premium Footer */}
            <footer className="bg-app-green text-zinc-300 border-t border-app-green-light/20 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-zinc-800">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold font-serif text-white">{footerData.brand.name}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">{footerData.brand.description}</p>
                            <div className="flex gap-4">
                                {footerData.brand.socials.map((social, idx) => (
                                    <a key={idx} href={social.link} className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                                        <social.icon className="size-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link Columns */}
                        {footerData.sections.map((sec, idx) => (
                            <div key={idx} className="space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{sec.title}</h4>
                                <ul className="space-y-2.5 text-sm">
                                    {sec.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            {"to" in link ? (
                                                <a href={link.to} className="hover:text-white transition-colors">{link.label}</a>
                                            ) : (
                                                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Contact Column */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                {footerData.contact.map((info, idx) => (
                                    <li key={idx} className="flex items-center gap-2.5">
                                        <info.icon className="size-4.5 text-app-orange" />
                                        <span>{info.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom footer details */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                        <p>{footerData.bottom.copyright}</p>
                        <div className="flex gap-4">
                            {footerData.bottom.links.map((link, idx) => (
                                <a key={idx} href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<ClientLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="deals" element={<Deals />} />

                    {/* Guarded Client Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:id" element={<OrderTracking />} />
                        <Route path="addresses" element={<Addresses />} />
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/:id/edit" element={<AdminProductForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
                </Route>

                {/* Delivery Routes */}
                <Route path="/delivery/login" element={<DeliveryLogin />} />
                <Route path="/delivery" element={<DeliveryLayout />}>
                    <Route index element={<DeliveryDashboard />} />
                </Route>
            </Routes>
        </>
    );
}
