import { Button } from "@repo/ui/button";
import { PrismaClient } from "@repo/db/client";
import Navbar from "../components/Navbar";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "./lib/auth";
export default async function Page() {
  //we need to pass the config to access id of token on server componets
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  //session is object with details of user returned after the login

  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <Navbar />
    </div>
  );
}
