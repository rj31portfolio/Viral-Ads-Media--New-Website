(() => {
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

  const FILE_TO_CLEAN_PATH = {
    "index.html": "/",
    "home.html": "/home",
    "about.html": "/about",
    "blogs.html": "/blogs",
    "blog-post.html": "/blog-post",
    "career.html": "/career",
    "category-records.html": "/category-records",
    "contact.html": "/contact",
    "industries.html": "/industries",
    "industry-detail.html": "/industry-detail",
    "portfolio.html": "/portfolio",
    "service.html": "/service",
    "services.html": "/services",
  };

  const DYNAMIC_ROUTE_CONFIG = {
    "service.html": {
      cleanBase: "/service",
      getSlug(url) {
        return url.search ? url.search.slice(1) : "";
      },
    },
    "blog-post.html": {
      cleanBase: "/blog-post",
      getSlug(url) {
        return url.searchParams.get("slug") || "";
      },
    },
    "category-records.html": {
      cleanBase: "/category-records",
      getSlug(url) {
        return url.search.slice(1).replace(/^id=/, "");
      },
    },
    "industry-detail.html": {
      cleanBase: "/industry-detail",
      getSlug(url) {
        return url.search ? url.search.slice(1) : "";
      },
    },
  };

  function normalizeServiceSlug(slug) {
    if (slug === "best-performance-marketing-in-delhi") {
      return "performance-marketing-agency-in-delhi";
    }
    if (slug === "affordable-logo-and-branding-near-me") {
      return "branding-agency-in-delhi";
    }
    if (slug === "affordable-web-developer-in-delhi") {
      return "website-designing-company-in-delhi";
    }
    if (slug === "best-seo-agency-near-me") {
      return "seo-agency-in-delhi-ncr";
    }
    return slug === "best-social-media-agency-in-delhi"
      ? "social-media-marketing-agency-in-delhi"
      : slug;
  }

  function buildCleanDynamicPath(fileName, slug) {
    const config = DYNAMIC_ROUTE_CONFIG[fileName];
    if (!config || !slug) {
      return null;
    }

    const routeSlug = fileName === "service.html" ? normalizeServiceSlug(slug) : slug;
    if (fileName === "service.html" && routeSlug === "performance-marketing-agency-in-delhi") {
      return "/service/performance-marketing-agency-in-delhi/";
    }
    if (fileName === "service.html" && routeSlug === "branding-agency-in-delhi") {
      return "/service/branding-agency-in-delhi/";
    }
    if (fileName === "service.html" && routeSlug === "website-designing-company-in-delhi") {
      return "/website-designing-company-in-delhi/";
    }
    return `${config.cleanBase}/${encodeURIComponent(routeSlug)}`;
  }

  function getPathSlug(basePath) {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    if (currentPath === basePath) {
      return "";
    }

    if (!currentPath.startsWith(`${basePath}/`)) {
      return "";
    }

    return decodeURIComponent(currentPath.slice(basePath.length + 1));
  }

  function getRouteSlug(basePath, fallbackSearchParam) {
    if (basePath === "/service" && window.location.pathname.replace(/\/+$/, "") === "/website-designing-company-in-delhi") {
      return "website-designing-company-in-delhi";
    }
    const pathSlug = getPathSlug(basePath);
    if (pathSlug) {
      return basePath === "/service" ? normalizeServiceSlug(pathSlug) : pathSlug;
    }

    if (fallbackSearchParam) {
      const searchSlug = new URLSearchParams(window.location.search).get(fallbackSearchParam);
      if (searchSlug) {
        return searchSlug;
      }
    }

    const rawSearch = window.location.search.startsWith("?")
      ? window.location.search.slice(1)
      : window.location.search;

    const querySlug = rawSearch.replace(/^id=/, "");
    return basePath === "/service" ? normalizeServiceSlug(querySlug) : querySlug;
  }

  function toCleanHref(rawHref) {
    if (!rawHref || rawHref.startsWith("#")) {
      return rawHref;
    }

    try {
      const url = new URL(rawHref, window.location.origin);
      if (url.origin !== window.location.origin) {
        return rawHref;
      }

      if (/^\/service\/(?:best-performance-marketing-in-delhi|performance-marketing-agency-in-delhi)\/?$/.test(url.pathname)) {
        return `/service/performance-marketing-agency-in-delhi/${url.hash}`;
      }

      if (/^\/service\/(?:affordable-logo-and-branding-near-me|branding-agency-in-delhi)\/?$/.test(url.pathname)) {
        return `/service/branding-agency-in-delhi/${url.hash}`;
      }

      if (/^\/service\/(?:affordable-web-developer-in-delhi|website-designing-company-in-delhi)\/?$/.test(url.pathname)) {
        return `/website-designing-company-in-delhi/${url.hash}`;
      }

      const fileName = url.pathname.split("/").pop();
      if (!fileName) {
        return rawHref;
      }

      const dynamicPath = buildCleanDynamicPath(fileName, DYNAMIC_ROUTE_CONFIG[fileName]?.getSlug(url));
      if (dynamicPath) {
        return `${dynamicPath}${url.hash}`;
      }

      if (!(fileName in FILE_TO_CLEAN_PATH)) {
        return rawHref;
      }

      return `${FILE_TO_CLEAN_PATH[fileName]}${url.search}${url.hash}`;
    } catch {
      return rawHref;
    }
  }

  function rewriteAnchors(root = document) {
    root.querySelectorAll("a[href]").forEach((anchor) => {
      const currentHref = anchor.getAttribute("href");
      const cleanHref = toCleanHref(currentHref);
      if (cleanHref && cleanHref !== currentHref) {
        anchor.setAttribute("href", cleanHref);
      }
    });
  }

  function replaceCurrentUrl() {
    if (/^\/service\/(?:best-performance-marketing-in-delhi|performance-marketing-agency-in-delhi)\/?$/.test(window.location.pathname)) {
      window.history.replaceState({}, "", `/service/performance-marketing-agency-in-delhi/${window.location.hash}`);
      return;
    }
    if (/^\/service\/(?:affordable-logo-and-branding-near-me|branding-agency-in-delhi)\/?$/.test(window.location.pathname)) {
      window.history.replaceState({}, "", `/service/branding-agency-in-delhi/${window.location.hash}`);
      return;
    }
    if (/^\/(?:website-designing-company-in-delhi|service\/(?:affordable-web-developer-in-delhi|website-designing-company-in-delhi))\/?$/.test(window.location.pathname)) {
      window.history.replaceState({}, "", `/website-designing-company-in-delhi/${window.location.hash}`);
      return;
    }
    if (window.location.pathname.replace(/\/+$/, "") === "/service/best-seo-agency-near-me") {
      window.history.replaceState({}, "", `/service/seo-agency-in-delhi-ncr${window.location.hash}`);
      return;
    }
    if (window.location.pathname.replace(/\/+$/, "") === "/service/best-social-media-agency-in-delhi") {
      window.history.replaceState({}, "", `/service/social-media-marketing-agency-in-delhi${window.location.hash}`);
      return;
    }

    const fileName = window.location.pathname.split("/").pop();
    const cleanPath = FILE_TO_CLEAN_PATH[fileName];

    if (!cleanPath || window.location.pathname === cleanPath) {
      return;
    }

    const dynamicPath = buildCleanDynamicPath(fileName, DYNAMIC_ROUTE_CONFIG[fileName]?.getSlug(new URL(window.location.href)));
    const nextPath = dynamicPath || cleanPath;
    window.history.replaceState({}, "", `${nextPath}${window.location.hash}`);
  }

  window.cleanUrlRoutes = Object.freeze({
    routes: ROUTES,
    toCleanHref,
    getRouteSlug,
  });

  document.addEventListener("DOMContentLoaded", () => {
    replaceCurrentUrl();
    rewriteAnchors();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
          }

          if (node.matches && node.matches("a[href]")) {
            rewriteAnchors(node.parentElement || document);
            return;
          }

          rewriteAnchors(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();
