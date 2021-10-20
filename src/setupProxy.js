// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const { createProxyMiddleware } = require("http-proxy-middleware");

// eslint-disable-next-line no-undef
module.exports = function (app) {
  const proxy = createProxyMiddleware({
    target: "http://localhost:3001",
  });
  app.use("/api", proxy);
  app.use("/trpc", proxy);
};
