import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [inputUserId, setInputUserId] = useState('');
  const navigate = useNavigate();

  const handleUserIdSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userId', inputUserId);
    navigate('/');
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleUserIdSubmit}>
        <label>
          Enter your User ID:
          <input
            type="text"
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateUser;