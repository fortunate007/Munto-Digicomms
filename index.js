const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

const routes = {
  '/': 'index.html',
  '/about': 'about.html',
  '/contact-me': 'contact-me.html',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url.length > 1 && url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  const fileName = routes[url] || '404.html';
  const filePath = path.join(__dirname, fileName);
  const statusCode = routes[url] ? 200 : 404;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }

    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
