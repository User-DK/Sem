// pages/api/[service].js
import { createServer } from 'http';
const loadbalance = require('loadbalance');

const servers = {
  
};

export default async function handler(req, res) {
  const { service } = req.query;
  const backendServers = servers[service];

  if (!backendServers) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  const balancer = loadbalance(backendServers);
  const target = balancer.pick(req);

  const proxyReq = createServer(target, (proxyRes) => {
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
}
