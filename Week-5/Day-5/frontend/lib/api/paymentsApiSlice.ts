import { baseApi } from "./baseApi";
import type { Payment } from "../types";

export const paymentsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<Payment[], void>({
      query: () => "/payments",
      providesTags: ["Payment"],
    }),

    getUserPayments: builder.query<Payment[], string>({
      query: (userId) => `/payments/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Payment", id: userId },
      ],
    }),

    createPayment: builder.mutation<
      Payment,
      {
        auction: string;
        user: string;
        bid: string;
        amount: number;
        transactionId?: string;
      }
    >({
      query: (paymentData) => ({
        url: "/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment"],
    }),

    updatePaymentStatus: builder.mutation<
      Payment,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/payments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Payment", id }],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetUserPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentStatusMutation,
} = paymentsApiSlice;
