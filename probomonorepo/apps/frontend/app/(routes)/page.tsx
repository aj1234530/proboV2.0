import { Button } from "@repo/ui/button";
import Navbar from "../../components/Navbar";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from ".././lib/auth";
import { signOut } from "next-auth/react";
import Herosection from "../../components/Herosection";
export default async function Page() {
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
    <div className="max-w-screen-xl mx-auto">
      <main>
        <Herosection></Herosection>
      </main>
    </div>
  );
}
