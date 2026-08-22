// <!-- DYNAMIC DATA & INJECTION SCRIPT -->


  const ALL_SERVICES_ARRAY = [
    { slug: "best-social-media-agency-in-delhi", title: "Social Media Marketing", icon: "fa-users" },
    { slug: "best-seo-agency-near-me", title: "Search Engine Optimization", icon: "fa-magnifying-glass" },
    { slug: "affordable-web-developer-in-delhi", title: "Website Designing", icon: "fa-display" },
    { slug: "best-performance-marketing-in-delhi", title: "Performance Marketing", icon: "fa-chart-line" },
    { slug: "affordable-logo-and-branding-near-me", title: "Logo & Branding", icon: "fa-pen-nib" },
    { slug: "best-influencer-marketing-in-delhi", title: "Influencer Marketing", icon: "fa-user-astronaut" },
    { slug: "proffessional-brand-shoots-in-delhi", title: "Brand Shoots", icon: "fa-camera-retro" },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Get everything after the "?" in the URL (e.g., gets "best-seo-agency-near-me")
    let slug = window.cleanUrlRoutes?.getRouteSlug("/service") || "";

    // 2. Default fallback if the page is opened without a query
    if (!slug) {
      slug = "best-social-media-agency-in-delhi";
    }
    const data = SINGLE_SERVICE_DATABASE[slug];

    if (!data) {
      document.getElementById("notFoundState").classList.remove("hidden");
      return;
    }

    // Apply page-specific SEO metadata from the service dataset.
    document.title = data.metaTitle || `${data.heading.replace(/<[^>]*>?/gm, '')} — Viral Ads Media`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && data.metaDescription) {
      descriptionMeta.setAttribute("content", data.metaDescription);
    }

    // Populate Hero Heading / Short Desc
    document.getElementById("servHeading").innerHTML = data.heading;
    document.getElementById("servShortDesc").textContent = data.shortDesc;

    // Populate Tools with Logo Images matching reference style
    const toolsGrid = document.getElementById("servToolsGrid");
    data.tools.forEach(tool => {
      const box = document.createElement("div");
      box.className = "bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-orange/50 transition-all aspect-square w-full max-w-[180px] mx-auto shadow-xl";
      box.innerHTML = `
        <div class="w-16 h-16 flex items-center justify-center bg-black/40 rounded-xl p-2 border border-white/5">
          <img src="${tool.logo}" alt="${tool.name}" class="w-full h-full object-contain">
        </div>
        <span class="font-bold text-sm text-white">${tool.name}</span>
      `;
      toolsGrid.appendChild(box);
    });

    // Populate Clients matching reference style
    const clientsLogoGrid = document.getElementById("servClientsLogoGrid");
    data.clients.forEach(cl => {
      const box = document.createElement("div");
      box.className = "bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 flex items-center justify-center h-32 w-full max-w-[200px] mx-auto hover:border-orange/50 transition-all shadow-xl";
      box.innerHTML = `
        <img src="${cl.logo}" alt="${cl.name}" class=" max-h-full object-contain  opacity-80 hover:opacity-100 transition duration-300">
      `;
      clientsLogoGrid.appendChild(box);
    });

    // Populate Portfolio Carousel with Hero Images (showing 3-4 items smoothly via Swiper)
    const carouselWrapper = document.getElementById("servPortfolioCarouselWrapper");
    data.portfolio.forEach(item => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="group block relative rounded-3xl overflow-hidden bg-surface border border-line aspect-[16/10] shadow-2xl">
          <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex items-end justify-between">
            <div>
              <span class="font-mono text-xs text-orange uppercase tracking-widest block mb-1">${item.client} · ${item.year}</span>
              <h3 class="text-2xl sm:text-4xl font-black text-white">${item.title}</h3>
            </div>
          </div>
        </div>
      `;
      carouselWrapper.appendChild(slide);
    });

    // Initialize Swiper for Portfolio Carousel with responsive breakpoints
    new Swiper('.clientPortfolioSwiper', {
      loop: true,
      speed: 800,
      grabCursor: true,
      spaceBetween: 24,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 1.15, centeredSlides: true },
        1024: { slidesPerView: 1.25, centeredSlides: true }
      }
    });

    // Populate Accordion FAQs
    const faqList = document.getElementById("servFaqList");
    data.faqs.forEach((faq, index) => {
      const item = document.createElement("div");
      item.className = "faq-item bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300";
      if (index === 0) item.classList.add("active");
      
      item.innerHTML = `
        <button type="button" class="faq-btn w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer">
          <span class="text-base sm:text-lg font-bold text-white">${faq.q}</span>
          <div class="faq-icon w-8 h-8 rounded-full border border-white/10 text-zinc-400 flex items-center justify-center transition-transform duration-300">
            <i class="fa-solid fa-plus text-xs"></i>
          </div>
        </button>
        <div class="faq-panel">
          <p class="px-6 pb-6 pt-2 text-zinc-400 text-sm leading-relaxed">${faq.a}</p>
        </div>
      `;

      // Accordion toggle listener
      const btn = item.querySelector('.faq-btn');
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });

      faqList.appendChild(item);
    });

    // Populate Other Services
  // Populate Other Services
  const otherGrid = document.getElementById("servOtherGrid");
  ALL_SERVICES_ARRAY.filter(s => s.slug !== slug).forEach(serv => {
    const card = document.createElement("a");
    
    // Update this line to match your ? format
    card.href = `/service/${serv.slug}`;
    
    card.className = "p-6 rounded-2xl bg-surface border border-line hover:border-orange/40 transition group flex flex-col justify-between";
    card.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center text-lg mb-4">
        <i class="fa-solid ${serv.icon}"></i>
      </div>
      <div>
        <h4 class="text-xl font-bold text-white group-hover:text-orange transition-colors mb-1">${serv.title}</h4>
        <span class="font-mono text-[10px] text-smoke uppercase tracking-wider">Explore Service →</span>
      </div>
    `;
    otherGrid.appendChild(card);
  });

  document.getElementById("serviceDetailMain").classList.remove("hidden");
});
