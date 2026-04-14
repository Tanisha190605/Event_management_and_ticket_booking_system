// Utility functions — NO static data

export const categories = ['All', 'Music', 'Conference', 'Comedy', 'Exhibition', 'Sports', 'Food'];

// Generate seat layout (10 rows x 15 cols) using real bookedSeatIds from API
export function generateSeatLayout(event) {
  const rows = 10;
  const cols = 15;
  const seats = [];
  const bookedSet = new Set(event.bookedSeatIds || []);
  const rowLabels = 'ABCDEFGHIJ';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let tier = 'General';
      let price = event.pricing?.General || 0;

      if (r < 2) {
        tier = 'VIP';
        price = event.pricing?.VIP || 0;
      } else if (r < 5) {
        tier = 'Premium';
        price = event.pricing?.Premium || 0;
      }

      const seatId = `${rowLabels[r]}${c + 1}`;

      seats.push({
        id: seatId,
        row: r,
        col: c,
        rowLabel: rowLabels[r],
        number: c + 1,
        tier,
        price,
        status: bookedSet.has(seatId) ? 'booked' : 'available',
      });
    }
  }

  return seats;
}

export function formatCurrency(amount) {
  return '₹' + (amount || 0).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

// Auth helpers
export function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// FIX BUG #1: logout uses SPA navigation instead of full page reload
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Use dynamic imports to avoid circular dependencies
  // SPA navigate instead of window.location.href which caused UI freezes
  import('./components/nav.js').then(({ refreshNav }) => {
    refreshNav();
  }).catch(() => {});
  import('./router.js').then(({ navigate }) => {
    navigate('/');
  }).catch(() => {
    // Fallback only if dynamic import fails
    window.location.href = '/';
  });
}
