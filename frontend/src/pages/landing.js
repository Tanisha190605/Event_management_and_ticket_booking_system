import { formatCurrency, formatDate } from '../data.js';
import { api } from '../services/api.js';

export function LandingPage() {
  const html = `
    <div class="landing-page">
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="hero-content container">
          <div class="hero-badge stagger-item">
            <span class="badge badge-indigo">✦ Premium Event Platform</span>
          </div>
          <h1 class="hero-title stagger-item">
            Discover <span class="gradient-text">Extraordinary</span><br/>Events Near You
          </h1>
          <p class="hero-subtitle stagger-item">
            Book tickets for concerts, conferences, comedy shows, and more — all in one beautiful, seamless experience.
          </p>
          <div class="hero-actions stagger-item">
            <button class="btn btn-primary btn-lg btn-breathing" data-href="/events">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Explore Events
            </button>
            <button class="btn btn-secondary btn-lg" data-href="/booking">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
              Book Now
            </button>
          </div>
          <div class="hero-stats stagger-item" id="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-number" id="stat-events">—</span>
              <span class="hero-stat-label">Events</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-number" id="stat-tickets">—</span>
              <span class="hero-stat-label">Tickets Sold</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-number">4.9★</span>
              <span class="hero-stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED EVENTS -->
      <section class="section">
        <div class="container">
          <div class="section-header stagger-item">
            <span class="badge badge-teal">🔥 Trending Now</span>
            <h2 class="section-title">Featured Events</h2>
            <p class="section-subtitle">Don't miss out on the most popular events happening near you</p>
          </div>
          <div class="featured-carousel" id="featured-carousel">
            <div style="text-align: center; padding: 4rem;">
              <span class="loading-spinner" style="width:40px; height:40px; border-width:4px; border-top-color:var(--primary); display:inline-block; border-radius:50%;"></span>
            </div>
          </div>
          <div class="section-cta stagger-item">
            <button class="btn btn-secondary" data-href="/events">View All Events →</button>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="section how-it-works-section">
        <div class="container">
          <div class="section-header stagger-item">
            <span class="badge badge-indigo">⚡ Simple & Fast</span>
            <h2 class="section-title">How It Works</h2>
          </div>
          <div class="grid grid-3 how-it-works-grid">
            ${[
              { icon: '🔍', title: 'Discover Events', desc: 'Browse through curated events across categories.' },
              { icon: '💺', title: 'Choose Your Seats', desc: 'Interactive seat map lets you pick the perfect spot.' },
              { icon: '🎫', title: 'Get Your Ticket', desc: 'Instant digital ticket with QR code delivered to you.' },
            ].map((step, i) => `
              <div class="how-step glass floater stagger-item" style="animation-delay: ${i * 0.15}s">
                <div class="how-step-icon">${step.icon}</div>
                <div class="how-step-number">${i + 1}</div>
                <h3>${step.title}</h3>
                <p>${step.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- CATEGORIES -->
      <section class="section">
        <div class="container">
          <div class="section-header stagger-item">
            <span class="badge badge-gold">🗂️ Browse by</span>
            <h2 class="section-title">Categories</h2>
          </div>
          <div class="categories-grid stagger-item">
            ${[
              { icon: '🎵', name: 'Music', color: 'var(--indigo)' },
              { icon: '💻', name: 'Tech', color: 'var(--teal)' },
              { icon: '😂', name: 'Comedy', color: 'var(--gold)' },
              { icon: '🎨', name: 'Art', color: 'var(--sky)' },
              { icon: '⚽', name: 'Sports', color: 'var(--green)' },
              { icon: '🍽️', name: 'Food', color: 'var(--red)' },
            ].map(cat => `
              <div class="category-card glass floater" data-href="/events" style="--cat-color: ${cat.color}">
                <span class="category-icon">${cat.icon}</span>
                <span class="category-name">${cat.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="site-footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <span class="nav-logo">✦ EMATBS</span>
              <p>Your premium destination for event discovery and ticket booking.</p>
            </div>
            <div class="footer-links">
              <div>
                <h4>Platform</h4>
                <span data-href="/events">Browse Events</span>
                <span data-href="/booking">Book Tickets</span>
              </div>
              <div>
                <h4>Company</h4>
                <span>About Us</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2026 EMATBS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `;

  async function init() {
    try {
      const events = await api.get('/events');
      const featured = events.filter(e => e.featured);

      // Update hero stats
      const statEvents = document.getElementById('stat-events');
      const statTickets = document.getElementById('stat-tickets');
      if (statEvents) statEvents.textContent = events.length + '+';
      const totalBooked = events.reduce((sum, e) => sum + (e.bookedSeats || 0), 0);
      if (statTickets) statTickets.textContent = totalBooked > 0 ? totalBooked.toLocaleString() + '+' : '0';

      // Render featured events
      const carousel = document.getElementById('featured-carousel');
      if (carousel && featured.length > 0) {
        carousel.innerHTML = featured.map((event, i) => `
          <div class="event-card floater stagger-item float float-delay-${i % 4}" data-href="/event/${event._id}">
            <div class="event-card-image">
              <img src="${event.image}" alt="${event.title}" loading="lazy" />
              <div class="event-card-overlay">
                <span class="badge badge-indigo">${event.category}</span>
                <span class="event-card-rating">★ ${event.rating || 'New'}</span>
              </div>
            </div>
            <div class="event-card-body">
              <h3 class="event-card-title">${event.title}</h3>
              <div class="event-card-meta">
                <span class="event-card-date">📅 ${formatDate(event.date)}</span>
                <span class="event-card-venue">📍 ${event.venue}</span>
              </div>
              <div class="event-card-footer">
                <span class="event-card-price">From ${formatCurrency(event.pricing?.General)}</span>
                <span class="event-card-seats">${event.totalSeats - (event.bookedSeats || 0)} seats left</span>
              </div>
            </div>
            <div class="event-card-glow"></div>
          </div>
        `).join('');

        // Trigger stagger animations
        carousel.querySelectorAll('.stagger-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
      } else if (carousel) {
        carousel.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)">No featured events yet. Check back soon!</div>`;
      }
    } catch (err) {
      console.error('Landing page load error:', err);
      const carousel = document.getElementById('featured-carousel');
      if (carousel) carousel.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red)">Failed to load events. Is the server running?</div>`;
    }
  }

  return { html, init };
}
