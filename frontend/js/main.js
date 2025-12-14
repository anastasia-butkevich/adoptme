document.addEventListener('DOMContentLoaded', () => {
  styleCards();
  appendMainHint();
  ensureFooterDate();
  ensureAccordion();
  ensureThemeToggle();
  loadTheme();
  navHoverHighlight();
  fontResizeOnArrows();
  ensureContactFormIfMissing();
  bindForms();
  renderWelcomeName();
});

function styleCards() {
  document.querySelectorAll('.card').forEach(card => {
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    if (!card.dataset.jsInit) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.dataset.jsInit = '1';
    }
  });

  const reveal = () => {
    const threshold = window.innerHeight / 1.3;
    document.querySelectorAll('.card').forEach(card => {
      const top = card.getBoundingClientRect().top;
      if (top < threshold) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  };

  reveal();
  window.addEventListener('scroll', reveal, { passive: true });
}

function appendMainHint() {
  const main = document.querySelector('main');
  if (!main) return;
  if (document.getElementById('dynamic-element')) return;

  const p = document.createElement('p');
  p.id = 'dynamic-element';
  p.textContent = 'Порада: використовуйте ArrowUp / ArrowDown для зміни розміру шрифту.';
  p.style.textAlign = 'center';
  p.style.marginTop = '24px';
  p.style.padding = '10px';
  p.style.color = '#675BC8';
  p.style.fontStyle = 'italic';
  main.append(p);
}

function ensureFooterDate() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const container = footer.querySelector('div') || footer;
  let el = document.getElementById('current-date');

  const formatted = new Date().toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  if (!el) {
    el = document.createElement('p');
    el.id = 'current-date';
    el.style.fontSize = '14px';
    el.style.marginTop = '10px';
    container.appendChild(el);
  }

  el.textContent = `Сьогодні: ${formatted}`;
}

function ensureAccordion() {
  const petInfo = document.querySelector('.pet-info');
  if (!petInfo) return;

  if (document.getElementById('accordion-toggle') || document.getElementById('hidden-content')) return;

  const hidden = document.createElement('div');
  hidden.id = 'hidden-content';
  hidden.hidden = true;
  hidden.style.marginTop = '20px';
  hidden.innerHTML = `
    <h3>Додаткова інформація</h3>
    <p>Ця тварина пройшла повний ветеринарний огляд та готова до адопції.
    Ми надаємо підтримку в перші місяці адаптації та консультації щодо догляду.</p>
  `;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'accordion-toggle';
  btn.className = 'button button-outline';
  btn.style.marginTop = '20px';
  btn.textContent = 'Показати більше';

  btn.addEventListener('click', () => {
    hidden.hidden = !hidden.hidden;
    btn.textContent = hidden.hidden ? 'Показати більше' : 'Приховати';
  });

  petInfo.appendChild(btn);
  petInfo.appendChild(hidden);
}

function ensureThemeToggle() {
  const header = document.querySelector('header > div');
  if (!header) return;

  let btn = document.getElementById('theme-toggle');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'theme-toggle';
    btn.className = 'button button-outline';
    btn.style.padding = '8px 16px';
    btn.style.marginLeft = '20px';
    btn.setAttribute('aria-label', 'Перемкнути тему');
    header.appendChild(btn);
  }

  syncThemeIcon();
  btn.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  syncThemeIcon();
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  document.body.classList.toggle('dark-theme', saved === 'dark');
  syncThemeIcon();
}

function syncThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
}

function navHoverHighlight() {
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('mouseenter', () => a.classList.add('nav-highlight'));
    a.addEventListener('mouseleave', () => a.classList.remove('nav-highlight'));
  });
}

function fontResizeOnArrows() {
  let size = parseInt(getComputedStyle(document.body).fontSize, 10) || 16;

  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    const el = document.activeElement;
    const tag = el && el.tagName ? el.tagName.toLowerCase() : '';
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    if (typing) return;

    e.preventDefault();

    size += e.key === 'ArrowUp' ? 2 : -2;
    if (size > 24) size = 24;
    if (size < 12) size = 12;

    document.body.style.fontSize = size + 'px';
    showToast(e.key === 'ArrowUp'
      ? 'Розмір шрифту збільшено'
      : 'Розмір шрифту зменшено');
  });
}

function showToast(text) {
  const old = document.getElementById('font-notification');
  if (old) old.remove();

  const n = document.createElement('div');
  n.id = 'font-notification';
  n.textContent = text;
  n.style.position = 'fixed';
  n.style.top = '20px';
  n.style.right = '20px';
  n.style.backgroundColor = '#675BC8';
  n.style.color = 'white';
  n.style.padding = '10px 20px';
  n.style.borderRadius = '8px';
  n.style.zIndex = '1000';
  n.style.animation = 'fadeIn 0.3s ease';
  document.body.appendChild(n);

  setTimeout(() => n.remove(), 2000);
}

