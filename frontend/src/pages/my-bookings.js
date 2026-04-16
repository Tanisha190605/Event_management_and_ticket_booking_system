import { formatCurrency, formatDate, isLoggedIn } from '../data.js';
import { api } from '../services/api.js';
import { navigate } from '../router.js';

export function MyBookingsPage() {
  if (!isLoggedIn()) {
    sessionStorage.setItem('redirectAfterLogin', '/my-bookings');
    setTimeout(() => navigate('/auth'), 0);
    return { html: '<div></div>' };
  }

  const html = `
    <div class="events-page">
      <div class="container">
        <section class="events-header stagger-item">
          <span class="badge badge-indigo">🎫 My Tickets</span>
          <h1 class="page-title">My Bookings</h1>
          <p class="page-subtitle">View your booking history and download tickets</p>
        </section>

        <div id="bookings-container">
          <div style="text-align: center; padding: 4rem;">
            <span class="loading-spinner" style="width:40px; height:40px; border-width:4px; border-top-color:var(--primary); display:inline-block; border-radius:50%;"></span>
          </div>
        </div>
      </div>
    </div>
  `;

  async function init() {
    const container = document.getElementById('bookings-container');
    try {
      const bookings = await api.get('/bookings/my-bookings');

      if (bookings.length === 0) {
        container.innerHTML = `
          <div class="glass" style="text-align:center;padding:4rem">
            <span style="font-size:3rem">🎫</span>
            <h3 style="margin-top:16px">No bookings yet</h3>
            <p style="color:var(--text-muted)">Book your first event!</p>
            <button class="btn btn-primary" data-href="/events" style="margin-top:16px">Browse Events</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:20px;">
          ${bookings.map((booking, i) => {
            const event = booking.event || {};
            const statusClass = booking.paymentStatus === 'completed' ? 'badge-green' : booking.paymentStatus === 'failed' ? 'badge-red' : 'badge-gold';
            return `
              <div class="glass floater stagger-item" style="padding:24px;animation-delay:${i*0.08}s">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px">
                  <div>
                    <h3 style="margin:0 0 4px">${event.title || 'Event'}</h3>
                    <span style="color:var(--text-muted);font-size:13px">📅 ${event.date ? formatDate(event.date) : 'N/A'} · 📍 ${event.venue || ''}</span>
                  </div>
                  <span class="badge ${statusClass}" style="text-transform:capitalize">${booking.bookingStatus}</span>
                </div>
                
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin:12px 0">
                  ${booking.seats.map(s => `<span class="badge badge-indigo">${s.id} · ${s.tier}</span>`).join('')}
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06)">
                  <span style="font-size:18px;font-weight:700;color:var(--green)">${formatCurrency(booking.totalAmount)}</span>
                  ${booking.qrCode ? `
                    <button class="btn btn-ghost btn-sm show-qr-btn" data-qr="${encodeURIComponent(booking.qrCode)}" data-title="${event.title}">🎫 View Ticket</button>
                  ` : ''}
                </div>
                <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">Booked: ${new Date(booking.createdAt).toLocaleString('en-IN')}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Stagger animations
      container.querySelectorAll('.stagger-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 80);
      });

      // QR Code viewer
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.show-qr-btn');
        if (!btn) return;
        const qrData = decodeURIComponent(btn.dataset.qr);
        const title = btn.dataset.title;

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)';
        overlay.innerHTML = `
          <div class="glass" style="padding:32px;text-align:center;border-radius:16px;max-width:380px">
            <h3 style="margin:0 0 8px">${title}</h3>
            <p style="color:var(--text-muted);margin-bottom:16px">Scan this QR at the entrance</p>
            <img src="${qrData}" style="width:200px;height:200px;border-radius:12px;background:white;padding:12px" />
            <br/>
            <button class="btn btn-ghost" style="margin-top:16px" id="close-qr-modal">Close</button>
          </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('close-qr-modal').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
      });

    } catch (err) {
      container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red)">Failed to load bookings: ${err.message}</div>`;
    }
  }

  return { html, init };
}
