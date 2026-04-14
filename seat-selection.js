import { generateSeatLayout, formatCurrency } from '../data.js';
import { navigate } from '../router.js';
import { api } from '../services/api.js';

export function SeatSelectionPage(params) {
  const bookingRaw = sessionStorage.getItem('bookingData');

  if (!bookingRaw) {
    return {
      html: `<div class="container section"><div class="glass" style="padding:60px;text-align:center"><h2>No booking in progress</h2><p>Please select an event first.</p><button class="btn btn-primary" data-href="/events">Browse Events</button></div></div>`,
    };
  }

  const bookingData = JSON.parse(bookingRaw);
  const totalTickets = bookingData.quantities.VIP + bookingData.quantities.Premium + bookingData.quantities.General;

  const html = `
    <div class="seat-selection-page">
      <div class="container">
        <!-- PROGRESS BAR -->
        <div class="progress-bar-container stagger-item">
          <div class="progress-step completed">
            <div class="progress-step-circle">✓</div>
            <span class="progress-step-label">Select Event</span>
          </div>
          <div class="progress-line"><div class="progress-line-fill" style="width:100%"></div></div>
          <div class="progress-step active">
            <div class="progress-step-circle">2</div>
            <span class="progress-step-label">Choose Seats</span>
          </div>
          <div class="progress-line"><div class="progress-line-fill" style="width:0%"></div></div>
          <div class="progress-step">
            <div class="progress-step-circle">3</div>
            <span class="progress-step-label">Payment</span>
          </div>
          <div class="progress-line"><div class="progress-line-fill" style="width:0%"></div></div>
          <div class="progress-step">
            <div class="progress-step-circle">4</div>
            <span class="progress-step-label">Confirmation</span>
          </div>
        </div>

        <div class="seat-layout-container">
          <div class="seat-main-area">
            <div class="glass seat-map-card stagger-item">
              <h2>Choose Your Seats</h2>
              <p class="seat-event-name" id="seat-event-title">Loading...</p>

              <!-- STAGE -->
              <div class="stage-indicator">
                <div class="stage-bar">STAGE</div>
              </div>

              <!-- SEAT MAP -->
              <div class="seat-map-wrapper" id="seat-map-wrapper">
                <div class="seat-map" id="seat-map">
                  <div style="text-align:center;padding:2rem"><span class="loading-spinner" style="width:30px;height:30px;border-width:3px;border-top-color:var(--primary);display:inline-block;border-radius:50%;"></span></div>
                </div>
              </div>

              <!-- LEGEND -->
              <div class="seat-legend">
                <div class="legend-item"><span class="legend-dot legend-available"></span> Available</div>
                <div class="legend-item"><span class="legend-dot legend-selected"></span> Selected</div>
                <div class="legend-item"><span class="legend-dot legend-booked"></span> Booked</div>
                <div class="legend-item"><span class="legend-dot legend-vip"></span> VIP</div>
                <div class="legend-item"><span class="legend-dot legend-premium"></span> Premium</div>
                <div class="legend-item"><span class="legend-dot legend-general"></span> General</div>
              </div>
            </div>
          </div>

          <!-- SIDEBAR -->
          <div class="seat-sidebar">
            <div class="glass seat-summary-card stagger-item">
              <h3>Booking Summary</h3>
              <div class="summary-event-info">
                <strong>${bookingData.event.title}</strong>
                <span>📅 ${new Date(bookingData.event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>📍 ${bookingData.event.venue}</span>
              </div>

              <div class="selected-seats-list" id="selected-seats-list">
                <p class="text-muted">No seats selected yet</p>
              </div>

              <div class="summary-total-section">
                <div class="summary-row">
                  <span>Selected</span>
                  <span id="selected-count">0 / ${totalTickets}</span>
                </div>
                <div class="summary-row summary-total">
                  <span>Total</span>
                  <span id="seat-total">₹0</span>
                </div>
              </div>

              <button class="btn btn-primary btn-lg btn-breathing" id="proceed-payment" style="width:100%" disabled>
                Proceed to Payment →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SEAT TOOLTIP -->
      <div class="tooltip" id="seat-tooltip"></div>
    </div>
  `;

  async function init() {
    const selectedSeats = [];
    let seats = [];

    try {
      // Fetch fresh event data to get real bookedSeatIds
      const event = await api.get(`/events/${params.id}`);

      document.getElementById('seat-event-title').textContent = `${event.title} — Select ${totalTickets} seat(s)`;

      // Generate seat layout with real booked seats
      seats = generateSeatLayout(event);

      const seatMapEl = document.getElementById('seat-map');
      if (seatMapEl) {
        seatMapEl.innerHTML = renderSeatMap(seats);
      }
    } catch (err) {
      document.getElementById('seat-map').innerHTML = `<p style="text-align:center;color:var(--red);padding:2rem">Failed to load seats: ${err.message}</p>`;
      return;
    }

    const seatMap = document.getElementById('seat-map');
    const tooltip = document.getElementById('seat-tooltip');

    // Seat click handler
    seatMap?.addEventListener('click', (e) => {
      const seatEl = e.target.closest('.seat');
      if (!seatEl || seatEl.classList.contains('booked')) return;

      const seatId = seatEl.dataset.seatId;
      const seatData = seats.find(s => s.id === seatId);
      if (!seatData) return;

      if (seatEl.classList.contains('selected')) {
        seatEl.classList.remove('selected');
        const idx = selectedSeats.findIndex(s => s.id === seatId);
        if (idx > -1) selectedSeats.splice(idx, 1);
      } else {
        if (selectedSeats.length >= totalTickets) return;
        seatEl.classList.add('selected');
        seatEl.style.animation = 'seatPulse 0.4s ease-out';
        selectedSeats.push(seatData);
      }

      updateSummary();
    });

    // Seat hover tooltip
    seatMap?.addEventListener('mouseover', (e) => {
      const seatEl = e.target.closest('.seat');
      if (!seatEl || seatEl.classList.contains('booked')) return;

      const seatData = seats.find(s => s.id === seatEl.dataset.seatId);
      if (!seatData) return;

      tooltip.innerHTML = `<strong>${seatData.id}</strong> · ${seatData.tier} · ${formatCurrency(seatData.price)}`;
      tooltip.classList.add('show');

      const rect = seatEl.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    });

    seatMap?.addEventListener('mouseout', (e) => {
      if (!e.target.closest('.seat')) return;
      tooltip.classList.remove('show');
    });

    // Proceed to payment
    document.getElementById('proceed-payment')?.addEventListener('click', () => {
      if (selectedSeats.length !== totalTickets) return;

      const updatedBooking = { ...bookingData, selectedSeats };
      sessionStorage.setItem('bookingData', JSON.stringify(updatedBooking));
      navigate('/booking/payment');
    });

    function updateSummary() {
      const listEl = document.getElementById('selected-seats-list');
      const countEl = document.getElementById('selected-count');
      const totalEl = document.getElementById('seat-total');
      const proceedBtn = document.getElementById('proceed-payment');

      if (selectedSeats.length === 0) {
        listEl.innerHTML = '<p class="text-muted">No seats selected yet</p>';
      } else {
        listEl.innerHTML = selectedSeats.map(s => `
          <div class="selected-seat-item">
            <span class="seat-label seat-label-${s.tier.toLowerCase()}">${s.id}</span>
            <span>${s.tier}</span>
            <span>${formatCurrency(s.price)}</span>
          </div>
        `).join('');
      }

      const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
      countEl.textContent = `${selectedSeats.length} / ${totalTickets}`;
      totalEl.textContent = formatCurrency(total);
      proceedBtn.disabled = selectedSeats.length !== totalTickets;
    }
  }

  return { html, init };
}

function renderSeatMap(seats) {
  const rows = {};
  seats.forEach(s => {
    if (!rows[s.row]) rows[s.row] = [];
    rows[s.row].push(s);
  });

  return Object.entries(rows).map(([rowIdx, rowSeats]) => `
    <div class="seat-row">
      <span class="seat-row-label">${rowSeats[0].rowLabel}</span>
      <div class="seat-row-seats">
        ${rowSeats.map((s, i) => `
          ${i === 7 ? '<div class="seat-aisle"></div>' : ''}
          <div class="seat ${s.status} ${s.tier.toLowerCase()}" data-seat-id="${s.id}" title="${s.id} - ${s.tier}">
            <span class="seat-number">${s.number}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}
