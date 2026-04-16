import { navigate } from '../router.js';
import { api } from '../services/api.js';
import { refreshNav } from '../components/nav.js';

export function AuthPage() {
  // Check for verification redirect
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get('verified');
  let verifyMessage = '';
  if (verified === 'success') {
    verifyMessage = '<div class="auth-message success" style="margin-bottom:16px">✅ Email verified successfully! You can now log in.</div>';
  } else if (verified === 'error') {
    verifyMessage = '<div class="auth-message error" style="margin-bottom:16px">❌ Email verification failed. The link may be expired.</div>';
  }

  const html = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h1 class="auth-title">Welcome</h1>
          <p class="auth-subtitle">Join us and experience the future of events</p>
        </div>

        ${verifyMessage}

        <div class="auth-tabs">
          <button class="auth-tab active" data-target="login" type="button">Login</button>
          <button class="auth-tab" data-target="signup" type="button">Signup</button>
        </div>

        <!-- Login Form -->
        <form class="auth-form active" id="login-form">
          <div class="input-group">
            <label>Email</label>
            <input type="email" id="login-email" class="input-field" placeholder="Enter your email" required />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" id="login-password" class="input-field" placeholder="Enter your password" required />
          </div>
          
          <div class="auth-form-footer">
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" /> Remember me
            </label>
          </div>

          <div id="login-message" class="auth-message"></div>

          <button type="submit" class="auth-btn" id="login-btn">Login</button>

          <div class="auth-divider">or</div>

          <div style="text-align: center;">
            <button type="button" class="auth-link" style="text-decoration: underline;" data-href="/">Continue as Guest</button>
          </div>
        </form>

        <!-- Signup Form -->
        <form class="auth-form" id="signup-form">
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" id="signup-name" class="input-field" placeholder="John Doe" required />
          </div>
          <div class="input-group">
            <label>Email</label>
            <input type="email" id="signup-email" class="input-field" placeholder="Enter your email" required />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" id="signup-password" class="input-field" placeholder="Create a password (min 6 chars)" required />
          </div>
          <div class="input-group">
            <label>Confirm Password</label>
            <input type="password" id="signup-confirm" class="input-field" placeholder="Confirm your password" required />
          </div>
          
          <div id="signup-message" class="auth-message"></div>

          <button type="submit" class="auth-btn" id="signup-btn">Create Account</button>
        </form>

      </div>
    </div>
  `;

  function init() {
    // Tab switching logic
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.target}-form`).classList.add('active');
        document.getElementById('login-message').className = 'auth-message';
        document.getElementById('signup-message').className = 'auth-message';
      });
    });

    // Login Form Submit
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const btn = document.getElementById('login-btn');
      const msg = document.getElementById('login-message');

      msg.className = 'auth-message';
      btn.innerHTML = '<span class="loading-spinner"></span>';

      try {
        const response = await api.post('/auth/login', { email, password: pass });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          name: response.name,
          email: response.email,
          id: response._id,
          role: response.role,
        }));
        msg.textContent = 'Login successful!';
        msg.className = 'auth-message success';
        btn.innerHTML = 'Success!';

        refreshNav();

        // Check for redirect
        const redirect = sessionStorage.getItem('redirectAfterLogin');
        sessionStorage.removeItem('redirectAfterLogin');

        setTimeout(() => {
          navigate(redirect || '/events');
        }, 500);
      } catch (err) {
        msg.textContent = err.message || 'Login failed';
        msg.className = 'auth-message error';
        btn.innerHTML = 'Login';
      }
    });

    // Signup Form Submit
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      const btn = document.getElementById('signup-btn');
      const msg = document.getElementById('signup-message');

      msg.className = 'auth-message';

      if (pass !== confirm) {
        msg.textContent = 'Passwords do not match';
        msg.className = 'auth-message error';
        return;
      }

      if (pass.length < 6) {
        msg.textContent = 'Password must be at least 6 characters';
        msg.className = 'auth-message error';
        return;
      }

      btn.innerHTML = '<span class="loading-spinner"></span>';

      try {
        const response = await api.post('/auth/signup', { name, email, password: pass });
        msg.textContent = response.message || 'Account created! Please verify your email.';
        msg.className = 'auth-message success';
        btn.innerHTML = 'Success!';

        // Switch to login tab after 1.5 seconds
        setTimeout(() => {
          tabs[0].click();
          document.getElementById('login-email').value = email;
        }, 1500);
      } catch (err) {
        msg.textContent = err.message || 'Signup failed';
        msg.className = 'auth-message error';
        btn.innerHTML = 'Create Account';
      }
    });
  }

  return { html, init };
}
