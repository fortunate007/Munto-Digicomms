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

var items = document.querySelectorAll('.card, .steps > div, details');
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
