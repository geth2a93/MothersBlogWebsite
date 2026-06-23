import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login.jsx';
import CreateUser from "./CreateUser.jsx";

import Home from './Home.jsx';
import Layout from "./Components.jsx";
import BlogPostFull from './BlogPostFull.jsx';
import BlogsList from './BlogsList.jsx';
import BooksList from './BooksList.jsx';
import About from './AboutMe.jsx'
import BooksGenreWrapper from './BooksGenre.jsx'
import BookDetail from './BookFull.jsx'
import TeachingResourceFull from './TeachingResourceFull.jsx'
import ContentListPage from "./ContentListPage";
import AdminHome from "./AdminHome";
import AdminAboutMe from "./AdminAboutMe";
import AdminWebResources from "./AdminWebResources"
import Embed from "./media.jsx"
import NewBlog from "./NewBlog.jsx";
import BlogPreview from "./BlogPreview";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/blog/:slug" element={<BlogPostFull />} />
        <Route path="/blog" element={<BlogsList />} />

        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:genre" element={<BooksGenreWrapper />} />
        <Route path="/books/title/:title" element={<BookDetail />} />

        <Route path="/teachingresources" element={<ContentListPage type="teaching" />} />
        <Route path="/teachingresources/:title" element={<TeachingResourceFull />} />
        <Route path="/embed" element={<Embed />} />

      </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/createuser" element={<CreateUser />} />

      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/aboutme" element={<AdminAboutMe />} />
      <Route path="/admin/websiteresources" element={<AdminWebResources />} />
      <Route path="/admin/blog-editor" element={<NewBlog/>} />
      <Route path="/admin/blog-editor/:slug" element={<NewBlog />} />

      <Route path="/admin/blog-preview" element={<BlogPreview />} />
      <Route path="/admin/blog-preview/:slug" element={<BlogPreview />} />
      
    </Routes>
  </BrowserRouter>
);