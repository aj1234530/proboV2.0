import { Button } from "@repo/ui/button";
import Navbar from "../../components/Navbar";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from ".././lib/auth";

import { signOut } from "next-auth/react";
import Herosection from "../../components/Herosection";
import MidSection from "../../components/landing/MidSection";
import Footer from "../../components/landing/Footer";
export default async function Page() {
  console.log(
    "env recieved",
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_URL_V1,
    process.env.NEXT_PUBLIC_WS_URL,
    process.env.NEXTAUTH_SECRET
  );
  //we need to pass the config to access id of token on server componets
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  //session is object with details of user returned after the login
  const balance = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_V1}/api/v1/getBalance`,
    {
      //write code for getting balance and pass in the navbar
    }
  );
  return (
    <div className="max-w-screen-xxl mx-auto">
      <main>
        <Herosection></Herosection>
        <MidSection></MidSection>
        <Footer></Footer>
      </main>
    </div>
  );
}
