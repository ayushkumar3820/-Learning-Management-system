import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/v1/', // Base URL of the backend
    credentials: 'include', // Always include credentials
  }),
  endpoints: () => ({}),
});
