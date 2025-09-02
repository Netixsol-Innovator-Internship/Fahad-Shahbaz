import { baseApi } from "./baseApi";
import type { Wishlist } from "../types";

export const wishlistApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserWishlist: builder.query<Wishlist[], string>({
      query: (userId) => `/wishlist/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Wishlist", id: userId },
        "Wishlist",
      ],
    }),

    getAllWishlists: builder.query<Wishlist[], void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<Wishlist, { user: string; car: string }>({
      query: (wishlistData) => ({
        url: "/wishlist",
        method: "POST",
        body: wishlistData,
      }),
      invalidatesTags: (result, error, { user }) => [
        { type: "Wishlist", id: user },
        "Wishlist",
      ],
    }),

    removeFromWishlist: builder.mutation<void, string>({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetUserWishlistQuery,
  useGetAllWishlistsQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
