import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
// Ensure axiosWithAuth is imported or defined if it's used elsewhere
import axiosWithAuth from '../axios';

import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate("/");
const redirectToArticles = () => navigate("/articles");

  
  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };
  

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await axios.post(loginUrl, { username, password });
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message);
      redirectToArticles();
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    } finally {
      setSpinnerOn(false);
    }
  };
  
  

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await axiosWithAuth().get(articlesUrl);
      setArticles(response.data.articles);
      setMessage('Articles fetched successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('Failed to fetch articles: ' + error.message);
      }
    } finally {
      setSpinnerOn(false);
    }
  };
  
  

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await axiosWithAuth().post(articlesUrl, article);
      await getArticles(); // Refresh articles list
      setMessage(response.data.message || 'Article added successfully!');
    } catch (error) {
      setMessage('Failed to post article: ' + error.message);
    } finally {
      setSpinnerOn(false); // This is correctly placed and will always execute
    }
  };
  

  const updateArticle = async ({ article_id, article }) => {
    try {
      const response = await axios.put(`http://localhost:9000/api/articles/${article_id}`, article);
      console.log('Article updated:', response.data);
      // Update your application state as needed
    } catch (error) {
      console.error('Error updating article:', error);
      // Handle error appropriately
    }
  };
  
  
  
  

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await axiosWithAuth().delete(`${articlesUrl}/${article_id}`);
      await getArticles(); // Refresh articles list
      setMessage(response.data.message || 'Article deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete article: ' + error.message);
    } finally {
      setSpinnerOn(false);
    }
  };
  
  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
    <Spinner on={spinnerOn} />
    <Message message={message} />
    <button id="logout" onClick={logout}>Logout from app</button>
    <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
      <h1>Advanced Web Applications</h1>
      <nav>
        <NavLink id="loginScreen" to="/">Login</NavLink>
        <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<LoginForm login={login} />} />
        <Route path="/articles" element={
          <>
            <ArticleForm 
              postArticle={postArticle} 
              updateArticle={updateArticle}
              currentArticleId={currentArticleId}
              setCurrentArticleId={setCurrentArticleId}
            />
            <Articles 
              articles={articles} 
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
            />
          </>
        } />
      </Routes>
      <footer>Bloom Institute of Technology 2022</footer>
    </div>
  </>
  )
}
