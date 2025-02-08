import Image from "next/image";
import Link from "next/link";
import EventCard from "../../../components/EventCard";
interface event {
  id: string;
  eventName: string;
  eventTitle: string;
  imageUrl: string;
}
interface dataRecieved {
  events: event[];
  message: string;
}

export default async function () {
  const url = `${process.env.NEXT_PUBLIC_API_URL_V1}/user/events`;
  console.log("url hit at", url);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_V1}/user/events`
  );
  //response.json parses the json too
  const dataRecieved: dataRecieved = await response.json();

  // const dataRecieved: dataRecieved = JSON.parse(await response.json());
  // const events = dataRecieved.events;
  console.log(
    "body:",
    response.body,
    "arraybuffer:",
    response.arrayBuffer,
    "blob:",
    response.blob
  );

  return (
    <div>
      <div className="h-full-[h-12]">
        <div className="flex flex-col items-center  gap-3">
          {dataRecieved &&
            dataRecieved.events?.map((el) => (
              <div className="flex-1" key={el.id}>
                <Link href={`/events/${el.eventName}`}>
                  <EventCard
                    key={el.id}
                    eventTitle={el.eventTitle}
                    eventName={el.eventName}
                    imageUrl={el.imageUrl}
                    yesPrice={4.4}
                    noPrice={5.4}
                    noOfTraders={0}
                  />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

//steps
//get the orderbook
//list the events and link to the specific page
