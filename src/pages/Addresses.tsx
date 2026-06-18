import { useState } from "react";
import { useApp } from "../context/AppContext";
import { MapPinIcon, PlusIcon, CompassIcon, ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Addresses() {
    const { user, addAddress } = useApp();
    const [label, setLabel] = useState("Home");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [lat, setLat] = useState("12.9716");
    const [lng, setLng] = useState("77.6412");
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!street || !city || !state || !zip) return;

        addAddress({
            label,
            address: street,
            city,
            state,
            zip,
            isDefault: user.addresses.length === 0,
            lat: parseFloat(lat) || 12.9716,
            lng: parseFloat(lng) || 77.6412,
        });

        // Reset
        setStreet("");
        setCity("");
        setState("");
        setZip("");
        setShowForm(false);
    };

    return (
        <div className="pb-16 max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-app-border pb-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/checkout"
                        className="p-2.5 bg-white hover:bg-app-cream border border-app-border text-zinc-500 rounded-xl transition-all"
                    >
                        <ArrowLeftIcon className="size-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-app-green font-serif">Manage Addresses</h1>
                        <p className="text-sm text-zinc-500 mt-1">Add or select delivery points for your groceries.</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-app-green hover:bg-app-green-light text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                    <PlusIcon className="size-4" /> Add Address
                </button>
            </div>

            {/* Form Drawer / Accordion */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white border border-app-border rounded-3xl p-6 space-y-4 shadow-sm animate-fade-in">
                    <h2 className="text-lg font-bold text-app-green mb-2">New Delivery Address</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Label Type</label>
                            <select
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm bg-white font-medium"
                            >
                                <option value="Home">Home 🏠</option>
                                <option value="Office">Office 🏢</option>
                                <option value="Gym">Gym 🏋️</option>
                                <option value="Friend">Friend's House 👥</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Street Address</label>
                            <input
                                required
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="e.g. 123 Main St, Indiranagar"
                                className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">City</label>
                            <input
                                required
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Bengaluru"
                                className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">State</label>
                                <input
                                    required
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="KA"
                                    maxLength={2}
                                    className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Zip Code / Pin Code</label>
                                <input
                                    required
                                    type="text"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    placeholder="560038"
                                    className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm"
                                />
                            </div>
                        </div>

                        {/* Coordinates (Useful for leaflet markers) */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><CompassIcon className="size-3.5" /> Latitude</label>
                                <input
                                    type="text"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><CompassIcon className="size-3.5" /> Longitude</label>
                                <input
                                    type="text"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-app-border outline-none focus:border-app-green text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white text-xs font-bold rounded-xl transition-all"
                        >
                            Save Address
                        </button>
                    </div>
                </form>
            )}

            {/* List of saved addresses */}
            <div className="grid sm:grid-cols-2 gap-4">
                {user.addresses.map((addr: any) => (
                    <div key={addr._id} className="bg-white rounded-3xl p-6 border border-app-border flex flex-col justify-between hover:shadow-md transition-shadow relative">
                        {addr.isDefault && (
                            <span className="absolute top-4 right-4 bg-orange-100 text-app-orange text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                                Default
                            </span>
                        )}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-app-green">
                                <MapPinIcon className="size-5" />
                                <span className="font-bold text-base text-zinc-950">{addr.label}</span>
                            </div>
                            <div className="text-zinc-600 text-sm">
                                <p className="font-medium text-zinc-800">{addr.address}</p>
                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-app-border/80 text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                            <span>LAT: {addr.lat.toFixed(4)}</span>
                            <span>·</span>
                            <span>LNG: {addr.lng.toFixed(4)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
