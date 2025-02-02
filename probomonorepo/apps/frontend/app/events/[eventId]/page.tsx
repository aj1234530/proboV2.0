import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Orderbook from "../../../components/Orderbook";
export default async function ({ params }: { params: { eventId: string } }) {
  const { eventId } = await params;
  const session = await getServerSession();
  //redirect to root page if not signed in
  if (!session) {
    console.log(session);
    redirect("/");
  }
  //return not found page on condition like event not found
  // if (eventId === "notFound") {
  //   notFound();
  // }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col md:flex-row items-center gap-4 text-xl font">
        <img
          className="object contain w-16 h-16"
          src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e75356f6-0648-4b8d-810b-a950e5feb23d.png&w=96&q=75"
        ></img>
        <div className=" text-center font-medium">
          Bitcoin to reach 102212.45 USDT or more at 12:00 AM?
        </div>
      </div>
      <div className="flex flex-row gap-5">
        <span>Orderbook</span>
        <span>Overview</span>
      </div>
      <Orderbook />
    </div>
  );
}

{
  /* <div className="w-1/2 flex flex-row justify-between text-sm ">
        <div>
          {" "}
          <span className="font-semibold">PRICE</span>
        </div>
        <div>
          QTY AT <span className="text-blue-500">YES</span>
        </div>
      </div>
      <div className="w-1/2 flex flex-row justify-between text-sm ">
        <div>
          {" "}
          <span className="font-semibold">PRICE</span>
        </div>
        <div>
          QTY AT <span className="text-red-500">NO</span>
        </div>
      </div> */
}
