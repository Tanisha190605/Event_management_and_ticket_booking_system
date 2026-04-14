import { formatCurrency, formatDate, isAdmin } from '../data.js';
import { api } from '../services/api.js';
import { navigate } from '../router.js';

export function AdminPage() {
  if (!isAdmin()) {
    setTimeout(() => navigate('/admin/auth'), 0);
    return { html: '<div></div>' };
  }

  const html = `
    <div class="admin-page">
      <!-- ADMIN SIDEBAR -->
      <aside class="admin-sidebar glass" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <span class="nav-logo">✦ EMATBS</span>
          <span class="admin-label badge badge-indigo">Admin</span>
        </div>
        <nav class="admin-nav">
          <button class="admin-nav-item active" data-tab="dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </button>
          <button class="admin-nav-item" data-tab="events">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Events
          </button>
          <button class="admin-nav-item" data-tab="bookings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            Bookings
          </button>
          <button class="admin-nav-item" data-tab="analytics">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Analytics
          </button>
        </nav>
        <div class="admin-sidebar-footer">
          <button class="btn btn-ghost btn-sm" data-href="/">← Back to Site</button>
        </div>
      </aside>

      <!-- ADMIN CONTENT -->
      <main class="admin-content" id="admin-content">
        <div class="admin-content-wrapper">
          <div class="admin-topbar">
            <button class="admin-sidebar-toggle" id="sidebar-toggle">☰</button>
            <h1 class="admin-page-title" id="admin-page-title">Dashboard</h1>
            <div class="admin-topbar-right">
              <span class="admin-date">${new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <!-- DASHBOARD TAB -->
          <div class="admin-tab active" id="tab-dashboard">
            <div style="text-align:center;padding:4rem"><span class="loading-spinner" style="width:40px;height:40px;border-width:4px;border-top-color:var(--primary);display:inline-block;border-radius:50%;"></span></div>
          </div>

          <!-- EVENTS TAB -->
          <div class="admin-tab" id="tab-events">
            <div style="text-align:center;padding:4rem"><span class="loading-spinner" style="width:40px;height:40px;border-width:4px;border-top-color:var(--primary);display:inline-block;border-radius:50%;"></span></div>
          </div>

          <!-- BOOKINGS TAB -->
          <div class="admin-tab" id="tab-bookings">
            <div style="text-align:center;padding:4rem"><span class="loading-spinner" style="width:40px;height:40px;border-width:4px;border-top-color:var(--primary);display:inline-block;border-radius:50%;"></span></div>
          </div>

          <!-- ANALYTICS TAB -->
          <div class="admin-tab" id="tab-analytics">
            <div style="text-align:center;padding:4rem"><span class="loading-spinner" style="width:40px;height:40px;border-width:4px;border-top-color:var(--primary);display:inline-block;border-radius:50%;"></span></div>
          </div>
        </div>
      </main>
    </div>
  `;

  function init() {
    // Tab switching
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${tab}`)?.classList.add('active');
        document.getElementById('admin-page-title').textContent = btn.textContent.trim();

        if (tab === 'dashboard') loadDashboard();
        if (tab === 'events') loadEvents();
        if (tab === 'bookings') loadBookings();
        if (tab === 'analytics') loadAnalytics();
      });
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('admin-sidebar')?.classList.toggle('collapsed');
    });

    // Load dashboard initially
    loadDashboard();
  }

  return { html, init };
}

async function loadDashboard() {
  const tab = document.getElementById('tab-dashboard');
  try {
    const stats = await api.get('/stats');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    tab.innerHTML = `
      <div class="admin-stats-grid">
        ${[
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', color: 'var(--green)' },
          { label: 'Total Bookings', value: stats.totalBookings.toString(), icon: '🎫', color: 'var(--indigo)' },
          { label: 'Total Users', value: stats.totalUsers.toString(), icon: '👥', color: 'var(--sky)' },
          { label: 'Active Events', value: stats.activeEvents.toString(), icon: '🎪', color: 'var(--teal)' },
        ].map((stat, i) => `
          <div class="admin-stat-card glass floater stagger-item" style="--stat-color: ${stat.color}; animation-delay: ${i * 0.1}s">
            <div class="stat-card-header">
              <span class="stat-icon">${stat.icon}</span>
            </div>
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
            <div class="stat-bar"><div class="stat-bar-fill" style="background: ${stat.color}; width: ${60 + Math.random() * 40}%"></div></div>
          </div>
        `).join('')}
      </div>

      <div class="admin-dashboard-split">
        <!-- Revenue Chart -->
        <div class="admin-chart-section glass stagger-item">
          <h3>Revenue Overview</h3>
          <div class="chart-container" id="revenue-chart">
            <div class="bar-chart">
              ${stats.monthlyRevenue.map((val, i) => {
                const maxVal = Math.max(...stats.monthlyRevenue, 1);
                const height = (val / maxVal) * 100;
                return `
                  <div class="bar-group">
                    <div class="bar" style="height: ${height}%; background: linear-gradient(to top, var(--indigo), var(--sky));" data-value="${formatCurrency(val)}">
                      <span class="bar-tooltip">${formatCurrency(val)}</span>
                    </div>
                    <span class="bar-label">${months[i]}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="admin-recent glass stagger-item">
          <h3>Recent Bookings</h3>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr><th>User</th><th>Event</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                ${stats.recentBookings.slice(0, 5).map(b => `
                  <tr>
                    <td>${b.user?.name || 'N/A'}</td>
                    <td>${(b.event?.title || 'N/A').substring(0, 25)}</td>
                    <td>${formatCurrency(b.totalAmount)}</td>
                    <td><span class="status-dot ${b.bookingStatus}"></span> ${b.bookingStatus}</td>
                  </tr>
                `).join('')}
                ${stats.recentBookings.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No bookings yet</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    tab.querySelectorAll('.stagger-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 80);
    });
  } catch (err) {
    tab.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red)">Failed to load stats: ${err.message}</div>`;
  }
}

async function loadEvents() {
  const tab = document.getElementById('tab-events');
  try {
    const events = await api.get('/events');

    tab.innerHTML = `
      <div class="admin-toolbar stagger-item">
        <button class="btn btn-primary" id="create-event-btn">+ Create Event</button>
      </div>
      <div class="admin-events-list">
        ${events.map((event, i) => `
          <div class="admin-event-row glass floater stagger-item" data-event-id="${event._id}" style="animation-delay:${i*0.05}s">
            <div class="admin-event-left">
              <img src="${event.image}" class="admin-event-thumb" alt="${event.title}" />
              <div class="admin-event-date-cat">
                <span class="badge badge-indigo">${event.category}</span>
                <span class="text-muted" style="font-size: 12px;">${formatDate(event.date)}</span>
              </div>
            </div>
            <div class="admin-event-center">
              <h4>${event.title}</h4>
              <span class="text-muted">${event.venue}, ${event.city}</span>
              <div class="admin-event-stats">
                <span>${event.bookedSeats || 0}/${event.totalSeats} booked</span>
              </div>
            </div>
            <div class="admin-event-actions">
              <button class="btn btn-ghost btn-sm edit-event-btn" style="color:var(--indigo)" data-id="${event._id}">✏️ Edit</button>
              <button class="btn btn-ghost btn-sm delete-event-btn" style="color:var(--red)" data-id="${event._id}">🗑️ Delete</button>
            </div>
          </div>
        `).join('')}
        ${events.length === 0 ? '<div style="text-align:center;padding:2rem;color:var(--text-muted)">No events yet. Create your first event!</div>' : ''}
      </div>

      <!-- Create/Edit Event Modal -->
      <div class="modal-overlay" id="event-modal">
        <div class="modal glass">
          <div class="modal-header">
            <h2 id="event-modal-title">Create New Event</h2>
            <button class="modal-close" id="close-event-modal">✕</button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="evt-edit-id" value="" />
            <div class="input-group">
              <label>Event Title *</label>
              <input class="input-field" type="text" id="evt-title" placeholder="Enter event title" required />
            </div>
            <div class="payment-row">
              <div class="input-group">
                <label>Category *</label>
                <select class="input-field" id="evt-category"><option>Music</option><option>Conference</option><option>Comedy</option><option>Exhibition</option><option>Sports</option><option>Food</option></select>
              </div>
              <div class="input-group">
                <label>Date *</label>
                <input class="input-field" type="date" id="evt-date" />
              </div>
            </div>
            <div class="payment-row">
              <div class="input-group">
                <label>Time</label>
                <input class="input-field" type="time" id="evt-time" value="18:00" />
              </div>
              <div class="input-group">
                <label>City *</label>
                <input class="input-field" type="text" id="evt-city" placeholder="Mumbai" />
              </div>
            </div>
            <div class="input-group">
              <label>Venue *</label>
              <input class="input-field" type="text" id="evt-venue" placeholder="Enter venue name" />
            </div>
            <div class="input-group">
              <label>Organizer</label>
              <input class="input-field" type="text" id="evt-organizer" placeholder="Organizer name" />
            </div>
            <div class="input-group">
              <label>Description</label>
              <textarea class="input-field" rows="3" id="evt-desc" placeholder="Event description..."></textarea>
            </div>
            <h3 style="margin:16px 0 8px">Pricing Tiers (₹)</h3>
            <div class="payment-row" style="gap:12px">
              <div class="input-group">
                <label>VIP</label>
                <input class="input-field" type="number" id="evt-vip" placeholder="4999" />
              </div>
              <div class="input-group">
                <label>Premium</label>
                <input class="input-field" type="number" id="evt-premium" placeholder="2999" />
              </div>
              <div class="input-group">
                <label>General</label>
                <input class="input-field" type="number" id="evt-general" placeholder="999" />
              </div>
            </div>
            <div class="payment-row">
              <div class="input-group">
                <label>Total Seats</label>
                <input class="input-field" type="number" id="evt-seats" value="150" />
              </div>
              <div class="input-group">
                <label>Featured</label>
                <select class="input-field" id="evt-featured"><option value="true">Yes</option><option value="false">No</option></select>
              </div>
            </div>
            <div class="input-group">
              <label>Event Image URL</label>
              <input class="input-field" type="url" id="evt-image" placeholder="https://images.unsplash.com/..." />
            </div>
            <div class="input-group">
              <label>Tags (comma separated)</label>
              <input class="input-field" type="text" id="evt-tags" placeholder="Music, Live, Night Event" />
            </div>
            <div id="create-event-error" class="auth-message" style="margin-top:8px"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" id="close-event-modal-2">Cancel</button>
            <button class="btn btn-primary" id="save-event-btn">Create Event</button>
          </div>
        </div>
      </div>
    `;

    // Create event modal - open
    document.getElementById('create-event-btn')?.addEventListener('click', () => {
      // Reset form for create mode
      document.getElementById('evt-edit-id').value = '';
      document.getElementById('event-modal-title').textContent = 'Create New Event';
      document.getElementById('save-event-btn').textContent = 'Create Event';
      document.getElementById('evt-title').value = '';
      document.getElementById('evt-category').value = 'Music';
      document.getElementById('evt-date').value = '';
      document.getElementById('evt-time').value = '18:00';
      document.getElementById('evt-city').value = '';
      document.getElementById('evt-venue').value = '';
      document.getElementById('evt-organizer').value = '';
      document.getElementById('evt-desc').value = '';
      document.getElementById('evt-vip').value = '';
      document.getElementById('evt-premium').value = '';
      document.getElementById('evt-general').value = '';
      document.getElementById('evt-seats').value = '150';
      document.getElementById('evt-featured').value = 'true';
      document.getElementById('evt-image').value = '';
      document.getElementById('evt-tags').value = '';
      document.getElementById('create-event-error').className = 'auth-message';
      document.getElementById('create-event-error').textContent = '';
      document.getElementById('event-modal')?.classList.add('show');
    });

    // Close modal
    document.getElementById('close-event-modal')?.addEventListener('click', () => {
      document.getElementById('event-modal')?.classList.remove('show');
    });
    document.getElementById('close-event-modal-2')?.addEventListener('click', () => {
      document.getElementById('event-modal')?.classList.remove('show');
    });

    // FIX BUG #6: Edit event buttons
    tab.querySelectorAll('.edit-event-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const eventId = btn.dataset.id;
        btn.innerHTML = '<span class="loading-spinner"></span>';
        btn.disabled = true;

        try {
          const event = await api.get(`/events/${eventId}`);

          // Fill form with event data
          document.getElementById('evt-edit-id').value = event._id;
          document.getElementById('event-modal-title').textContent = 'Edit Event';
          document.getElementById('save-event-btn').textContent = 'Update Event';
          document.getElementById('evt-title').value = event.title || '';
          document.getElementById('evt-category').value = event.category || 'Music';
          document.getElementById('evt-date').value = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
          document.getElementById('evt-time').value = event.time || '18:00';
          document.getElementById('evt-city').value = event.city || '';
          document.getElementById('evt-venue').value = event.venue || '';
          document.getElementById('evt-organizer').value = event.organizer || '';
          document.getElementById('evt-desc').value = event.description || '';
          document.getElementById('evt-vip').value = event.pricing?.VIP || '';
          document.getElementById('evt-premium').value = event.pricing?.Premium || '';
          document.getElementById('evt-general').value = event.pricing?.General || '';
          document.getElementById('evt-seats').value = event.totalSeats || 150;
          document.getElementById('evt-featured').value = event.featured ? 'true' : 'false';
          document.getElementById('evt-image').value = event.image || '';
          document.getElementById('evt-tags').value = (event.tags || []).join(', ');
          document.getElementById('create-event-error').className = 'auth-message';
          document.getElementById('create-event-error').textContent = '';
          document.getElementById('event-modal')?.classList.add('show');
        } catch (err) {
          showToast('Failed to load event: ' + err.message);
        }
        btn.innerHTML = '✏️ Edit';
        btn.disabled = false;
      });
    });

    // FIX BUG #5: Save event (create or update) — properly reset button in all cases
    document.getElementById('save-event-btn')?.addEventListener('click', async () => {
      const errEl = document.getElementById('create-event-error');
      errEl.className = 'auth-message';
      errEl.textContent = '';

      const editId = document.getElementById('evt-edit-id').value;
      const title = document.getElementById('evt-title').value.trim();
      const category = document.getElementById('evt-category').value;
      const date = document.getElementById('evt-date').value;
      const time = document.getElementById('evt-time').value;
      const venue = document.getElementById('evt-venue').value.trim();
      const city = document.getElementById('evt-city').value.trim();
      const organizer = document.getElementById('evt-organizer').value.trim();
      const description = document.getElementById('evt-desc').value.trim();
      const image = document.getElementById('evt-image').value.trim();
      const tags = document.getElementById('evt-tags').value.split(',').map(t => t.trim()).filter(Boolean);
      const totalSeats = parseInt(document.getElementById('evt-seats').value) || 150;
      const featured = document.getElementById('evt-featured').value === 'true';

      if (!title || !date || !venue || !city) {
        errEl.textContent = 'Title, date, venue, and city are required';
        errEl.className = 'auth-message error';
        return;
      }

      const btn = document.getElementById('save-event-btn');
      const originalText = btn.textContent;
      btn.innerHTML = '<span class="loading-spinner"></span>';
      btn.disabled = true;

      const eventData = {
        title, category, date, time, venue, city,
        organizer: organizer || 'EMATBS',
        description: description || `${title} — an exciting ${category.toLowerCase()} event in ${city}.`,
        image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
        banner: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=500&fit=crop',
        tags, totalSeats, featured,
        pricing: {
          VIP: parseInt(document.getElementById('evt-vip').value) || 0,
          Premium: parseInt(document.getElementById('evt-premium').value) || 0,
          General: parseInt(document.getElementById('evt-general').value) || 0,
        },
      };

      try {
        if (editId) {
          // Update existing event
          await api.put(`/events/${editId}`, eventData);
          showToast('Event updated successfully!');
        } else {
          // Create new event
          await api.post('/events', eventData);
          showToast('Event created successfully!');
        }
        document.getElementById('event-modal')?.classList.remove('show');
        loadEvents(); // Reload list
      } catch (err) {
        errEl.textContent = err.message;
        errEl.className = 'auth-message error';
        // FIX BUG #5: Always reset button text on error
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });

    // FIX BUG #7: Delete event buttons with loading state
    tab.querySelectorAll('.delete-event-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this event?')) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loading-spinner"></span>';
        btn.disabled = true;

        try {
          await api.delete(`/events/${btn.dataset.id}`);
          showToast('Event deleted');
          loadEvents();
        } catch (err) {
          showToast('Delete failed: ' + err.message);
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    });

    tab.querySelectorAll('.stagger-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 60);
    });
  } catch (err) {
    tab.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red)">Failed to load events: ${err.message}</div>`;
  }
}

