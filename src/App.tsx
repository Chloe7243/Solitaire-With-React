import { useState } from "react";
import { startGame } from "./store/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import Game from "./components/Game";
import Loading from "./components/Loading";

import "./App.css";
import { useCreateNewPileQuery, useNewDeckQuery } from "./store/services/api";

function App() {
  let content: React.ReactElement;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [startBtnClicked, setStartBtnClicked] = useState(false);
  const gameStarted = useAppSelector((state) => state.game.started);
  const { data, isLoading: gameDataLoading } = useNewDeckQuery(null, {
    skip: !startBtnClicked,
  });

  setTimeout(() => setIsLoading(false), 2000);
  const startGameFunc = () => setStartBtnClicked(true);

  if (startBtnClicked && !gameDataLoading) {
    localStorage.setItem("gameID", data.deck_id);
    dispatch(startGame());
  }

  content = gameStarted ? (
    <Game />
  ) : (
    <button className="start" onClick={startGameFunc}>
      Start Game
    </button>
  );
  return (
    <DndProvider backend={HTML5Backend}>
      {isLoading || gameDataLoading ? (
        <Loading
          content={gameDataLoading ? "Starting Game ..." : "Loading..."}
        />
      ) : (
        content
      )}
    </DndProvider>
  );
}

export default App;
