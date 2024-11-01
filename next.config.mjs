/** @type {import('next').NextConfig} */
const nextConfig = {
	rewrites: async () => [
		{
			source: "/auth/:path*",
			destination: "http://localhost:3001/auth/:path*", // Adjust the port
		},
	],
	images: {
		domains: ["simracingcockpit.gg", "localhost"], // Add your allowed domains here
	},
};

export default nextConfig;
