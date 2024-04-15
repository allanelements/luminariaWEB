
const dgram = require('dgram');
const WebSocket = require('ws');

const udpServer = dgram.createSocket('udp4');
const wsServer = new WebSocket.Server({ port: 8124 });

udpServer.on('message', (msg, rinfo) => {
  const messageString = msg.toString();
  const { address, port } = rinfo;
  console.log(`DEVICE:${address}:${port} : IP:`, messageString);

  // Enviar a mensagem junto com o IP e a porta via WebSocket
  const messageWithInfo = `DEVICE: ${messageString} - IP:${address}:${port}`;
  wsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageWithInfo);
    }
  });
});

udpServer.bind(8123);
