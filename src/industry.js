

  const ALL_INDUSTRIES = [
    { name: "E-Commerce", slug: "affordable-e-commerce-website-development-services", icon: "fa-cart-shopping" },
    { name: "Healthcare", slug: "healthcare-marketing-services", icon: "fa-suitcase-medical" },
    { name: "Manufacturing", slug: "manufacturing-marketing-services", icon: "fa-industry" },
    { name: "Real Estate", slug: "real-estate-marketing-services", icon: "fa-building" },
    { name: "Education", slug: "education-marketing-services", icon: "fa-graduation-cap" },
    { name: "Fashion", slug: "fashion-marketing-services", icon: "fa-shirt" },
    { name: "Travel", slug: "travel-marketing-services", icon: "fa-plane" },
    { name: "Appliances", slug: "appliances-marketing-service", icon: "fa-blender" },
    { name: "Cosmetics", slug: "cosmetics-marketing-service", icon: "fa-wand-magic-sparkles" },
  ];

  document.addEventListener("DOMContentLoaded", () => {
   // 1. Extract the key directly from window.location.search (after the "?")
   let indSlug = window.cleanUrlRoutes?.getRouteSlug("/industry-detail") || "";
    
   // 2. Fallback default if opened without query parameters
   if (!indSlug) {
     indSlug = "affordable-e-commerce-website-development-services";
   }

   const data = PARTICULAR_INDUSTRIES[indSlug];

   if (!data) {
     document.getElementById("notFound").classList.remove("hidden");
     return;
   }

    // Populate Dynamic Content
    document.title = `${data.title.replace(/<[^>]*>?/gm, '')} — Viral Ads Media`;
    document.getElementById("indHeroImg").src = data.heroImg;
    document.getElementById("indChip").textContent = data.chip;
    document.getElementById("indTitle").innerHTML = data.title;
    document.getElementById("indDescription").textContent = data.description;

    // Render Stats
    const statsGrid = document.getElementById("indStatsGrid");
    data.stats.forEach(st => {
      const box = document.createElement("div");
      box.className = "p-6 rounded-2xl bg-black border border-line";
      box.innerHTML = `
        <p class="font-display text-4xl lg:text-5xl text-accent mb-1">${st.value}</p>
        <p class="font-mono text-[10px] uppercase tracking-widest text-smoke">${st.label}</p>
      `;
      statsGrid.appendChild(box);
    });

    // Render Brand Logos Only in Swiper Carousel
    const brandLogosWrapper = document.getElementById("indBrandLogosWrapper");
    data.brands.forEach(br => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="bg-[#0c0c0c] border border-white/10 rounded-2xl p-12 flex items-center justify-center h-36 w-full max-w-[220px]  mx-auto shadow-xl">
          <img src="${br.logo}" alt="${br.name}" class=" max-w-full object-contain  opacity-80 hover:opacity-100 transition duration-300">
        </div>
      `;
      brandLogosWrapper.appendChild(slide);
    });

    // Initialize Swiper for Brand Logos
    new Swiper('.brandLogoSwiper', {
      loop: true,
      speed: 800,
      grabCursor: true,
      spaceBetween: 24,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 4 }
      }
    });

    // Render Case Studies (Hero images only, no links)
    const csGrid = document.getElementById("indCaseStudiesGrid");
    data.caseStudies.forEach(cs => {
      const item = document.createElement("div");
      item.className = "group block relative rounded-2xl overflow-hidden bg-surface border border-line";
      item.innerHTML = `
        <div class="relative aspect-[16/10] overflow-hidden">
          <img src="${cs.img}" alt="${cs.title}" class="w-full h-full object-cover filter brightness-[0.85]">
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between">
          <div>
            <span class="font-mono text-xs text-accent uppercase tracking-widest block mb-1">${cs.client} · ${cs.year}</span>
            <h3 class="font-display text-2xl sm:text-3xl text-white">${cs.title}</h3>
          </div>
        </div>
      `;
      csGrid.appendChild(item);
    });

    // Render Other Industries
    const otherGrid = document.getElementById("otherIndustriesGrid");
    ALL_INDUSTRIES.filter(i => i.slug !== indSlug).forEach(ind => {
      const card = document.createElement("a");
      card.href = `/industry-detail/${ind.slug}`;
      card.className = "p-6 rounded-2xl bg-surface border border-line hover:border-accent/40 transition group flex flex-col justify-between";
      card.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg mb-4">
          <i class="fa-solid ${ind.icon}"></i>
        </div>
        <div>
          <h4 class="font-display text-xl text-white group-hover:text-accent transition-colors mb-1">${ind.name}</h4>
          <span class="font-mono text-[10px] text-smoke uppercase tracking-wider">Inspect Sector Records →</span>
        </div>
      `;
      otherGrid.appendChild(card);
    });

    document.getElementById("industryMain").classList.remove("hidden");
    ScrollTrigger.refresh();
  });