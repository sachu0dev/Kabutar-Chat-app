import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
  }),
  tagTypes: ["Chat", "User"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "/chat/chats",
        credentials: "include",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `/user/search?name=${name}`,
        credentials: "include",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    sedFriendRequest: builder.mutation({
      query: (data) => ({
        url: "/user/send-request",
        credentials: "include",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getNotification: builder.query({
      query: () => ({
        url: "/user/notification",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "/user/accept-request",
        credentials: "include",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSedFriendRequestMutation,
  useGetNotificationQuery,
  useAcceptFriendRequestMutation,
} = api;
