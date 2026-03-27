//import { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

export default function App() {
  //const [todo, setTodo] = useState(null);

  const todoId = 2;

  const newTodo = {
    title: "Title",
    completed: false
  };

  const todoUpdate = {
    title: "New todo title"
  };

  // useEffect(() => {
  //   axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`)
  //     .then(response => {
  //       console.log(response.data)
  //       setTodo(response.data)
  //     })
  //     .catch(error => console.log(error))

  //   axios.post(`https://jsonplaceholder.typicode.com/todos`, newTodo)
  //     .then(response => console.log(response.data))
  //     .catch(error => console.log(error));

  //   axios.patch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, todoUpdate)
  //     .then(response => console.log(response.data))
  //     .catch(error => console.log(error));

  //   axios.delete(`https://jsonplaceholder.typicode.com/todos/${todoId + 1}`)
  //     .then((response) => console.log(response.data))
  //     .catch(error => console.log(error));
  // }, [])

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTodo2) => {
      const res = await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo2);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      console.log("Todo added successfully");
    }
  });

  const handleCreateTodo = () => {
    mutation.mutate({
      title: "My new todo12",
      completed: false
    })
  };

  const { data: todo } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
      return res.data;
    },
  });

  return (
    <>
      <h1>Mutations</h1>
      <pre>{JSON.stringify(todo, null, 2)}</pre>

      <button onClick={handleCreateTodo}>Create Todo</button>
      {mutation.isPending && <div>Adding todo...</div>}
      {mutation.isError && <div>An error occurred</div>}
      {mutation.isSuccess && <div>Todo added!</div>}
    </>
  )
}
