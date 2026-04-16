import { formatCurrency, getCurrentUser } from '../data.js';
import { navigate } from '../router.js';
import { api } from '../services/api.js';

export function PaymentPage() {
  const bookingRaw = sessionStorage.getItem('bookingData');
  if (!bookingRaw) {
    return {
      html: `<div class="container section"><div class="glass" style="padding:60px;text-align:center"><h2>No booking in progress</h2><button class="btn btn-primary" data-href="/events">Browse Events</button></div></div>`,
    };
  }

  const bookingData = JSON.parse(bookingRaw);
  const total = bookingData.selectedSeats?.reduce((s, seat) => s + seat.price, 0) || 0;
  const convenienceFee = Math.round(total * 0.03);
  const grandTotal = total + convenienceFee;
  const user = getCurrentUser();

  const html = `
    <div class="payment-page">
      <div class="container">
        <!-- PROGRESS BAR -->
        <div class="progress-bar-container stagger-item">
          <div class="progress-step completed">
            <div class="progress-step-circle">✓</div>
            <span class="progress-step-label">Select Event</span>
          </div>
          <div class="progress-line"><div class="progress-line-fill" style="width:100%"></div></div>
          <div class="progress-step completed">
            <div class="progress-step-circle">✓</div>
            <span class="progress-step-label">Choose Seats</span>
          </div>
          <div class="progress-line"><div class="progress-line-fill" style="width:100%"></div></div>
          <div class="progress-step active">
            <div class="progress-step-circle">3</div>
            <span class="progress-step-label">Payment</span>
          </div>
          <div class="progress-line"><div class="progress-line-fill" style="width:0%"></div></div>
          <div class="progress-step">
            <div class="progress-step-circle">4</div>
            <span class="progress-step-label">Confirmation</span>
          </div>
        </div>

        <div class="payment-layout">
          <!-- PAYMENT INFO -->
          <div class="payment-form-area">
            <div class="glass payment-section stagger-item">
              <h2>Booking Summary</h2>
              <p style="color:var(--text-muted);margin-bottom:16px">Review your order and proceed to pay via Razorpay's secure checkout.</p>
              
              <div class="input-group">
                <label for="pay-name">Full Name</label>
                <input class="input-field" type="text" id="pay-name" placeholder="Enter your full name" value="${user?.name || ''}" />
              </div>
              <div class="payment-row">
                <div class="input-group">
                  <label for="pay-email">Email Address</label>
                  <input class="input-field" type="email" id="pay-email" placeholder="your@email.com" value="${user?.email || ''}" />
                </div>
                <div class="input-group">
                  <label for="pay-phone">Phone Number</label>
                  <input class="input-field" type="tel" id="pay-phone" placeholder="+91 9876543210" />
                </div>
              </div>
            </div>

            <div class="glass payment-section stagger-item">
              <h2>💳 Payment via Razorpay</h2>
              <p style="color:var(--text-muted)">You'll be redirected to Razorpay's secure checkout to complete payment. Supports UPI, Cards, Wallets, and Net Banking.</p>
              <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
                <span class="badge badge-teal">💳 Cards</span>
                <span class="badge badge-indigo">📱 UPI</span>
                <span class="badge badge-gold">👛 Wallets</span>
                <span class="badge badge-teal">🏦 Net Banking</span>
              </div>
              <div style="margin-top:12px;padding:12px;border-radius:8px;background:rgba(99,102,241,0.08);font-size:13px;color:var(--text-muted)">
                <strong style="color:var(--indigo)">💡 Test Mode:</strong> Use Razorpay test card <code>4111 1111 1111 1111</code>, any future expiry, any CVV. For UPI, use <code>success@razorpay</code>.
              </div>
            </div>
          </div>

          <!-- ORDER SUMMARY -->
          <div class="payment-sidebar">
            <div class="glass payment-summary-card stagger-item">
              <h3>Order Summary</h3>
              <div class="payment-summary-event">
                <strong>${bookingData.event.title}</strong>
                <span>📅 ${new Date(bookingData.event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                <span>📍 ${bookingData.event.venue}</span>
              </div>
              
              <div class="payment-summary-seats">
                <h4>Seats (${bookingData.selectedSeats?.length || 0})</h4>
                ${(bookingData.selectedSeats || []).map(s => `
                  <div class="summary-seat-row">
                    <span>${s.id} (${s.tier})</span>
                    <span>${formatCurrency(s.price)}</span>
                  </div>
                `).join('')}
              </div>

              <div class="payment-summary-totals">
                <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(total)}</span></div>
                <div class="summary-row"><span>Convenience Fee</span><span>${formatCurrency(convenienceFee)}</span></div>
                <div class="summary-row summary-total"><span>Grand Total</span><span>${formatCurrency(grandTotal)}</span></div>
              </div>

              <button class="btn btn-primary btn-lg btn-breathing" id="pay-now-btn" style="width:100%" disabled>
                Loading payment gateway...
              </button>
              <p class="payment-secure-note">🔒 Secured by Razorpay · 256-bit SSL</p>

              <div id="payment-error" style="display:none;color:var(--red);text-align:center;margin-top:12px;font-size:14px"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- PROCESSING OVERLAY -->
      <div class="payment-overlay" id="payment-overlay">
        <div class="payment-processing glass">
          <div class="processing-spinner" id="processing-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <div class="processing-success" id="processing-success" style="display:none">
            <div class="success-checkmark">
              <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none" stroke="var(--green)" stroke-width="2"/><path fill="none" stroke="var(--green)" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
            </div>
          </div>
          <h3 id="processing-text">Processing Payment...</h3>
          <p id="processing-sub">Please do not close this window</p>
        </div>
      </div>
    </div>
  `;

  function init() {
    // FIX BUG #3: Load Razorpay SDK with proper onload/onerror tracking
    const payBtn = document.getElementById('pay-now-btn');
    const errorEl = document.getElementById('payment-error');

    const razorpayReady = new Promise((resolve, reject) => {
      if (window.Razorpay) {
        // Already loaded from a previous visit
        resolve();
        return;
      }

      const existingScript = document.getElementById('razorpay-sdk');
      if (existingScript) {
        // Script tag exists but hasn't loaded yet — attach handlers
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
        // Safety timeout in case events already fired
        setTimeout(() => {
          if (window.Razorpay) resolve();
        }, 2000);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    });

    // Enable pay button only after SDK loads
    razorpayReady
      .then(() => {
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.innerHTML = `💳 Pay ${formatCurrency(grandTotal)}`;
        }
      })
      .catch((err) => {
        if (payBtn) {
          payBtn.innerHTML = `❌ Payment gateway unavailable`;
        }
        if (errorEl) {
          errorEl.textContent = err.message + '. Please refresh the page.';
          errorEl.style.display = 'block';
        }
      });

    // Input validation glow
    document.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.add('valid');
          input.classList.remove('invalid');
        }
      });
    });

    // Pay button
    document.getElementById('pay-now-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('pay-name')?.value?.trim();
      const email = document.getElementById('pay-email')?.value?.trim();
      const phone = document.getElementById('pay-phone')?.value?.trim();

      errorEl.style.display = 'none';

      if (!name || !email) {
        if (!name) { const el = document.getElementById('pay-name'); el.classList.add('invalid'); el.focus(); }
        else if (!email) { const el = document.getElementById('pay-email'); el.classList.add('invalid'); el.focus(); }
        return;
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const el = document.getElementById('pay-email');
        el.classList.add('invalid');
        el.focus();
        errorEl.textContent = 'Please enter a valid email address';
        errorEl.style.display = 'block';
        return;
      }

      // FIX BUG #3: Ensure Razorpay SDK is loaded before proceeding
      if (!window.Razorpay) {
        errorEl.textContent = 'Payment gateway is still loading. Please wait a moment and try again.';
        errorEl.style.display = 'block';
        return;
      }

      const localPayBtn = document.getElementById('pay-now-btn');
      localPayBtn.innerHTML = '<span class="loading-spinner"></span> Creating Order...';
      localPayBtn.disabled = true;

      try {
        // Step 1: Create booking + Razorpay order on backend
        const result = await api.post('/bookings', {
          eventId: bookingData.eventId,
          seats: bookingData.selectedSeats,
          totalAmount: grandTotal,
        });

        localPayBtn.innerHTML = `💳 Pay ${formatCurrency(grandTotal)}`;
        localPayBtn.disabled = false;

        // Step 2: Open Razorpay checkout
        const options = {
          key: result.razorpayKeyId,
          amount: result.amount,
          currency: result.currency,
          name: 'EMATBS',
          description: `Tickets for ${bookingData.event.title}`,
          order_id: result.orderId,
          prefill: {
            name: name,
            email: email,
            contact: phone || '',
          },
          theme: {
            color: '#6366f1',
          },
          handler: async function (response) {
            // Step 3: Payment successful — verify on backend
            const overlay = document.getElementById('payment-overlay');
            overlay.classList.add('show');

            try {
              const verifyResult = await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: result.booking._id,
              });

              document.getElementById('processing-spinner').style.display = 'none';
              document.getElementById('processing-success').style.display = 'block';
              document.getElementById('processing-text').textContent = 'Payment Successful!';
              document.getElementById('processing-sub').textContent = 'Redirecting to your ticket...';

              // Store confirmed booking ID for confirmation page
              const updatedBooking = {
                ...bookingData,
                bookingId: result.booking._id,
                paidAmount: grandTotal,
                userInfo: { name, email, phone },
                bookingDate: new Date().toISOString(),
              };
              sessionStorage.setItem('bookingData', JSON.stringify(updatedBooking));

              setTimeout(() => {
                navigate('/booking/confirmation');
              }, 1500);
            } catch (verifyErr) {
              overlay.classList.remove('show');
              errorEl.textContent = 'Payment verification failed: ' + verifyErr.message;
              errorEl.style.display = 'block';
            }
          },
          modal: {
            ondismiss: function () {
              errorEl.textContent = 'Payment was cancelled. Your seats are still reserved — try again.';
              errorEl.style.display = 'block';
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          errorEl.textContent = `Payment failed: ${response.error.description}`;
          errorEl.style.display = 'block';
        });
        rzp.open();
      } catch (err) {
        localPayBtn.innerHTML = `💳 Pay ${formatCurrency(grandTotal)}`;
        localPayBtn.disabled = false;
        errorEl.textContent = err.message || 'Failed to create order';
        errorEl.style.display = 'block';
      }
    });
  }

  return { html, init };
}
