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
      if (!fileName || !(fileName in FILE_TO_CLEAN_PATH)) {
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

    window.history.replaceState({}, "", `${cleanPath}${window.location.search}${window.location.hash}`);
  }

  window.cleanUrlRoutes = Object.freeze({
    routes: ROUTES,
    toCleanHref,
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
