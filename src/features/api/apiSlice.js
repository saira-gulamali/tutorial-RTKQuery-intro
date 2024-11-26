import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
      transformResponse: (res) => {
        let delay = 60000;
        const loadedTodos = res.map((item) => {
          if (!item.date) {
            item.date = Date.now() - delay;
            delay += 60000;
          }
          return item;
        });

        return loadedTodos.sort((a, b) => b.date - a.date);
      },
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation({
      query: (todo) => {
        todo.date = Date.now();
        return {
          url: "/todos",
          method: "POST",
          body: todo,
        };
      },
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
