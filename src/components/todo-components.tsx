"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { createTodo, deleteTodo, getTodos, updateTodo, Todo, CreateTodoPayload } from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Create Todo Form Schema
const createTodoFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
});

export function CreateTodoForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof createTodoFormSchema>>({
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Invalidate todos query to refetch
      toast.success("Todo created successfully!");
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create todo.");
    },
  });

  const onSubmit = (values: CreateTodoPayload) => {
    createTodoMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg rounded-lg p-6">
      {" "}
      {/* Added shadow, rounded-lg, and padding */}
      <CardHeader className="p-0 pb-4">
        {" "}
        {/* Adjusted padding */}
        <CardTitle className="text-2xl font-bold text-gray-800">Create New Todo</CardTitle> {/* Increased font size */}
      </CardHeader>
      <CardContent className="p-0">
        {" "}
        {/* Adjusted padding */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Buy groceries" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Milk, eggs, bread..." {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200" disabled={createTodoMutation.isPending}>
              {" "}
              {/* Styled button */}
              {createTodoMutation.isPending ? "Creating..." : "Add Todo"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { isDone: boolean } }) => updateTodo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo updated!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update todo.");
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete todo.");
    },
  });

  const handleToggleDone = () => {
    updateTodoMutation.mutate({ id: todo.id, payload: { isDone: !todo.isDone } });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      // Using window.confirm for simplicity, replace with custom modal
      deleteTodoMutation.mutate(todo.id);
    }
  };

  return (
    <Card className="flex items-center justify-between p-4 mb-3 bg-white shadow-sm rounded-lg border border-gray-200">
      {" "}
      {/* Styled card */}
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={todo.isDone}
          onCheckedChange={handleToggleDone}
          disabled={updateTodoMutation.isPending}
          className="h-5 w-5 rounded-sm border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white" // Styled checkbox
        />
        <div>
          <h3 className={`text-lg font-semibold ${todo.isDone ? "line-through text-gray-500" : "text-gray-800"}`}>{todo.title}</h3>
          {todo.description && <p className={`text-sm text-gray-600 ${todo.isDone ? "line-through text-gray-400" : ""}`}>{todo.description}</p>}
          <p className="text-xs text-gray-500 mt-1">Created: {format(new Date(todo.createdAt), "PPP")}</p>
        </div>
      </div>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteTodoMutation.isPending} className="py-1 px-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
        {" "}
        {/* Styled delete button */}
        Delete
      </Button>
    </Card>
  );
}

export function TodoList() {
  const [filters, setFilters] = useState({
    isDone: undefined as boolean | undefined,
    search: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10; // Number of todos per page

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos", filters, page],
    queryFn: () => getTodos({ ...filters, page, limit }),
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading todos...</div>;
  if (isError) return <div className="text-center text-red-500">Error: {(error as any).message}</div>;

  const todos = data?.data || [];
  const totalTodos = data?.total || 0;
  const totalPages = Math.ceil(totalTodos / limit);

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-lg shadow-md mb-6">
        {" "}
        {/* Styled filter section */}
        <Input placeholder="Search todos..." value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} className="flex-grow rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        <select
          value={filters.isDone === true ? "done" : filters.isDone === false ? "undone" : "all"}
          onChange={(e) => handleFilterChange("isDone", e.target.value === "done" ? true : e.target.value === "undone" ? false : undefined)}
          className="p-2 border rounded-md border-gray-300 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </select>
      </div>

      {todos.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No todos found. Create one!</p>
      ) : (
        <div className="space-y-3">
          {" "}
          {/* Adjusted space-y */}
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          {" "}
          {/* Adjusted margin */}
          <Button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} variant="outline" className="rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-200">
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            variant="outline"
            className="rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
