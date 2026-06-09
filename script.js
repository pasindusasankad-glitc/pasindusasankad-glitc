/* ============================================================
   PORTFOLIO JAVASCRIPT — Pasindu Sasanka
   Handles: Smooth scroll, sticky header, scroll-reveal,
            mobile nav, active link tracking, back-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Element References ---------- */
  const header      = document.querySelector('.header');
  const hamburger   = document.querySelector('.hamburger');
  const navLinks    = document.querySelector('.nav-links');
  const navOverlay  = document.querySelector('.nav-overlay');
  const allNavLinks = document.querySelectorAll('.nav-links a');
  const backToTop   = document.querySelector('.back-to-top');
  const reveals     = document.querySelectorAll('.reveal');
  const sections    = document.querySelectorAll('section[id]');


  /* ---------- Sticky Header on Scroll ---------- */
  const handleScroll = () => {
    // Add 'scrolled' class when page is scrolled past 60px
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Show/hide back-to-top button
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Highlight active nav link based on scroll position
    highlightActiveSection();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ---------- Active Section Highlighting ---------- */
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  /* ---------- Smooth Scrolling for Nav Links ---------- */
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target   = document.querySelector(targetId);

      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }

      // Close mobile nav if open
      closeMobileNav();
    });
  });


  /* ---------- Mobile Navigation ---------- */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', closeMobileNav);

  function closeMobileNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });


  /* ---------- Scroll-Reveal Animations (Intersection Observer) ---------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing once revealed for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));


  /* ---------- Back to Top ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- Contact Form Handling (placeholder) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simple client-side validation
      if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Simulate async delay
      setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }


  /* ---------- Notification Toast ---------- */
  function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${message}</span>
    `;

    // Styling the toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: type === 'success' ? '#0D9488' : '#E11D48',
      color: '#fff',
      padding: '14px 24px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      fontWeight: '600',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      zIndex: '9999',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }


  /* ---------- Typing Effect for Hero Subtitle (optional enhancement) ---------- */
  const roles = [
    'Environmental Scientist',
    'Laboratory Investigator',
    'Bilingual Translator'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById('typingText');

  function typeEffect() {
    if (!typingEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500; // Pause before next word
    }

    setTimeout(typeEffect, speed);
  }

  // Start typing effect
  if (typingEl) {
    setTimeout(typeEffect, 1200);
  }


  /* ---------- Spin animation for loading state ---------- */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(styleSheet);


  /* ---------- Initial call ---------- */
  handleScroll();

});
