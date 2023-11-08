import { useState, useEffect } from "react";
import {
  useDrawACardQuery,
  useLazyDrawACardQuery,
  useLazyReturnCardToDeckQuery,
  useReturnCardToDeckQuery,
} from "../store/services/api";
import { CardTypes } from "./dragTypes";
import { useDrag, useDragLayer } from "react-dnd";


// export const CustomDragLayer = () => {
//   const { itemType, isDragging, item, initialOffset, currentOffset } =
//     useDragLayer((monitor) => ({
//       item: monitor.getItem(),
//       itemType: monitor.getItemType(),
//       initialOffset: monitor.getInitialSourceClientOffset(),
//       currentOffset: monitor.getSourceClientOffset(),
//       isDragging: monitor.isDragging(),
//     }));
//   function renderItem() {
//     switch (itemType) {
//       case ItemTypes.BOX:
//         return <BoxDragPreview title={item.title} />;
//       default:
//         return null;
//     }
//   }
//   if (!isDragging) {
//     return null;
//   }
//   return (
//     <div style={layerStyles}>
//       <div
//         style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}
//       >
//         {renderItem()}
//       </div>
//     </div>
//   );
// };


const Game = () => {
  const cardImgBaseUrl = "https://deckofcardsapi.com/static/img/";
  const cardBack = `${cardImgBaseUrl}back.png`;
  const [deckCards, setDeckCards] = useState([]);
  const [drawDeckCard, setDrawDeckCard] = useState(false);
  const { data } = useDrawACardQuery({ count: 28 });
  const [drawAcard, results] = useLazyDrawACardQuery();
  const [returnCard] = useLazyReturnCardToDeckQuery();

  const [{ isDragging }, dragCard] = useDrag(() => ({
    type: CardTypes.RED,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
  }));

  const tableau = new Array(7);
  for (let i = 0; i < tableau.length; i++) {
    const getStart = (j: number): number =>
      j === 0 ? 0 : (j += getStart(j - 1));
    const start = getStart(i);
    const end = start + i + 1;
    tableau[i] = data?.cards.slice(start, end);
  }

  const result = [
    { name: "clubs", cards: [] },
    { name: "hearts", cards: [] },
    { name: "spades", cards: [] },
    { name: "diamonds", cards: [] },
  ];

  const suitColor = (name: string) =>
    ["hearts", "diamonds"].includes(name.toLowerCase()) ? "red" : "black";

  // const drag = (event: React.DragEvent<HTMLDivElement>) => {
  //   // console.log(event.currentTarget.);
  //   const imageSrc = event.currentTarget.getAttribute("src") || "";
  //   event.dataTransfer.setData("text/plain", imageSrc);
  //   event.currentTarget.classList.add("opaczz");
  //   setTimeout(() => event.target.classList.add("hidden"), 0);
  //   console.log(imageSrc);
  //   console.log(event.dataTransfer);
  // };

  const drop = (event: React.DragEvent) => {
    console.log(event.target);
    const data = event.dataTransfer.getData("text/plain");
    console.log(data);
  };

  const allowDrop = (event: React.DragEvent) => event.preventDefault();

  const drawFromDeck = () => {
    drawAcard({ count: 1 });
    if (drawDeckCard) {
      const cards = deckCards.map((card: any) => card.code).join(",");
      returnCard({ cards });
    } else {
      setDrawDeckCard(true);
    }
  };

  useEffect(() => {
    if (results && results.data) {
      setDeckCards(results.data.cards);
    }
    console.log(results);
  }, [results]);

  return (
    <div
      className={`relative w-screen h-screen bg-[url(./assets/bg5.jpg)] bg-center bg-no-repeat bg-cover grid grid-cols-3 grid-rows-2 gap-10 p-4`}
    >
      <div className="flex gap-8 z-10">
        <button
          className="w-40 h-48 relative flex flex-col items-center"
          onClick={drawFromDeck}
        >
          {new Array(5).fill("").map((f, i: number) => (
            <img
              draggable="false"
              className="absolute"
              style={{ top: `${i * 0.1}rem` }}
              src={cardBack}
              alt=""
            />
          ))}
        </button>
        <div className="reltaive h-56 w-40">
          {deckCards.map((img: any) => (
            <img
              src={img.image}
              ref={dragCard}
              data-code={img.code}
              data-value={img.value}
              data-color={suitColor(img.suit)}
              className="w-full h-full cursor-grab"
            />
          ))}
        </div>
      </div>
      <div className="col-span-2 gap-5 flex z-10 justify-end">
        {result.map((suit) => (
          <div
            className="h-56 text-9xl border-dashed border w-full max-w rounded-lg flex flex-col items-center justify-center"
            style={{
              color: suitColor(suit.name),
              maxWidth: "10rem",
            }}
          >
            {suit.name === "hearts"
              ? "♥️"
              : suit.name === "clubs"
              ? "♣️"
              : suit.name === "spades"
              ? "♠️"
              : "♦️"}
          </div>
        ))}
      </div>
      <div
        className="col-span-3 gap-2 flex justify-around z-10"
      >
        {tableau?.map((arr) => {
          return (
            <div className="w-full h-full relative flex flex-col items-center z-40">
              {arr.map((img: any, i: number) => (
                <img
                  ref={dragCard}
                  src={i === arr.length - 1 ? img?.image : cardBack}
                  data-code={img.code}
                  data-value={img.value}
                  data-color={suitColor(img.suit)}
                  className="absolute h-52 cursor-grab"
                  style={{ top: `${i * 1.5}rem` }}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div className="absolute w-full h-full bg-black opacity-75"></div>
    </div>
  );
};

export default Game;
