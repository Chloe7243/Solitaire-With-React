import cardGif from "../assets/poker-of-aces.gif";

const Loading = ({ content }: { content?: string }) => {
  return (
    <div>
      <img src={cardGif} alt="" width={300} />
      <p className="text-xl">{content || "Loading..."}</p>
    </div>
  );
};

export default Loading;
