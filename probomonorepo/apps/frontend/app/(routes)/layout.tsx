import Providers from "../providers/provider";
import SignedInNavbar from "../../components/Navbar";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //this is the intial approach to set balance in the bar
  //but change to use context api
  // let balance;
  // const session = await getServerSession(NEXT_AUTH_CONFIG);
  // const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/balance`;
  // console.log("code  at 1 url hit at :", url, "seesion info:", session);
  // const token = session ? session.accessToken : null;
  // if (token) {
  //   const response = await fetch(url, {
  //     headers: {
  //       Authorization: `Bearer ${session.accessToken}`,
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   if (!response.ok) {
  //     console.log("error getting the balance from the db 2", response);
  //   }
  //   if (response.status === 200) {
  //     const dataRecieved = await response.json();
  //     balance = dataRecieved["balance"];
  //     console.log(balance);
  //     console.log(dataRecieved);
  //   }
  // }
  return (
    <>
      <div className="w-screen min-h-screen bg-[#f5f5f5]">
        {/* mx-auto centers the children */}
        <div className="max-w-[1440px] mx-auto ">
          <div className="w-full h-16">
            <SignedInNavbar />
          </div>
          <div className="w-full h-[100%-62px] p-2">
            <Providers>{children}</Providers>
          </div>
        </div>
      </div>
    </>
  );
}

/* DOUBTS:
1. is  the above correct way to define a page structure
2. should navbar be the sticky
*/

/*
TODO
1. mobile view for navbar ⭕️
2. event card and addition to the page
3. response for the evetns page

*/
