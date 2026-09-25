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
