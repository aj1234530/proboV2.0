export default function ({
  eventName = "India to win the 4th T20I vs England?",
  imageUrl,
  yesPrice = 4.3,
  noPrice = 5.7,
  noOfTraders = 1000,
}: {
  eventName: string;
  imageUrl: string;
  yesPrice: number;
  noPrice: number;
  noOfTraders: number;
}) {
  return (
    <div
      className="flex flex-col bg-white gap-2 drop-shadow-md p-2 rounded max-w-[500px]
 "
    >
      <div className="flex flex-row gap-1">
        <img
          className=""
          src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FBar_Chart.png&w=16&q=75"
        ></img>
        <div>{noOfTraders} traders</div>
        <div>traders</div>
      </div>

      <div className="flex flex-row gap-2">
        <img
          className="h-12"
          src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_37a12ace-be9c-49e8-baee-f35edb78482b.png&w=96&q=75"
        ></img>
        <div className="title">{eventName}</div>
      </div>
      <div className="flex flex-row  flex-wrap gap-2 text-sm">
        <button className="bg-blue-500/30 px-2 py-2 rounded flex-grow-1">
          <span className="text-blue-500/100">Yes ₹{yesPrice}</span>
        </button>
        <button
          type="button" 
          className="bg-red-500/30 p-0 rounded flex-grow-1 "
        >
          <span className="text-red-500/100">NO ₹{noPrice}</span>
        </button>
      </div>
    </div>
  );
}
