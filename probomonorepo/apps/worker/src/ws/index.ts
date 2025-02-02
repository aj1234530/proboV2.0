//wsClient is just like websocket client on a frontend
//using here to establish connection bw two node js backend
import WebSocket from "ws";
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
  wsClient = new WebSocket("ws://localhost:8080");
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
    setTimeout(establishConnection, 2000);
  };
  return wsClient;
}

establishConnection();
