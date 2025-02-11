//wsClient is just like websocket client on a frontend
//using here to establish connection bw two node js backend
import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();
//this code did not work
// function establishConnection() {
//   const wsClient = new WebSocket("ws://localhost:8080");
//   return wsClient;
// }
// export let wsClient = establishConnection();
// //this way if the connection loses you won't be able re connect
// // wsClient.onclose = () => {
// //   console.log("web socket connection lost");
// // };

// wsClient.onopen = () => {
//   console.log("websocket connected");
// };

// wsClient.onmessage = (message) => {
//   console.log("websocket server sent a message", message.data);
// };
// wsClient.onclose = () => {
//   console.log("retrying to connect to wss");
//   setTimeout(() => (wsClient = establishConnection()), 2000);
// };
export let wsClient: WebSocket;
function establishConnection() {
  console.log(`websockeurl recieved: ${process.env.WS_URL}`, "test1");
  wsClient = new WebSocket(`${process.env.WS_URL}`);
  //this way if the connection loses you won't be able re connect
  // wsClient.onclose = () => {
  //   console.log("web socket connection lost");
  // };

  wsClient.onopen = () => {
    console.log("websocket connected");
  };

  wsClient.onmessage = (message) => {
    console.log("websocket server sent a message", message.data);
  };
  wsClient.onclose = () => {
    console.log("lost connection,retrying to connect to wss");
    setTimeout(establishConnection, 2000);
  };
  wsClient.onerror = (error) => {
    console.log(
      "error occured,it seems the ws server is not listening ,again retrying"
    );
    setTimeout(establishConnection, 5000);
  };
  return wsClient;
}

establishConnection();