function ensureContactFormIfMissing() {
  const hasMessageField = !!document.querySelector('textarea, #message, textarea[name="message"]');
  if (hasMessageField) return;

  const main = document.querySelector('main');
  if (!main) return;
  if (document.getElementById('contact-form')) return;

  const section = document.createElement('section');
  section.style.marginTop = '30px';
  section.innerHTML = `
    <div class="auth-form">
      <h2>Звʼязатися з нами</h2>
      <form id="contact-form">
        <div class="form-group">
          <label class="form-label">Імʼя</label>
          <input class="form-input" name="name" type="text">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" name="email" type="email">
        </div>
        <div class="form-group">
          <label class="form-label">Повідомлення</label>
          <textarea class="form-input" name="message" rows="4"></textarea>
        </div>
        <button class="button button-primary" type="submit">Надіслати</button>
      </form>
    </div>
  `;
  main.appendChild(section);
}

function bindForms() {
  document.querySelectorAll('form').forEach(form => {
    if (form.closest('.filters')) return;
    form.addEventListener('submit', e => onSubmit(e, form));
  });
}

function onSubmit(e, form) {
  e.preventDefault();
  clearErrors(form);
  removeSuccess(form);

  console.log('Дані форми:', Object.fromEntries(new FormData(form)));

  if (!validate(form)) return;

  const regName = form.querySelector('#reg_fullname');
  const loginEmail = form.querySelector('#login_email');

  if (regName && regName.value.trim().length >= 3) {
    localStorage.setItem('userName', regName.value.trim());
  }

  if (loginEmail && loginEmail.value.trim().length >= 3) {
    localStorage.setItem('userName', loginEmail.value.trim());
  }

  showSuccess(form, 'Форма успішно надіслана!');
  form.reset();
  renderWelcomeName();
}

function validate(form) {
  let ok = true;

  const name = form.querySelector('[name="name"], #reg_fullname');
  const email = form.querySelector('[type="email"]');
  const msg = form.querySelector('textarea');
  const pass = form.querySelector('#reg_password');
  const terms = form.querySelector('#terms');
  const loginPass = form.querySelector('#login_password');

  if (name && name.value.trim().length < 3) {
    showError(name, 'Імʼя повинно містити мінімум 3 символи');
    ok = false;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, 'Введіть коректну електронну адресу');
    ok = false;
  }

  if (msg && msg.value.trim().length < 10) {
    showError(msg, 'Повідомлення повинно містити мінімум 10 символів');
    ok = false;
  }

  if (pass && pass.value.length < 8) {
    showError(pass, 'Пароль повинен містити мінімум 8 символів');
    ok = false;
  }

  if (terms && !terms.checked) {
    showError(terms, 'Потрібно погодитися з умовами');
    ok = false;
  }

  if (loginPass && loginPass.value.trim().length === 0) {
    showError(loginPass, 'Введіть пароль');
    ok = false;
  }

  return ok;
}

function showError(el, message) {
  el.style.borderColor = '#C30000';
  el.style.backgroundColor = '#fff5f5';

  const container = el.closest('.form-group') || el.parentElement;
  const d = document.createElement('div');
  d.className = 'error-message';
  d.textContent = message;
  d.style.color = '#C30000';
  d.style.fontSize = '14px';
  d.style.marginTop = '5px';
  container.appendChild(d);
}

function clearErrors(scope) {
  scope.querySelectorAll('.error-message').forEach(e => e.remove());
  scope.querySelectorAll('.form-input').forEach(i => {
    i.style.borderColor = '';
    i.style.backgroundColor = '';
  });
}

function showSuccess(form, message) {
  const s = document.createElement('div');
  s.className = 'success-message';
  s.textContent = message;
  s.style.backgroundColor = '#4CAF50';
  s.style.color = 'white';
  s.style.padding = '15px';
  s.style.borderRadius = '8px';
  s.style.marginTop = '20px';
  s.style.textAlign = 'center';
  form.appendChild(s);

  setTimeout(() => s.remove(), 5000);
}

function removeSuccess(form) {
  const s = form.querySelector('.success-message');
  if (s) s.remove();
}

function renderWelcomeName() {
  const name = localStorage.getItem('userName');
  if (!name) return;

  const header = document.querySelector('header > div');
  if (!header) return;

  const old = document.getElementById('welcome-message');
  if (old) old.remove();

  const span = document.createElement('span');
  span.id = 'welcome-message';
  span.textContent = `Вітаємо, ${name}!`;
  span.style.color = '#675BC8';
  span.style.fontWeight = '600';
  span.style.marginLeft = '20px';
  header.appendChild(span);
}