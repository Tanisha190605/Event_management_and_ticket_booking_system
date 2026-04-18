import { formatCurrency, formatDate } from '../data.js';
import { api } from '../services/api.js';

export function BookingPage() {
  const html = `
    <div class="booking-page">
      <div class="container">
        <section class="events-header stagger-item">
          <span class="badge badge-teal">🎫 Quick Booking</span>
          <h1 class="page-title">Book Your Event</h1>
          <p class="page-subtitle">Select an event below to start your booking journey</p>
        </section>

        <div class="booking-events-grid grid grid-3" id="booking-events-grid">
          <div style="text-align: center; grid-column: 1/-1; padding: 4rem;">
            <span class="loading-spinner" style="width:40px; height:40px; border-width:4px; border-top-color:var(--primary); display:inline-block; border-radius:50%;"></span>
          </div>
        </div>
      </div>
    </div>
  `;

  async function init() {
    const grid = document.getElementById('booking-events-grid');
    try {
      const events = await api.get('/events');
      if (events.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)"><h3>No events available</h3><p>Check back soon!</p></div>`;
        return;
      }
      grid.innerHTML = events.map((event, i) => `
        <div class="booking-event-card glass floater stagger-item" style="animation-delay:${i * 0.08}s">
          <div class="event-card-image">
            <img src="${event.image}" alt="${event.title}" loading="lazy" />
            <div class="event-card-overlay">
              <span class="badge badge-indigo">${event.category}</span>
            </div>
          </div>
          <div class="event-card-body">
            <h3 class="event-card-title">${event.title}</h3>
            <div class="event-card-meta">
              <span>📅 ${formatDate(event.date)}</span>
              <span>📍 ${event.city}</span>
            </div>
            <div class="event-card-footer">
              <span class="event-card-price">From ${formatCurrency(event.pricing?.General || 0)}</span>
              <button class="btn btn-primary btn-sm" data-href="/event/${event._id}">Book Now →</button>
            </div>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.stagger-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 80);
      });
    } catch (err) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--red)">Failed to load events: ${err.message}</div>`;
    }
  }

  return { html, init };
}
