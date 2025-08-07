import axios from "axios";

// Base URL for the API. It's recommended to use environment variables.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://fe-test-api.nwappservice.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth API Functions ---
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    // Add other user fields as per API response
  };
}

export const login = async (credentials: any): Promise<AuthResponse> => {
  // MOHON VERIFIKASI JALUR INI DI DOKUMENTASI POSTMAN ANDA
  // Jika Postman menunjukkan /auth/login, gunakan itu. Jika hanya /login, gunakan itu.
  const response = await api.post("/login", credentials);
  return response.data;
};

export const register = async (userData: any): Promise<AuthResponse> => {
  // MOHON VERIFIKASI JALUR INI DI DOKUMENTASI POSTMAN ANDA
  // Jika Postman menunjukkan /auth/register, gunakan itu. Jika hanya /register, gunakan itu.
  const response = await api.post("/register", userData);
  return response.data;
};

// --- Todo API Functions ---
export interface Todo {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  isDone?: boolean;
}

export interface GetTodosParams {
  page?: number;
  limit?: number;
  isDone?: boolean; // Filter by done status
  search?: string; // Filter by search query
}

export const getTodos = async (params?: GetTodosParams): Promise<{ data: Todo[]; total: number }> => {
  // MOHON VERIFIKASI JALUR INI DI DOKUMENTASI POSTMAN ANDA
  const response = await api.get("/todos", { params });
  return response.data; // Assuming API returns { data: [], total: number }
};

export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  // MOHON VERIFIKASI JALUR INI DI DOKUMENTASI POSTMAN ANDA
  const response = await api.post("/todos", payload);
  return response.data;
};

export const updateTodo = async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
  // MOHON VERIFIKASI JALUR INI DI DOKUMENTASI POSTMAN ANDA
  const response = await api.patch(`/todos/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  // MOHON VERIFIKASI JALUR INI DI DOKUMENTASI POSTMAN ANDA
  await api.delete(`/todos/${id}`);
};
