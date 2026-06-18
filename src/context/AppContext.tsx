import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { dummyProducts, dummyDashboardOrdersData, dummyDeliveryPartnerData } from "../assets/assets";
import type { Product, Order, DeliveryPartner, Address } from "../types";
import toast from "react-hot-toast";

interface AppContextProps {
    products: Product[];
    cart: { product: Product; quantity: number }[];
    orders: Order[];
    partners: DeliveryPartner[];
    user: any;
    addToCart: (product: Product, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, qty: number) => void;
    clearCart: () => void;
    placeOrder: (address: Address, paymentMethod: string) => Order;
    updateOrderStatus: (orderId: string, status: string, note?: string) => void;
    assignPartner: (orderId: string, partnerId: string) => void;
    addPartner: (partner: Omit<DeliveryPartner, "_id" | "createdAt" | "isActive"> & { password?: string }) => void;
    togglePartnerActive: (partnerId: string, isActive: boolean) => void;
    addProduct: (productData: any) => void;
    updateProduct: (id: string, productData: any) => void;
    markOutOfStock: (productId: string) => void;
    addAddress: (addr: Omit<Address, "_id">) => void;
    updateLiveLocation: (orderId: string, lat: number, lng: number) => void;
    currency: string;
    login: (email: string, pass: string) => Promise<boolean>;
    signup: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const initialUsers = [
    {
        _id: "user-client-1",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password",
        phone: "+91 98765 43210",
        avatar: "",
        addresses: [
            {
                _id: "addr-1",
                label: "Home",
                address: "Flat 402, Sea Breeze Apts, Carter Road, Bandra West",
                city: "Mumbai",
                state: "MH",
                zip: "400050",
                isDefault: true,
                lat: 19.0583,
                lng: 72.8215,
            },
            {
                _id: "addr-2",
                label: "Office",
                address: "15th Floor, Maker Chambers VI, Nariman Point",
                city: "Mumbai",
                state: "MH",
                zip: "400021",
                isDefault: false,
                lat: 18.9284,
                lng: 72.8229,
            }
        ],
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "user-admin-1",
        name: "Admin User",
        email: "admin@example.com",
        password: "admin",
        phone: "+91 99999 99999",
        avatar: "",
        addresses: [],
        isAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export function AppContextProvider({ children }: { children: ReactNode }) {
    const currency = "₹";

    // Products
    const [products, setProducts] = useState<Product[]>(() => {
        const stored = localStorage.getItem("freshmart_products");
        return stored ? JSON.parse(stored) : dummyProducts;
    });

    // Orders
    const [orders, setOrders] = useState<Order[]>(() => {
        const stored = localStorage.getItem("freshmart_orders");
        if (stored) return JSON.parse(stored);
        return dummyDashboardOrdersData.map((order: any) => ({
            ...order,
            user: order.user || { _id: "user-client-1", name: "Jane Doe", email: "jane.doe@example.com" },
            deliveryOtp: order.deliveryOtp || "483920"
        }));
    });

    // Delivery Partners
    const [partners, setPartners] = useState<DeliveryPartner[]>(() => {
        const stored = localStorage.getItem("freshmart_partners");
        return stored ? JSON.parse(stored) : dummyDeliveryPartnerData;
    });

    // Users Database
    const [users, setUsers] = useState<any[]>(() => {
        const stored = localStorage.getItem("freshmart_users");
        if (stored) return JSON.parse(stored);
        localStorage.setItem("freshmart_users", JSON.stringify(initialUsers));
        return initialUsers;
    });

    // User Profile (Jane Doe by default on first load, but stays null if logged out)
    const [user, setUser] = useState<any>(() => {
        const stored = localStorage.getItem("freshmart_user");
        if (stored) return JSON.parse(stored);

        // Check if the user has explicitly logged out in the past
        const initialized = localStorage.getItem("freshmart_auth_initialized");
        if (initialized) {
            return null; // keep logged out
        }

        // First-time visit: auto-login Jane Doe
        const jane = initialUsers[0];
        localStorage.setItem("freshmart_user", JSON.stringify(jane));
        localStorage.setItem("freshmart_auth_initialized", "true");
        return jane;
    });

    // Cart
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
        const stored = localStorage.getItem("freshmart_cart");
        return stored ? JSON.parse(stored) : [];
    });

    // Save states to local storage
    useEffect(() => {
        localStorage.setItem("freshmart_products", JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem("freshmart_orders", JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem("freshmart_partners", JSON.stringify(partners));
    }, [partners]);

    useEffect(() => {
        localStorage.setItem("freshmart_users", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("freshmart_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("freshmart_user");
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("freshmart_cart", JSON.stringify(cart));
    }, [cart]);

    // Cart Actions
    const addToCart = (product: Product, qty: number = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            if (existing) {
                toast.success(`Updated ${product.name} quantity!`);
                return prev.map(item => item.product._id === product._id ? { ...item, quantity: item.quantity + qty } : item);
            }
            toast.success(`Added ${product.name} to cart!`);
            return [...prev, { product, quantity: qty }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const item = prev.find(i => i.product._id === productId);
            if (item) {
                toast.error(`Removed ${item.product.name} from cart`);
            }
            return prev.filter(i => i.product._id !== productId);
        });
    };

    const updateCartQuantity = (productId: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => item.product._id === productId ? { ...item, quantity: qty } : item));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Checkout & Orders Actions
    const placeOrder = (shippingAddress: Address, paymentMethod: string) => {
        const subtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
        const deliveryFee = subtotal > 200 ? 0 : 40.00;
        const tax = subtotal * 0.05;
        const total = subtotal + deliveryFee + tax;

        // Generate 6 digit delivery OTP
        const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOrder: Order = {
            _id: "order-" + Math.random().toString(36).substring(2, 9),
            user: {
                _id: user?._id || "guest",
                name: user?.name || "Guest User",
                email: user?.email || "guest@example.com",
                phone: user?.phone || ""
            },
            items: cart.map(item => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                unit: item.product.unit
            })),
            shippingAddress: {
                label: shippingAddress.label,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zip: shippingAddress.zip,
                lat: shippingAddress.lat || 12.9716,
                lng: shippingAddress.lng || 77.6412,
            },
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            status: "Placed",
            statusHistory: [
                { status: "Placed", timestamp: new Date().toISOString(), note: "Order placed successfully" }
            ],
            deliveryPartner: null,
            deliveryOtp,
            isPaid: paymentMethod === "card",
            createdAt: new Date().toISOString()
        };

        // Deduct stocks
        setProducts(prevProducts => {
            return prevProducts.map(p => {
                const cartItem = cart.find(item => item.product._id === p._id);
                if (cartItem) {
                    return { ...p, stock: Math.max(0, (p.stock || 100) - cartItem.quantity) };
                }
                return p;
            });
        });

        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        return newOrder;
    };

    const updateOrderStatus = (orderId: string, status: string, note?: string) => {
        setOrders(prev => prev.map(order => {
            if (order._id === orderId) {
                const isNewStatus = order.status !== status;
                const updatedHistory = [...order.statusHistory];
                if (isNewStatus) {
                    updatedHistory.push({
                        status,
                        timestamp: new Date().toISOString(),
                        note: note || `Status updated to ${status}`
                    });
                }
                return {
                    ...order,
                    status,
                    statusHistory: updatedHistory,
                    isPaid: status === "Delivered" ? true : order.isPaid
                };
            }
            return order;
        }));
    };

    const assignPartner = (orderId: string, partnerId: string) => {
        const partner = partners.find(p => p._id === partnerId) || null;
        if (!partner) return;
        setOrders(prev => prev.map(order => {
            if (order._id === orderId) {
                return {
                    ...order,
                    status: "Assigned",
                    deliveryPartner: partner,
                    statusHistory: [
                        ...order.statusHistory,
                        {
                            status: "Assigned",
                            timestamp: new Date().toISOString(),
                            note: `Assigned to delivery partner: ${partner.name}`
                        }
                    ]
                };
            }
            return order;
        }));
    };

    // Partners Admin Operations
    const addPartner = (partnerData: Omit<DeliveryPartner, "_id" | "createdAt" | "isActive"> & { password?: string }) => {
        const newPartner: DeliveryPartner = {
            _id: "partner-" + Math.random().toString(36).substring(2, 9),
            name: partnerData.name,
            email: partnerData.email,
            phone: partnerData.phone,
            avatar: partnerData.avatar || "",
            vehicleType: partnerData.vehicleType as any,
            isActive: true,
            createdAt: new Date().toISOString()
        };
        setPartners(prev => [...prev, newPartner]);
        toast.success(`Onboarded partner ${newPartner.name}!`);
    };

    const togglePartnerActive = (partnerId: string, isActive: boolean) => {
        setPartners(prev => prev.map(p => p._id === partnerId ? { ...p, isActive } : p));
        toast.success(`Partner status updated!`);
    };

    // Product Admin Operations
    const addProduct = (productData: any) => {
        const newProd: Product = {
            _id: "product-" + Math.random().toString(36).substring(2, 9),
            name: productData.name,
            description: productData.description || "",
            price: parseFloat(productData.price),
            originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : parseFloat(productData.price),
            image: productData.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
            category: productData.category,
            unit: productData.unit || "piece",
            stock: parseInt(productData.stock) || 0,
            isOrganic: productData.isOrganic || false,
            rating: 4.5,
            reviewCount: 0,
            discount: productData.originalPrice ? Math.round((1 - parseFloat(productData.price) / parseFloat(productData.originalPrice)) * 100) : 0,
            createdAt: new Date().toISOString()
        };
        setProducts(prev => [newProd, ...prev]);
        toast.success(`Product "${newProd.name}" added successfully!`);
    };

    const updateProduct = (id: string, productData: any) => {
        setProducts(prev => prev.map(p => {
            if (p._id === id) {
                const originalPrice = productData.originalPrice ? parseFloat(productData.originalPrice) : parseFloat(productData.price);
                const price = parseFloat(productData.price);
                return {
                    ...p,
                    name: productData.name,
                    description: productData.description,
                    price,
                    originalPrice,
                    category: productData.category,
                    unit: productData.unit,
                    stock: parseInt(productData.stock) || 0,
                    isOrganic: productData.isOrganic,
                    discount: originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0
                };
            }
            return p;
        }));
        toast.success(`Product updated successfully!`);
    };

    const markOutOfStock = (productId: string) => {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: 0 } : p));
        toast.error("Product marked as out of stock");
    };

    // User Profile Operations
    const addAddress = (addr: Omit<Address, "_id">) => {
        if (!user) {
            toast.error("You must be logged in to add an address");
            return;
        }
        const newAddr: Address = {
            _id: "addr-" + Math.random().toString(36).substring(2, 9),
            ...addr,
            isDefault: user.addresses.length === 0 ? true : addr.isDefault || false
        };

        const updatedAddresses = addr.isDefault
            ? user.addresses.map((a: any) => ({ ...a, isDefault: false })).concat(newAddr)
            : user.addresses.concat(newAddr);
        const updatedUser = {
            ...user,
            addresses: updatedAddresses
        };

        setUser(updatedUser);
        setUsers(prev => prev.map(u => u._id === user._id ? updatedUser : u));
        toast.success(`Address "${newAddr.label}" added!`);
    };

    const updateLiveLocation = (orderId: string, lat: number, lng: number) => {
        setOrders(prev => prev.map(order => {
            if (order._id === orderId) {
                return {
                    ...order,
                    liveLocation: {
                        lat,
                        lng,
                        updatedAt: new Date().toISOString()
                    }
                };
            }
            return order;
        }));
    };

    // Simulation of Location Updates for Out For Delivery orders
    useEffect(() => {
        const interval = setInterval(() => {
            setOrders(prevOrders => {
                let updated = false;
                const nextOrders = prevOrders.map(order => {
                    if (order.status === "Out for Delivery") {
                        updated = true;
                        const baseLat = order.shippingAddress.lat || 12.9716;
                        const baseLng = order.shippingAddress.lng || 77.6412;

                        const curLat = order.liveLocation?.lat || baseLat + 0.01;
                        const curLng = order.liveLocation?.lng || baseLng + 0.01;

                        const latDiff = baseLat - curLat;
                        const lngDiff = baseLng - curLng;

                        const stepSize = 0.0005;

                        let newLat = curLat;
                        let newLng = curLng;

                        if (Math.abs(latDiff) > stepSize) {
                            newLat += Math.sign(latDiff) * stepSize;
                        } else {
                            newLat = baseLat;
                        }

                        if (Math.abs(lngDiff) > stepSize) {
                            newLng += Math.sign(lngDiff) * stepSize;
                        } else {
                            newLng = baseLng;
                        }

                        return {
                            ...order,
                            liveLocation: {
                                lat: newLat,
                                lng: newLng,
                                updatedAt: new Date().toISOString()
                            }
                        };
                    }
                    return order;
                });
                return updated ? nextOrders : prevOrders;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Login Action
    const login = async (email: string, pass: string): Promise<boolean> => {
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
        if (!found) {
            throw new Error("Invalid email or password");
        }
        setUser(found);
        localStorage.setItem("freshmart_user", JSON.stringify(found));
        localStorage.setItem("freshmart_auth_initialized", "true");
        toast.success(`Welcome back, ${found.name}!`);
        return true;
    };

    // Signup Action
    const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            throw new Error("Email address already registered");
        }

        const welcomeAddress = {
            _id: "addr-" + Math.random().toString(36).substring(2, 9),
            label: "Home",
            address: "Flat 402, Sea Breeze Apts, Carter Road, Bandra West",
            city: "Mumbai",
            state: "MH",
            zip: "400050",
            isDefault: true,
            lat: 19.0583,
            lng: 72.8215
        };

        const newUser = {
            _id: "user-" + Math.random().toString(36).substring(2, 9),
            name,
            email,
            password: pass,
            phone: "+91 99999 99999",
            avatar: "",
            addresses: [welcomeAddress],
            isAdmin: email.toLowerCase().includes("admin"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        localStorage.setItem("freshmart_user", JSON.stringify(newUser));
        localStorage.setItem("freshmart_auth_initialized", "true");

        // Add a fixed welcome product (first product) to cart as a welcome gift reaction
        if (products.length > 0) {
            const welcomeProduct = products[0];
            setCart([{ product: welcomeProduct, quantity: 1 }]);
            toast.success(`🎉 Account created! Welcome Gift: Added ${welcomeProduct.name} to your cart.`);
        } else {
            toast.success(`Account created successfully! Welcome, ${name}!`);
        }

        return true;
    };

    // Logout Action
    const logout = () => {
        setUser(null);
        localStorage.removeItem("freshmart_user");
        localStorage.setItem("freshmart_auth_initialized", "true");
        toast.success("Logged out successfully");
    };

    return (
        <AppContext.Provider value={{
            products,
            cart,
            orders,
            partners,
            user,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            placeOrder,
            updateOrderStatus,
            assignPartner,
            addPartner,
            togglePartnerActive,
            addProduct,
            updateProduct,
            markOutOfStock,
            addAddress,
            updateLiveLocation,
            currency,
            login,
            signup,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppContextProvider");
    }
    return context;
}

