import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { StarIcon, SparklesIcon, LeafIcon } from "lucide-react";

export default function Deals() {
    const { products, addToCart, currency } = useApp();

    // Select discounted products
    const dealProducts = products.filter(p => p.discount && p.discount > 0);

    return (
        <div className="pb-16 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="border-b border-app-border pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-app-green font-serif flex items-center gap-2">
                        <SparklesIcon className="size-8 text-app-orange animate-pulse" /> Flash Deals
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Super savings on fresh vegetables, snacks, and daily essentials.</p>
                </div>
            </div>

            {dealProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-app-border rounded-2xl">
                    <p className="text-lg font-bold text-zinc-800">No active deals right now</p>
                    <p className="text-sm text-zinc-500 mt-1">Check back later for fresh discounts!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dealProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl p-4 border border-orange-100 flex flex-col justify-between relative group hover:shadow-lg transition-all">
                            {product.isOrganic && (
                                <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 flex items-center gap-0.5">
                                    <LeafIcon className="size-2.5 fill-green-800" /> Organic
                                </span>
                            )}
                            <span className="absolute top-3 right-3 bg-app-orange text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full z-10">
                                Save {product.discount}%
                            </span>
                            <Link to={`/product/${product._id}`} className="block">
                                <div className="h-40 w-full mb-3 overflow-hidden rounded-xl bg-app-cream/30 flex-center">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full object-contain transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="flex items-center">
                                        <StarIcon className="size-3 text-app-warning fill-app-warning" />
                                        <span className="text-[11px] font-bold ml-0.5 text-zinc-900">{product.rating || "4.5"}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400">({product.reviewCount || "12"})</span>
                                </div>
                                <h3 className="font-semibold text-zinc-900 group-hover:text-app-green text-sm line-clamp-1 transition-colors">{product.name}</h3>
                                <p className="text-xs text-zinc-500 mb-3">{product.unit}</p>
                            </Link>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-zinc-950">{currency}{product.price.toFixed(2)}</span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-zinc-400 line-through">{currency}{product.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={(product.stock || 0) <= 0}
                                    className="px-3.5 py-1.5 bg-app-green hover:bg-app-green-light text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {(product.stock || 0) > 0 ? "Add" : "Out of Stock"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
