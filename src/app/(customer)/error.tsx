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
			<div className="text-center max-w-md">
				<div className="text-6xl mb-4">😕</div>
				<h2 className="text-3xl font-bold mb-3">Oops!</h2>
				<p className="text-gray-600 mb-6">
					We're having trouble loading this page. Please try again in a moment.
				</p>
				{process.env.NODE_ENV === 'development' && (
					<details className="text-left text-sm text-gray-500 mb-6 p-4 bg-gray-50 rounded">
						<summary className="cursor-pointer font-medium">Error Details (Dev Only)</summary>
						<p className="mt-2 font-mono text-xs">{error.message}</p>
					</details>
				)}
				<button
					onClick={reset}
					className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
				>
					Try Again
				</button>
			</div>
		</div>
	);
}
