import { getCurrentUser, isLoggedIn, logout } from '../data.js';
import { navigate } from '../router.js';

export function renderNav() {
  const user = getCurrentUser();
  const loggedIn = isLoggedIn();

  return `
    <nav class="nav" id="main-nav">
      <div class="nav-inner">
        <a class="nav-logo" data-href="/">✦ EMATBS</a>
        <ul class="nav-links">
          <li><span class="nav-link active" data-href="/">Home</span></li>
          <li><span class="nav-link" data-href="/events">Events</span></li>
          <li><span class="nav-link" data-href="/booking">Book Now</span></li>
          <li><span class="nav-link" data-href="/admin">Admin</span></li>
          ${loggedIn ? '<li><span class="nav-link" data-href="/my-bookings">My Bookings</span></li>' : ''}
        </ul>
        <div class="nav-actions">
          ${loggedIn ? `
            <span style="color: var(--text-muted); font-size: 13px; margin-right: 8px;">👤 ${user?.name || 'User'}</span>
            <button class="btn btn-ghost btn-sm" id="logout-btn">Logout</button>
          ` : `
            <button class="btn btn-ghost btn-sm" data-href="/auth" style="margin-right: 8px;">Login / Signup</button>
          `}
          <button class="btn btn-primary btn-sm" data-href="/events">Explore Events</button>
          <button class="mobile-menu-btn" id="mobile-menu-toggle">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <span class="mobile-menu-close" id="mobile-menu-close">✕</span>
      <span class="nav-link" data-href="/" onclick="document.getElementById('mobile-menu').classList.remove('open')">Home</span>
      <span class="nav-link" data-href="/events" onclick="document.getElementById('mobile-menu').classList.remove('open')">Events</span>
      <span class="nav-link" data-href="/booking" onclick="document.getElementById('mobile-menu').classList.remove('open')">Book Now</span>
      ${loggedIn ? `<span class="nav-link" data-href="/my-bookings" onclick="document.getElementById('mobile-menu').classList.remove('open')">My Bookings</span>` : ''}
      <span class="nav-link" data-href="/admin" onclick="document.getElementById('mobile-menu').classList.remove('open')">Admin</span>
      ${loggedIn
        ? `<button class="btn btn-ghost" id="mobile-logout-btn" style="margin-top:10px;">Logout</button>`
        : `<span class="nav-link" data-href="/auth" onclick="document.getElementById('mobile-menu').classList.remove('open')">Login / Signup</span>`
      }
      <button class="btn btn-primary" data-href="/events" style="margin-top:10px;" onclick="document.getElementById('mobile-menu').classList.remove('open')">Explore Events</button>
    </div>
  `;
}

export function initNav() {
  // Scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu
  document.addEventListener('click', (e) => {
    if (e.target.closest('#mobile-menu-toggle')) {
      document.getElementById('mobile-menu')?.classList.add('open');
    }
    if (e.target.closest('#mobile-menu-close')) {
      document.getElementById('mobile-menu')?.classList.remove('open');
    }
  });

  // FIX BUG #1: Logout uses SPA navigation — no full page reload
  document.addEventListener('click', (e) => {
    if (e.target.closest('#logout-btn') || e.target.closest('#mobile-logout-btn')) {
      e.preventDefault();
      e.stopPropagation();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      refreshNav();
      navigate('/');
    }
  });
}

// FIX BUG #1: More robust refreshNav that finds the nav container reliably
export function refreshNav() {
  // Try multiple selectors to find the nav container
  let navContainer = document.querySelector('nav.nav')?.parentElement;
  if (!navContainer) {
    navContainer = document.getElementById('main-nav')?.parentElement;
  }
  if (navContainer) {
    navContainer.innerHTML = renderNav();
  }
}
