
gsap.registerPlugin(ScrollTrigger);

// Reveal service blocks
gsap.utils.toArray(".service-item").forEach((el) => {
  gsap.fromTo(el, {opacity:0, y:50}, {
    opacity:1, y:0,
    duration:1,
    ease:"power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%"
    }
  });

  // Lazy load and reveal image
  const img = el.querySelector(".service-img");
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    onEnter: () => {
      if(img.dataset.src && !img.src) img.src = img.dataset.src;
      gsap.to(img, {opacity:1, scale:1, duration:1.2, ease:"power3.out"});
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
  // GSAP 3D Card Stacking (Services Page)
  // ==========================================
  const stackSection = document.getElementById("service-cards-section");
  const stackCards = gsap.utils.toArray(".service-stack-card");

  if (stackSection && stackCards.length > 0 && typeof gsap !== 'undefined') {
    
    // Hide subsequent cards and push them down out of view
    gsap.set(stackCards.slice(1), { yPercent: 100, opacity: 0 });

    let stackTl = gsap.timeline({
      scrollTrigger: {
        trigger: stackSection,
        start: "top 10%", 
        end: "+=" + ((stackCards.length - 1) * 100) + "%", 
        scrub: 1,      
        pin: true,
        invalidateOnRefresh: true // recalculates if user resizes window
      }
    });

    stackCards.forEach((card, index) => {
      if (index > 0) {
        // Bring the new card up
        stackTl.to(card, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        }, index - 1); 
        
        // Push the PREVIOUS card back slightly to create 3D depth
        stackTl.to(stackCards[index - 1], {
          scale: 0.95,
          yPercent: -3,
          opacity: 0.4,
          duration: 1,
          ease: "power2.out"
        }, index - 1); 
      }
    });
  }



  document.querySelectorAll('.accordion-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      if (!item) return;
      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
  }

  if (window.Swiper && document.querySelector('.testimonialSwiper')) {
    new Swiper('.testimonialSwiper', {
      loop: true,
      speed: 700,
      grabCursor: true,
      spaceBetween: 20,
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.testimonialSwiper .swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.testimonial-next',
        prevEl: '.testimonial-prev'
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        900: { slidesPerView: 1.15, centeredSlides: true },
        1200: { slidesPerView: 1.35, centeredSlides: true }
      }
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});