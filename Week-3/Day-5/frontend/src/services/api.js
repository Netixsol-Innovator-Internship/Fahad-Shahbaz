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
  tagTypes: ["Product", "User", "Cart", "Auth"],

  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation({
      query: (userData) => ({
        url: "users/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Product endpoints
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: () => ({
        url: "products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getProductsForAdmin: builder.query({
      query: () => ({
        url: "products/productsForAdmin",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    getProductsByCategory: builder.query({
      query: (category) => ({
        url: `products/category/${category}`,
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

    // User endpoints
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

    getUsers: builder.query({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Cart endpoints
    getCart: builder.query({
      query: () => ({
        url: "cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (cartData) => ({
        url: "cart/add",
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: "cart/removeItem",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "cart/update-quantity",
        method: "PUT",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Task endpoints (if still needed)
    addTask: builder.mutation({
      query: (taskData) => ({
        url: "tasks",
        method: "POST",
        body: taskData,
      }),
    }),
  }),
});

export const {
  // Auth hooks
  useLoginMutation,
  useSignupMutation,

  // Product hooks
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductsForAdminQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // User hooks
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
  useGetUsersQuery,

  // Cart hooks
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,

  // Task hooks
  useAddTaskMutation,
} = api;
