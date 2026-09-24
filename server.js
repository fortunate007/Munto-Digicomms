require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });
const clean = (v, max) => String(v || '').trim().slice(0, max);

app.post('/api/leads', limiter, async (req, res) => {
  try {
    const name = clean(req.body.name, 100);
    const business = clean(req.body.business, 150);
    const service = clean(req.body.service, 80);
    const message = clean(req.body.message, 2000);
    if (!name || !business) {
      return res.status(400).json({ error: 'Name and business are required.' });
    }
    await prisma.lead.create({ data: { name, business, service, message } });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

function auth(req, res, next) {
  const decoded = Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
  const i = decoded.indexOf(':');
  const user = decoded.slice(0, i);
  const pass = decoded.slice(i + 1);
  if (i > -1 && user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) return next();
  res.set('WWW-Authenticate', 'Basic realm="Munto Admin"').status(401).send('Authentication required');
}

app.get('/admin', auth, async (req, res) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  res.render('admin', { leads });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Munto Digicomms running on http://localhost:' + port));
