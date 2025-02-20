export default function MidSection() {
  return (
    <section className="bg-[#262626] min-h-screen flex items-center text-white px-10">
      <div className="flex-1">
        <h2 className="text-6xl font-bold mt-4">Engage And Grow</h2>
        <p className="mt-4 text-2xl max-w-xl">
          From Sports to Entertainment, Economy, Finance, and more. Keep an eye
          on events in your field of interest.
        </p>
      </div>
      {/* problems
1. why overflow hidden and relative
2. spilling video on less height
*/}
      <div className="flex-1 flex items-center justify-center ">
        <video
          className=" relative w-[300px] h-[600px] bg-[#262626 rounded-2xl border-4 border-transparent overflow-hidden"
          autoPlay
          loop
          muted
          playsInline
          src="https://d39axbyagw7ipf.cloudfront.net/videos/info-video.mp4"
        ></video>
      </div>
    </section>
  );
}
