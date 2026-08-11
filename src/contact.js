
// Mobile menu


// Scroll progress
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
  if (scrollBar) scrollBar.style.width = pct + '%';
});

// Reveal animation
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-btn').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) other.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

// Form demo submit
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if (contactForm && formMsg) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    formMsg.textContent = 'Thank you! Your enquiry has been submitted. Replace this demo action with your backend or form service.';
    formMsg.classList.remove('hidden');
    contactForm.reset();
  });
}