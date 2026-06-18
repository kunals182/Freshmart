import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import DummyReviewsSection from "../components/DummyReviewsSection";
import { ArrowLeftIcon, StarIcon, ShieldCheckIcon, TruckIcon, LeafIcon, PlusIcon, MinusIcon } from "lucide-react";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, currency } = useApp();
    const [qty, setQty] = useState(1);

    const product = products.find(p => p._id === id);

    useEffect(() => {
        // Reset quantity when product changes
        setQty(1);
    }, [id]);

    if (!product) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-bold text-zinc-900 mb-4">Product not found</p>
                <Link to="/products" className="px-6 py-2 bg-app-green text-white rounded-xl font-bold">
                    Back to Products
                </Link>
            </div>
        );
    }

    // Related products of same category (excluding current)
    const relatedProducts = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

    return (
        <div className="pb-16 space-y-12 animate-fade-in">
            {/* Navigation and breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 bg-white hover:bg-app-cream border border-app-border text-zinc-500 rounded-xl transition-all"
                >
                    <ArrowLeftIcon className="size-5" />
                </button>
                <div className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
                    <Link to="/products" className="hover:text-app-green transition-colors">Products</Link>
                    <span>/</span>
                    <span className="capitalize text-zinc-400">{product.category.replace("-", " & ")}</span>
                    <span>/</span>
                    <span className="text-zinc-800 line-clamp-1">{product.name}</span>
                </div>
            </div>

            {/* Layout Column */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start bg-white rounded-3xl p-6 md:p-8 border border-app-border">
                {/* Left - Image */}
                <div className="w-full h-80 md:h-[420px] overflow-hidden rounded-2xl bg-app-cream/35 flex-center border border-app-border relative group">
                    {product.isOrganic && (
                        <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full z-10 flex items-center gap-1">
                            <LeafIcon className="size-3 fill-green-800" /> Organic
                        </span>
                    )}
                    {product.discount > 0 && (
                        <span className="absolute top-4 right-4 bg-app-orange text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full z-10">
                            Save {product.discount}%
                        </span>
                    )}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Right - Product Specs */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-app-green font-serif">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <StarIcon key={s} className={`size-4 ${s <= Math.round(product.rating || 4.5) ? "text-app-warning fill-app-warning" : "text-app-border"}`} />
                                ))}
                                <span className="text-sm font-bold ml-1 text-zinc-900">{product.rating || "4.5"}</span>
                            </div>
                            <span className="text-zinc-400">·</span>
                            <span className="text-xs text-zinc-500 font-semibold">{product.reviewCount || "12"} verified buyer reviews</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-app-cream/40 border border-app-border flex items-center justify-between">
                        <div>
                            <span className="text-xs text-app-text-light font-medium block">Price per unit ({product.unit})</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-extrabold text-zinc-950">{currency}{product.price.toFixed(2)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-zinc-400 line-through font-medium">{currency}{product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="text-xs text-app-text-light font-medium block text-right">Availability</span>
                            <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-semibold rounded-full ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {product.stock > 0 ? `${product.stock} units in stock` : "Out of Stock"}
                            </span>
                        </div>
                    </div>

                    {/* Quantity Selector and Action */}
                    {product.stock > 0 ? (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex items-center border border-app-border rounded-xl bg-white p-1 select-none shrink-0 w-full sm:w-fit justify-between">
                                <button
                                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                                    className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-app-cream"
                                >
                                    <MinusIcon className="size-4" />
                                </button>
                                <span className="w-12 text-center text-sm font-bold text-zinc-800">{qty}</span>
                                <button
                                    onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                                    className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-app-cream"
                                >
                                    <PlusIcon className="size-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => addToCart(product, qty)}
                                className="flex-1 py-3 bg-app-green hover:bg-app-green-light text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Add to Cart — {(currency + (product.price * qty).toFixed(2))}
                            </button>
                        </div>
                    ) : (
                        <div className="py-3 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold text-center">
                            This item is currently out of stock. We are replenishing it soon!
                        </div>
                    )}

                    {/* Features checklist */}
                    <div className="grid grid-cols-2 gap-4 border-t border-app-border pt-6 text-sm text-zinc-600">
                        <div className="flex items-center gap-2">
                            <TruckIcon className="size-4.5 text-app-green shrink-0" />
                            <span>Same Day Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="size-4.5 text-app-green shrink-0" />
                            <span>100% Quality Guarantee</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold text-app-green text-sm">Description</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            {product.description || "Fresh from our farms, premium hand-picked selection. High standards of hygiene, storage, and processing ensures safety and quality."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <DummyReviewsSection product={product} />

            {/* Recommendations Grid */}
            {relatedProducts.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-app-green font-serif">You May Also Like</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(prod => (
                            <div key={prod._id} className="bg-white rounded-2xl p-4 border border-app-border flex flex-col justify-between relative group hover:shadow-lg transition-all">
                                {prod.isOrganic && (
                                    <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 flex items-center gap-0.5">
                                        <LeafIcon className="size-2.5 fill-green-800" /> Organic
                                    </span>
                                )}
                                <Link to={`/product/${prod._id}`} className="block">
                                    <div className="h-40 w-full mb-3 overflow-hidden rounded-xl bg-app-cream/30 flex-center">
                                        <img
                                            src={prod.image}
                                            alt={prod.name}
                                            className="h-full object-contain transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-zinc-900 group-hover:text-app-green text-sm line-clamp-1 transition-colors">{prod.name}</h3>
                                    <p className="text-xs text-zinc-500 mb-3">{prod.unit}</p>
                                </Link>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-lg font-bold text-zinc-950">{currency}{prod.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => addToCart(prod)}
                                        className="px-3 py-1.5 bg-app-green hover:bg-app-green-light text-white text-xs font-bold rounded-xl transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
