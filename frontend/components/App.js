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


//const initialFormValues = { title: '', text: '', topic: '' };

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  //const [articleForm, setArticleForm] = useState({ title: '', content: '' }); // State for the article form inputs
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [username, setUsername] = useState('');

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate("/");
const redirectToArticles = () => navigate("/Articles");

  
  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };
  
  const login = async ({ username, password }) => {
    setMessage(''); // Reset any previous message
    setSpinnerOn(true); // Show a spinner or loading indicator
    try {
      const response = await axios.post(loginUrl, { username, password });
      localStorage.setItem('token', response.data.token);
      setUsername(username);
      // Set a personalized welcome message that includes the user's name
      const welcomeMessage = `Welcome back, ${username}!`; // Adjusted to include username
      setMessage(welcomeMessage);
      setSpinnerOn(false); 
      // Assuming this function sets the expected success message for articles fetching
      // or navigates the user to a page where this message is displayed.
      redirectToArticles();
    } catch (error) {
      // If login fails, display an error message to the user
      setMessage('Login failed: ' + error.message);
    } /*finally {
      setSpinnerOn(false); // Hide the spinner or loading indicator
    }*/
  };
  
  
  

  const getArticles = async () => {
  setMessage('');
  setSpinnerOn(true);
  try {
    const response = await axiosWithAuth().get(articlesUrl);
    setArticles(response.data.articles);
    // Assuming 'username' is available in the scope or from state/context
    setMessage(`Here are your articles, ${username}!`);
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
    setArticles(prevArticles => [...prevArticles, response.data.article]);
     setMessage(`Well done, ${username}. Great article!`);
     // setArticles(initialFormValues);
    //setArticleForm({ title: '', content: '' });
  } catch (error) {
    setMessage('Failed to post article: ' + error.message);
  } finally {
    setSpinnerOn(false);
  }
};



  
  

const updateArticle = async ({ article_id, article }) => {
  setMessage('');
  setSpinnerOn(true);
  //const username = localStorage.getItem('username') || 'User';
  try {
    const response = await axiosWithAuth().put(`${articlesUrl}/${article_id}`, article);
    //console.log(response.data);
    console.log("Before update:", articles);
    const updatedArticleData = response.data.article || response.data;
    const updatedArticles = articles.map(art =>
      art.article_id === article_id ? { ...art, ...updatedArticleData } : art
    );
    console.log("After update:", updatedArticles);
    console.log(updatedArticles);
    setArticles(updatedArticles);
    // Make sure the variable `username` is defined and accessible in this scope
    setMessage(`Nice update, ${username}!`);
    setCurrentArticleId(null);
  } catch (error) {
    setMessage(`Error updating article: ${error.message}`);
  } finally {
    setSpinnerOn(false);
  }
};

  
  
  
  
  

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      await axiosWithAuth().delete(`${articlesUrl}/${article_id}`);
      setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id));
      setMessage(`Article ${article_id} was deleted, ${username}!`); // Corrected line
    } catch (error) {
      setMessage(`Failed to delete article: ${error.message}`);
    } finally {
      setSpinnerOn(false);
    }
  };
  
  
  console.log(articles, currentArticleId);
  const currentArticle = currentArticleId != null ? articles.find(article => article.article_id === currentArticleId) : null;
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
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={currentArticle} // Now correctly passing currentArticle
               // setArticleForm={setArticleForm} // Added prop to set form state
              />
              <Articles 
                articles={articles} 
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
