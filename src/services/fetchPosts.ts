import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface FetchPostsResponse {
  posts: Post[];
}

export const fetchPosts = async (searchText: string): Promise<Post[]> => {
  const res = await axios.get<FetchPostsResponse>(
    'https://dummyjson.com/posts/search',
    {
      params: {
        q: searchText,
      },
    }
  );
  return res.data.posts;
};
