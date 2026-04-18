// Simple SPA Router
const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  renderRoute(path);
}

export function renderRoute(path) {
  const app = document.getElementById('app');
  if (!app) return;

  // Page exit animation
  const currentPage = app.querySelector('.page');
  if (currentPage) {
    currentPage.classList.remove('page-active');
    currentPage.classList.add('page-exit');
  }

  // Cleanup previous page
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  setTimeout(() => {
    // Find matching route
    let handler = routes[path];
    let params = {};

    if (!handler) {
      // Try parameterized routes
      for (const [routePath, routeHandler] of Object.entries(routes)) {
        const routeParts = routePath.split('/');
        const pathParts = path.split('/');
        if (routeParts.length === pathParts.length) {
          let match = true;
          const p = {};
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              p[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            handler = routeHandler;
            params = p;
            break;
          }
        }
      }
    }

    if (!handler) handler = routes['/'];

    const result = handler(params);
    app.innerHTML = '';

    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page page-enter';
    pageWrapper.innerHTML = result.html || '';
    app.appendChild(pageWrapper);

    // Page enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pageWrapper.classList.remove('page-enter');
        pageWrapper.classList.add('page-active');
      });
    });

    // FIX BUG #2: Properly handle async init functions
    // Previously, async init() errors were unhandled promise rejections
    // causing silent failures and frozen UI with no error feedback
    if (result.init) {
      const initResult = result.init();
      if (initResult && typeof initResult.then === 'function') {
        // It's a Promise (async init function) — handle errors
        initResult
          .then((cleanup) => {
            if (typeof cleanup === 'function') {
              currentCleanup = cleanup;
            }
          })
          .catch((err) => {
            console.error('Page init error:', err);
            // Don't break the entire app on init error
          });
      } else {
        currentCleanup = initResult || null;
      }
    }

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.dataset.href;
      link.classList.toggle('active', href === path || (path.startsWith(href) && href !== '/'));
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Init stagger animations
    initStaggerAnimations();
  }, currentPage ? 300 : 0);
}

export function initRouter() {
  // Handle popstate (back/forward)
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });

  // Handle link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-href]');
    if (link) {
      e.preventDefault();
      navigate(link.dataset.href);
    }
  });

  renderRoute(window.location.pathname);
}

function initStaggerAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-item').forEach(el => observer.observe(el));
}
