document.getElementById('yr').textContent = new Date().getFullYear();

var form = document.getElementById('lead');
var note = document.createElement('p');
note.style.cssText = 'margin:12px 0 0;font-family:sans-serif;font-size:.9rem';
form.appendChild(note);

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  var v = function (id) { return document.getElementById(id).value.trim(); };
  var btn = form.querySelector('button');
  btn.disabled = true;
  note.textContent = 'Sending...';
  try {
    var res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: v('n'), business: v('b'), service: v('s'), message: v('m') })
    });
    var data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    note.style.color = '#1faa59';
    note.textContent = 'Thank you! We will contact you within one working day.';
    form.reset();
  } catch (err) {
    note.style.color = '#c92a2a';
    note.textContent = err.message || 'Could not send. Please try again.';
  }
  btn.disabled = false;
});

// Lead magnet form (free checklist) - posts to the same /api/leads endpoint
var magnetForm = document.getElementById('magnet-form');
if (magnetForm) {
  var magnetNote = document.getElementById('magnet-note');
  magnetForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = document.getElementById('me').value.trim();
    var btn = magnetForm.querySelector('button');
    btn.disabled = true;
    magnetNote.style.color = '';
    magnetNote.textContent = 'Sending...';
    try {
      var res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email, business: email, service: 'Free checklist download', message: 'Requested the 10-point audit checklist' })
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      magnetNote.style.color = '#8be0af';
      magnetNote.textContent = 'Sent! Check your inbox shortly.';
      magnetForm.reset();
    } catch (err) {
      magnetNote.style.color = '#ff9b9b';
      magnetNote.textContent = err.message || 'Could not send. Please try again.';
    }
    btn.disabled = false;
  });
}

// Cookie consent banner
(function () {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  var KEY = 'munto_cookie_consent';
  try {
    if (!localStorage.getItem(KEY)) banner.hidden = false;
  } catch (e) { banner.hidden = false; }
  function setConsent(val) {
    try { localStorage.setItem(KEY, val); } catch (e) {}
    banner.hidden = true;
  }
  var accept = document.getElementById('cookie-accept');
  var decline = document.getElementById('cookie-decline');
  if (accept) accept.addEventListener('click', function () { setConsent('accepted'); });
  if (decline) decline.addEventListener('click', function () { setConsent('declined'); });
})();
// Floating contact ticker: cycles welcome + WhatsApp + phone + email
(function () {
  var box = document.getElementById('contact-ticker');
  if (!box) return;
  var closeBtn = document.getElementById('ct-close');
  var iconEl = document.getElementById('ct-icon');
  var textEl = document.getElementById('ct-text');
  var HIDE_KEY = 'munto_contact_ticker_closed';
  try {
    if (sessionStorage.getItem(HIDE_KEY)) { box.style.display = 'none'; return; }
  } catch (e) {}

  // Messages to cycle through
  var messages = [
    { icon: '\uD83D\uDC4B', html: 'Thank you for visiting Munto Digicomms &mdash; we serve at your pleasure.' },
    { icon: '\uD83D\uDCAC', html: 'Chat on WhatsApp: <a href="https://wa.me/254792232969" target="_blank" rel="noopener">+254 792 232 969</a>' },
    { icon: '\uD83D\uDCDE', html: 'Call us: <a href="tel:+254792232969">+254 792 232 969</a>' },
    { icon: '\u2709\uFE0F', html: 'Email: <a href="mailto:elmnton@gmail.com">elmnton@gmail.com</a>' }
  ];
  var i = 0;
  function show(index) {
    textEl.classList.add('fade');
    setTimeout(function () {
      iconEl.innerHTML = messages[index].icon;
      textEl.innerHTML = messages[index].html;
      textEl.classList.remove('fade');
    }, 350);
  }
  var timer = setInterval(function () {
    i = (i + 1) % messages.length;
    show(i);
  }, 4000);
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      clearInterval(timer);
      box.style.display = 'none';
      try { sessionStorage.setItem(HIDE_KEY, '1'); } catch (e) {}
    });
  }
})();

var items = document.querySelectorAll('.card, .steps > div, details, .quote, .founder');
items.forEach(function (el) { el.classList.add('reveal'); });
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
} else {
  items.forEach(function (el) { el.classList.add('in'); });
}
