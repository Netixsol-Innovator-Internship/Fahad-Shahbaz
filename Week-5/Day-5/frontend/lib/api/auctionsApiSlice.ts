import { baseApi } from "./baseApi";
import type { Auction } from "../types";

type CreateAuctionPayload = {
  car: string;
  startTime: string;
  endTime: string;
  status?: Auction["status"];
  currentPrice?: number;
  createdBy: string;
};

export const auctionsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuctions: builder.query<Auction[], void>({
      query: () => "/auctions",
      providesTags: ["Auction"],
    }),

    getAuction: builder.query<Auction, string>({
      query: (id) => `/auctions/${id}`,
      providesTags: (result, error, id) => [{ type: "Auction", id }],
    }),

    createAuction: builder.mutation<Auction, CreateAuctionPayload>({
      query: (auctionData) => ({
        url: "/auctions",
        method: "POST",
        body: auctionData,
      }),
      invalidatesTags: ["Auction"],
    }),

    updateAuction: builder.mutation<Auction, Partial<Auction> & { id: string }>(
      {
        query: ({ id, ...patch }) => ({
          url: `/auctions/${id}`,
          method: "PUT",
          body: patch,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Auction", id }],
      }
    ),

    deleteAuction: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/auctions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auction"],
    }),
  }),
});

export const {
  useGetAuctionsQuery,
  useGetAuctionQuery,
  useCreateAuctionMutation,
  useUpdateAuctionMutation,
  useDeleteAuctionMutation,
} = auctionsApiSlice;
