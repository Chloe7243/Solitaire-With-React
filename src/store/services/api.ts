import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const deck_id = localStorage.getItem("gameID");
export const cardsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://deckofcardsapi.com/api/deck",
  }),
  endpoints: (builder) => ({
    newDeck: builder.query({
      query: () => "new/shuffle",
    }),
    getDeckInfo: builder.query({
      query: () => `${deck_id}`,
    }),
    returnCardToDeck: builder.query({
      query: ({ cards }) => `${deck_id}/return/?cards=${cards}`,
    }),
    createNewPile: builder.query({
      query: ({ pile_name }) => ({
        url: `${deck_id}/pile/${pile_name}/add`,
      }),
    }),
    getPile: builder.query({
      query: ({ pile_name }) => ({
        url: `${deck_id}/pile/${pile_name}/list`,
      }),
    }),
    drawACard: builder.query({
      query: (args) => ({
        url: `${deck_id}/draw/`,
        method: "GET",
        params: args,
      }),
    }),
  }),
});

export const {
  useNewDeckQuery,
  useDrawACardQuery,
  useGetDeckInfoQuery,
  useLazyDrawACardQuery,
  useCreateNewPileQuery,
  useReturnCardToDeckQuery,
  useLazyReturnCardToDeckQuery,
} = cardsApi;
