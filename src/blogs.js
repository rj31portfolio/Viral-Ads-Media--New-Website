/* =================================================================
   POST DATA — add an object here to publish a new article.
   Cards link to /blog-post?slug=<slug>.
================================================================= */

const POSTS = [
  {
    slug: "why-website-not-generating-leads",
    title: "Why Your Website Is Not Generating Leads (And How To Fix It)",
    excerpt: "Your website is more than an online brochure. It should attract the right audience, build trust, and convert visitors into potential customers.",
    category: "marketing",
    author: "Talia Brennan",
    date: "2026-04-02",
    readTime: "7 min read",
    seed: "vam-blog-1",
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/fl_preserve_transparency/v1786428386/why-your-website-not-generate-lead_gyybog.jpg?_s=public-apps",
  },
  {
    slug: "ultimate-seo-audit-checklist",
    title: "The Ultimate SEO Audit Checklist for Websites",
    excerpt: "Imagine you just built a stunning website for your business. The colors are perfect, the design is modern, and your contact forms are ready. But a month goes by, and your traffic is flat. Your phone is not ringing.",
    category: "SEO",
    author: "Sasha Verlin",
    date: "2026-03-11",
    readTime: "9 min read",
    seed: "vam-blog-2",
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/v1786431408/the-seo-audit-check-list_qtprul.png",
  },
  {
    slug: "ultimate-local-seo-checklist",
    title: "The Ultimate Local SEO Checklist for Business Owners",
    excerpt: "You have just opened the best local business in town. Your storefront looks amazing, your products are top-notch, and your team is ready to go. But when you look out the window, the street is empty.",
    category: "SEO",
    author: "Theo Calder",
    date: "2026-02-18",
    readTime: "8 min read",
    seed: "vam-nova",
    featured: true,
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/v1786432418/local-seo-check-list_gnsnpn.png",
  },
  {
    slug: "seo-vs-google-ads",
    title: "SEO vs Google Ads: Which One Actually Makes Sense for Your Business?",
    excerpt: "SEO and Google Ads are two of the most common ways companies try to show up when people search online. One builds organic visibility over time. The other buys you attention right away.",
    category: "marketing",
    author: "Mara Ibsen",
    date: "2026-01-22",
    readTime: "8 min read",
    seed: "vam-blog-4",
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/v1786432410/SEO-Vs-_Google_Ads_ejfizh.png",
  },
  {
    slug: "choose-right-digital-marketing-agency",
    title: "How To Choose The Right Digital Marketing Agency For Your Business",
    excerpt: "Choosing the right digital marketing agency is one of the most important decisions for any business looking to grow online. Today, customers search online before making buying decisions.",
    category: "marketing",
    author: "Marco Ueda",
    date: "2026-01-09",
    readTime: "9 min read",
    seed: "vam-blog-5",
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/v1786432423/digitalmarketingstragy_y9qwin.png",
  },
  {
    slug: "digital-marketing-strategy-small-businesses",
    title: "Digital Marketing Strategy For Small Businesses: How To Grow Your Brand Online",
    excerpt: "A few years ago, having a shop, office, or word-of-mouth referrals was enough for many businesses to grow. Today, things have changed.",
    category: "marketing",
    author: "Noah Reff",
    date: "2025-12-15",
    readTime: "7 min read",
    seed: "vam-blog-6",
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/v1786432423/digitalmarketingstragy_y9qwin.png",
  },
  {
    slug: "digital-marketing-mistakes-small-businesses",
    title: "Digital Marketing Mistakes Small Businesses Make (And How To Avoid Them)",
    excerpt: "Many small businesses have great products, excellent services, and passionate teams — yet they still struggle to grow online. The reason is often not the quality of their business.",
    category: "marketing",
    author: "Diego Marsh",
    date: "2025-12-03",
    readTime: "7 min read",
    seed: "vam-blog-7",
    imageUrl: "https://res.cloudinary.com/dq3izjr7b/image/upload/v1786432421/digitalamrketing_mistake_fwfxhg.png",
  },
];
  
  function picsum(seed, w, h, post = null) {
    // If post has imageUrl, use it
    if (post && post.imageUrl) {
        return post.imageUrl;
    }
    // Otherwise use picsum
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  }
  
  function formatDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  
  function initials(name) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    // Whole-page smooth scroll — delete this block if the host site
    // already runs its own ScrollSmoother instance.
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: reduceMotion ? 0 : 1.1,
      effects: true,
      normalizeScroll: true,
    });
  
    const featuredPost = POSTS.find((p) => p.featured) || POSTS[0];
    const allPosts = POSTS.filter((p) => p.slug !== featuredPost.slug);
    const categories = ["All", ...new Set(allPosts.map((p) => p.category))];
  
    const state = { category: "All", query: "", visibleCount: 6 };
    const BATCH = 3;
  
    renderFeatured(featuredPost);
    renderChips();
    renderGrid(true);
    wireSearch();
    wireNewsletter();
    runHeroEntrance(reduceMotion);
  
    // ---------------- render ----------------
  
    function renderFeatured(p) {
      const wrap = document.getElementById("featuredPost");
      wrap.innerHTML = `
        <a href="/blog-post/${p.slug}" class="media-card group block relative overflow-hidden rounded-sm bg-surface h-[42vh] lg:h-[58vh]" aria-label="Read ${p.title}">
          <img class="media-img" src="${picsum(p.seed, 1400, 1500, p)}" alt="" loading="lazy" decoding="async">
        </a>
        <div>
          <div class="flex items-center gap-3 mb-5">
            <span class="chip bg-accent text-ink">Featured</span>
            <span class="chip border border-line text-smoke">${p.category}</span>
          </div>
          <a href="/blog-post/${p.slug}" class="block group">
            <h2 class="font-display text-3xl lg:text-5xl tracking-wide leading-tight group-hover:text-accent transition-colors">${p.title}</h2>
          </a>
          <p class="text-smoke mt-4 max-w-lg leading-relaxed">${p.excerpt}</p>
          <div class="flex items-center gap-3 mt-6">
            <span class="w-8 h-8 rounded-full bg-line flex items-center justify-center font-mono text-[10px] text-bone">${initials(p.author)}</span>
            <p class="font-mono text-xs text-smoke uppercase tracking-wider">${p.author} · ${formatDate(p.date)} · ${p.readTime}</p>
          </div>
          <div class="flex items-center gap-6 mt-7">
            <a href="/blog-post/${p.slug}" class="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              Read Article <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
            ${p.relatedProject ? `<a href="/category-records/${p.relatedProject}" class="font-mono text-xs uppercase tracking-widest text-smoke hover:text-bone transition-colors">View the case study →</a>` : ""}
          </div>
        </div>`;
    }
  
    function renderChips() {
      const wrap = document.getElementById("filterChips");
      wrap.innerHTML = "";
      categories.forEach((cat) => {
        const count = cat === "All" ? allPosts.length : allPosts.filter((p) => p.category === cat).length;
        const btn = document.createElement("button");
        btn.className = `filter-chip ${cat === state.category ? "active" : ""}`;
        btn.textContent = `${cat} (${count})`;
        btn.addEventListener("click", () => {
          state.category = cat;
          state.visibleCount = 6;
          renderChips();
          renderGrid(false);
        });
        wrap.appendChild(btn);
      });
    }
  
    function getFiltered() {
      return allPosts.filter((p) => {
        const inCategory = state.category === "All" || p.category === state.category;
        const q = state.query.trim().toLowerCase();
        const inQuery = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
        return inCategory && inQuery;
      });
    }
    function renderGrid() {
    const filtered = getFiltered().slice(0, state.visibleCount);
    const grid = document.getElementById("blogGrid");
    grid.innerHTML = ""; // Remove previous cards
    filtered.forEach(p => {
      const card = document.createElement("a");
      card.href = `/blog-post/${p.slug}`;
      card.className = "media-card group block grid-item";
      card.innerHTML = `
        <div class="relative overflow-hidden rounded-sm bg-surface h-[32vh] lg:h-[36vh]">
          <img class="media-img" src="${picsum(p.seed, 900, 700, p)}" alt="" loading="lazy" decoding="async">
          <span class="chip absolute top-4 left-4 bg-ink/80 text-bone border border-line">${p.category}</span>
        </div>
        <h3 class="font-display text-xl lg:text-2xl tracking-wide mt-4 leading-tight group-hover:text-accent transition-colors">${p.title}</h3>
        <p class="text-smoke text-sm mt-2 leading-relaxed line-clamp-2">${p.excerpt}</p>
        <p class="font-mono text-[10px] text-smoke uppercase tracking-widest mt-3">${p.author} · ${formatDate(p.date)} · ${p.readTime}</p>`;
      grid.appendChild(card);
    });
  }
    document.getElementById("loadMoreBtn").addEventListener("click", () => {
      state.visibleCount += BATCH;
      renderGrid(false);
    });
  
    document.getElementById("resetFilters").addEventListener("click", () => {
      state.category = "All";
      state.query = "";
      state.visibleCount = 6;
      document.getElementById("searchInput").value = "";
      renderChips();
      renderGrid(false);
    });
  
    function wireSearch() {
    const input = document.getElementById("searchInput");
  
    // Listen for input in search box
    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      state.query = query;       // Update global state
      state.visibleCount = 6;    // Reset visible count
      renderGrid(false);         // Re-render grid with filter
  
      // Optionally highlight matching cards
      const cards = document.querySelectorAll("#blogGrid .media-card");
      cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const excerpt = card.querySelector("p").textContent.toLowerCase();
        if (title.includes(query) || excerpt.includes(query)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
  
      // Show "No Results" if nothing matches
      const filtered = getFiltered();
      document.getElementById("noResults").classList.toggle("hidden", filtered.length > 0);
    });
  
    // Pressing Enter could optionally jump to the first result
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = document.querySelector("#blogGrid .media-card");
        if (first) first.click();
      }
    });
  }function wireSearch() {
    const input = document.getElementById("searchInput");
  
    // Listen for input in search box
    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      state.query = query;       // Update global state
      state.visibleCount = 6;    // Reset visible count
      renderGrid(false);         // Re-render grid with filter
  
      // Optionally highlight matching cards
      const cards = document.querySelectorAll("#blogGrid .media-card");
      cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const excerpt = card.querySelector("p").textContent.toLowerCase();
        if (title.includes(query) || excerpt.includes(query)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
  
      // Show "No Results" if nothing matches
      const filtered = getFiltered();
      document.getElementById("noResults").classList.toggle("hidden", filtered.length > 0);
    });
  
    // Pressing Enter could optionally jump to the first result
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = document.querySelector("#blogGrid .media-card");
        if (first) first.click();
      }
    });
  }
  
    function wireNewsletter() {
      document.getElementById("newsletterForm").addEventListener("submit", (e) => {
        e.preventDefault();
        // No backend wired up — replace with a real subscribe call (Mailchimp,
        // Klaviyo, your own API, etc.) before shipping.
        document.getElementById("newsletterForm").classList.add("hidden");
        document.getElementById("newsletterSuccess").classList.remove("hidden");
      });
    }
  
    function runHeroEntrance(reduce) {
      const els = ["#heroEyebrow", "#heroTitle", "#heroTagline", "#heroSearchWrap"];
      if (reduce) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(els, { y: 24 });
      gsap.timeline()
        .to("#heroEyebrow", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to("#heroTitle", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.4")
        .to("#heroTagline", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to("#heroSearchWrap", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");
    }
  });
