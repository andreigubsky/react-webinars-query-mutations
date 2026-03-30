//import { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios'
import { useMutation, useQueryClient, useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { fetchPosts } from '../../services/fetchPosts';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import { useFetchPosts } from '../../hooks/useFetchPosts';

type TodoInput = {
  title: string;
  completed: boolean;
};

export default function App() {
  //const [todo, setTodo] = useState(null);

  const todoId = 3;

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

  const mutation = useMutation<any, unknown, TodoInput>({
    mutationFn: async (newTodo2: TodoInput) => {
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
    queryKey: ['todos', todoId],
    queryFn: async () => {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
      return res.data;
    },
  });

  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");


  // const { data: posts, isFetching } = useQuery({
  //   queryKey: ['posts', debouncedValue],
  //   queryFn: () => fetchPosts(debouncedValue),
  //   placeholderData: keepPreviousData,
  // });

  const debouncedUpdate = useDebouncedCallback((value: string) => {
    setDebouncedValue(value);
  }, 1000);
  const handleChange = (value: string) => {
    setInputValue(value);
    debouncedUpdate(value);
  };

  const windowWidth = useWindowWidth();



  const [searchQuery, setSearchQuery] = useState('');
  const { data: posts, isFetching } = useFetchPosts(searchQuery);

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    300
  );
  return (
    <>
      <h1>Mutations</h1>
      <pre>{JSON.stringify(todo, null, 2)}</pre>

      <button onClick={handleCreateTodo}>Create Todo</button>
      {mutation.isPending && <div>Adding todo...</div>}
      {mutation.isError && <div>An error occurred</div>}
      {mutation.isSuccess && <div>Todo added!</div>}


      <input
        type="text"
        defaultValue={searchQuery}
        onChange={updateSearchQuery}
        placeholder="Search posts"
      />
      {isFetching && <div>Loading posts...</div>}
      {posts && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
      <p>Current window width: {windowWidth}px</p>;

      <input
        type="text"

        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search posts"
      />
      {isFetching && <div>Loading...</div>}
      {posts && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
      <p>Text value: {inputValue}</p>
    </>
  )
}
