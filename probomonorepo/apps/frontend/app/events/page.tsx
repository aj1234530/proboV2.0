import Image from "next/image";
import Link from "next/link";
import EventCard from "../../components/EventCard";

export default function () {
  let x = "xyz";
  return (
    <div>
      <h1>Events Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Link href="/events/1">
          <EventCard />
        </Link>
        <Link href="/events/2">
          <EventCard />
        </Link>
        <Link href="/events/3">
          <EventCard />
        </Link>
        <Link href="/events/4">
          <EventCard />
        </Link>
        <Link href="/events/5">
          <EventCard />
        </Link>
        <Link href="/events/6">
          <EventCard />
        </Link>
      </div>
    </div>
  );
}

//steps
//get the orderbook
//list the events and link to the specific page
