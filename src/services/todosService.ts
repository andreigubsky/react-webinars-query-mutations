import axios from "axios";
import type { JsonResponse } from "../types/jsonplaceholder";

const TOKEN = import.meta.env.VITE_JSONPLACEHOLDER_TOKEN;
const URL = "https://jsonplaceholder.typicode.com/todos";

export default async function fetchTodos(
    todoId: number,
  ): Promise<JsonResponse> {
    try {
      const axiosConfig = {
        method: "get",
        url: URL,
        params: {
            todoId: todoId,
        },
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      };
  
      const response = await axios.request<JsonResponse>(axiosConfig);
      if (!response.data) {
        throw new Error('No data');
      }
      return response.data; 
    } catch (err) {
      console.error("fetchMovies error:", err);
      throw err;; 
    }
  }