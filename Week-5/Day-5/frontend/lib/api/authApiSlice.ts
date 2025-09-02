import { baseApi } from "./baseApi";
import type { LoginRequest, SignupRequest, AuthResponse, User } from "../types";

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Backend signup returns { message, user } (no token)
    signup: builder.mutation<{ message: string; user: User }, SignupRequest>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = authApiSlice;
