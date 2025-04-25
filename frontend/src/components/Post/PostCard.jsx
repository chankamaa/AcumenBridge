import React, { useState } from 'react';
import { likePost, commentOnPost } from '../../services/postService'; // Adjust the import path as necessary
import CommentBox from './CommentBox';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    await likePost(post.id);
    setLikes(likes + 1); // Simple increment
  };

  const handleComment = async (text) => {
    await commentOnPost(post.id, text);
    const updated = [...comments, { user: 'You', text }];
    setComments(updated);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="text-sm text-gray-700 mb-2 font-medium">🧑 milan sanjaya</div>

      {post.description && <p className="text-sm mb-3">{post.description}</p>}

      <div className="grid grid-cols-1 gap-2 mb-3">
        {post.mediaUrls.map((url, i) =>
          url.endsWith('.mp4') ? (
            <video key={i} src={url} controls className="rounded w-full" />
          ) : (
            <img key={i} src={url} alt="media" className="rounded w-full" />
          )
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>👍 {likes}</span>
        <span>💬 {comments.length}</span>
      </div>

      <div className="flex justify-between border-t pt-2 text-sm">
        <button onClick={handleLike} className="text-blue-600 hover:underline">Like</button>
        <button className="text-blue-600 hover:underline">Comment</button>
      </div>

      <CommentBox onComment={handleComment} comments={comments} />
    </div>
  );
};

export default PostCard;
