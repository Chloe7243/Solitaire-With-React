import { useEffect, useState } from "react";
import { startGame } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import Game from "./components/Game";
import Loading from "./components/Loading";

import "./App.css";
import {
  useDrawCardQuery,
  useGetNewDeckQuery,
  // useCreateNewPileQuery,
} from "./store/services/api";

function App() {
  let content: React.ReactElement;
  const dispatch = useAppDispatch();
  const { currentData: cardsData, isLoading: cardsDataLoading } =
    useDrawCardQuery({ count: 28 });
  const [isLoading, setIsLoading] = useState(true);
  const [startBtnClicked, setStartBtnClicked] = useState(false);
  const gameStarted = useAppSelector((state) => state.game.started);
  const { data, isLoading: gameDataLoading } = useGetNewDeckQuery(null, {
    skip: !startBtnClicked,
  });

  useEffect(() => {
    if (!cardsDataLoading)
      setTimeout(() => setIsLoading(cardsDataLoading), 2000);
    else setIsLoading(cardsDataLoading);
  }, [cardsDataLoading]);
  const startGameFunc = () => setStartBtnClicked(true);

  if (startBtnClicked && !gameDataLoading) {
    localStorage.setItem("gameID", data.deck_id);
    dispatch(startGame());
  }

  content = gameStarted ? (
    <Game cardsData={cardsData} />
  ) : (
    <div className="bg-black w-screen h-screen flex items-center justify-center">
      <button className="start bg-white" onClick={startGameFunc}>
        Start Game
      </button>
    </div>
  );
  return (
    <>
      {isLoading || gameDataLoading ? (
        <Loading
          content={gameDataLoading ? "Starting Game ..." : "Loading..."}
        />
      ) : (
        content
      )}
    </>
  );
}

export default App;
