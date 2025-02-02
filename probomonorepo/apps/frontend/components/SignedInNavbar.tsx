export default function SignedInNavbar({ balance }: { balance?: string }) {
  return (
    <div className="bg-[#f5f5f5] h-16 border-b-1 border-gray-300  ">
      <div className="h-full flex flex-row justify-between items-center px-10">
        <div className="">
          <img
            className="h-8"
            src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Flogo.webp&w=128&q=75"
          ></img>
        </div>
        <div className="flex flex-row gap-10 h-full items-center">
          <div className="flex flex-col flex-wrap">
            <img src="https://d39axbyagw7ipf.cloudfront.net/icons/home.svg"></img>
            <span>Home</span>
          </div>

          <div className="flex flex-col flex-wrap">
            <img src="https://d39axbyagw7ipf.cloudfront.net/icons/portfolio.svg"></img>
            <span>Portfolio</span>
          </div>

          <div className="flex flex-row gap-4 border border-gray-300 px-4 p-0 rounded-sm">
            <img src="https://d39axbyagw7ipf.cloudfront.net/icons/wallet.svg"></img>
            <span>₹{balance}</span>
          </div>
          <img
            src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FSilhouette.png&w=48&q=75"
            className=" h-10 rounded-full"
          ></img>
        </div>
      </div>
    </div>
  );
}
