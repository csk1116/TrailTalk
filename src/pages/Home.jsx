import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [userId, setUserId] = useState('');
  const [inputUserId, setInputUserId] = useState('');
  const [isChangingUser, setIsChangingUser] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleUserIdSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userId', inputUserId);
    setUserId(inputUserId);
    setInputUserId('');
    setIsChangingUser(false);
  };

  const handleChangeUser = () => {
    setIsChangingUser(true);
  };

  return (
    <div>
      <h1>Welcome to TrailTalk</h1>
      {userId ? (
        <div>
          <p>Hello, {userId}</p>
          <nav>
            <ul>
              <li>
                <Link to="/posts">View Posts</Link>
              </li>
              <li>
                <Link to="/create">Create a Post</Link>
              </li>
            </ul>
          </nav>
          <button onClick={handleChangeUser}>Change User</button>
          {isChangingUser && (
            <form onSubmit={handleUserIdSubmit}>
              <label>
                Enter new User ID:
                <input
                  type="text"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Home;