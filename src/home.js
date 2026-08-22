// ==========================================
// CENTRALIZED & FILTERED SCRIPT FILE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
  // Register GSAP plugins globally
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
  }

  // ==========================================
  // 1. Smooth Scroll Initialization (Lenis)
  // ==========================================
  try {
      if (!/\/blog-post(?:\.html)?$/.test(window.location.pathname)) {
          const lenis = new Lenis({
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });

          if (typeof ScrollTrigger !== 'undefined') {
              lenis.on('scroll', ScrollTrigger.update);
          }

          if (typeof gsap !== 'undefined') {
              gsap.ticker.add((time) => { lenis.raf(time * 1000); });
              gsap.ticker.lagSmoothing(0);
          } else {
              function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
              requestAnimationFrame(raf);
          }
          window.lenis = lenis;
      }
  } catch(e) { console.error("Lenis Error:", e); }

  // ==========================================
  // 2. Image & Cursor Trail Animation (Medium & Large Screens Only)
  // ==========================================
  try {
      const section = document.getElementById("interactive-area");
      const pool = document.getElementById("cursor-pool");

      if (section && pool && window.innerWidth >= 768) {
        const cursorImages = [
            "./Assets/Graphics/11.jpg", "./Assets/Graphics/2.jpg", "./Assets/Graphics/3.jpg",
            "./Assets/Graphics/4.jpg", "./Assets/Graphics/5.jpg", "./Assets/Graphics/6.jpg",
            "./Assets/Graphics/7.jpg", "./Assets/Graphics/8.jpg", "./Assets/Graphics/9.jpg", "./Assets/Graphics/10.jpg",
            "./Assets/Graphics/12.jpg", "./Assets/Graphics/13.jpg", "./Assets/Graphics/14.jpg", "./Assets/Graphics/15.jpg"
        ];

          let currentIndex = 0;
          let lastX = null;
          let lastY = null;
          let ticking = false;
          const distanceThreshold = 70;
          const removeDelay = 950;

          function createImageTrail(clientX, clientY) {
              const rect = section.getBoundingClientRect();
              const x = clientX - rect.left;
              const y = clientY - rect.top;

              const img = document.createElement("img");
              img.src = cursorImages[currentIndex];
              img.alt = "";
              img.className = "cursor-image";
              img.style.left = `${x}px`;
              img.style.top = `${y}px`;
              img.style.setProperty("--rotate", `${Math.random() * 18 - 9}deg`);

              img.onerror = function () {
                  this.onerror = null;
                  this.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&fit=crop";
              };

              pool.appendChild(img);
              currentIndex = (currentIndex + 1) % cursorImages.length;

              setTimeout(() => { img.remove(); }, removeDelay);
          }

          function handleMove(e) {
              if (ticking) return;
              ticking = true;

              requestAnimationFrame(() => {
                  const clientX = e.clientX;
                  const clientY = e.clientY;

                  if (lastX === null || lastY === null) {
                      lastX = clientX;
                      lastY = clientY;
                      createImageTrail(clientX, clientY);
                      ticking = false;
                      return;
                  }

                  const distance = Math.sqrt(Math.pow(clientX - lastX, 2) + Math.pow(clientY - lastY, 2));
                  if (distance > distanceThreshold) {
                      lastX = clientX;
                      lastY = clientY;
                      createImageTrail(clientX, clientY);
                  }
                  ticking = false;
              });
          }

          section.addEventListener("pointermove", handleMove);
          section.addEventListener("pointerleave", () => { lastX = null; lastY = null; });
      }
  } catch (e) {
      console.error("Cursor Trail Error:", e);
  }

  // ==========================================
  // 3. Toolkit / Services Section Horizontal Scroller
  // ==========================================
  try {
      const wrapper = document.querySelector("#wrapper");
      const section = document.querySelector("#scroll-section");

      if (wrapper && section && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          function getScrollAmount() {
              return wrapper.scrollWidth - window.innerWidth;
          }

          gsap.to(wrapper, {
              x: () => -getScrollAmount(),
              ease: "none",
              scrollTrigger: {
                  trigger: section,
                  pin: true,
                  scrub: 1.5,
                  start: "top top",
                  end: () => "+=" + getScrollAmount(),
                  invalidateOnRefresh: true,
              },
          });
      }
  } catch (e) { console.error("Horizontal Scroller Error:", e); }

  // ==========================================
  // 4. Selected Work Portfolio Animations
  // ==========================================
  try {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.to(".work-header", {
              scrollTrigger: {
                  trigger: "#selected-work",
                  start: "top 80%",
              },
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
          });

          gsap.utils.toArray(".work-card").forEach((card, i) => {
              gsap.to(card, {
                  scrollTrigger: {
                      trigger: card,
                      start: "top 85%",
                  },
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: "power3.out",
              });
          });

          gsap.to(".work-cta", {
              scrollTrigger: {
                  trigger: ".work-cta",
                  start: "top 90%",
              },
              opacity: 1,
              duration: 1,
              delay: 0.3,
              ease: "power2.out",
          });
      }
  } catch (e) { console.error("Selected Work Animation Error:", e); }

  // ==========================================
  // 5. Process Stacking Cards Animation 
  // ==========================================
