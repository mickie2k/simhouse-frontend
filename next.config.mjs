/** @type {import('next').NextConfig} */
const nextConfig = {
	rewrites: async () => [
		{
			source: "/auth/:path*",
			destination: "http://localhost:3001/auth/:path*", // Adjust the port
		},
	],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "simracingcockpit.gg",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "simhouse-backend-production.up.railway.app",
			},
		],
	},
};

export default nextConfig;
