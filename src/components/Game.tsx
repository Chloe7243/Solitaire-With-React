import { useState, useEffect } from "react";
import {
  useLazyDrawCardQuery,
  useLazyReturnCardToDeckQuery,
  // useReturnCardToDeckQuery,
} from "../store/services/api";
import Draggable from "react-draggable";

import dragClickSound from "../sounds/dragClick.mp3";
import wrongMoveSound from "../sounds/wrongMove.mp3";
import correctMoveSound from "../sounds/correctMove.mp3";

const Game = ({ cardsData }: { cardsData: any }) => {
  const cardImgBaseUrl = "https://deckofcardsapi.com/static/img/";
  const cardBack = `${cardImgBaseUrl}back.png`;
  const [deckCards, setDeckCards] = useState([]);
  const [drawDeckCard, setDrawDeckCard] = useState(false);
  const [drawAcard, results] = useLazyDrawCardQuery();
  const [returnCard] = useLazyReturnCardToDeckQuery();
  const [cardPostition, setCardPosition] = useState({ x: 0, y: 0 });

  const tableau = new Array(7);
  for (let i = 0; i < tableau.length; i++) {
    const getStart = (j: number): number =>
      j === 0 ? 0 : (j += getStart(j - 1));
    const start = getStart(i);
    const end = start + i + 1;
    tableau[i] = cardsData?.cards.slice(start, end);
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

  const drawFromDeck = async () => {
    new Audio(dragClickSound).play();
    const card = await drawAcard({ count: 1 });
    console.log(card);
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

  const dragStartEventHandler = () => {
    console.log("hi");
    var audio = new Audio(dragClickSound);
    audio.play();
  };

  const dragEventHandler = (e: any, data: any) => {
    data.node.style.zIndex = 30;
  };

  const dragEndEventHandler = (e: any, data: any) => {
    const audio = new Audio(correctMoveSound);
    // audio.play();
    data.node.style.zIndex = 10;
  };

  return (
    <div
      className={`relative w-screen h-screen bg-[url(./assets/bg5.jpg)] bg-center bg-no-repeat bg-cover grid`}
    >
      <div
        className={`relative w-full h-full max-w-[100rem]  bg-center bg-no-repeat bg-cover grid grid-cols-3 grid-rows-2 gap-10 p-4 z-10 m-auto`}
      >
        <div className="flex gap-8">
          <button
            className="w-40 h-48 relative flex flex-col"
            onClick={drawFromDeck}
          >
            {new Array(5).fill("").map((_, i: number) => (
              <img
                draggable={false}
                className="absolute h-40"
                style={{ top: `${i * 0.1}rem` }}
                src={cardBack}
                alt=""
              />
            ))}
          </button>
          <div className="reltaive h-40 mt-1.5">
            {deckCards.map((img: any) => (
              <Draggable
                position={cardPostition}
                onDrag={dragEventHandler}
                onStop={dragEndEventHandler}
                onStart={dragStartEventHandler}
              >
                <img
                  draggable={false}
                  src={img.image}
                  data-code={img.code}
                  data-value={img.value}
                  data-color={suitColor(img.suit)}
                  className="w-full h-full cursor-grab relative"
                />
              </Draggable>
            ))}
          </div>
        </div>
        <div className="col-span-2 gap-5 flex justify-end">
          {result.map((suit) => (
            <div
              className="h-[10.4rem] w-[7.4rem] text-6xl border-dashed border rounded-lg flex flex-col items-center justify-center"
              style={{
                color: suitColor(suit.name),
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
        <div className="col-span-3 gap-10 flex justify-around">
          {tableau?.map((arr, i: number) => {
            return (
              <div className="w-full h-max relative flex flex-col items-center">
                {arr?.map((img: any, j: number) =>
                  j === arr.length - 1 ? (
                    <Draggable
                      key={i + j}
                      position={cardPostition}
                      onDrag={dragEventHandler}
                      onStop={dragEndEventHandler}
                      onStart={dragStartEventHandler}
                    >
                      <img
                        draggable={false}
                        src={img?.image}
                        data-code={img.code}
                        data-value={img.value}
                        data-color={suitColor(img.suit)}
                        className="absolute cursor-grab h-40"
                        style={{ top: `${j * 0.8}rem`, zIndex: 10 }}
                      />
                    </Draggable>
                  ) : (
                    <img
                      key={i + j}
                      draggable={false}
                      src={cardBack}
                      data-code={img.code}
                      data-value={img.value}
                      data-color={suitColor(img.suit)}
                      className="absolute cursor-grab h-40"
                      style={{ top: `${j * 0.8}rem` }}
                    />
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute w-full h-full bg-black opacity-75"></div>
    </div>
  );
};

export default Game;
