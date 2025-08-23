// services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fahad-week3-day5-teabackend.vercel.app/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("Token in headers:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "User", "Cart"],

  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "products",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ Get All Products
    getProductsForAdmin: builder.query({
      query: () => ({
        url: "products/productsForAdmin",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => {
        console.log("RTK Query - ID:", id);
        console.log("RTK Query - Body:", body);

        return {
          url: `products/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, newRole }) => ({
        url: `users/${id}/role`,
        method: "PATCH",
        body: { newRole },
      }),
      invalidatesTags: ["User"], 
    }),

    blockUnblockUser: builder.mutation({
      query: ({ id, action }) => ({
        url: `users/${id}/block`,
        method: "PATCH",
        body: { action }, 
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Get Users
    getUsers: builder.query({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsForAdminQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
  useGetProductsQuery,
  useGetUsersQuery,
} = api;
