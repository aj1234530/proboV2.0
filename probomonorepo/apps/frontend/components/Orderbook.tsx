"use client";

import React from "react";
import { useEffect, useState } from "react";
import { json } from "stream/consumers";

/* 
Questions about websocket:
1. where should the socket be kept
2. should it be in state var or local variable
3. what if the ws connection fails , how it will try to reconnect
4. 

Next js Specific Questions
1. we should handle the websocket connetion on client side or server side ?
2.For now using
i. client side to manange the connect to websocket conn 
*/
type Order = {
  userId: string;
  quantity: number;
};

// Prices range from 950 to 50 (key must be a string in TypeScript)
type PriceLevels = {
  [price: string]: {
    total: number;
    orders: Order[];
  };
};

// "yes" and "no" categories (can have price levels or be empty)
type OrderBookSide = {
  yes?: PriceLevels; // Empty object `{}` when no orders
  no?: PriceLevels;
};

// Stock data structure
type orderbooktype = {
  [stockSymbol: string]: OrderBookSide;
};
interface orderBookData {
  [price: number]: number;
}
interface totalBidQuantity {
  yes: number;
  no: number;
}
export default function Orderbook() {
  const [socketConnection, setSocketConnection] = useState<WebSocket | null>(
    null
  );

  const [yesOrderBookData, setYesOrderbookData] = useState<
    orderBookData[] | null
  >(null);
  const [noOrderBookData, setNoOrderbookData] = useState<
    orderBookData[] | null
  >(null);

  const [totalBidsQuantity, setTotalBidsQuantity] = useState<totalBidQuantity>({
    yes: 0,
    no: 0,
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocketConnection(socket);
    //even this useeffect runs only one time but the socket listens , event listeners has been attached to the conn
    //callback fxn of the event listeners runs
    //not using stored state - becaue state is snapspot
    socket.onopen = () => {
      console.log("connecte to web socket server");
    };
    socket.onmessage = (message) => {
      try {
        const data: orderbooktype = JSON.parse(message.data);
        console.log(data);
        //change 1: replace with real game
        const eventName = data["SAMPLE_STOCK"];
        //is empty object falsy ? no => object are always truthy
        if (eventName?.yes && eventName && eventName.no) {
          console.log("inside if");
          const yesPriceKeys = Object.keys(eventName.yes);
          const noPriceKeys = Object.keys(eventName.no);
          console.log("keys", yesPriceKeys, noPriceKeys);
          const yesOrderBookDataArray: orderBookData[] = [];
          const noOrderBookDataArray: orderBookData[] = [];
          let totalBidQuantity: totalBidQuantity = { yes: 0, no: 0 };
          for (let key of yesPriceKeys) {
            //modfify the key => to divideby 100
            const parsedKey = parseInt(key) / 100;
            console.log("inside for looop : key", key);
            if (parsedKey && eventName.yes[key]?.total) {
              yesOrderBookDataArray?.push({
                [parsedKey]: eventName.yes?.[key].total,
              });
              totalBidQuantity.yes += eventName.yes?.[key].total;
            }
            console.log("inside for loop", yesOrderBookDataArray);
            setYesOrderbookData(yesOrderBookDataArray);
          }
          for (let key of noPriceKeys) {
            //modfify the key => to divideby 100
            const parsedKey = parseInt(key) / 100;
            console.log("inside for looop : key", key);
            if (parsedKey && eventName.no[key]?.total) {
              noOrderBookDataArray?.push({
                [parsedKey]: eventName.no?.[key].total,
              });
              totalBidQuantity.no = eventName.no?.[key].total;
            }
            console.log("inside for loop", noOrderBookDataArray);
          }
          setTotalBidsQuantity(totalBidQuantity);
          setNoOrderbookData(noOrderBookDataArray);
          console.log(totalBidQuantity);
        }

        //what to do
        //1. obtain keys
        //2. get their total
        //fill the orderbook
      } catch (error) {
        console.log(error, "error parseing");
      }
      console.log(0);
    };

    return () => {
      if (socketConnection) socketConnection.close();
      console.log("ws connection closed");
    };
  }, []);
  //   will this fxn run every time on the message recieving but how ?

  return (
    <div className="flex flex-row gap-2 p-2 justify-between bg-white w-[600px] h-[400px] border rounded-md border-gray-300">
      <table className="w-1/2 text-sm">
        <thead className="">
          <tr className="text-gray-500 border-b">
            <th className="text-left p-2">PRICE</th>
            <th className="text-right p-2">QTY AT YES</th>
          </tr>
        </thead>
        <tbody className="">
          {yesOrderBookData?.map((el, index) => (
            //using react frament as i can't use div here
            <React.Fragment key={index}>
              <tr className=" border-b " key={index}>
                {/* td means table data used to represent cell */}
                {Object.keys(el).map((key, i) => (
                  <td
                    // making key unique as, below ,also index has been to map
                    key={`key-${i}`}
                    className="w-1/5 text-left h-[40px] p-2 "
                  >
                    {key}
                  </td>
                ))}
                {Object.values(el).map((value, i) => (
                  <td
                    key={`value-${i}`}
                    className={`w-2/5 text-left h-[40px] p-2 `}
                    style={{
                      background: `${getBackGroundColor(totalBidsQuantity.yes, value, "yes")}`,
                    }}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <table className="w-1/2 text-sm">
        <thead className="">
          <tr className="text-gray-500 border-b">
            <th className="text-left p-2">PRICE</th>
            <th className="text-right p-2">QTY AT NO</th>
          </tr>
        </thead>
        <tbody className="w-[200%] flex flex-col ">
          {noOrderBookData?.map((el, index) => (
            <tr className="w-full border-b h-[40px] " key={index}>
              {/* td means table data used to represent cell */}
              {Object.keys(el).map((key, i) => (
                <td
                  key={`value-${i}-z`}
                  className="w-1/2 text-left h-[40px] p-2 "
                >
                  {key}
                </td>
              ))}
              {Object.values(el).map((value, i) => (
                <td
                  key={`key-${i}-x`}
                  className="w-1/2 text-left h-[40px] p-2 "
                  style={{
                    background: `${getBackGroundColor(totalBidsQuantity.no, value, "no")}`,
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// {/* <tr className="w-full border-b h-[40px] flex flex-row">
// {/* td means table data used to represent cell */}
// <td className="w-1/2 text-left h-[40px] p-2 ">0.5 </td>
// <td className="w-1/2  text-right h-[40px] p-2">240</td>
// </tr> */}

// {/* <tr className="w-full border-b h-[40px] flex flex-row">
// {/* td means table data used to represent cell */}
// <td className="w-1/2 text-left h-[40px] p-2 ">0.5 </td>
// <td className="w-1/2  text-right h-[40px] p-2">240</td>
// </tr> */}

function getBackGroundColor(
  total: number,
  part: number,
  type: "yes" | "no"
): string {
  const percentage = (part / total) * 100;
  const bgColor = `linear-gradient(to left, ${type === "yes" ? `rgba(137, 196, 244)` : `rgba(255, 0, 0, 0.6)`} ${percentage}%, white ${percentage}%)`;
  return bgColor;
}

// const ProgressBar = ({ percentage }) => {
//   const bgColor =`linear-gradient(to right, red ${percentage}%, gray ${percentage}%)`
//     percentage >= 80 ? "bg-green-500" : percentage >= 50 ? "bg-orange-500" : "bg-red-500";

//   return (
//     <div className={`w-full h-8 ${bgColor} text-center text-white font-bold rounded-md`}>
//       {percentage}%
//     </div>
//   );
// };

// const App = () => <ProgressBar percentage={80} />;

// export default App;
// const ProgressBar = ({ percentage }) => {
//   return (
//     <div
//       className="w-full h-8 rounded-md border text-center text-white font-bold"
//       style={{
//         background: `linear-gradient(to right, red ${percentage}%, gray ${percentage}%)`,
//         backgroundSize: "100% 100%",
//       }}
//     >
//       {percentage}%
//     </div>
//   );
