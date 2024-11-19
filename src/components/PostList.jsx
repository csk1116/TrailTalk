import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, addComment, upvotePost } from '../services/api';
import Loading from '../pages/Loading';
import '../styles/PostList.css';

const VALID_TAGS = [
    'Adventure', 'Trail Review', 'Scenic View', 'Trail Tips', 
    'Gear Advice', 'Planning Help', 'Weather Concerns',
    'Trail Running', 'Question', 'Opinion', 'Discussion', 'Other'
];

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filterTag, setFilterTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const loadPosts = async () => {
        try {
            const startTime = Date.now();
            const { data: postsData } = await fetchPosts();
            const elapsedTime = Date.now() - startTime;
            const remainingTime = 1000 - elapsedTime;
            setTimeout(() => {
                setPosts(postsData);
                setLoading(false);
            }, remainingTime > 0 ? remainingTime : 0);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    loadPosts();
  }, []);

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const newComment = { userId, comment, createdAt: new Date().toISOString() };
      await addComment(postId, newComment);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [newComment, ...post.comments] }
            : post
        )
      );
      setComment('');
    } catch (err) {
      alert(err.message || 'Failed to add comment. Please try again.');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to upvote. Please try again.');
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterTag(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = posts
    .filter((post) => 
      (filterTag === '' || post.tags.includes(filterTag)) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.userId.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <div className='sort'>
        <label>
          Sort by:
          <select value={sortOption} onChange={handleSortChange}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="upvotes">Upvotes</option>
          </select>
        </label>
        <label>
          Filter by tag:
          <select value={filterTag} onChange={handleFilterChange}>
            <option value="">All</option>
            {VALID_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label>
          Search:
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title or user ID"
          />
        </label>
      </div>
      <div className='post-list'>
      {filteredPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post._id} className="post-summary">
            <h2>
              <Link to={`/detail/${post._id}`}>{post.title}</Link>
            </h2>
            <p>{post.userId} Created At: {new Date(post.createdAt).toLocaleString()}</p>
            <p className='content'>{post.content}</p>
            <p>Tags: {post.tags.join(', ')}</p>
            <p>Upvotes: {post.upvotes}</p>
            <button onClick={() => handleUpvote(post._id)}>
                Upvote
            </button>
            {post.localImagePath && (
              <img
                src={`https://trailtalk-backend-production.up.railway.app${post.localImagePath}`}
                alt={post.title}
              />
            )}
            {!post.localImagePath && post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
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
              <form onSubmit={(e) => handleCommentSubmit(e, post._id)}>
                <textarea
                  placeholder="Leave a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button type="submit">Submit Comment</button>
              </form>
            </div>
          </div>
        ))
      )}
      </div>
     
    </div>
  );
};

export default PostList;