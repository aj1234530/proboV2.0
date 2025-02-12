"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { triggerToast } from "../functions/toast";
import { useState } from "react";
export default function ({ eventName }: { eventName: string }) {
  const [price, setPrice] = useState(0.5);
  const [buyEventName, setBuyEventName] = useState(eventName);
  const [quantity, setQuantity] = useState(0);
  const [bidType, setBidType] = useState<"yes" | "no">("yes");
  const [clicked, setClicked] = useState<"button1" | "button2">("button1");
  const [response, setResponse] = useState<string | null>(null);
  console.log("price", price, quantity, bidType, eventName);
  const handleButtonClick = (button: "button1" | "button2") => {
    if (button === "button1") {
      setBidType("yes");
      setClicked("button1");
    } else {
      setBidType("no");
      setClicked("button2");
    }
  };
  const session: any = useSession();

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/buy`;
  const placeOrder = async () => {
    console.log(
      "data sent",
      bidType,
      buyEventName,
      quantity,
      session.data.accessToken
    );
    try {
      const response = await axios.post(
        url,
        {
          bidType: bidType,
          eventName: buyEventName,
          bidQuantity: quantity,
          price: price * 100,
          session:      session.data.accessToken
        },
        {
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`, // Set Bearer token in header
          },
        }
      );
      if (response.status === 200) {
        triggerToast("bid submitted", "success");
      } else {
        triggerToast("some thing went wrong", "error");
      }

      return response.data; // return the response if needed
    } catch (error) {
      triggerToast("some thing went wrong", "error");
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="bg-white  border w-[300px] border-gray-300 rounded-sm flex flex-col gap-5 p-4">
      <div className="flex flex-row justify-between border">
        <div className="w-full flex flex-row justify-between gap-3 ">
          <button
            onClick={() => handleButtonClick("button1")}
            className={`border rounded-sm w-1/2 ${clicked === "button1" ? "bg-blue-400" : "bg-white"} hover:cursor-pointer`}
          >
            Yes
          </button>
          <button
            onClick={() => handleButtonClick("button2")}
            className={`border rounded-sm w-1/2 ${clicked === "button2" ? "bg-blue-400" : "bg-white"} hover:cursor-pointer`}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <div className="flex flex-row justify-between">
          <div>Price</div>
          <select onChange={(e) => setPrice(parseFloat(e.target.value))}>
            <option value="0.5">0.5</option>
            <option value="1.0">1.0</option>
            <option value="1.5">1.5</option>
            <option value="2.0">2.0</option>
            <option value="2.5">2.5</option>
            <option value="3.0">3.0</option>
            <option value="3.5">3.5</option>
            <option value="4.0">4.0</option>
            <option value="4.5">4.5</option>
            <option value="5.0">5.0</option>
            <option value="5.5">5.5</option>
            <option value="6.0">6.0</option>
            <option value="6.5">6.5</option>
            <option value="7.0">7.0</option>
            <option value="7.5">7.5</option>
            <option value="8.0">8.0</option>
            <option value="8.5">8.5</option>
            <option value="9.0">9.0</option>
            <option value="9.5">9.5</option>
          </select>
        </div>
        <div className="flex flex-row justify-between">
          <div>Quantity</div>
          <input
            required
            className="border w-10 rounded-sm"
            type="number"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          ></input>
        </div>
      </div>

      <button
        onClick={async () => {
          const response = await placeOrder();
          // setResponse(response.data.message);
        }}
        // mt auto places last element at the bottom of the container
        className="mt-auto bg-blue-400 text-gray-800 border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        Place Order
      </button>
      <ToastContainer />
      {response && <div>{response}</div>}
    </div>
  );
}
