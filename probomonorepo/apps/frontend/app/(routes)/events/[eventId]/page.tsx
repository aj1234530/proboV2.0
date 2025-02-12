import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Orderbook from "../../../../components/Orderbook";
import OrderCard from "../../../../components/OrderCard";

//params:Promise<{eventId:string}> measn that params is a promise which will resolve to an object with eventId key
export default async function ({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getServerSession();
  const url = `${process.env.NEXT_PUBLIC_API_URL_V1}/user/event/${eventId}`;
  console.log("url hit at", url);
  //redirect to root page if not signed in
  if (!session) {
    redirect("/api/auth/signin");
  }
  interface event {
    id: string;
    eventName: string;
    eventTitle: string;
    imageUrl: string;
  }
  interface dataRecieved {
    event: event;
    message: string;
  }
  const response = await fetch(url);
  const dataRecieved: dataRecieved = await response.json();
  console.log(dataRecieved.event);
  //return not found page on condition like event not found
  if (response.status === 404) {
    notFound();
  } else if (!response.ok) {
    return <>Something is not right , we are fixing it</>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col md:flex-row items-center gap-4 text-xl font">
        <img
          className="object contain w-16 h-16"
          src={dataRecieved.event.imageUrl}
        ></img>
        <div className=" text-center font-medium">
          {dataRecieved.event.eventTitle}
        </div>
      </div>
      <div className="flex flex-row gap-5">
        <span>Orderbook</span>
        {/* <span>Overview</span> */}
      </div>

      <Orderbook eventName={eventId} />

      <OrderCard eventName={eventId} />
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
