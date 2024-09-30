/** @type {import('next').NextConfig} */
const nextConfig = {
	rewrites: async () => [
		{
			source: "/auth/:path*",
			destination: "http://localhost:3001/auth/:path*", // Adjust the port
		},
	],
};

export default nextConfig;
