import cardGif from "../assets/poker-of-aces.gif";

const Loading = ({ content }: { content?: string }) => {
  return (
    <div className="bg-black h-screen w-screen flex items-center flex-col justify-center">
      <img src={cardGif} alt="" width={300} />
      <p className="text-xl text-white">{content || "Loading..."}</p>
    </div>
  );
};

export default Loading;
