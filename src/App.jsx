import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateUser from './components/CreateUser'
import CreatePost from './components/CreatePosts'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import EditPost from './components/EditPost'
import Navbar from './routes/Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/detail/:id" element={<PostDetail />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      {/* <PostList />
      <CreatePost /> */}
    </>
  )
}

export default App
