import { formatCurrency } from '../data.js';
import { api } from '../services/api.js';

export function ConfirmationPage() {
  const bookingRaw = sessionStorage.getItem('bookingData');
  if (!bookingRaw) {
    return {
      html: `<div class="container section"><div class="glass" style="padding:60px;text-align:center"><h2>No booking found</h2><button class="btn btn-primary" data-href="/events">Browse Events</button></div></div>`,
    };
  }

  const bookingLocal = JSON.parse(bookingRaw);

  const html = `
    <div class="confirmation-page">
      <div class="container">
        <!-- PROGRESS BAR -->
        <div class="progress-bar-container stagger-item">
          <div class="progress-step completed"><div class="progress-step-circle">✓</div><span class="progress-step-label">Select Event</span></div>
          <div class="progress-line"><div class="progress-line-fill" style="width:100%"></div></div>
          <div class="progress-step completed"><div class="progress-step-circle">✓</div><span class="progress-step-label">Choose Seats</span></div>
          <div class="progress-line"><div class="progress-line-fill" style="width:100%"></div></div>
          <div class="progress-step completed"><div class="progress-step-circle">✓</div><span class="progress-step-label">Payment</span></div>
          <div class="progress-line"><div class="progress-line-fill" style="width:100%"></div></div>
          <div class="progress-step active"><div class="progress-step-circle">4</div><span class="progress-step-label">Confirmation</span></div>
        </div>

        <!-- SUCCESS BANNER -->
        <div class="confirmation-success stagger-item">
          <div class="success-icon-large">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="38" fill="none" stroke="var(--green)" stroke-width="2.5" class="success-circle-anim"/>
              <path d="M24 42l10 10 22-24" fill="none" stroke="var(--green)" stroke-width="3.5" stroke-linecap="round" class="success-check-anim"/>
            </svg>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your tickets have been booked successfully.</p>
        </div>

        <!-- DIGITAL TICKET (loaded from API) -->
        <div id="ticket-container" class="stagger-item">
          <div style="text-align:center;padding:2rem">
            <span class="loading-spinner" style="width:30px;height:30px;border-width:3px;border-top-color:var(--primary);display:inline-block;border-radius:50%;"></span>
            <p style="color:var(--text-muted);margin-top:8px">Loading your ticket...</p>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="confirmation-actions stagger-item">
          <button class="btn btn-primary btn-lg" id="download-ticket-btn">
            📥 Download Ticket
          </button>
          <button class="btn btn-primary btn-lg" data-href="/my-bookings" style="background:var(--teal)">
            🎫 View My Bookings
          </button>
          <button class="btn btn-secondary btn-lg" data-href="/">
            🏠 Back to Home
          </button>
          <button class="btn btn-secondary btn-lg" data-href="/events">
            🎪 Browse More Events
          </button>
        </div>
      </div>
    </div>
  `;

  async function init() {
    const container = document.getElementById('ticket-container');
    let booking = null;

    try {
      // Fetch the confirmed booking from the API
      if (bookingLocal.bookingId) {
        booking = await api.get(`/bookings/${bookingLocal.bookingId}`);
      }
    } catch (err) {
      console.warn('Failed to fetch booking from API, using local data:', err.message);
    }

    // Use API data if available, fall back to local sessionStorage data
    const eventTitle = booking?.event?.title || bookingLocal.event?.title || 'Event';
    const eventDate = booking?.event?.date || bookingLocal.event?.date || new Date().toISOString();
    const eventVenue = booking?.event?.venue || bookingLocal.event?.venue || '';
    const eventCity = booking?.event?.city || bookingLocal.event?.city || '';
    const userName = booking?.user?.name || bookingLocal.userInfo?.name || 'Guest';
    const userEmail = booking?.user?.email || bookingLocal.userInfo?.email || '';
    const seats = booking?.seats || bookingLocal.selectedSeats || [];
    const paidAmount = booking?.totalAmount || bookingLocal.paidAmount || 0;
    const bookingId = booking?._id || bookingLocal.bookingId || 'N/A';
    const qrCodeUrl = booking?.qrCode || '';

    container.innerHTML = `
      <div class="ticket-card-wrapper">
        <div class="digital-ticket" id="digital-ticket">
          <div class="ticket-top">
            <div class="ticket-top-left">
              <span class="ticket-brand">✦ EMATBS</span>
              <h2 class="ticket-event-name">${eventTitle}</h2>
              <div class="ticket-meta-grid">
                <div class="ticket-meta-item">
                  <span class="ticket-meta-label">Date</span>
                  <span class="ticket-meta-value">${new Date(eventDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div class="ticket-meta-item">
                  <span class="ticket-meta-label">Venue</span>
                  <span class="ticket-meta-value">${eventVenue}${eventCity ? ', ' + eventCity : ''}</span>
                </div>
                <div class="ticket-meta-item">
                  <span class="ticket-meta-label">Attendee</span>
                  <span class="ticket-meta-value">${userName}</span>
                </div>
                <div class="ticket-meta-item">
                  <span class="ticket-meta-label">Email</span>
                  <span class="ticket-meta-value">${userEmail}</span>
                </div>
              </div>
            </div>
            <div class="ticket-top-right">
              <div class="ticket-qr">
                ${qrCodeUrl
                  ? `<img src="${qrCodeUrl}" alt="QR Code" />`
                  : `<div style="width:120px;height:120px;background:rgba(255,255,255,0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">QR</div>`
                }
              </div>
              <span class="ticket-qr-label">Scan for entry</span>
            </div>
          </div>
          <div class="ticket-divider">
            <div class="ticket-notch ticket-notch-left"></div>
            <div class="ticket-divider-line"></div>
            <div class="ticket-notch ticket-notch-right"></div>
          </div>
          <div class="ticket-bottom">
            <div class="ticket-seats-info">
              <span class="ticket-meta-label">Seats</span>
              <div class="ticket-seat-badges">
                ${seats.map(s => `
                  <span class="ticket-seat-badge badge-${s.tier.toLowerCase()}">${s.id} · ${s.tier}</span>
                `).join('')}
              </div>
            </div>
            <div class="ticket-amount">
              <span class="ticket-meta-label">Amount Paid</span>
              <span class="ticket-amount-value">${formatCurrency(paidAmount)}</span>
            </div>
            <div class="ticket-booking-id">
              <span class="ticket-meta-label">Booking ID</span>
              <span class="ticket-id-value" style="font-size:11px;word-break:break-all">${bookingId}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Download ticket as HTML
    document.getElementById('download-ticket-btn')?.addEventListener('click', () => {
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head><title>EMATBS Ticket - ${bookingId}</title>
        <style>
          body{font-family:Arial,sans-serif;background:#121826;color:#f1f5f9;display:flex;justify-content:center;padding:40px}
          .ticket{background:linear-gradient(135deg,#1a2332,#1f2a44);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px;max-width:600px;width:100%}
          h2{color:#818CF8;margin:8px 0}
          .meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}
          .meta-item span:first-child{color:#64748B;font-size:12px;display:block}
          .meta-item span:last-child{font-size:14px}
          .qr{text-align:center;margin:20px 0}
          .qr img{width:150px;height:150px;border-radius:8px;background:white;padding:8px}
          .seats{margin:16px 0;display:flex;gap:8px;flex-wrap:wrap}
          .seat-badge{background:rgba(99,102,241,0.2);padding:4px 12px;border-radius:20px;font-size:12px}
          .amount{font-size:24px;color:#22C55E;font-weight:bold;text-align:center;margin:16px 0}
        </style></head>
        <body>
          <div class="ticket">
            <div style="text-align:center">✦ EMATBS</div>
            <h2>${eventTitle}</h2>
            <div class="meta">
              <div class="meta-item"><span>Date</span><span>${new Date(eventDate).toLocaleDateString()}</span></div>
              <div class="meta-item"><span>Venue</span><span>${eventVenue}</span></div>
              <div class="meta-item"><span>Attendee</span><span>${userName}</span></div>
              <div class="meta-item"><span>Email</span><span>${userEmail}</span></div>
            </div>
            ${qrCodeUrl ? `<div class="qr"><img src="${qrCodeUrl}" /></div>` : ''}
            <div class="seats">${seats.map(s => `<span class="seat-badge">${s.id} · ${s.tier}</span>`).join('')}</div>
            <div class="amount">${formatCurrency(paidAmount)}</div>
            <div style="text-align:center;color:#64748B;font-size:12px">Booking ID: ${bookingId}</div>
          </div>
        </body></html>
      `], { type: 'text/html' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EMATBS-Ticket-${bookingId.toString().substring(0, 8)}.html`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Clear booking data from session
    sessionStorage.removeItem('bookingData');
  }

  return { html, init };
}
