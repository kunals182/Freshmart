import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { heroSectionData, categoriesData, appPromoBannerData } from "../assets/assets";
import { StarIcon, SparklesIcon, LeafIcon } from "lucide-react";

export default function Home() {
    const { products, addToCart, currency } = useApp();

    // Show a selection of organic / top products
    const featuredProducts = products.slice(0, 8);
    const dealProducts = products.filter(p => p.discount && p.discount > 0).slice(0, 4);

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden bg-app-green text-white min-h-[480px] flex items-center p-8 md:p-16">
                <img
                    src={heroSectionData.hero_image}
                    alt="Hero BG"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
                <div className="relative z-10 max-w-2xl space-y-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-orange-400 backdrop-blur-sm">
                        <SparklesIcon className="size-3.5" /> Direct From Local Farms
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-serif leading-tight">
                        Fresh Groceries <br />
                        <span className="text-app-orange">Delivered in Minutes</span>
                    </h1>
                    <p className="text-lg text-zinc-300 font-medium max-w-lg">
                        {heroSectionData.description}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4">
                        <Link
                            to="/products"
                            className="px-8 py-3.5 bg-app-orange text-white font-bold rounded-xl hover:bg-app-orange-dark transition-all text-center shadow-lg active:scale-[0.98]"
                        >
                            Shop Groceries Now
                        </Link>
                        <Link
                            to="/deals"
                            className="px-8 py-3.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-center backdrop-blur-sm"
                        >
                            View Deals
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-1">
                {heroSectionData.hero_features.map((feat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-app-border flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-sm">
                        <div className="size-12 rounded-xl bg-green-50 text-app-green-lighter flex-center shrink-0">
                            <feat.icon className="size-6 text-green-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-900 text-sm">{feat.title}</h3>
                            <p className="text-xs text-app-text-light">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Categories Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-app-green font-serif">Browse Categories</h2>
                    <Link to="/products" className="text-sm font-semibold text-app-orange hover:text-app-orange-dark transition-colors">
                        See All Products →
                    </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                    {categoriesData.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            className="group flex flex-col items-center gap-2 text-center"
                        >
                            <div className="size-20 rounded-full border border-app-border bg-white overflow-hidden flex-center p-3 transition-all group-hover:scale-105 group-hover:border-app-green-lighter group-hover:shadow-md">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-700 group-hover:text-app-green transition-colors leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Deals Spotlight */}
            {dealProducts.length > 0 && (
                <section className="bg-orange-50/50 rounded-3xl p-6 md:p-8 border border-orange-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-app-green font-serif flex items-center gap-2">
                                <SparklesIcon className="size-6 text-app-orange animate-pulse" /> Flash Deals
                            </h2>
                            <p className="text-xs text-app-text-light">Grab them before they are gone!</p>
                        </div>
                        <Link to="/deals" className="text-sm font-semibold text-app-orange hover:text-app-orange-dark transition-colors">
                            More Deals →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dealProducts.map(product => (
                            <div key={product._id} className="bg-white rounded-2xl p-4 border border-orange-100/50 flex flex-col justify-between relative group hover:shadow-lg transition-all">
                                <span className="absolute top-3 left-3 bg-app-orange text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full z-10">
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
                                    <h3 className="font-semibold text-zinc-900 group-hover:text-app-green text-sm line-clamp-1 transition-colors">{product.name}</h3>
                                    <p className="text-xs text-zinc-500 mb-2">{product.unit}</p>
                                </Link>

                                <div>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-lg font-bold text-zinc-950">{currency}{product.price.toFixed(2)}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-zinc-400 line-through">{currency}{product.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full py-2.5 bg-app-green hover:bg-app-green-light text-white text-xs font-bold rounded-xl transition-colors active:scale-[0.98]"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Organic Produce */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-app-green font-serif">Featured Produce</h2>
                        <p className="text-xs text-app-text-light">Fresh, healthy, and organic essentials</p>
                    </div>
                    <Link to="/products" className="text-sm font-semibold text-app-orange hover:text-app-orange-dark transition-colors">
                        Browse All →
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl p-4 border border-app-border flex flex-col justify-between relative group hover:shadow-lg transition-all">
                            {product.isOrganic && (
                                <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 flex items-center gap-0.5">
                                    <LeafIcon className="size-2.5 fill-green-800" /> Organic
                                </span>
                            )}
                            <Link to={`/product/${product._id}`} className="block">
                                <div className="h-44 w-full mb-3 overflow-hidden rounded-xl bg-app-cream/30 flex-center">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full object-contain transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 mb-1.5">
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
                                <span className="text-lg font-bold text-zinc-950">{currency}{product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock <= 0}
                                    className="px-4 py-2 bg-app-green hover:bg-app-green-light text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                >
                                    {product.stock > 0 ? "Add" : "Out of Stock"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* App Promo Banner */}
            <section className="bg-linear-to-r from-app-green-light to-app-green rounded-3xl text-white p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4 max-w-xl">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-serif">{appPromoBannerData.title}</h2>
                    <p className="text-zinc-300 text-sm leading-relaxed">{appPromoBannerData.description}</p>
                    <div className="flex gap-3 pt-2">
                        <a href="#" className="h-10 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-full" /></a>
                        <a href="#" className="h-10 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-full" /></a>
                    </div>
                </div>
                <div className="relative md:w-1/3 flex-center">
                    <div className="size-48 bg-white/5 rounded-full blur-2xl absolute" />
                    <img
                        src="https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vy1xa7zovcu22smzapzv.png"
                        alt="Promo Cart"
                        className="w-40 animate-pulse-soft"
                    />
                </div>
            </section>
        </div>
    );
}
