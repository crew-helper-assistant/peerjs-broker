const express = require('express');
const cors = require('cors');
const http = require('http');
const { ExpressPeerServer } = require('peer');

const app = express();
app.use(cors());

app.get('/healthz', (req, res) => res.status(200).send('ok'));

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: '/',
  proxied: true,
  allow_discovery: false,
  corsOptions: { origin: true },
});

app.use('/peerjs', peerServer);

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`peerjs-broker listening on ${port}, path /peerjs`);
});
