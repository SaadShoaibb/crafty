/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
    // Prevent Webpack from parsing native node modules (like `.node` binaries)
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    if (!isServer) {
      // If this is for client-side, ensure native modules are excluded
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
      });
    }

    return config;
  },
};

export default nextConfig;
