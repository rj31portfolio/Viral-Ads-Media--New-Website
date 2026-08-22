const browserSync = require("browser-sync").create();

const ROUTES = {
  "/": "/index.html",
  "/home": "/home.html",
  "/about": "/about.html",
  "/blogs": "/blogs.html",
  "/blog-post": "/blog-post.html",
  "/career": "/career.html",
  "/category-records": "/category-records.html",
  "/contact": "/contact.html",
  "/industries": "/industries.html",
  "/industry-detail": "/industry-detail.html",
  "/portfolio": "/portfolio.html",
  "/service": "/service.html",
  "/services": "/services.html",
};

function resolveRoute(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const resolvedPath = ROUTES[url.pathname];

  if (!resolvedPath) {
    return requestUrl;
  }

  return `${resolvedPath}${url.search}`;
}

function cleanUrlMiddleware(req, _res, next) {
  if (!req.url || req.url.includes(".")) {
    next();
    return;
  }

  req.url = resolveRoute(req.url);
  next();
}

if (require.main === module) {
  browserSync.init({
    server: {
      baseDir: ".",
      middleware: [cleanUrlMiddleware],
    },
    files: ["./**/*.{html,css,js}"],
    open: false,
    notify: false,
  });
}

module.exports = {
  ROUTES,
  resolveRoute,
};
