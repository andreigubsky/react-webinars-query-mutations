// src/hooks/useFetchPosts.ts

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface FetchPostsResponse {
  posts: Post[];
}

const fetchPosts = async (searchText: string): Promise<Post[]> => {
  const res = await axios.get<FetchPostsResponse>(
    'https://dummyjson.com/posts/search',
    {
      params: { q: searchText }
    }
  );
  return res.data.posts;
};

export const useFetchPosts = (query: string) => {
  return useQuery({
    queryKey: ['posts', query],
    queryFn: () => fetchPosts(query),
    placeholderData: keepPreviousData,
  });
};
