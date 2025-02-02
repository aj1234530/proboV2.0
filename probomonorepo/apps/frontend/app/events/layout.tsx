import Providers from "../providers/provider";
import SignedInNavbar from "../../components/SignedInNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-screen min-h-screen bg-[#f5f5f5]">
        <div className="max-w-[1440px] mx-auto ">
          <div className="w-full h-16">
            <SignedInNavbar balance="50" />
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
