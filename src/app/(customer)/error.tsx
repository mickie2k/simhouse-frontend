"use client";

export default function CustomerError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
			<h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
			<p className="text-gray-600 mb-6 text-center">{error.message}</p>
			<button
				onClick={reset}
				className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
			>
				Try again
			</button>
		</div>
	);
}
