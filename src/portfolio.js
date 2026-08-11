gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector("#workTrack");
const pinWrap = document.querySelector("#workPinWrap");
const cards = gsap.utils.toArray(".work-card");
const progressFill = document.querySelector("#workProgressFill");

let scrollTween = null;

function initPortfolioAnimation() {
  if (scrollTween) {
    scrollTween.scrollTrigger.kill();
    scrollTween.kill();
    scrollTween = null;
  }

  // Only apply horizontal scroll pinning on desktop screens (>= 1024px)
  if (window.innerWidth >= 1024) {
    const getScrollAmount = () => {
      return Math.max(0, track.scrollWidth - window.innerWidth);
    };

    scrollTween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: pinWrap,
        start: "top top",
        end: () => "+=" + getScrollAmount(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (progressFill) {
            progressFill.style.width = `${self.progress * 100}%`;
          }
        }
      }
    });
  } else {
    // Reset horizontal offsets for small/mobile screens to stack vertically cleanly
    gsap.set(track, { clearProps: "x" });
  }

  ScrollTrigger.refresh();
}

window.addEventListener("load", () => {
  initPortfolioAnimation();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initPortfolioAnimation();
  }, 250);
});

// ENTRY STAGGER ANIMATION
gsap.from(cards, {
  opacity: 0,
  y: 30,
  stagger: 0.05,
  duration: 0.6,
  ease: "power3.out"
});

// HOVER EFFECT ON CARDS (Desktop interaction)
cards.forEach(card => {
  const img = card.querySelector(".work-img");

  card.addEventListener("mouseenter", () => {
    if (window.innerWidth >= 1024) {
      gsap.to(img, { scale: 1.08, duration: 0.6 });
    }
  });

  card.addEventListener("mouseleave", () => {
    if (window.innerWidth >= 1024) {
      gsap.to(img, { scale: 1, duration: 0.6 });
    }
  });
});