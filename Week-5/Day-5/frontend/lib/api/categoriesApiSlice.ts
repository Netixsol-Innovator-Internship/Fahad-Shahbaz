import { baseApi } from "./baseApi";
import type { Category } from "../types";

export const categoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<Category, { name: string; logo?: string }>(
      {
        query: (categoryData) => ({
          url: "/categories",
          method: "POST",
          body: categoryData,
        }),
        invalidatesTags: ["Category"],
      }
    ),

    updateCategory: builder.mutation<
      Category,
      Partial<Category> & { id: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }],
    }),

    deleteCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
