// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/posts">Post List</Link>
        </li>
        <li>
          <Link to="/create">Create Post</Link>
        </li>
        <li>
          <Link to="/create-user">Change/Create User</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;