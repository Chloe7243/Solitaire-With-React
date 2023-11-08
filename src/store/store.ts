import { configureStore, createSlice } from "@reduxjs/toolkit";
import { cardsApi } from "./services/api";

const GameSlice = createSlice({
  name: "game",
  initialState: { started: false },
  reducers: {
    startGame: (state) => {
      state.started = true;
    },
  },
});

const store = configureStore({
  reducer: {
    [cardsApi.reducerPath]: cardsApi.reducer,
    game: GameSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cardsApi.middleware),
});

export const { startGame } = GameSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export default store;