try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const cards = gsap.utils.toArray(".process-card");

        // Use ScrollTrigger matchMedia for perfect responsive handling across screen sizes
        ScrollTrigger.matchMedia({
            
            // Desktop & Large Screens (>= 1024px)
            "(min-width: 1024px)": function() {
                cards.forEach((card, i) => {
                    if (i === 0) {
                        gsap.set(card, { y: 0, opacity: 1, scale: 1 });
                    } else {
                        gsap.set(card, { y: "100%", opacity: 0, scale: 1 });
                    }
                });

                let processTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#process",
                        start: "top top",
                        end: "+=2200",
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                cards.forEach((card, i) => {
                    if (i === 0) return;

                    processTl.to(card, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power2.out",
                    }, i);

                    for (let j = 0; j < i; j++) {
                        processTl.to(cards[j], {
                            scale: 0.92 - (i - 1 - j) * 0.03,
                            filter: "blur(3px)",
                            opacity: 0.35,
                            duration: 1,
                        }, i);
                    }
                });
            },

            // Mobile & Small Screens (< 1024px) - Clean animated scroll reveal instead of broken desktop pinning
            "(max-width: 1023px)": function() {
                cards.forEach((card, i) => {
                    gsap.set(card, { y: 0, opacity: 1, scale: 1 });
                    
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                });
            }
        });
    }
} catch (e) { 
    console.error("Process Cards Error:", e); 
}
  // ==========================================
  // 6. Achievements & Results Section Animations
  // ==========================================
  try {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.to(".achieve-header", {
              scrollTrigger: {
                  trigger: "#achievements-section",
                  start: "top 80%",
              },
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out"
          });

          gsap.utils.toArray(".achieve-card").forEach((card, i) => {
              gsap.to(card, {
                  scrollTrigger: {
                      trigger: card,
                      start: "top 85%",
                  },
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "power3.out"
              });
          });

          gsap.utils.toArray(".achieve-block").forEach((block) => {
              gsap.to(block, {
                  scrollTrigger: {
                      trigger: block,
                      start: "top 85%",
                  },
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "power3.out"
              });
          });

          const path = document.querySelector("#growth-path");
          if (path) {
              const length = path.getTotalLength();
              gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

              gsap.to(path, {
                  scrollTrigger: {
                      trigger: path,
                      start: "top 75%",
                  },
                  strokeDashoffset: 0,
                  duration: 2,
                  ease: "power2.out"
              });
          }
      }
  } catch (e) { console.error("Achievements Animation Error:", e); }

  // ==========================================
  // 7. Testimonials Swiper Initialization
  // ==========================================
  try {
      if (typeof Swiper !== 'undefined') {
          new Swiper(".testimonialSwiper", {
              slidesPerView: 1,
              spaceBetween: 24,
              loop: false,
              watchOverflow: true,
              autoHeight: false,
              autoplay: {
                  delay: 5000,
                  disableOnInteraction: false,
              },
              pagination: {
                  el: ".swiper-pagination",
                  clickable: true,
              },
              navigation: {
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
              },
              breakpoints: {
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
              },
          });
      }
  } catch (e) { console.error("Swiper Initialization Error:", e); }

  // ==========================================
  // 8. Scroll Intersections (Fade-Ups & Counters)
  // ==========================================
  try {
      function runCounter(el) {
          const countStr = el.getAttribute("data-count");
          if (!countStr) return;
          const end = parseInt(countStr);
          let current = 0;
          const duration = 1500;
          const startStamp = performance.now();

          function step(ts) {
              const progress = Math.min((ts - startStamp) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(end * ease);
              el.innerText = current;
              if (progress < 1) requestAnimationFrame(step);
              else el.innerText = end;
          }
          requestAnimationFrame(step);
      }

      function animateOnScroll() {
          const elements = document.querySelectorAll(".fade-up");
          const viewHeight = window.innerHeight;

          elements.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.top < viewHeight - 50) {
                  el.classList.add("faded-in");
                  if (el.classList.contains("counter") && !el.classList.contains("counted")) {
                      el.classList.add("counted");
                      runCounter(el);
                  } else if (el.querySelector(".counter") && !el.querySelector(".counter").classList.contains("counted")) {
                      const target = el.querySelector(".counter");
                      target.classList.add("counted");
                      runCounter(target);
                  }
              }
          });
      }

      window.addEventListener("scroll", animateOnScroll);
      animateOnScroll();
  } catch (e) {
      console.error("Scroll Intersections Error:", e);
  }

  // ==========================================
  // 9. Chart.js Initialization
  // ==========================================
  try {
      const canvas = document.getElementById("trafficChart");
      if (canvas && typeof Chart !== "undefined") {
          const ctx = canvas.getContext("2d");
          let gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(236, 77, 32, 0.25)");
          gradient.addColorStop(1, "rgba(236, 77, 32, 0.0)");

          new Chart(ctx, {
              type: "line",
              data: {
                  labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
                  datasets: [{
                      data: [10, 15, 22, 30, 45, 60, 80, 105, 140, 185, 240, 310],
                      borderColor: "#EC4D20",
                      backgroundColor: gradient,
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4,
                      pointRadius: function (ctx) {
                          return ctx.dataIndex === ctx.dataset.data.length - 1 ? 5 : 0;
                      },
                      pointBackgroundColor: "#EC4D20",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                  }],
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: {
                      x: { display: false },
                      y: { display: false, min: 0, max: 350 },
                  },
                  animation: { duration: 2000, easing: "easeOutQuart" },
              },
          });
      }
  } catch (e) {
      console.error("Chart Error:", e);
  }

  // ==========================================
  // 10. Contact Form GSAP Animation
  // ==========================================
  try {
      const contactLeft = document.querySelector(".gsap-left");
      if (contactLeft && typeof gsap !== "undefined") {
          const contactTl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: ".gsap-left" },
          });

          contactTl
              .fromTo(".gsap-left", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15 })
              .fromTo(".gsap-right", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.6");
      }
  } catch (e) {
      console.error("Contact Anim Error:", e);
  }

});

  // ==========================================
  // 10.  FAQ accordion interactive functionality
  // ==========================================

