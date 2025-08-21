import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.github.com/",
    prepareHeaders: (headers) => {
      if (GITHUB_TOKEN) {
        headers.set("Authorization", `Bearer ${GITHUB_TOKEN}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: (q) => `search/users?q=${encodeURIComponent(q)}`,
    }),
    getUser: builder.query({
      query: (username) => `users/${username}`,
    }),
    getUserRepos: builder.query({
      query: (username) => `users/${username}/repos?sort=updated&per_page=10`,
    }),
    getUserEvents: builder.query({
      query: (username) => `users/${username}/events/public?per_page=10`,
    }),
  }),
});

export const {
  useSearchUsersQuery,
  useGetUserQuery,
  useGetUserReposQuery,
  useGetUserEventsQuery,
} = githubApi;
