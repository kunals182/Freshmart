export default function Loading() {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <div className="size-10 rounded-full border-4 border-app-cream-dark border-t-app-green animate-spin" />
            <p className="text-sm font-medium text-app-text-light animate-pulse-soft">Loading...</p>
        </div>
    );
}
