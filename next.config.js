/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "digital-market-production-4041.up.railway.app",
			},
		],
		
	},
};

module.exports = nextConfig;
