
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("hero");
  const floaters = document.querySelectorAll(".floater");
  const logo = document.getElementById("main-logo");

  // Use GSAP MatchMedia for clean cleanup and responsiveness
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Desktop: Interactive Mouse Follow
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;   
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to(logo, { rotateY: x, rotateX: -y, duration: 0.5 });
      floaters.forEach((f, i) => {
        gsap.to(f, { x: x * (i + 1) * 0.2, y: y * (i + 1) * 0.2, duration: 0.8 });
      });
    };
    hero.addEventListener("mousemove", handleMove);
    return () => hero.removeEventListener("mousemove", handleMove);
  });

  mm.add("(max-width: 767px)", () => {
    // Mobile: Gentle Float Animation
    gsap.to(floaters, {
      y: "-=20",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.5
    });
  });

  // Simple CSS-based rotation for the ring (most reliable for infinite loops)
  gsap.to("#text-ring", { rotation: 360, duration: 15, repeat: -1, ease: "none" });



  // marquee section js 
  // Pause marquee animation on hover (on the whole marquee)
  const marquee = document.getElementById('brand-marquee');
  marquee.addEventListener('mouseenter', () => { marquee.classList.add('paused'); });
  marquee.addEventListener('mouseleave', () => { marquee.classList.remove('paused'); });

  // Keyboard accessibility for focus styles
  document.querySelectorAll('.brand-item').forEach(item => {
    item.addEventListener('focus', () => item.classList.add('hover'));
    item.addEventListener('blur', () => item.classList.remove('hover'));
  });


  // where we contribute section 
  // Animation for text + image
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate text paragraphs sequentially
        entry.target.classList.add('active');
        entry.target.querySelectorAll('p').forEach((p, i) => {
          setTimeout(() => {
            p.classList.add('!opacity-100', '!translate-y-0');
            p.style.opacity = 1;
            p.style.transform = 'translateY(0)';
          }, i * 160);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Image reveal with scale up
  const imgReveal = document.querySelector('.reveal-img');
  if (imgReveal) {
    const imgObs = new IntersectionObserver((entries, ob) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgReveal.classList.add('!opacity-100');
          imgReveal.style.opacity = 1;
          imgReveal.style.transform = "scale(1)";
          ob.unobserve(imgReveal);
        }
      });
    }, { threshold: 0.25 });
    imgReveal.style.transform = "scale(0.92)";
    imgReveal.style.transition = "all 0.9s cubic-bezier(.22,1,.36,1.12)";
    imgObs.observe(imgReveal);
  }


  // contribute accordion

  const items = document.querySelectorAll(".acc-item");
  const preview = document.getElementById("preview");
  const wipe = document.getElementById("wipe");

  // Fix: rename images -> accordionImages for unique scoping
  const accordionImages = {
    "1": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "2": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    "3": "https://images.unsplash.com/photo-1551836022-deb4988cc6c0",
    "4": "https://images.unsplash.com/photo-1556761175-4b46a572b786"
  };

  function animateImage(id) {

    // set new image
    preview.src = accordionImages[id];

    // reset states
    gsap.set(preview, { opacity: 0, scale: 1.08 });
    gsap.set(wipe, { scaleX: 1 });

    // wipe animation
    gsap.to(wipe, {
      scaleX: 0,
      duration: 0.7,
      ease: "power4.inOut"
    });

    // image reveal
    gsap.to(preview, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.1
    });

  }

  // init first image
  animateImage("1");

  items.forEach((item) => {

    item.addEventListener("mouseenter", () => {

      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      animateImage(item.dataset.img);

    });

  });

  // exit reset
  document.getElementById("contribute").addEventListener("mouseleave", () => {

    gsap.to(preview, {
      opacity: 0,
      scale: 1.08,
      duration: 0.5
    });

    gsap.to(wipe, {
      scaleX: 1,
      duration: 0.5
    });

  });

  // 2 strips animation 

  function initMarquee(id, direction = 'left') {
    const el = document.getElementById(id);
    const inner = el.querySelector('.marquee-inner');
    inner.innerHTML += inner.innerHTML;

    // If direction is right, start at -50% and move to 0%
    const xFrom = direction === 'right' ? -50 : 0;
    const xTo = direction === 'right' ? 0 : -50;

    gsap.fromTo(
        inner,
        { xPercent: xFrom },
        {
            xPercent: xTo,
            ease: "none",
            repeat: -1,
            duration: 15
        }
    );
  }

  initMarquee('marquee1', 'left');   // Default: left-to-right (moves left)
  initMarquee('marquee2', 'right');  // Second strip: right-to-left (moves right)

  // project showcase section 

  const cursor = document.getElementById("cursor");
  const projects = document.querySelectorAll(".project");

  // Fix: rename images -> showcaseImages for unique scoping
  const showcaseImages = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  ];

  const layers = document.querySelectorAll(".bg-layer");

  // set backgrounds
  layers[0].style.backgroundImage = `url(${showcaseImages[0]})`;
  layers[1].style.backgroundImage = `url(${showcaseImages[1]})`;

  /* =========================
     CUSTOM CURSOR
  ========================== */

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      duration: 0.15,
      ease: "power2.out"
    });

  });

  projects.forEach((project) => {

    project.addEventListener("mouseenter", () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    });

    project.addEventListener("mouseleave", () => {
      gsap.to(cursor, { scale: 0, duration: 0.3 });
    });

  });

  /* =========================
     PARALLAX BACKGROUND SHIFT
  ========================== */

  projects.forEach((project, index) => {

    project.addEventListener("mousemove", (e) => {

      const rect = project.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const moveX = (x - 0.5) * 30;
      const moveY = (y - 0.5) * 30;

      const bg = project.querySelector(".bg-layer");

      gsap.to(bg, {
        backgroundPosition: `${50 + moveX}% ${50 + moveY}%`,
        duration: 0.8,
        ease: "power3.out"
      });

    });

  });


});