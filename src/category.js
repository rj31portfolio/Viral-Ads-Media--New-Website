

  const ALL_SERVICES_LIST = [
    { key: "affordable-web-developer-in-delhi", name: "Website Designing", icon: "fa-laptop-code" },
    { key: "best-performance-marketing-in-delhi", name: "Performance Marketing", icon: "fa-bullseye" },
    { key: "affordable-logo-and-branding-near-me", name: "Logo & Branding", icon: "fa-pen-nib" },
    { key: "best-influencer-marketing-in-delhi", name: "Influencer Marketing", icon: "fa-users" },
    { key: "best-seo-agency-near-me", name: "SEO Management", icon: "fa-magnifying-glass" },
    { key: "affordable-logo-and-branding-near-me", name: "Ads Campaign", icon: "fa-rocket" },
    { key: "best-social-media-agency-in-delhi", name: "Social Media", icon: "fa-share-nodes" },
    { key: "best-social-media-agency-in-delhi", name: "Social Media", icon: "fa-share-nodes" },
  ];


  document.addEventListener("DOMContentLoaded", () => {
    // 1. Extract the key directly from window.location.search (after the "?")
    let catKey = window.cleanUrlRoutes?.getRouteSlug("/category-records") || "";
    
    // 2. Fallback default if opened without query parameters
    if (!catKey) {
      catKey = "affordable-web-developer-in-delhi";
    }

    const data = CATEGORIES_DATA[catKey];

    if (!data) {
      document.getElementById("notFound").classList.remove("hidden");
      return;
    }

    // Populate Dynamic Content
    document.title = `${data.title} — Viral Ads Media`;
    document.getElementById("catHeroImg").src = data.heroImg;
    document.getElementById("catChip").textContent = data.chip;
    document.getElementById("catTitle").textContent = data.title;
    document.getElementById("catDescription").textContent = data.description;

    // Render Stats / Countdowns
    const statsGrid = document.getElementById("catStatsGrid");
    statsGrid.innerHTML = "";
    data.stats.forEach(st => {
      const box = document.createElement("div");
      box.className = "p-6 rounded-2xl bg-black border border-line";
      box.innerHTML = `
        <p class="font-display text-4xl lg:text-5xl text-accent mb-1">${st.value}</p>
        <p class="font-mono text-[10px] uppercase tracking-widest text-smoke">${st.label}</p>
      `;
      statsGrid.appendChild(box);
    });

    // Render Brands / Clients Records
    const clientsGrid = document.getElementById("catClientsGrid");
    clientsGrid.innerHTML = "";
    data.clients.forEach(cl => {
      const card = document.createElement("div");
      card.className = "p-8 rounded-2xl bg-surface border border-line flex flex-col justify-between hover:border-accent/40 transition-colors group";
      card.innerHTML = `
        <div>
          <div class="h-12 flex items-center mb-6">
            <img src="${cl.logo}" alt="${cl.name}" class="max-h-10 max-w-[140px] object-contain filter brightness-0 invert opacity-75 group-hover:opacity-100 transition-opacity">
          </div>
          <h3 class="font-display text-2xl tracking-wide mb-2 text-white">${cl.name}</h3>
          <p class="text-zinc-400 text-sm font-light leading-relaxed">${cl.desc}</p>
        </div>
        <div class="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-accent">
          <span>Verified Record</span>
          <i class="fa-solid fa-circle-check text-[10px]"></i>
        </div>
      `;
      clientsGrid.appendChild(card);
    });

    // Render Case Studies
    const csGrid = document.getElementById("catCaseStudiesGrid");
    csGrid.innerHTML = "";
    data.caseStudies.forEach(cs => {
      const item = document.createElement("a");
      item.href = `/category-records/${catKey}`;
      item.className = "group block relative rounded-2xl overflow-hidden bg-surface border border-line";
      item.innerHTML = `
        <div class="relative aspect-[16/10] overflow-hidden">
          <img src="${cs.img}" alt="${cs.title}" class="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between">
          <div>
            <span class="font-mono text-xs text-accent uppercase tracking-widest block mb-1">${cs.client} · ${cs.year}</span>
            <h3 class="font-display text-2xl sm:text-3xl text-white group-hover:text-accent transition-colors">${cs.title}</h3>
          </div>
        </div>
      `;
      csGrid.appendChild(item);
    });

    // Render Other Services (Excluding current)
    const otherGrid = document.getElementById("otherServicesGrid");
    otherGrid.innerHTML = "";
    ALL_SERVICES_LIST.filter(s => s.key !== catKey).forEach(serv => {
      const servCard = document.createElement("a");
      servCard.href = `/category-records/${serv.key}`;
      servCard.className = "p-6 rounded-2xl bg-surface border border-line hover:border-accent/40 transition group flex flex-col justify-between";
      servCard.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg mb-4">
          <i class="fa-solid ${serv.icon}"></i>
        </div>
        <div>
          <h4 class="font-display text-xl text-white group-hover:text-accent transition-colors mb-1">${serv.name}</h4>
          <span class="font-mono text-[10px] text-smoke uppercase tracking-wider">Explore Records →</span>
        </div>
      `;
      otherGrid.appendChild(servCard);
    });

    document.getElementById("categoryMain").classList.remove("hidden");
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  });