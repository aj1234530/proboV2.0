"use client"; //why use client ? =>(session providers use react context) React Context is unavailable in Server Components
import { SessionProvider } from "next-auth/react";

//this component needs prop which is - react component
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
