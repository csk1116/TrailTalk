import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, deletePost, addComment, upvotePost } from '../services/api';
import Loading from '../pages/Loading';
import '../styles/PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const loadPost = async () => {
      try {
        const data = await fetchPost(id);
        setPost(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleDelete = async () => {
    if (!secretKey.trim()) {
      alert('Secret key is required to delete this post.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the post "${post.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await deletePost(id, secretKey);
      alert('Post deleted successfully!');
      navigate('/posts');
    } catch (err) {
      alert(err.message || 'Failed to delete the post. Please try again.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const newComment = { userId, comment, createdAt: new Date().toISOString() };
      await addComment(id, newComment);
      setPost((prevPost) => ({
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      }));
      setComment('');
    } catch (err) {
      alert(err.message || 'Failed to add comment. Please try again.');
    }
  };

 const handleUpvote = async () => {
    try {
      await upvotePost(id);
      setPost((prevPost) => ({
        ...prevPost,
        upvotes: prevPost.upvotes + 1,
      }));
    } catch (err) {
      alert(err.message || 'Failed to upvote. Please try again.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error loading post: {error}</p>;

  return (
    <div className='post-detail'>
      <div className="action-buttons">
        <button onClick={() => navigate(`/edit/${id}`)}>Edit Post</button>
        <button onClick={handleDelete}>Delete Post</button>
        <input
          type="password"
          placeholder="Enter secret key to delete"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
      <p>Upvotes: {post.upvotes}</p>
      <button onClick={() => handleUpvote(post._id)}>
         Upvote
      </button>
      {post.localImagePath && (
        <img
          src={`https://trailtalk-backend-production.up.railway.app${post.localImagePath}`}
          alt={post.title}
          style={{ width: '300px', height: 'auto' }}
        />
      )}
      {!post.localImagePath && post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ width: '300px', height: 'auto' }}
        />
      )}
      <div>
        <h3>Comments:</h3>
        {post.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          post.comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment, index) => (
              <div key={index}>
                <p>
                  <strong>{comment.userId}</strong> at{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p>{comment.comment}</p>
              </div>
            ))
        )}
      </div>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Leave a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default PostDetail;
