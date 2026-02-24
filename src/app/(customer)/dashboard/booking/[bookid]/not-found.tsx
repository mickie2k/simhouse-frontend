export default function BookingNotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
			<h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
			<p className="text-gray-600 mb-6 text-center">
				The booking you're looking for doesn't exist or you don't have permission to view it.
			</p>
			<a
				href="/dashboard"
				className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
			>
				Go to Dashboard
			</a>
		</div>
	);
}
