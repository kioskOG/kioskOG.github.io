/**
 * effects.js
 * Visual Redesign enhancements: Page Transitions, Canvas Particles, Theme Presets dropdown.
 * Compliance: respects prefers-reduced-motion and implements safe page transition exclusions.
 */
(function () {
  'use strict';

  // Global variables
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Listen to system changes for reduced motion
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      stopParticles();
      document.body.classList.remove('page-entering', 'page-exiting');
    } else {
      initParticles();
    }
  });

  // =========================================================================
  // 1. FLUID PAGE TRANSITIONS (WITH SAFE EXCLUSIONS)
  // =========================================================================
  function initPageTransitions() {
    if (isReducedMotion) {
      // Remove any transition classes immediately if reduced motion is requested
      document.body.classList.remove('page-entering');
      return;
    }

    // Apply entering state on load
    document.body.classList.add('page-entering');
    
    // Fade in page by removing class after animation duration
    window.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        document.body.classList.remove('page-entering');
      }, 250);
    });

    // Handle bfcache back/forward navigation
    window.addEventListener('pageshow', function (event) {
      document.body.classList.remove('page-entering', 'page-exiting');
    });

    // Intercept clicks on links
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a');
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (!href) return;

      // --- EXCLUSION RULES ---
      // 1. Target="_blank" links
      if (anchor.target === '_blank') return;

      // 2. Protocol links
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('sms:')) return;

      // 3. Anchor / Hash links (same page navigation)
      if (href.startsWith('#') || anchor.hash) {
        // Only skip if the destination is on the same page
        var currentPath = window.location.pathname;
        var linkPath = anchor.pathname || '';
        // Normalize paths
        if (currentPath.replace(/\/$/, '') === linkPath.replace(/\/$/, '')) {
          return;
        }
      }

      // 4. External links
      var linkHost = anchor.hostname;
      if (linkHost && linkHost !== window.location.hostname) return;

      // 5. Download links
      if (anchor.hasAttribute('download')) return;

      // 6. Custom transition skip tags
      if (anchor.hasAttribute('data-no-transition') || anchor.closest('[data-no-transition]')) return;

      // Prevent default navigation and run exiting animation
      e.preventDefault();
      document.body.classList.add('page-exiting');

      setTimeout(function () {
        window.location.href = anchor.href;
      }, 220); // Sync with CSS transition duration (0.22s)
    });
  }

  // =========================================================================
  // 2. INTERACTIVE CANVAS PARTICLES
  // =========================================================================
  var canvas, ctx, animationFrameId;
  var particles = [];
  var mouse = { x: null, y: null, radius: 100 };

  function initParticles() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    if (isReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = 'block';
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', throttle(resizeCanvas, 100));

    // Mouse tracking
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });

    // Populate particles
    createParticles();
    
    // Start animation loop
    animateParticles();
  }

  function createParticles() {
    particles = [];
    var count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        colorType: Math.floor(Math.random() * 3) // 0: blue, 1: green, 2: purple
      });
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  function stopParticles() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (canvas) {
      canvas.style.display = 'none';
    }
  }

  function parseToRgb(color) {
    if (!color) return '59,130,246';
    if (color.startsWith('rgba') || color.startsWith('rgb')) {
      return color.replace(/rgb\(|rgba\(|\)/g, '').split(',').slice(0, 3).join(',').trim();
    }
    var hex = color.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var r = parseInt(hex.substring(0, 2), 16) || 59;
    var g = parseInt(hex.substring(2, 4), 16) || 130;
    var b = parseInt(hex.substring(4, 6), 16) || 246;
    return r + ',' + g + ',' + b;
  }

  function getThemeColors() {
    var computedStyle = getComputedStyle(document.documentElement);
    var colorBlue = computedStyle.getPropertyValue('--accent-blue').trim() || '#3b82f6';
    var colorGreen = computedStyle.getPropertyValue('--accent-green').trim() || '#10b981';
    var colorPurple = computedStyle.getPropertyValue('--accent-purple').trim() || '#8b5cf6';
    
    return {
      blue: parseToRgb(colorBlue),
      green: parseToRgb(colorGreen),
      purple: parseToRgb(colorPurple)
    };
  }

  function animateParticles() {
    if (isReducedMotion) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var colors = getThemeColors();

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Update positions
      p.x += p.vx;
      p.y += p.vy;

      // Wall collisions
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (mouse.radius - dist) / mouse.radius;
          var angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }
      }

      // Map color category
      var pRgb = p.colorType === 0 ? colors.blue : (p.colorType === 1 ? colors.green : colors.purple);

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + pRgb + ', 0.35)';
      ctx.fill();

      // Draw connections
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx2 = p.x - p2.x;
        var dy2 = p.y - p2.y;
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < 120) {
          var p2Rgb = p2.colorType === 0 ? colors.blue : (p2.colorType === 1 ? colors.green : colors.purple);
          var lineOpacity = ((120 - dist2) / 120) * 0.08;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          
          // Linear gradient connection for beautiful blending
          var grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          grad.addColorStop(0, 'rgba(' + pRgb + ',' + lineOpacity + ')');
          grad.addColorStop(1, 'rgba(' + p2Rgb + ',' + lineOpacity + ')');
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animateParticles);
  }

  // =========================================================================
  // 3. THEME PRESETS DROPDOWN SELECTOR
  // =========================================================================
  function initThemePresetsDropdown() {
    var btn = document.getElementById('theme-dropdown-btn');
    var menu = document.getElementById('theme-dropdown');
    if (!btn || !menu) return;

    // Toggle menu
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function () {
      menu.classList.remove('open');
    });

    // Close menu when pressing escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menu.classList.remove('open');
    });

    // Handle dropdown item selections
    menu.querySelectorAll('.theme-dropdown-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var theme = this.getAttribute('data-theme-preset');
        if (!theme) return;

        // Apply theme data attribute to document element
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme-preset', theme);

        // Update active class in menu
        menu.querySelectorAll('.theme-dropdown-item').forEach(function (el) {
          el.classList.remove('active');
        });
        this.classList.add('active');

        // Update dropdown button icon or swatch if desired
        updateDropdownIcon(theme);

        // Force canvas redraw if particles are running
        createParticles();
      });
    });

    // Initialize switcher state to match current theme
    var activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    var activeItem = menu.querySelector('[data-theme-preset="' + activeTheme + '"]');
    if (activeItem) {
      activeItem.classList.add('active');
    }
    updateDropdownIcon(activeTheme);
  }

  function updateDropdownIcon(theme) {
    var icon = document.getElementById('theme-dropdown-icon');
    if (!icon) return;
    
    // Choose appropriate Font Awesome icon based on theme preset
    switch(theme) {
      case 'light':
        icon.className = 'fas fa-sun';
        break;
      case 'dark':
        icon.className = 'fas fa-moon';
        break;
      case 'dracula':
        icon.className = 'fas fa-ghost';
        break;
      case 'nord':
        icon.className = 'fas fa-snowflake';
        break;
      case 'emerald':
        icon.className = 'fas fa-terminal';
        break;
      default:
        icon.className = 'fas fa-palette';
    }
  }

  // =========================================================================
  // UTILITY HELPERS
  // =========================================================================
  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  }

  // =========================================================================
  // 4. SCROLL REVEAL EFFECT
  // =========================================================================
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    if (isReducedMotion) {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // =========================================================================
  // 5. GLOBAL MOBILE NAVIGATION
  // =========================================================================
  function initMobileNav() {
    var ham = document.getElementById('hamburger');
    var nav = document.getElementById('nav-links');
    if (ham && nav) {
      ham.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        ham.setAttribute('aria-expanded', String(open));
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // =========================================================================
  // 6. GLOBAL FOOTER YEAR
  // =========================================================================
  function initFooterYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  function initAll() {
    initPageTransitions();
    initParticles();
    initThemePresetsDropdown();
    initScrollReveal();
    initMobileNav();
    initFooterYear();
  }

  // Execute
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
