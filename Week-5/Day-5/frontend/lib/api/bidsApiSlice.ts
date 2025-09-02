import { baseApi } from "./baseApi";
import type { Bid } from "../types";

export const bidsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBids: builder.query<Bid[], void>({
      query: () => "/bids",
      providesTags: ["Bid"],
    }),

    getUserBids: builder.query<Bid[], string>({
      query: (userId) => `/bids/user/${userId}`,
      providesTags: ["Bid"],
    }),

    getBid: builder.query<Bid, string>({
      query: (id) => `/bids/${id}`,
      providesTags: (result, error, id) => [{ type: "Bid", id }],
    }),

    createBid: builder.mutation<
      Bid,
      { auction: string; bidder: string; amount: number }
    >({
      query: (bidData) => ({
        url: "/bids",
        method: "POST",
        body: bidData,
      }),
      // Also invalidate the specific auction id if we know it via providesTags on Auction slice
      invalidatesTags: (result, error, arg) => [
        "Bid",
        { type: "Auction", id: arg.auction },
      ],
    }),

    updateBid: builder.mutation<Bid, Partial<Bid> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/bids/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Bid", id }],
    }),

    deleteBid: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/bids/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bid"],
    }),
  }),
});

export const {
  useGetBidsQuery,
  useGetUserBidsQuery,
  useGetBidQuery,
  useCreateBidMutation,
  useUpdateBidMutation,
  useDeleteBidMutation,
} = bidsApiSlice;
