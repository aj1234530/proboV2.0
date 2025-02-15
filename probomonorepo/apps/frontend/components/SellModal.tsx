"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { triggerToast } from "../functions/toast";
import { ToastContainer } from "react-toastify";

export default function ModalComponent({
  isOpen,

  setIsOpen,
  bidType,
  eventName,
  availableQuantity,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  eventName: string;
  availableQuantity: string;
  bidType: string;
}) {
  const session: any = useSession();
  console.log(bidType, eventName, availableQuantity);
  const [formData, setFormData] = useState({
    bidQuantity: "",
    price: "0.5", //send in cents
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL_V1}/user/exit`;
    console.log("sell url 2 @", url);

    if (availableQuantity < formData.bidQuantity) {
      alert("enter less than  available quantity");
      return;
    }

    try {
      const dataToSend = {
        eventName: eventName,
        bidType: bidType,
        bidQuantity: formData.bidQuantity,
        availableQuantity: availableQuantity,
        price: parseFloat(formData.price) * 100, //sending in cents
      };
      console.log("data sent 3", dataToSend, session.data.accessToken);

      const response = await axios.post(
        url,
        {
          eventName: eventName,
          bidType: bidType,
          bidQuantity: formData.bidQuantity,
          price: parseFloat(formData.price) * 100,
        },
        {
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        triggerToast("exit order place", "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Fill in the Details</h2>
            <input
              name="eventName"
              type="text"
              value={eventName}
              disabled
              className="w-full p-2 border rounded-md mb-3"
            />
            <input
              name="bidType"
              type="text"
              value={bidType}
              disabled
              className="w-full p-2 border rounded-md mb-3"
            />
            <div>Choose Exit Price</div>
            <select
              name="bidPrice"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-3"
            >
              {/* googled it for clean syntax */}
              {Array.from({ length: 19 }, (_, i) => (i + 1) * 0.5).map(
                (value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                )
              )}
            </select>
            <input
              required
              name="bidQuantity"
              placeholder="enter quantity to sell"
              onChange={(e) =>
                setFormData({ ...formData, bidQuantity: e.target.value })
              }
              type="text"
              className="w-full p-2 border rounded-md mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Place Sell Order
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
