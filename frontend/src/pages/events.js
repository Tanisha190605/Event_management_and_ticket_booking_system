import { categories, formatCurrency, formatDate } from '../data.js';
import { api } from '../services/api.js';

export function EventsPage() {
  let viewMode = 'grid';
  let dynamicEvents = [];

  const html = `
    <div class="events-page">
      <div class="container">
        <section class="events-header">
          <div class="stagger-item">
            <span class="badge badge-teal">🎪 All Events</span>
            <h1 class="page-title">Explore Events</h1>
            <p class="page-subtitle">Find and book tickets for amazing events happening around you</p>
          </div>
        </section>

        <div class="events-layout">
          <!-- FILTERS SIDEBAR -->
          <aside class="filters-sidebar glass floater stagger-item" id="filters-sidebar">
            <h3 class="filters-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
              Filters
            </h3>
            
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <div class="filter-chips" id="category-chips">
                ${categories.map(cat => `
                  <button class="filter-chip ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>
                `).join('')}
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">Price Range</label>
              <div class="price-range">
                <input type="range" class="input-range" min="0" max="10000" value="10000" id="price-range" />
                <div class="price-range-labels">
                  <span>₹0</span>
                  <span id="price-range-value">₹10,000</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">Sort By</label>
              <select class="input-field" id="sort-select">
                <option value="date">Date</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">City</label>
              <div class="filter-chips" id="city-chips">
                <!-- Cities populated dynamically -->
              </div>
            </div>
          </aside>

          <!-- EVENTS GRID -->
          <main class="events-main">
            <div class="events-toolbar stagger-item">
              <span class="events-count" id="events-count">Loading events...</span>
              <div class="view-toggle">
                <button class="view-btn active" id="grid-view-btn" title="Grid View">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"/></svg>
                </button>
                <button class="view-btn" id="list-view-btn" title="List View">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
                </button>
              </div>
            </div>
            <div class="events-grid" id="events-grid">
               <div style="text-align: center; grid-column: 1/-1; padding: 4rem;">
                 <span class="loading-spinner" style="width:40px; height:40px; border-width:4px; border-top-color:var(--primary); display:inline-block; border-radius:50%;"></span>
               </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `;

  async function init() {
    let currentCategory = 'All';
    let currentCity = 'All';
    let maxPrice = 10000;
    let sortBy = 'date';

    try {
      dynamicEvents = await api.get('/events');
      
      // Populate city chips dynamically
      const cities = ['All', ...new Set(dynamicEvents.map(e => e.city).filter(Boolean))];
      const cityChipsContainer = document.getElementById('city-chips');
      if (cityChipsContainer) {
         cityChipsContainer.innerHTML = cities.map(city => `
            <button class="filter-chip ${city === 'All' ? 'active' : ''}" data-city="${city}">${city}</button>
         `).join('');
      }
      
      filterAndRender();
    } catch(err) {
      document.getElementById('events-grid').innerHTML = `<p class="error-text" style="color:red;grid-column:1/-1;text-align:center;padding:2rem">Failed to load events: ${err.message}</p>`;
      document.getElementById('events-count').textContent = '0 events';
    }

    // Category filter
    document.getElementById('category-chips')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      document.querySelectorAll('#category-chips .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.category;
      filterAndRender();
    });

    // City filter
    document.getElementById('city-chips')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      document.querySelectorAll('#city-chips .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCity = chip.dataset.city;
      filterAndRender();
    });

    // Price range
    document.getElementById('price-range')?.addEventListener('input', (e) => {
      maxPrice = parseInt(e.target.value);
      document.getElementById('price-range-value').textContent = formatCurrency(maxPrice);
      filterAndRender();
    });

    // Sort
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      sortBy = e.target.value;
      filterAndRender();
    });

    // View toggle
    document.getElementById('grid-view-btn')?.addEventListener('click', () => {
      viewMode = 'grid';
      document.getElementById('grid-view-btn').classList.add('active');
      document.getElementById('list-view-btn').classList.remove('active');
      const grid = document.getElementById('events-grid');
      if (grid) grid.classList.remove('list-view');
      filterAndRender();
    });

    document.getElementById('list-view-btn')?.addEventListener('click', () => {
      viewMode = 'list';
      document.getElementById('list-view-btn').classList.add('active');
      document.getElementById('grid-view-btn').classList.remove('active');
      const grid = document.getElementById('events-grid');
      if (grid) grid.classList.add('list-view');
      filterAndRender();
    });

    function filterAndRender() {
      let filtered = [...dynamicEvents];
      if (currentCategory !== 'All') filtered = filtered.filter(e => e.category === currentCategory);
      if (currentCity !== 'All') filtered = filtered.filter(e => e.city === currentCity);
      filtered = filtered.filter(e => (e.pricing?.General || 0) <= maxPrice);

      if (sortBy === 'date') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      else if (sortBy === 'price-low') filtered.sort((a, b) => (a.pricing?.General || 0) - (b.pricing?.General || 0));
      else if (sortBy === 'price-high') filtered.sort((a, b) => (b.pricing?.General || 0) - (a.pricing?.General || 0));
      else if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      const grid = document.getElementById('events-grid');
      const count = document.getElementById('events-count');
      if (grid) {
        grid.innerHTML = filtered.length > 0 ? renderEventCards(filtered) : `
          <div class="no-events glass" style="grid-column:1/-1;text-align:center;padding:3rem">
            <span style="font-size:3rem">🔍</span>
            <h3>No events found</h3>
            <p>Try adjusting your filters</p>
          </div>
        `;
        grid.querySelectorAll('.stagger-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 60);
        });
      }
      if (count) count.textContent = `${filtered.length} events found`;
    }
  }

  return { html, init };
}

function renderEventCards(eventList) {
  return eventList.map((event, i) => `
    <div class="event-card floater stagger-item" data-href="/event/${event._id}" style="animation-delay:${i * 0.05}s">
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
          <span class="event-card-venue">📍 ${event.city}</span>
        </div>
        <p class="event-card-desc">${(event.description || '').substring(0, 80)}...</p>
        <div class="event-card-tags">
          ${(event.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="event-card-footer">
          <span class="event-card-price">From ${formatCurrency(event.pricing?.General || 0)}</span>
          <span class="event-card-seats ${(event.totalSeats - (event.bookedSeats || 0)) < 50 ? 'low-seats' : ''}">${event.totalSeats - (event.bookedSeats || 0)} left</span>
        </div>
      </div>
      <div class="event-card-glow"></div>
    </div>
  `).join('');
}
