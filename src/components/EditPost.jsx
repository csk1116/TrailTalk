import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, updatePost } from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPost(id);
        setEditForm({
          title: data.data.title,
          content: data.data.content,
          tags: data.data.tags,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      tags: Array.from(e.target.selectedOptions, (opt) => opt.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      alert('Secret key is required to edit this post.');
      return;
    }

    try {
      await updatePost(id, { ...editForm, secretKey });
      alert('Post updated successfully!');
      navigate(`/detail/${id}`); // Redirect back to the post detail page
    } catch (err) {
      alert(err.message || 'Failed to update the post. Please try again.');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post: {error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={editForm.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        value={editForm.content}
        onChange={handleChange}
      />
      <select
        name="tags"
        multiple
        value={editForm.tags}
        onChange={handleTagsChange}
      >
        <option value="Adventure">Adventure</option>
        <option value="Trail Review">Trail Review</option>
        <option value="Scenic View">Scenic View</option>
        <option value="Off the Beaten Path">Off the Beaten Path</option>
        {/* Add more tags */}
      </select>
      <input
        type="password"
        placeholder="Enter secret key to edit"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        required
      />
      <button type="submit">Save Changes</button>
      <button type="button" onClick={() => navigate(`/detail/${id}`)}>
        Discard Edits
      </button>
    </form>
  );
};

export default EditPost;
