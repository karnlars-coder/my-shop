const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let products = [];

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', products }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'add') products.push(data.product);
    if (data.type === 'delete') products.splice(data.index, 1);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', products }));
      }
    });
  });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
