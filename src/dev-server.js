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

const DYNAMIC_ROUTE_RESOLVERS = [
  {
    prefix: "/service/",
    resolve: (slug) => `/service.html?${encodeURIComponent(slug)}`,
  },
  {
    prefix: "/blog-post/",
    resolve: (slug) => `/blog-post.html?slug=${encodeURIComponent(slug)}`,
  },
  {
    prefix: "/category-records/",
    resolve: (slug) => `/category-records.html?${encodeURIComponent(slug)}`,
  },
  {
    prefix: "/industry-detail/",
    resolve: (slug) => `/industry-detail.html?${encodeURIComponent(slug)}`,
  },
];

function resolveRoute(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const resolvedPath = ROUTES[url.pathname];

  if (resolvedPath) {
    return `${resolvedPath}${url.search}`;
  }

  for (const route of DYNAMIC_ROUTE_RESOLVERS) {
    if (!url.pathname.startsWith(route.prefix)) {
      continue;
    }

    const slug = decodeURIComponent(url.pathname.slice(route.prefix.length));
    if (!slug) {
      return requestUrl;
    }

    return `${route.resolve(slug)}${url.hash}`;
  }

  return requestUrl;
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