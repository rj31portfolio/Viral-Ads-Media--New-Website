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

  function buildCleanDynamicPath(fileName, slug) {
    const config = DYNAMIC_ROUTE_CONFIG[fileName];
    if (!config || !slug) {
      return null;
    }

    return `${config.cleanBase}/${encodeURIComponent(slug)}`;
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
    const pathSlug = getPathSlug(basePath);
    if (pathSlug) {
      return pathSlug;
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

    return rawSearch.replace(/^id=/, "");
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