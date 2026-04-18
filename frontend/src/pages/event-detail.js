import { formatCurrency, formatDate } from '../data.js';
import { navigate } from '../router.js';
import { api } from '../services/api.js';

export function EventDetailPage(params) {
  const html = `
    <div class="event-detail-page" id="event-detail-container">
      <div style="text-align:center;padding:8rem 2rem;">
        <span class="loading-spinner" style="width:40px; height:40px; border-width:4px; border-top-color:var(--primary); display:inline-block; border-radius:50%;"></span>
        <p style="color:var(--text-muted);margin-top:16px">Loading event...</p>
      </div>
    </div>
  `;

  async function init() {
    const container = document.getElementById('event-detail-container');
    try {
      const event = await api.get(`/events/${params.id}`);

      const seatsLeft = event.totalSeats - (event.bookedSeats || 0);
      const seatsPercent = Math.round(((event.bookedSeats || 0) / event.totalSeats) * 100);

      container.innerHTML = `
        <!-- BANNER -->
        <div class="event-banner" style="background-image: url('${event.banner || event.image}')">
          <div class="event-banner-overlay"></div>
          <div class="event-banner-content container">
            <button class="btn btn-ghost" data-href="/events" style="color:white;margin-bottom:16px">← Back to Events</button>
            <span class="badge badge-indigo stagger-item">${event.category}</span>
            <h1 class="event-detail-title stagger-item">${event.title}</h1>
            <div class="event-detail-meta stagger-item">
              <span>📅 ${formatDate(event.date)} at ${event.time}</span>
              <span>📍 ${event.venue}, ${event.city}</span>
              <span>🎤 ${event.organizer}</span>
              ${event.rating ? `<span>★ ${event.rating}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="container">
          <div class="event-detail-layout">
            <!-- LEFT: Event Info -->
            <div class="event-detail-info">
              <div class="glass event-detail-section stagger-item">
                <h2>About This Event</h2>
                <p>${event.description}</p>
                <div class="event-tags-row">
                  ${(event.tags || []).map(t => `<span class="badge badge-teal">${t}</span>`).join('')}
                </div>
              </div>

              <div class="glass event-detail-section stagger-item">
                <h2>Venue & Date</h2>
                <div class="detail-info-grid">
                  <div class="detail-info-item">
                    <span class="detail-info-icon">📅</span>
                    <div><strong>Date</strong><span>${formatDate(event.date)}</span></div>
                  </div>
                  <div class="detail-info-item">
                    <span class="detail-info-icon">🕐</span>
                    <div><strong>Time</strong><span>${event.time}</span></div>
                  </div>
                  <div class="detail-info-item">
                    <span class="detail-info-icon">📍</span>
                    <div><strong>Venue</strong><span>${event.venue}, ${event.city}</span></div>
                  </div>
                  <div class="detail-info-item">
                    <span class="detail-info-icon">🎤</span>
                    <div><strong>Organizer</strong><span>${event.organizer}</span></div>
                  </div>
                </div>
              </div>

              <!-- AVAILABILITY -->
              <div class="glass event-detail-section stagger-item">
                <h2>Availability</h2>
                <div class="seats-progress-bar">
                  <div class="seats-progress-fill" style="width: ${seatsPercent}%"></div>
                </div>
                <div class="seats-info">
                  <span>${seatsLeft} seats available</span>
                  <span>${seatsPercent}% booked</span>
                </div>
              </div>
            </div>

            <!-- RIGHT: Ticket Selection -->
            <div class="event-detail-sidebar">
              <div class="glass ticket-selector stagger-item" id="ticket-selector">
                <h2>Select Tickets</h2>
                
                <!-- VIP -->
                <div class="ticket-tier ticket-vip" data-tier="VIP" id="tier-vip">
                  <div class="ticket-tier-header">
                    <div class="ticket-tier-icon">👑</div>
                    <div class="ticket-tier-info">
                      <h3>VIP</h3>
                      <p>Front rows, premium lounge, complimentary drinks</p>
                    </div>
                    <div class="ticket-tier-price">${formatCurrency(event.pricing?.VIP)}</div>
                  </div>
                  <div class="ticket-tier-actions">
                    <button class="qty-btn" data-tier="VIP" data-action="minus">−</button>
                    <span class="qty-value" id="qty-VIP">0</span>
                    <button class="qty-btn" data-tier="VIP" data-action="plus">+</button>
                  </div>
                </div>

                <!-- Premium -->
                <div class="ticket-tier ticket-premium" data-tier="Premium" id="tier-premium">
                  <div class="ticket-tier-header">
                    <div class="ticket-tier-icon">⭐</div>
                    <div class="ticket-tier-info">
                      <h3>Premium</h3>
                      <p>Mid-section, great views, priority entry</p>
                    </div>
                    <div class="ticket-tier-price">${formatCurrency(event.pricing?.Premium)}</div>
                  </div>
                  <div class="ticket-tier-actions">
                    <button class="qty-btn" data-tier="Premium" data-action="minus">−</button>
                    <span class="qty-value" id="qty-Premium">0</span>
                    <button class="qty-btn" data-tier="Premium" data-action="plus">+</button>
                  </div>
                </div>

                <!-- General -->
                <div class="ticket-tier ticket-general" data-tier="General" id="tier-general">
                  <div class="ticket-tier-header">
                    <div class="ticket-tier-icon">🎫</div>
                    <div class="ticket-tier-info">
                      <h3>General</h3>
                      <p>Standard seating, full event access</p>
                    </div>
                    <div class="ticket-tier-price">${formatCurrency(event.pricing?.General)}</div>
                  </div>
                  <div class="ticket-tier-actions">
                    <button class="qty-btn" data-tier="General" data-action="minus">−</button>
                    <span class="qty-value" id="qty-General">0</span>
                    <button class="qty-btn" data-tier="General" data-action="plus">+</button>
                  </div>
                </div>

                <!-- Total & Book -->
                <div class="ticket-summary" id="ticket-summary" style="display:none">
                  <div class="ticket-summary-row">
                    <span>Total</span>
                    <span class="ticket-total" id="ticket-total">₹0</span>
                  </div>
                  <button class="btn btn-primary btn-lg btn-breathing" id="proceed-booking" style="width:100%">
                    Proceed to Seats →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Ticket quantity logic
      const quantities = { VIP: 0, Premium: 0, General: 0 };

      document.getElementById('ticket-selector')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.qty-btn');
        if (!btn) return;

        const tier = btn.dataset.tier;
        const action = btn.dataset.action;

        if (action === 'plus' && quantities[tier] < 10) quantities[tier]++;
        if (action === 'minus' && quantities[tier] > 0) quantities[tier]--;

        document.getElementById(`qty-${tier}`).textContent = quantities[tier];

        ['VIP', 'Premium', 'General'].forEach(t => {
          const el = document.getElementById(`tier-${t.toLowerCase()}`);
          if (el) el.classList.toggle('selected', quantities[t] > 0);
        });

        const total = quantities.VIP * (event.pricing?.VIP || 0) +
                      quantities.Premium * (event.pricing?.Premium || 0) +
                      quantities.General * (event.pricing?.General || 0);

        const summary = document.getElementById('ticket-summary');
        const totalEl = document.getElementById('ticket-total');
        if (total > 0) {
          summary.style.display = 'block';
          totalEl.textContent = formatCurrency(total);
        } else {
          summary.style.display = 'none';
        }
      });

      document.getElementById('proceed-booking')?.addEventListener('click', () => {
        const totalQty = quantities.VIP + quantities.Premium + quantities.General;
        if (totalQty === 0) return;

        // Check login
        if (!localStorage.getItem('token')) {
          sessionStorage.setItem('redirectAfterLogin', `/booking/seats/${event._id}`);
          navigate('/auth');
          return;
        }

        sessionStorage.setItem('bookingData', JSON.stringify({
          eventId: event._id,
          quantities,
          event: {
            title: event.title,
            date: event.date,
            venue: event.venue,
            city: event.city,
            pricing: event.pricing,
          },
        }));
        navigate(`/booking/seats/${event._id}`);
      });

      // Stagger animations
      container.querySelectorAll('.stagger-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 80);
      });

    } catch (err) {
      container.innerHTML = `
        <div class="container section">
          <div class="glass" style="padding:60px;text-align:center">
            <h2>Event not found</h2>
            <p>${err.message}</p>
            <button class="btn btn-primary" data-href="/events">Browse Events</button>
          </div>
        </div>
      `;
    }
  }

  return { html, init };
}