async function loadBookings() {
  const tab = document.getElementById('tab-bookings');
  try {
    const bookings = await api.get('/bookings');

    tab.innerHTML = `
      <div class="admin-toolbar stagger-item">
        <div class="payment-row" style="gap:12px;align-items:end">
          <div class="input-group" style="margin:0">
            <label>Filter by Status</label>
            <select class="input-field" id="booking-filter">
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div class="admin-table-wrapper glass stagger-item">
        <table class="admin-table">
          <thead>
            <tr><th>Event</th><th>User</th><th>Seats</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${bookings.map(b => `
              <tr class="booking-row" data-status="${b.bookingStatus}">
                <td>${(b.event?.title || 'N/A').substring(0, 30)}</td>
                <td>${b.user?.name || 'N/A'}<br/><small style="color:var(--text-muted)">${b.user?.email || ''}</small></td>
                <td>${b.seats.map(s => s.id).join(', ')}</td>
                <td>${formatCurrency(b.totalAmount)}</td>
                <td><span class="badge ${b.paymentStatus === 'completed' ? 'badge-green' : 'badge-gold'}">${b.paymentStatus}</span></td>
                <td><span class="status-indicator ${b.bookingStatus}"><span class="status-dot ${b.bookingStatus}"></span>${b.bookingStatus}</span></td>
                <td style="display:flex; gap:8px;">
                  ${b.bookingStatus !== 'cancelled' ? '<button class="btn btn-ghost btn-sm cancel-booking-btn" style="color:var(--red); padding:4px 8px; font-size:12px;" data-id="' + b._id + '">Cancel</button>' : ''}
                  ${b.bookingStatus === 'pending' ? '<button class="btn btn-ghost btn-sm confirm-booking-btn" style="color:var(--green); padding:4px 8px; font-size:12px;" data-id="' + b._id + '">Confirm</button>' : ''}
                </td>
              </tr>
            `).join('')}
            ${bookings.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No bookings yet</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    `;

    // Booking filter
    document.getElementById('booking-filter')?.addEventListener('change', (e) => {
      const val = e.target.value;
      document.querySelectorAll('.booking-row').forEach(row => {
        row.style.display = (val === 'all' || row.dataset.status === val) ? '' : 'none';
      });
    });

    // Booking actions
    tab.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to cancel this booking? This will unlock the seats.')) return;
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loading-spinner"></span>';
        btn.disabled = true;

        try {
          await api.put(`/bookings/${btn.dataset.id}/status`, { status: 'cancelled' });
          showToast('Booking cancelled');
          loadBookings();
        } catch (err) {
          showToast('Failed to cancel: ' + err.message);
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    });

    tab.querySelectorAll('.confirm-booking-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loading-spinner"></span>';
        btn.disabled = true;

        try {
          await api.put(`/bookings/${btn.dataset.id}/status`, { status: 'confirmed' });
          showToast('Booking confirmed');
          loadBookings();
        } catch (err) {
          showToast('Failed to confirm: ' + err.message);
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    });

    tab.querySelectorAll('.stagger-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 80);
    });
  } catch (err) {
    tab.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red)">Failed to load bookings: ${err.message}</div>`;
  }
}

