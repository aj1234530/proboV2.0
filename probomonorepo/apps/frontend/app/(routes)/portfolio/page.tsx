"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useBalance } from "../../providers/orderbookProvider";
import { useSession } from "next-auth/react";
import ModalComponent from "../../../components/SellModal";
import { getStockBalance } from "../../../functions/serveractions";

interface UserStockBalance {
  [stockName: string]: {
    yes: { quantity: number; locked: number; pending: number; exited: number };
    no: { quantity: number; locked: number; pending: number; exited: number };
  };
}
export default function Portfolio() {
  // const { userTrades, updateTrades } = useBalance();not using now
  //sell modal states
  const { userTrades, updateTrades } = useBalance();
  const [isOpen, setIsOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sellOrderData, setSellOrderData] = useState({
    availableQuantity: "",
    eventName: "",
    bidType: "",
  });

  const session: any = useSession();

  //   const {  session,data }:{session:any,data:any} = useSession();
  const [userStockBalance, setUserStockBalance] =
    useState<UserStockBalance | null>(null);
  console.log("user stock balance", userStockBalance);
  const userId = session.data?.user.id;
  console.log("session", session, "userId,", userId);

  const fetchStockBalance = async () => {
    const response = await getStockBalance();
    if (response.success) {
      const stockBalances = response.responseJson?.stockbalance; //have to look if it is json
      if (stockBalances[userId]) {
        setUserStockBalance(stockBalances[userId]);
      }
      console.log(
        "response for balcnce fetching",
        response.responseJson,
        userId,
        response.responseJson.stockbalance,
        response.responseJson.stockbalance[userId]
      );
    }
    if (response.error) {
      console.log("error", response.error);
    }
  };
  useEffect(() => {
    if (session?.data?.accessToken) {
      fetchStockBalance();
    }
    try {
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, [session]); // Runs only when userId is available

  return (
    <div>
      <div className="w-full flex flex-row gap-3 font-light justify-center"></div>
      {/* prettier-ignore */}
      {userStockBalance ? (
        <div>
          {Object.keys(userStockBalance).map((stockName) => (
            <div
              key={stockName}
              className="border flex flex-col gap-5 p-4 rounded-lg shadow-md"
            >
              {/* object.entries will return the array of object;s own key value for nested obje 
                i.e. value is obj it recursive call and constructs dot-separ key path!!!!!!!*/}

              {/* below in array will be the two value yes and no - and their values will be accessible dot separted  */}
              {Object.entries(userStockBalance[stockName]!).map(
                ([yesNo, data]) => (
                  <div
                    key={yesNo}
                    className="border p-3 rounded-md shadow-sm bg-gray-100"
                  >
                    <div className="flex flex-row justify-between mx-auto">
                      {/* how stock name is accessible here ? => is it closure */}
                      <h3>{stockName}</h3>
                      <div className="flex flex-row gap-3 md:gap-5">
                        <h3 className="font-medium">{yesNo.toUpperCase()}</h3>
                        <div className="whitespace-nowrap">
                          {" "}
                          Quantity: {data.quantity}{" "}
                        </div>
                        <div className="whitespace-nowrap">
                          Locked: {data.locked}
                        </div>
                        <div className="whitespace-nowrap">
                          Pending: {data.pending}
                        </div>
                        <div className="whitespace-nowrap">
                          Exited: {data.exited}
                        </div>
                        <button
                          id={`${stockName}`}
                          onClick={() => {
                            setSellOrderData({
                              ...sellOrderData,
                              availableQuantity: data.quantity.toString(),
                              eventName: stockName,
                              bidType: yesNo,
                            });
                            setIsOpen(true);
                          }}
                          className="bg-blue-700 text-white rounded  px-4 hover:cursor-pointer"
                        >
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
          <div>
            <ModalComponent
              availableQuantity={sellOrderData.availableQuantity}
              eventName={sellOrderData.eventName}
              bidType={sellOrderData.bidType}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen">
          <div className="h-full flex items-center justify-center">
            You don't have any active trade
          </div>
        </div>
      )}
    </div>
  );
}

function SellModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div>
      <button>Open Modal</button>
      {isOpen && (
        <div>
          <form className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 ">
            <input placeholder="quantity"></input>
          </form>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

//how i am getting the stocks data
//on every trade i am setting the stock balance in localstorage and then - in orderbook page
//on portfolio page - give the userTrades state of that data to make reactive if teh data changes
//and then parsing all to show the order

// function isValidJson(str:string){
//   try {
//     JSON.parse(str)
//     return true
//   } catch (error) {
//       return false;
//   }
// }
