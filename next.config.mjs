/** @type {import('next').NextConfig} */
const nextConfig = {
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
