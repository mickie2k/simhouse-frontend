/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "dbqqhdaknxqdo.cloudfront.net",
			}
		],
	},
};

export default nextConfig;