async function loadAnalytics() {
  const tab = document.getElementById('tab-analytics');
  try {
    const stats = await api.get('/stats');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const maxMonthly = Math.max(...stats.monthlyRevenue, 1);

    const totalTierTickets = Object.values(stats.tierBreakdown || {}).reduce((s, t) => s + t.count, 0) || 1;

    tab.innerHTML = `
      <div class="analytics-grid">
        <!-- Ticket Sales Breakdown -->
        <div class="glass analytics-card stagger-item">
          <h3>Ticket Sales by Tier</h3>
          <div class="donut-chart-wrapper">
            <div class="donut-chart">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="16"/>
                ${(() => {
                  const tiers = stats.tierBreakdown || {};
                  const vip = tiers.VIP?.count || 0;
                  const premium = tiers.Premium?.count || 0;
                  const general = tiers.General?.count || 0;
                  const total = vip + premium + general || 1;
                  const circ = 2 * Math.PI * 50;
                  const vipLen = (vip / total) * circ;
                  const premLen = (premium / total) * circ;
                  const genLen = (general / total) * circ;
                  return `
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gold)" stroke-width="16" stroke-dasharray="${vipLen} ${circ - vipLen}" stroke-dashoffset="0" class="donut-segment"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--indigo)" stroke-width="16" stroke-dasharray="${premLen} ${circ - premLen}" stroke-dashoffset="${-vipLen}" class="donut-segment"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--teal)" stroke-width="16" stroke-dasharray="${genLen} ${circ - genLen}" stroke-dashoffset="${-(vipLen + premLen)}" class="donut-segment"/>
                  `;
                })()}
              </svg>
              <div class="donut-center">
                <span class="donut-total">${stats.totalBookings}</span>
                <span class="donut-label">Total</span>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-row"><span class="legend-dot" style="background:var(--gold)"></span> VIP <strong>${stats.tierBreakdown?.VIP?.count || 0}</strong></div>
              <div class="legend-row"><span class="legend-dot" style="background:var(--indigo)"></span> Premium <strong>${stats.tierBreakdown?.Premium?.count || 0}</strong></div>
              <div class="legend-row"><span class="legend-dot" style="background:var(--teal)"></span> General <strong>${stats.tierBreakdown?.General?.count || 0}</strong></div>
            </div>
          </div>
        </div>

        <!-- Monthly Trend -->
        <div class="glass analytics-card stagger-item">
          <h3>Monthly Revenue Trend</h3>
          <div class="line-chart">
            <svg viewBox="0 0 600 200" class="trend-svg">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--indigo)" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="var(--indigo)" stop-opacity="0"/>
                </linearGradient>
              </defs>
              ${(() => {
                const pts = stats.monthlyRevenue.map((v, i) => {
                  const x = (i / 11) * 560 + 20;
                  const y = 180 - (v / maxMonthly) * 160;
                  return `${x},${y}`;
                });
                const areaPath = `M20,180 L${pts.join(' L')} L580,180 Z`;
                const linePath = `M${pts.join(' L')}`;
                return `
                  <path d="${areaPath}" fill="url(#lineGrad)"/>
                  <path d="${linePath}" fill="none" stroke="var(--indigo)" stroke-width="2.5" stroke-linecap="round" class="trend-line"/>
                  ${stats.monthlyRevenue.map((v, i) => {
                    const x = (i / 11) * 560 + 20;
                    const y = 180 - (v / maxMonthly) * 160;
                    return `<circle cx="${x}" cy="${y}" r="4" fill="var(--indigo)" stroke="var(--bg-dark)" stroke-width="2"/>`;
                  }).join('')}
                `;
              })()}
            </svg>
          </div>
        </div>

        <!-- Sales by Event -->
        <div class="glass analytics-card stagger-item" style="grid-column: 1 / -1">
          <h3>Sales by Event</h3>
          <div class="horizontal-bars">
            ${(stats.eventStats || []).map(e => {
              const pct = e.totalSeats > 0 ? Math.round(((e.bookedSeats || 0) / e.totalSeats) * 100) : 0;
              return `
                <div class="h-bar-row">
                  <span class="h-bar-label">${e.title.length > 24 ? e.title.substring(0,24)+'...' : e.title}</span>
                  <div class="h-bar-track">
                    <div class="h-bar-fill" style="width:${pct}%; background: linear-gradient(90deg, var(--indigo), var(--sky))"></div>
                  </div>
                  <span class="h-bar-value">${pct}%</span>
                </div>
              `;
            }).join('')}
            ${(stats.eventStats || []).length === 0 ? '<p style="color:var(--text-muted);text-align:center">No event data</p>' : ''}
          </div>
        </div>
      </div>
    `;

    tab.querySelectorAll('.stagger-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 80);
    });

    // Animate bars
    setTimeout(() => {
      tab.querySelectorAll('.h-bar-fill').forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w; }, i * 80);
      });
    }, 300);
  } catch (err) {
    tab.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red)">Failed to load analytics: ${err.message}</div>`;
  }
}


function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> ${message}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