(function () {
  const faqToggles = document.querySelectorAll('#faq-accordion-list .faq-toggle');
  faqToggles.forEach((toggle, i) => {
    toggle.addEventListener('click', function () {
      const card = this.closest('.faq-card');
      const content = card.querySelector('.faq-content');
      const arrow = this.querySelector('.faq-arrow');
      const expanded = this.getAttribute('aria-expanded') === "true";

      // Collapse all others
      faqToggles.forEach((otherToggle, j) => {
        const otherCard = otherToggle.closest('.faq-card');
        const otherContent = otherCard.querySelector('.faq-content');
        const otherArrow = otherToggle.querySelector('.faq-arrow');
        otherToggle.setAttribute('aria-expanded', 'false');
        otherContent.style.display = 'none';
        otherArrow.classList.remove('rotate-180');
        otherArrow.classList.add('rotate-0');
        otherToggle.classList.remove('active');
      });

      // Expand this one if it was closed
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        content.style.display = (window.innerWidth < 768) ? "block" : "flex";
        arrow.classList.remove('rotate-0');
        arrow.classList.add('rotate-180');
        this.classList.add('active');
      }
    });
  });

  // Initialize correct state (expand first, collapse others)
  faqToggles.forEach((toggle, i) => {
    const card = toggle.closest('.faq-card');
    const content = card.querySelector('.faq-content');
    const arrow = toggle.querySelector('.faq-arrow');
    if (i === 0) {
      toggle.setAttribute('aria-expanded', 'true');
      content.style.display = (window.innerWidth < 768) ? "block" : "flex";
      arrow.classList.add('rotate-180');
      arrow.classList.remove('rotate-0');
      toggle.classList.add('active');
    } else {
      toggle.setAttribute('aria-expanded', 'false');
      content.style.display = "none";
      arrow.classList.add('rotate-0');
      arrow.classList.remove('rotate-180');
      toggle.classList.remove('active');
    }
  });

  // Handle responsive for FAQ content display on resize
  window.addEventListener('resize', function () {
    faqToggles.forEach((toggle, i) => {
      const card = toggle.closest('.faq-card');
      const content = card.querySelector('.faq-content');
      if (toggle.getAttribute('aria-expanded') === "true") {
        content.style.display = (window.innerWidth < 768) ? "block" : "flex";
      }
    });
  });
})();


