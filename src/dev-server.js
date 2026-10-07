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
  if (/^\/service\/brand-shoot-services-delhi(?:\/index\.html)?\/?$/.test(url.pathname)) {
    return `/service/brand-shoot-services-delhi/index.html${url.search}`;
  }
  if (/^\/service\/website-designing-company-in-delhi(?:\/index\.html)?\/?$/.test(url.pathname)) {
    return `/service/website-designing-company-in-delhi/index.html${url.search}`;
  }
  if (/^\/service\/influencer-marketing-agency-delhi(?:\/index\.html)?\/?$/.test(url.pathname)) {
    return `/service/influencer-marketing-agency-delhi/index.html${url.search}`;
  }
  const resolvedPath = ROUTES[url.pathname];

  if (resolvedPath) {
    return `${resolvedPath}${url.search}`;
  }

  for (const route of DYNAMIC_ROUTE_RESOLVERS) {
    if (!url.pathname.startsWith(route.prefix)) {
      continue;
    }

    const slug = decodeURIComponent(url.pathname.slice(route.prefix.length)).replace(/\/+$/, "");
    if (!slug) {
      return requestUrl;
    }

    return `${route.resolve(slug)}${url.hash}`;
  }

  return requestUrl;
}

function cleanUrlMiddleware(req, res, next) {
  const url = new URL(req.url || "/", "http://localhost");
  if (/^\/service\/proffessional-brand-shoots-in-delhi(?:\/index\.html)?\/?$/.test(url.pathname) ||
      (/^\/service(?:\.html)?\/?$/.test(url.pathname) &&
       ["proffessional-brand-shoots-in-delhi", "brand-shoot-services-delhi"].includes(url.search.slice(1).replace(/^id=/, "")))) {
    const search = url.pathname.startsWith("/service/") ? url.search : "";
    res.writeHead(301, { Location: `/service/brand-shoot-services-delhi/${search}` });
    res.end();
    return;
  }
  if (/^\/(?:website-designing-company-in-delhi|service\/affordable-web-developer-in-delhi)(?:\/index\.html)?\/?$/.test(url.pathname) ||
      (/^\/service(?:\.html)?\/?$/.test(url.pathname) &&
       ["affordable-web-developer-in-delhi", "website-designing-company-in-delhi"].includes(url.search.slice(1).replace(/^id=/, "")))) {
    const search = url.pathname.startsWith("/service/") ? url.search : "";
    res.writeHead(301, { Location: `/service/website-designing-company-in-delhi/${search}` });
    res.end();
    return;
  }
  if (/^\/(?:influencer-marketing-agency-delhi|service\/best-influencer-marketing-in-delhi)(?:\/index\.html)?\/?$/.test(url.pathname) ||
      (/^\/service(?:\.html)?\/?$/.test(url.pathname) &&
       ["best-influencer-marketing-in-delhi", "influencer-marketing-agency-delhi"].includes(url.search.slice(1).replace(/^id=/, "")))) {
    const search = url.pathname.startsWith("/service/") ? url.search : "";
    res.writeHead(301, { Location: `/service/influencer-marketing-agency-delhi/${search}` });
    res.end();
    return;
  }
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
  cleanUrlMiddleware,
};
