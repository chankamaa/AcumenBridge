import React, { useState } from 'react';

const CreatePostPage = () => {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);

  const openWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dffkhchiwe', // ✅ Your Cloudinary cloud name
        uploadPreset: 'acumenbridge', // ✅ Your unsigned preset
        maxFiles: 3,
        resourceType: 'auto',
        multiple: true,
        folder: 'posts/',
        clientAllowedFormats: ['jpg', 'png', 'mp4'],
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setMediaUrls(prev => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mediaUrls.length === 0) {
      alert("Please upload at least 1 media file.");
      return;
    }

    const newPost = {
      description,
      mediaUrls,
    };

    console.log('Sending to backend:', newPost);
    // TODO: Send newPost to your backend using Axios

    setDescription('');
    setMediaUrls([]);
    alert("Post created successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Post</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 rounded-lg p-3 text-sm text-gray-700 resize-none mb-4"
            rows="4"
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="button"
            onClick={openWidget}
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline mb-4"
          >
            📎 Upload Images / Videos
          </button>

          {mediaUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {mediaUrls.map((url, index) =>
                url.includes('.mp4') ? (
                  <video
                    key={index}
                    controls
                    src={url}
                    className="rounded-lg w-full h-28 object-cover"
                  />
                ) : (
                  <img
                    key={index}
                    src={url}
                    alt="media preview"
                    className="rounded-lg w-full h-28 object-cover"
                  />
                )
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg shadow transition duration-300"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
