import './styles/base.css';
import './styles/pages.css';
import './styles/booking.css';
import './styles/admin.css';
import './styles/auth.css';

import { initThreeBackground } from './three-bg.js';
import { registerRoute, initRouter } from './router.js';
import { initFloaterMotion } from './floater.js';
import { renderNav, initNav } from './components/nav.js';
import { LandingPage } from './pages/landing.js';
import { EventsPage } from './pages/events.js';
import { EventDetailPage } from './pages/event-detail.js';
import { BookingPage } from './pages/booking.js';
import { SeatSelectionPage } from './pages/seat-selection.js';
import { PaymentPage } from './pages/payment.js';
import { ConfirmationPage } from './pages/confirmation.js';
import { AdminPage } from './pages/admin.js';
import { AuthPage } from './pages/auth.js';
import { AdminAuthPage } from './pages/admin-auth.js';
import { MyBookingsPage } from './pages/my-bookings.js';

// Initialize Three.js background
initThreeBackground();

// Initialize Floater Motion
initFloaterMotion();

// Add navigation
const navContainer = document.createElement('div');
navContainer.innerHTML = renderNav();
document.getElementById('app').before(navContainer);
initNav();

// Register routes
registerRoute('/', () => LandingPage());
registerRoute('/events', () => EventsPage());
registerRoute('/event/:id', (params) => EventDetailPage(params));
registerRoute('/booking', () => BookingPage());
registerRoute('/booking/seats/:id', (params) => SeatSelectionPage(params));
registerRoute('/booking/payment', () => PaymentPage());
registerRoute('/booking/confirmation', () => ConfirmationPage());
registerRoute('/admin', () => AdminPage());
registerRoute('/admin/dashboard', () => AdminPage());
registerRoute('/auth', () => AuthPage());
registerRoute('/admin/auth', () => AdminAuthPage());
registerRoute('/my-bookings', () => MyBookingsPage());

// Initialize router
initRouter();
