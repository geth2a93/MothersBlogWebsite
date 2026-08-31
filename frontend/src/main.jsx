import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './dashboard/Login.jsx';

import Home from './public/Home.jsx';
import Layout from "./public/Components.jsx";
import BlogPostFull from './public/BlogPostFull.jsx';
import BlogsList from './public/BlogsList.jsx';
import BooksList from './public/BooksList.jsx';
import About from './public/AboutMe.jsx'
import BooksGenreWrapper from './public/BooksGenre.jsx'
import BookDetail from './public/BookFull.jsx'
import TeachingResourceFull from './public/TeachingResourceFull.jsx'
import ContentListPage from "./public/ContentListPage.jsx";

import AdminHome from "./dashboard/DashHome.jsx";
import AdminAboutMe from "./dashboard/AdminAboutMe.jsx";
import AdminWebResources from "./dashboard/AdminWebResources.jsx"

import NewBlog from "./dashboard/NewBlog.jsx";
import BlogPreview from "./dashboard/BlogPreview.jsx";
import AdminEditBlog from './dashboard/DisplayBlogs.jsx';
import EditBlog from "./dashboard/EditBlog.jsx";

import AdminEditBooks from "./dashboard/DisplayBooks.jsx";
import EditBook from "./dashboard/EditBook.jsx";
import NewBook from './dashboard/AddBook.jsx';

import DashboardLayout from './dashboard/DashWrapper.jsx';
import DashNotFound from './dashboard/DashNotFound.jsx';
import DisplayEmails from './dashboard/DisplayEmail.jsx';
import AddEmail from './dashboard/AddEmail.jsx';
import EditEmail from './dashboard/EditEmail.jsx';

import DisplayTeachingResources from './dashboard/DisplayTeach.jsx';
import AddTeachingResource from './dashboard/AddTeach.jsx';
import EditTeachingResource from './dashboard/EditTeach.jsx';

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
        <Route path="/books/title/:slug" element={<BookDetail />} />

        <Route path="/teachingresources" element={<ContentListPage type="teaching" />} />
        <Route path="/teachingresources/:slug" element={<TeachingResourceFull />} />
      </Route>

      <Route path="/login" element={<Login />} />

    <Route path="/dashboard" element={<DashboardLayout />}> 
      <Route path="*" element={<DashNotFound />} />
      <Route index element={<AdminHome />} />

      <Route path="aboutme" element={<AdminAboutMe />} />
      <Route path="websiteresources" element={<AdminWebResources />} />

      <Route path="add-blog" element={<NewBlog />} />
      <Route path="add-blog/:slug" element={<NewBlog />} />

      <Route path="blog-preview" element={<BlogPreview />} />
      <Route path="blog-preview/:slug" element={<BlogPreview />} />

      <Route path="blogs" element={<AdminEditBlog />} />
      <Route path="blog-editor" element={<NewBlog />} />
      <Route path="blog-editor/new" element={<NewBlog />} />
      <Route path="blog-edit/:slug" element={<EditBlog />} />

      <Route path="books" element={<AdminEditBooks />} />
      <Route path="book-edit/:slug" element={<EditBook />} />
      <Route path="newbook" element={<NewBook />} />

      <Route path="displayemails" element={<DisplayEmails />} />
      <Route path="new-email" element={<AddEmail />} />
      <Route path="edit-email/:email_id" element={<EditEmail />} />

      <Route path="display-teaching" element={<DisplayTeachingResources />} />
      <Route path="add-teaching" element={<AddTeachingResource />} />
      <Route path="edit-teaching/:slug" element={<EditTeachingResource />} />
    </Route>
    </Routes>
  </BrowserRouter>
);