// Clients we were served for 

const clients = [
    {
      name: "Allied Taps",
      logo: "Assets/brands/allied.png",
    },
  
    {
      name: "DD Carpet",
      logo: "Assets/brands/ddcarpet.png",
    },
  
    {
      name: "Drapple",
      logo: "Assets/brands/drapple.png",
    },
  
    {
      name: "E;ectric Universe",
      logo: "Assets/brands/electric universe.png",
    },
  
    {
      name: "Frendz Forever",
      logo: "Assets/brands/frendz_forever.png",
    },
  
    {
      name: "Glamfam",
      logo: "Assets/brands/Glamfam.png",
    },
  
    {
      name: "Hoot Beauty",
      logo: "Assets/brands/hoot beauty.png",
    },
  
    {
      name: "Ocean Beauty",
      logo: "Assets/brands/ocean beauty.png",
    },
  
    {
      name: "Pixel Cables",
      logo: "Assets/brands/pixel-cables.png",
    },
  
    {
      name: "Presco",
      logo: "Assets/brands/presco.png",
    },
  
    {
      name: "Saptron",
      logo: "Assets/brands/saptron.png",
    },
  
    {
      name: "SS Light",
      logo: "Assets/brands/ss light.png",
    },
  
    {
      name: "TDII",
      logo: "Assets/brands/tdii.png",
    },
  
    {
      name: "Tiptop",
      logo: "Assets/brands/tiptop.png",
    },
  
    {
      name: "Topson",
      logo: "Assets/brands/topson.png",
    },
  
    // {
    //   name: "Pixel Cable",
    //   logo: "Assets/brands/pixel.png",
    // },
  
    // {
    //   name: "Viral Ads",
    //   logo: "Assets/brands/viral.png",
    // },
  
    // {
    //   name: "Ocean Beauty",
    //   logo: "Assets/brands/ocean.png",
    // },
  
    // {
    //   name: "Saptron",
    //   logo: "Assets/brands/saptron.png",
    // },
  
    // {
    //   name: "Electric Universe",
    //   logo: "Assets/brands/electric.png",
    // },
  
    // add 30-50 logos here
  ];
  
  const grid = document.querySelector("#clientGrid");
  
  clients.forEach((client, index) => {
    const card = document.createElement("div");
  
    let positions = [
      "translate-x-[-300px] translate-y-[-80px]",
      "translate-x-[-180px] translate-y-[50px]",
      "translate-x-[0px] translate-y-[-150px]",
      "translate-x-[180px] translate-y-[80px]",
      "translate-x-[300px] translate-y-[-50px]",
    ];
  
    card.className = `
    
    absolute
    
    w-32
    h-32
    
    md:w-36
    md:h-36
    
    rounded-2xl
    
    bg-[#171426]
    
    border
    border-white/5
    
    flex
    items-center
    justify-center
    
    p-6
    
    transition-all
    duration-500
    
    hover:
    scale-110
    
    hover:
    bg-[#211b36]
    
    hover:
    shadow-[0_0_40px_rgba(168,85,247,.35)]
    
    `;
  
    let randomX = Math.random() * 700 - 350;
  
    let randomY = Math.random() * 350 - 175;
  
    card.style.transform = `
    translate(${randomX}px,${randomY}px)
    `;
  
    card.innerHTML = `
    
    <img
    
    src="${client.logo}"
    
    alt="${client.name}"
    
    class="
    max-h-14
    max-w-full
    object-contain
    brightness-0
    invert
    opacity-80
    hover:opacity-100
    transition
    "
    
    />
    
    `;
  
    grid.appendChild(card);
  });
  
  
  gsap.utils.toArray(".client-box").forEach((card,i)=>{

    gsap.to(card,{
    
    y: i%2===0 ? 8 : -8,
    
    duration:2.5,
    
    repeat:-1,
    
    yoyo:true,
    
    ease:"sine.inOut",
    
    delay:i*.15
    
    });
    
    
    });
