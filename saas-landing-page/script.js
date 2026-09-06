/**
 * NovaFlow SaaS Landing Page Interactivity
 * Handles: Mobile Navigation, Header Scroll, Pricing Toggle,
 * FAQ Accordion, and Interactive Demo Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Header Background Effect ---
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // --- 2. Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    const toggleMenu = (forceState) => {
      const isOpen = forceState !== undefined ? forceState : !navMenu.classList.contains('open');
      menuToggle.classList.toggle('active', isOpen);
      navMenu.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      
      // Prevent body scroll when menu is active on mobile
      if (window.innerWidth <= 768) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close mobile nav when clicking any nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // --- 3. Monthly / Annual Pricing Toggle ---
  const billingToggle = document.getElementById('billing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');
  const priceValues = document.querySelectorAll('.price-value');
  const priceNotes = document.querySelectorAll('.price-billing-note');

  if (billingToggle) {
    let isYearly = false;

    const updatePricingDisplay = () => {
      billingToggle.setAttribute('aria-checked', String(isYearly));

      if (labelMonthly && labelAnnual) {
        labelMonthly.classList.toggle('active', !isYearly);
        labelAnnual.classList.toggle('active', isYearly);
      }

      priceValues.forEach((el) => {
        const targetPrice = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        
        // Quick visual transition
        el.style.transform = 'scale(0.85)';
        el.style.opacity = '0.6';

        setTimeout(() => {
          el.textContent = targetPrice;
          el.style.transform = 'scale(1)';
          el.style.opacity = '1';
        }, 120);
      });

      priceNotes.forEach((el) => {
        const noteText = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        el.textContent = noteText;
      });
    };

    billingToggle.addEventListener('click', () => {
      isYearly = !isYearly;
      updatePricingDisplay();
    });

    if (labelMonthly) {
      labelMonthly.addEventListener('click', () => {
        if (isYearly) {
          isYearly = false;
          updatePricingDisplay();
        }
      });
    }

    if (labelAnnual) {
      labelAnnual.addEventListener('click', () => {
        if (!isYearly) {
          isYearly = true;
          updatePricingDisplay();
        }
      });
    }
  }

  // --- 4. FAQ Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const headerBtn = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (headerBtn && content) {
      headerBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        accordionItems.forEach((other) => {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.accordion-header');
          const otherContent = other.querySelector('.accordion-content');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
          headerBtn.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 30 + 'px';
        }
      });
    }
  });

  // Open first FAQ by default
  if (accordionItems.length > 0) {
    const firstItem = accordionItems[0];
    const firstHeader = firstItem.querySelector('.accordion-header');
    const firstContent = firstItem.querySelector('.accordion-content');
    firstItem.classList.add('active');
    if (firstHeader) firstHeader.setAttribute('aria-expanded', 'true');
    if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + 30 + 'px';
  }

  // --- 5. Interactive Demo Modal ---
  const openDemoBtn = document.getElementById('open-demo-btn');
  const demoModal = document.getElementById('demo-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const replayBtn = document.getElementById('demo-replay-btn');
  const demoTrialLink = document.getElementById('demo-trial-link');

  if (openDemoBtn && demoModal) {
    const openModal = () => {
      demoModal.removeAttribute('hidden');
      requestAnimationFrame(() => {
        demoModal.classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      demoModal.classList.remove('open');
      setTimeout(() => {
        demoModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }, 250);
    };

    openDemoBtn.addEventListener('click', openModal);

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    if (demoTrialLink) {
      demoTrialLink.addEventListener('click', closeModal);
    }

    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('open')) {
        closeModal();
      }
    });

    // Replay Simulation Animation
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        const nodes = demoModal.querySelectorAll('.demo-node');
        nodes.forEach((node, idx) => {
          node.style.opacity = '0.3';
          node.style.transform = 'scale(0.95)';
          setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'scale(1)';
          }, (idx + 1) * 350);
        });
      });
    }
  }

  // --- 6. Smooth Scroll Offset for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
