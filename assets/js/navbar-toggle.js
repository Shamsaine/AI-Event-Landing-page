// Mobile navbar toggle (works with components/navbar.html)
(function () {
  function setupNavbarToggle() {
    const nav = document.querySelector('.nav-links');
    const headerContent = document.querySelector('.header-content');
    if (!nav || !headerContent) return;

    // Prevent double-binding
    if (nav.dataset.toggleBound === '1') return;
    nav.dataset.toggleBound = '1';

    // If a toggle already exists (e.g., hot reload), don't create another
    let toggleBtn = document.querySelector('[data-nav-toggle="1"]');

    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-label', 'Toggle navigation');
      toggleBtn.setAttribute('data-nav-toggle', '1');
      toggleBtn.className =
        'hidden md:hidden px-3 py-2 rounded-lg border border-cyan-300/20 bg-white/5 text-neon font-bold';
      toggleBtn.style.display = 'none';
      toggleBtn.innerHTML = '&#8801;';

      // Insert button as last child of header-content
      headerContent.appendChild(toggleBtn);
    }

    function updateToggleVisibility() {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      toggleBtn.style.display = isMobile ? 'block' : 'none';
    }

    function setMobileCollapsed(collapsed) {
      if (collapsed) {
        nav.classList.add('nav-collapsed');
      } else {
        nav.classList.remove('nav-collapsed');
      }
      toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    function handleResize() {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      updateToggleVisibility();
      
      if (!isMobile) {
        // On desktop, always show nav
        nav.classList.remove('nav-collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }

    // Initialize state: collapsed on mobile
    updateToggleVisibility();
    if (window.matchMedia('(max-width: 767px)').matches) {
      setMobileCollapsed(true);
    } else {
      setMobileCollapsed(false);
    }

    // Toggle handler
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = nav.classList.contains('nav-collapsed');
      setMobileCollapsed(!isCollapsed);
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
  }

  // Try immediately (some pages inject navbar quickly)
  document.addEventListener('DOMContentLoaded', setupNavbarToggle);

  // Also attempt after components load (navbar injected dynamically)
  const observer = new MutationObserver(() => {
    const nav = document.querySelector('.nav-links');
    if (nav && !nav.dataset.toggleBound) {
      setupNavbarToggle();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();


