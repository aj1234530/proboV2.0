"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Navbar() {
  const session = useSession();
  // console.log(1, session.data, 2, session.status, 3, session.update);
  //session is object with details of user returned after the login
  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/v1/user/signin`,
        {
          method: "POST",
          //because of not specify content type in headesr i was stuck here
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "ak@gmail.com",
            password: "123456",
          }),
        }
      );
      const responseJson = await response.json();
      console.log(response, 2, response.ok, 3, responseJson.userId);
    };
    fetchData();
  }, []);
  return (
    <div className="h-12 bg-slate-100 flex justify-between">
      <div className="flex justify-between">
        <div>Logo</div>
        <ul className="flex ">
          <li>Home</li>
          <li>Events</li>
          <li>About</li>
        </ul>
      </div>
      <div>{JSON.stringify(session)}</div>
      <div className="flex gap-2">
        {session.status === "unauthenticated" && (
          <button onClick={() => signIn()}>Login</button>
        )}

        {session.status === "authenticated" && (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
      </div>
    </div>
  );
}
