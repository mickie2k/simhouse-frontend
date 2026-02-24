export default function HostingLoading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Skeleton */}
                <div className="h-9 w-48 bg-gray-200 rounded-lg mb-6 animate-pulse" />

                {/* Filter Tabs Skeleton */}
                <div className="flex gap-3 mb-8">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                        />
                    ))}
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add New Card Skeleton */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 min-h-[320px]">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse" />
                        <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Simulator Card Skeletons */}
                    {[...Array(7)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col border border-borderColor1 rounded-xl overflow-hidden"
                        >
                            <div className="h-48 w-full bg-gray-200 animate-pulse" />
                            <div className="flex flex-col p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="h-4 w-40 bg-gray-200 rounded mb-3 animate-pulse" />
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
