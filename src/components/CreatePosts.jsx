import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const VALID_TAGS = [
  'Adventure', 'Trail Review', 'Scenic View', 'Trail Tips', 
  'Gear Advice', 'Planning Help', 'Weather Concerns',
  'Trail Running', 'Question', 'Opinion', 'Discussion', 'Other'
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [secretKey, setSecretKey] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/create-user');
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    formData.append('secretKey', secretKey);
    formData.append('userId', userId);

    // Handle local or external image
    if (image) {
      formData.append('image', image); // Local file upload
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl); // External image URL
    }

    try {
      const response = await createPost(formData);
      console.log('Post created successfully:', response);
      // Redirect or update UI as needed
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select
        multiple
        onChange={(e) =>
          setTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
      >
        {VALID_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <input
        type="password"
        placeholder="Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
          setImageUrl(''); // Clear external URL if local file is selected
        }}
      />
      <input
        type="text"
        placeholder="External Image URL"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
          setImage(null); // Clear local file if external URL is entered
        }}
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
