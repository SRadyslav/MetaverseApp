/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
}

module.exports = nextConfig;

const withTM = require("next-transpile-modules")(["three"]);
module.exports = withTM();
