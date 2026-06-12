import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login.jsx';
import Home from './Home.jsx';

import Layout from "./Components.jsx";
import BlogPost from './BlogPostFull.jsx';
import BlogsList from './BlogsList.jsx';
import BooksList from './BooksList.jsx';
import About from './AboutMe.jsx'
import BooksbyGenre from './BooksGenre.jsx'


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/blog" element={<BlogsList />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/login" element={<Login />} />

        <Route path="/books/:genre" element={<BooksbyGenre />} />
      </Route>

    </Routes>
  </BrowserRouter>
);