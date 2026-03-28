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
			},
			{
				protocol: "http",
				hostname: "simhouse-backend-env.eba-cypjwp4e.ap-southeast-1.elasticbeanstalk.com",
			}
		],
	},
};

export default nextConfig;
