import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fahad-week3-day5-teabackend.vercel.app/api",
  }), // Update baseUrl as needed
  tagTypes: ["Product", "User", "Task", "Cart"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: ({ name, email, password, role }) => ({
        url: "/users/register",
        method: "POST",
        body: { name, email, password, role },
      }),
    }),
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductsForAdmin: builder.query({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: "/products/productsForAdmin",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (product) => {
        const token = localStorage.getItem("token");
        return {
          url: "/products",
          method: "POST",
          body: product,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/products/${id}`,
          method: "PATCH",
          body: patch,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        const token = localStorage.getItem("token");
        return {
          url: `/products/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Product"],
    }),
    getUsers: builder.query({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: "/users",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["User"],
    }),
    changeUserRole: builder.mutation({
      query: ({ id, newRole }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/users/${id}/role`,
          method: "PATCH",
          body: { newRole },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["User"],
    }),
    blockUnblockUser: builder.mutation({
      query: ({ id, action }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/users/${id}/block`,
          method: "PATCH",
          body: { action },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["User"],
    }),
    addTask: builder.mutation({
      query: ({ title, description, token }) => ({
        url: "/tasks",
        method: "POST",
        body: { title, description },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    getTasks: builder.query({
      query: (userId) => ({
        url: `/tasks/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: ({ taskId, updatedTaskData, token }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body: updatedTaskData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      query: ({ taskId, token }) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, userId, quantity, token }) => ({
        url: "/cart/add",
        method: "POST",
        body: { productId, userId, quantity },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsForAdminQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useChangeUserRoleMutation,
  useBlockUnblockUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useAddTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddToCartMutation,
} = apiSlice;
