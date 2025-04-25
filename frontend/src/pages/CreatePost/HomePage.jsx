import React, { useEffect, useState } from 'react';
import { fetchAllPosts } from '../../services/postService';
import PostCard from  '../../components/Post/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchAllPosts().then(setPosts);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      <p></p>
    </div>
  );
};

export default HomePage;
