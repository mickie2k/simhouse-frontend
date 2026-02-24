"use client";

export default function HostingError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center px-6">
                <h2 className="text-2xl font-bold text-black2 mb-4">
                    Something went wrong!
                </h2>
                <p className="text-secondText mb-6">
                    Failed to load your simulators. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
