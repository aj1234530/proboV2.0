"use client";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface BalanceContext {
  walletBalance: number;
  refreshBalance: () => void;
  userTrades: string | null;
  updateTrades: (data: string) => void;
}

//create the context - what is a context?
//1.we create context to hold the shared state
const BalanceContext = createContext<BalanceContext | null>(null);
//create provider compoment ?

//what is a provider component?
//provider compo provide data to the state - logic of data and getting data
export function BalanceProvider({ children }: { children: ReactNode }) {
  //1. balance
  const [walletBalance, setBalance] = useState(0);
  const [userTrades, setUserTrades] = useState<string | null>(null);

  const session: any = useSession();

  //2.
  const updateTrades = (data: string) => {
    setUserTrades(data);
  };
  const fetchBalance = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/balance`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.data.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.log("error getting the balance from the db 2", response);
      }
      if (response.status === 200) {
        const dataRecieved = await response.json();
        setBalance(dataRecieved.balance);
        console.log("data recieved", dataRecieved, "balance", walletBalance);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };
  //fetch balance on mount
  useEffect(() => {
    //only fetch the balace if the session has accesstoken , this ensure it does not fetch balance fxn does not access the if not init
    if (session?.data?.accessToken) {
      fetchBalance();
    }
  }, [session]); //depedency ensures if the session changes fetch the balance that is inital load the session might not be initialise so when initiale fetch the balace

  return (
    <BalanceContext.Provider
      value={{
        walletBalance,
        refreshBalance: fetchBalance,
        userTrades,
        updateTrades,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

//create a hook for consuming
export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("use balance must be withing a balance provider");
  }
  return context;
}
