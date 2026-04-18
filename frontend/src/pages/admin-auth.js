import { navigate } from '../router.js';
import { api } from '../services/api.js';
import { refreshNav } from '../components/nav.js';

export function AdminAuthPage() {
  const html = `
    <div class="auth-page">
      <div class="auth-card admin-theme">
        <div class="auth-header">
          <div class="auth-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 class="auth-title" id="auth-main-title">Admin Login</h1>
          <p class="auth-subtitle" id="auth-sub-title">Login to manage events and bookings</p>
        </div>

        <!-- LOGIN FORM -->
        <form class="auth-form active" id="admin-login-form">
          <div class="input-group">
            <label>Admin Email</label>
            <input type="email" id="admin-email" class="input-field" placeholder="admin@ematbs.com" required />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" id="admin-password" class="input-field" placeholder="Enter admin password" required />
          </div>
          
          <div id="admin-message" class="auth-message"></div>

          <button type="submit" class="auth-btn" id="admin-login-btn">Login as Admin</button>
          
          <div style="text-align: center; margin-top: 24px;">
            <button type="button" class="auth-link" data-href="/">← Return to Website</button>
          </div>
        </form>



      </div>
    </div>
  `;

  function init() {
    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;
      const btn = document.getElementById('admin-login-btn');
      const msg = document.getElementById('admin-message');

      msg.className = 'auth-message';
      btn.innerHTML = '<span class="loading-spinner"></span>';
      btn.disabled = true;

      try {
        const response = await api.post('/auth/admin-login', { email, password });

        if (response.user.role !== 'admin') {
          msg.textContent = 'This account does not have admin privileges';
          msg.className = 'auth-message error';
          btn.innerHTML = 'Login as Admin';
          btn.disabled = false;
          return;
        }

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          name: response.user.name,
          email: response.user.email,
          id: response.user.id,
          role: response.user.role,
        }));

        msg.textContent = 'Admin access granted!';
        msg.className = 'auth-message success';
        btn.innerHTML = 'Authenticated ✓';

        refreshNav();

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } catch (err) {
        msg.textContent = err.message || 'Invalid admin credentials';
        msg.className = 'auth-message error';
        btn.innerHTML = 'Login as Admin';
        btn.disabled = false;
      }
    });


  }

  return { html, init };
}
