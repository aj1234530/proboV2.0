export default function Herosection() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen-[h-12]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl p-4">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
                India’s Leading
              </h1>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
                Online Skill Gaming
              </h1>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-light">
                Platform
              </h1>
            </div>
            <div className="text-lg md:text-xl lg:text-2xl font-medium">
              <p>Sports, Entertainment, Economy, or</p>
              <p>Finance</p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader-23012025.webp&w=640&q=75"
              alt="Hero Image"
              className="w-full max-w-lg h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="grid grid-cols-2 p-2">
        <div className="flex  flex-col gap-4">
          <div className="space-y-1 pt-4">
            <div className="text-sm md:text-lg lg:text-2xl xl:text-4xl">India’s Leading</div>
            <div className="text-sm md:text-lg lg:text-2xl xl:text-4xl">Online Skill Gaming</div>
            <div className="text-sm md:text-lg lg:text-2xl xl:text-4xl font-light">Platfrom</div>
          </div>
          <div>
            <div>Sports,Entertainment,Economy or </div>
            <div>Finanace</div>
          </div>
        </div>
        <div>
          <img src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader-23012025.webp&w=640&q=75"></img>
        </div>
      </div> */
}
