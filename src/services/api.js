import axios from 'axios';

// Base URL for your backend API
const API_URL = import.meta.env.VITE_Trailtalk_API_URL;

// Response handler
const handleResponse = (response) => response.data;

// Error handler
const handleError = (error) => {
    console.error('API call failed:', error);
    if (error.response) {
        // Return structured error for API response issues
        return Promise.reject({
        status: error.response.status,
        message: error.response.data.error || 'An error occurred',
        });
    }
    // Handle network errors
    return Promise.reject({ message: 'Network error or server unreachable' });
};

// Fetch all posts
export const fetchPosts = () =>
    axios.get(`${API_URL}/posts`).then(handleResponse).catch(handleError);

// Fetch a single post by ID
export const fetchPost = (id) =>
    axios.get(`${API_URL}/posts/${id}`).then(handleResponse).catch(handleError);

// Create a new post
export const createPost = (postData) => {
    const isFileUpload = postData instanceof FormData;
    return axios
    .post(`${API_URL}/posts`, postData, {
        headers: isFileUpload ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .then(handleResponse)
    .catch(handleError);
};

// Update a post by ID
export const updatePost = (id, postData, isFileUpload = false) =>
  axios
    .put(`${API_URL}/posts/${id}`, postData, {
      headers: isFileUpload ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .then(handleResponse)
    .catch(handleError);

// Delete a post by ID (requires secret key)
export const deletePost = (id, secretKey) =>
  axios
    .delete(`${API_URL}/posts/${id}`, { data: { secretKey } })
    .then(handleResponse)
    .catch(handleError);

// Upvote a post
export const upvotePost = (id) =>
  axios
    .post(`${API_URL}/posts/${id}/upvote`)
    .then(handleResponse)
    .catch(handleError);

// Add a comment to a post
export const addComment = (postId, commentData) =>
    axios
        .post(`${API_URL}/posts/${postId}/comments`, commentData)
        .then(handleResponse)
        .catch(handleError);
