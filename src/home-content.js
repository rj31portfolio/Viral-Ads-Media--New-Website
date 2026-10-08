(() => {
  const disclosure = document.getElementById('growth-disclosure');
  if (!disclosure) return;
  const refreshLayout = () => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    window.dispatchEvent(new Event('resize'));
  };
  disclosure.addEventListener('toggle', refreshLayout);
  disclosure.querySelector('.growth-collapse').addEventListener('click', () => {
    disclosure.open = false;
    const summary = disclosure.querySelector('summary');
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
})();
