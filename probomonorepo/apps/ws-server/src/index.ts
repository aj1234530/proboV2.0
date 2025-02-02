import { WebSocketServer, WebSocket } from "ws";
const rooms = [{ eventdId: 1 }];
const connectedClients: Set<WebSocket> = new Set();
const wss = new WebSocketServer({ port: 8080 });
//lastOrderBookSent is for the initail connection to your websocke as ws server don't have the orderbook, so keep previoustored
let lastOrderBookSent: string;
wss.on("connection", function connection(ws, req) {
  connectedClients.add(ws);
  console.log(connectedClients.size);
  ws.on("message", function message(data) {
    console.log("message triggered");
    //data.toString to convert to buffer
    const parsedData = JSON.parse(JSON.stringify(data.toString()));
    console.log("on message ", connectedClients.size);

    console.log("received: %s", parsedData);
    lastOrderBookSent = data.toString();
    broadCastToRoom(connectedClients, data.toString());
  });
  // when one connects for the first time send the orderbook available so that on first render we can fill the data
  ws.send(JSON.stringify({ msg: "you are now connected to our server" }));
  //sending the orderbook on inital connection
  ws.send(lastOrderBookSent);
  ws.on("close", () => {
    console.log("no of clients before delete", connectedClients.size);
    connectedClients.delete(ws);
    console.log("no of clients after delete", connectedClients.size);
  });
});

wss.on("close", () => {
  console.log("websocket connection closed");
});

function broadCastToRoom(connectedClients: Set<WebSocket>, message: string) {
  // how to not send message ot worker as that worker is also connected to our ws and in clients se
  //for now responding to node js also
  connectedClients.forEach((ws) => {
    //ws.readystate can have various values eg - WebSocket.Connecting, websocket.open,websockent.closing,websocket.closed
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}
