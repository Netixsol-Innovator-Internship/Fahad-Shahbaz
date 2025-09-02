import { baseApi } from "./baseApi";
import type { Car } from "../types";

export const carsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<Car[], void>({
      query: () => "/cars",
      providesTags: ["Car"],
    }),

    getCar: builder.query<Car, string>({
      query: (id) => `/cars/${id}`,
      providesTags: (result, error, id) => [{ type: "Car", id }],
    }),

    createCar: builder.mutation<Car, Partial<Car>>({
      query: (carData) => ({
        url: "/cars",
        method: "POST",
        body: carData,
      }),
      invalidatesTags: ["Car"],
    }),

    updateCar: builder.mutation<Car, Partial<Car> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/cars/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Car", id }],
    }),

    deleteCar: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carsApiSlice;
