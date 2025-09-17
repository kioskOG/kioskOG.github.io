
// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Subtle tilt following mouse (performance-safe)
document.querySelectorAll('.project-card').forEach(card => {
  let rAF = null;
  const onMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      card.style.transform = `translateY(-4px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
    });
  };
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Gentle parallax of the hero orb using mouse position
(function(){
  let raf;
  window.addEventListener('mousemove', (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      document.body.style.setProperty('--orbX', (x*3).toFixed(2)+'%');
      document.body.style.setProperty('--orbY', (y*3).toFixed(2)+'%');
    });
  });
})();
