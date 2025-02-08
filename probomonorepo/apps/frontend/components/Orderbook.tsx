"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useBalance } from "../app/providers/orderbookProvider";
import { json } from "node:stream/consumers";

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
export default function Orderbook({ eventName }: { eventName: string }) {
  const [orderEventName, setOrderEventName] = useState(eventName);
  const [socketConnection, setSocketConnection] = useState<WebSocket | null>(
    null
  );
  const { userTrades, updateTrades } = useBalance();

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
        // console.log("inside onmessage 0", message.data, orderEventName);
        const dataRecieved = JSON.parse(message.data);
        console.log(
          "inside onmessage 1,fulldata recieved:",
          dataRecieved,
          orderEventName
        );
        const data: orderbooktype = dataRecieved["orderbook"];

        const stockBalance = dataRecieved["stockbalance"];
        //now set this balance to the usestate
        try {
          localStorage.setItem("userTrades", JSON.stringify(stockBalance));
          const userTradesFromLocalStorage = localStorage.getItem("userTrades");
          //setting local and updating to the
          if (userTradesFromLocalStorage) {
            updateTrades(userTradesFromLocalStorage);
          }
          console.log(
            "user trades setting",
            userTrades,
            JSON.stringify(stockBalance)
          );
        } catch (error) {}
        updateTrades(JSON.stringify(data));
        console.log(
          "inside onmessage 2,orderbookdata",
          data,
          "stock balance:",
          stockBalance
        );

        //change 1: replace with real game
        const eventName = data[orderEventName];
        //is empty object falsy ? no => object are always truthy
        if (eventName?.yes && eventName && eventName.no) {
          console.log("inside if 2");
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
            console.log("inside yes for loop", yesOrderBookDataArray);
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
              totalBidQuantity.no += eventName.no?.[key].total;
            }
            console.log("inside no for loop", noOrderBookDataArray);
          }
          setTotalBidsQuantity(totalBidQuantity);
          setNoOrderbookData(noOrderBookDataArray);
          console.log(totalBidQuantity);
        }
        console.log(
          "final data: noorderbookarray",
          noOrderBookData,
          "yesorderbookarray",
          yesOrderBookData
        );
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

  //this compone is aobut approach
  // return (
  //   <div className="flex flex-row gap-2 p-2 justify-between bg-white w-[600px] h-[400px] border rounded-md border-gray-300">
  //     <table className="w-1/2 text-sm">
  //       <thead className="">
  //         <tr className="text-gray-500 border-b">
  //           <th className="text-left p-2">PRICE</th>
  //           <th className="text-right p-2">QTY AT YES</th>
  //         </tr>
  //       </thead>
  //       <tbody className="">
  //         {yesOrderBookData?.map((el, index) => (
  //           //using react frament as i can't use div here
  //           <React.Fragment key={index}>
  //             <tr className=" border-b " key={index}>
  //               {/* td means table data used to represent cell */}
  //               {Object.keys(el).map((key, i) => (
  //                 <td
  //                   // making key unique as, below ,also index has been to map
  //                   key={`key-${i}`}
  //                   className="w-1/5 text-left h-[40px] p-2 "
  //                 >
  //                   {key}
  //                 </td>
  //               ))}
  //               {Object.values(el).map((value, i) => (
  //                 <td
  //                   key={`value-${i}`}
  //                   className={`w-2/5 text-left h-[40px] p-2 `}
  //                   style={{
  //                     background: `${getBackGroundColor(totalBidsQuantity.yes, value, "yes")}`,
  //                   }}
  //                 >
  //                   {value}
  //                 </td>
  //               ))}
  //             </tr>
  //           </React.Fragment>
  //         ))}
  //       </tbody>
  //     </table>

  //     <table className="w-1/2 text-sm">
  //       <thead className="">
  //         <tr className="text-gray-500 border-b">
  //           <th className="text-left p-2">PRICE</th>
  //           <th className="text-right p-2">QTY AT NO</th>
  //         </tr>
  //       </thead>
  //       <tbody className="w-[200%] flex flex-col ">
  //         {noOrderBookData?.map((el, index) => (
  //           <tr className="w-full border-b h-[40px] " key={index}>
  //             {/* td means table data used to represent cell */}
  //             {Object.keys(el).map((key, i) => (
  //               <td
  //                 key={`value-${i}-z`}
  //                 className="w-1/2 text-left h-[40px] p-2 "
  //               >
  //                 {key}
  //               </td>
  //             ))}
  //             {Object.values(el).map((value, i) => (
  //               <td
  //                 key={`key-${i}-x`}
  //                 className="w-1/2 text-left h-[40px] p-2 "
  //                 style={{
  //                   background: `${getBackGroundColor(totalBidsQuantity.no, value, "no")}`,
  //                 }}
  //               >
  //                 {value}
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="w-full ">
      <div className="flex flex-row gap-1   border-collapse">
        <table className="min-w-sm flex-auto w-fit bg-white text-sm   text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="h-4">
              <th scope="col" className="p-2 text-left">
                Price
              </th>
              <th scope="col" className=" whitespace-nowrap text-right p-2">
                QTY AT NO
              </th>
            </tr>
          </thead>
          <tbody>
            {yesOrderBookData?.map((el, index) => (
              <tr
                key={index}
                className="h-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                {Object.keys(el).map((key, i) => (
                  <th
                    scope="row"
                    key={`value-${i}`}
                    className="w-1/5 text-left p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {key}
                  </th>
                ))}
                {Object.values(el).map((el, i) => (
                  <td
                    key={`value-${i}`}
                    className="w-4/5 border text-right p-2"
                    style={{
                      background: `${getBackGroundColor(totalBidsQuantity.yes, el, "yes")}`,
                    }}
                  >
                    {el}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <table className="min-w-sm flex-auto w-fit bg-white text-sm   text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="h-4">
              <th scope="col" className="p-2 text-left">
                Price
              </th>
              <th scope="col" className=" whitespace-nowrap text-right p-2">
                QTY AT NO
              </th>
            </tr>
          </thead>
          <tbody>
            {noOrderBookData?.map((el, index) => (
              <tr
                key={index}
                className="h-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                {Object.keys(el).map((key, i) => (
                  <th
                    scope="row"
                    key={`value-${i}`}
                    className="w-1/5 text-left p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {key}
                  </th>
                ))}
                {Object.values(el).map((el, i) => (
                  <td
                    key={`value-${i}`}
                    className="w-4/5 border text-right p-2"
                    style={{
                      background: `${getBackGroundColor(totalBidsQuantity.no, el, "no")}`,
                    }}
                  >
                    {el}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Color
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Microsoft Surface Pro
            </th>
            <td className="px-6 py-4">White</td>
            <td className="px-6 py-4">Laptop PC</td>
            <td className="px-6 py-4">$1999</td>
          </tr>
          <tr className="bg-white dark:bg-gray-800">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Magic Mouse 2
            </th>
            <td className="px-6 py-4">Black</td>
            <td className="px-6 py-4">Accessories</td>
            <td className="px-6 py-4">$99</td>
          </tr>
        </tbody>
      </table> */}
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
  console.log("total", total, "part", part);
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
