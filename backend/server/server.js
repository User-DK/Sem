const express = require('express');
const { createProxyServer } = require('http-proxy');
const loadbalance = require('loadbalance');

const proxy = createProxyServer({});
const app = express();
app.use(express.json());

const servers = {
  booking: [
    'http://localhost:3001', // Booking service backend
    'http://localhost:3005', // Booking service backend additional instance
    'http://localhost:3006', // Booking service backend additional instance
    'http://localhost:3007', // Booking service backend additional instance
    'http://localhost:3008', // Booking service backend additional instance
  ],
  geolocation: [
    'http://localhost:3002', // Geolocation service backend
  ],
  osrm: [
    'http://localhost:3003', // OSRM Routing service backend
  ],
  writeBooking: [
    'http://localhost:3004', // Write Booking service backend
  ],
};

// Middleware to handle load balancing
app.use('/api/:service', (req, res) => {
  const service = req.params.service;
  const backendServers = servers[service];

  if (!backendServers) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // Load balancer to pick a target server
  const balancer = loadbalance(backendServers);
  const target = balancer.pick(req);

  // Proxy the request to the target server
  proxy.web(req, res, { target }, (err) => {
    if (err) {
      console.error('Error proxying request:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
