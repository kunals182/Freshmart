import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { categoriesData } from "../assets/assets";
import { StarIcon, LeafIcon, SlidersHorizontalIcon, ArrowUpDownIcon } from "lucide-react";

export default function Products() {
    const { products, addToCart, currency } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters states from search params
    const category = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";

    const [organicOnly, setOrganicOnly] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Sync categories changes from search params
    const handleCategoryClick = (slug: string) => {
        const params = new URLSearchParams(searchParams);
        if (slug) {
            params.set("category", slug);
        } else {
            params.delete("category");
        }
        setSearchParams(params);
    };

    // Filter logic
    const filteredProducts = products.filter(product => {
        // Category check
        if (category && product.category !== category) return false;

        // Search check
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        // Organic check
        if (organicOnly && !product.isOrganic) return false;

        // Stock check
        if (inStockOnly && (product.stock || 0) <= 0) return false;

        return true;
    }).sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating-desc") return (b.rating || 0) - (a.rating || 0);
        return 0; // default (no sorting)
    });

    return (
        <div className="pb-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-app-green font-serif">
                        {category ? categoriesData.find(c => c.slug === category)?.name : "All Groceries"}
                    </h1>
                    {searchQuery && (
                        <p className="text-sm text-zinc-500 mt-1">
                            Showing search results for <span className="font-semibold text-zinc-900">"{searchQuery}"</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="lg:hidden px-4 py-2 border border-app-border rounded-xl bg-white text-xs font-semibold text-zinc-700 flex items-center gap-1.5"
                    >
                        <SlidersHorizontalIcon className="size-3.5" /> Filters
                    </button>

                    <div className="flex items-center gap-2 border border-app-border rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-700 w-fit">
                        <ArrowUpDownIcon className="size-3.5 text-zinc-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer text-zinc-700"
                        >
                            <option value="default">Sort: Popularity</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating-desc">Customer Rating</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 items-start">
                {/* Left Sidebar Filters - Desktop */}
                <aside className="hidden lg:block w-64 shrink-0 bg-white border border-app-border rounded-2xl p-5 space-y-6 sticky top-24">
                    <div className="space-y-3">
                        <h3 className="font-bold text-app-green text-sm flex items-center gap-1.5"><SlidersHorizontalIcon className="size-4" /> Filters</h3>
                        <hr className="border-app-border" />
                    </div>

                    {/* Category List */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider">Categories</h4>
                        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                            <button
                                onClick={() => handleCategoryClick("")}
                                className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors font-medium ${!category ? "bg-app-green text-white" : "text-zinc-600 hover:bg-app-cream"}`}
                            >
                                All Categories
                            </button>
                            {categoriesData.map(cat => (
                                <button
                                    key={cat.slug}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center justify-between ${category === cat.slug ? "bg-app-green text-white" : "text-zinc-600 hover:bg-app-cream"}`}
                                >
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter checkboxes */}
                    <div className="space-y-3 pt-2">
                        <h4 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider">Preferences</h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-zinc-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={organicOnly}
                                    onChange={(e) => setOrganicOnly(e.target.checked)}
                                    className="size-4.5 rounded text-app-green border-app-border focus:ring-app-green"
                                />
                                <span>Organic Produce</span>
                            </label>
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-zinc-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="size-4.5 rounded text-app-green border-app-border focus:ring-app-green"
                                />
                                <span>In Stock Only</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Mobile Filters Drawer */}
                {mobileFiltersOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
                        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 p-6 flex flex-col gap-6 lg:hidden animate-slide-in-right">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-app-green text-sm">Filters</h3>
                                <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-500 hover:text-zinc-900 font-bold text-sm">Close</button>
                            </div>
                            <div className="space-y-6 overflow-y-auto flex-1">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider">Categories</h4>
                                    <div className="flex flex-col gap-1.5 pr-1">
                                        <button
                                            onClick={() => { handleCategoryClick(""); setMobileFiltersOpen(false); }}
                                            className={`text-left text-sm px-2.5 py-1.5 rounded-lg font-medium ${!category ? "bg-app-green text-white" : "text-zinc-600 hover:bg-app-cream"}`}
                                        >
                                            All Categories
                                        </button>
                                        {categoriesData.map(cat => (
                                            <button
                                                key={cat.slug}
                                                onClick={() => { handleCategoryClick(cat.slug); setMobileFiltersOpen(false); }}
                                                className={`text-left text-sm px-2.5 py-1.5 rounded-lg font-medium ${category === cat.slug ? "bg-app-green text-white" : "text-zinc-600 hover:bg-app-cream"}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <h4 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider">Preferences</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2.5 text-sm font-semibold text-zinc-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={organicOnly}
                                                onChange={(e) => setOrganicOnly(e.target.checked)}
                                                className="size-4.5 rounded text-app-green border-app-border focus:ring-app-green"
                                            />
                                            <span>Organic Produce</span>
                                        </label>
                                        <label className="flex items-center gap-2.5 text-sm font-semibold text-zinc-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={inStockOnly}
                                                onChange={(e) => setInStockOnly(e.target.checked)}
                                                className="size-4.5 rounded text-app-green border-app-border focus:ring-app-green"
                                            />
                                            <span>In Stock Only</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Right Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-app-border rounded-2xl">
                            <span className="text-4xl block mb-4">🔍</span>
                            <h3 className="text-lg font-bold text-zinc-900 mb-1">No products found</h3>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto">We couldn't find any items matching your current filters. Try relaxing your search criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="bg-white rounded-2xl p-4 border border-app-border flex flex-col justify-between relative group hover:shadow-lg transition-all">
                                    {product.isOrganic && (
                                        <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 flex items-center gap-0.5">
                                            <LeafIcon className="size-2.5 fill-green-800" /> Organic
                                        </span>
                                    )}
                                    {product.discount > 0 && (
                                        <span className="absolute top-3 right-3 bg-app-orange text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full z-10">
                                            -{product.discount}%
                                        </span>
                                    )}
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
                                            <span className="text-base font-bold text-zinc-950">{currency}{product.price.toFixed(2)}</span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-[10px] text-zinc-400 line-through">{currency}{product.originalPrice.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={(product.stock || 0) <= 0}
                                            className="px-3 py-1.5 bg-app-green hover:bg-app-green-light text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            {(product.stock || 0) > 0 ? "Add" : "Out of Stock"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
