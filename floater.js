// Floater Motion - Floating UI animation system

export function initFloaterMotion() {
  // Apply float + tilt to all .floater elements
  document.addEventListener('mousemove', handleGlobalTilt);
  observeFloaters();
}

function handleGlobalTilt(e) {
  const floaters = document.querySelectorAll('.floater');
  floaters.forEach(el => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 2) {
      const rotateX = deltaY * -5;
      const rotateY = deltaX * 5;
      const scale = el.matches(':hover') ? 1.04 : 1;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    }
  });
}

function observeFloaters() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.floater:not([data-floater-init])').forEach(el => {
      el.dataset.floaterInit = 'true';
      el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';

      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(99,102,241,0.15)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        el.style.boxShadow = '';
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  // Initial pass
  document.querySelectorAll('.floater').forEach(el => {
    el.dataset.floaterInit = 'true';
    el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
  });
}

// Spring animation helper
export function springAnimation(element, properties, { stiffness = 180, damping = 12, mass = 1 } = {}) {
  const keys = Object.keys(properties);
  const current = {};
  const velocity = {};
  const target = {};

  keys.forEach(key => {
    current[key] = parseFloat(getComputedStyle(element)[key]) || 0;
    velocity[key] = 0;
    target[key] = properties[key];
  });

  let animating = true;

  function step() {
    if (!animating) return;

    let allSettled = true;
    keys.forEach(key => {
      const displacement = current[key] - target[key];
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocity[key];
      const acceleration = (springForce + dampingForce) / mass;
      velocity[key] += acceleration * 0.016;
      current[key] += velocity[key] * 0.016;

      if (Math.abs(velocity[key]) > 0.01 || Math.abs(displacement) > 0.01) {
        allSettled = false;
      }

      element.style[key] = `${current[key]}px`;
    });

    if (!allSettled) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);

  return () => { animating = false; };
}

// Stagger children animation
export function staggerReveal(container, selector = '.stagger-item', delay = 80) {
  const items = container.querySelectorAll(selector);
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, i * delay);
  });
}
