const http = require('http');

const data = JSON.stringify({
  destination: "Goa",
  budget: 5000,
  days: 3
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/generate-trip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', error => console.error('Error:', error));
req.write(data);
req.end();
