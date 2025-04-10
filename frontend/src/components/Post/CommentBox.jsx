import React, { useState } from 'react';

const CommentBox = ({ onComment, comments }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    onComment(text);
    setText('');
  };

  return (
    <div className="mt-3">
      {comments.map((c, i) => (
        <p key={i} className="text-xs text-gray-700 mb-1">
          <strong>{c.user}:</strong> {c.text}
        </p>
      ))}
      <form onSubmit={handleSubmit} className="flex mt-2 gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-2 py-1 text-xs border rounded"
        />
        <button type="submit" className="text-xs bg-blue-500 text-white px-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
