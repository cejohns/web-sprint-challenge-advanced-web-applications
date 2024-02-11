import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PT from 'prop-types';

export default function Articles({ articles, getArticles, deleteArticle, setCurrentArticleId, currentArticleId }) {
  useEffect(() => {
    getArticles(); // Call this function to fetch articles when the component mounts
  }, []);

  if (!localStorage.getItem('token')) {
    return <Navigate to="/" />; // Redirect to login if no token found
  }

  console.log(articles); // For debugging purposes

  return (
    <div className="articles">
      <h2>Articles</h2>
      {
        articles.length === 0
          ? 'No articles yet'
          : articles.filter(art => art != null && art.article_id != null)
          // Remove any nullish articles
              .map(art => {
                return (
                  <div className="article" key={art?.article_id}>
                    <div>
                      <h3>{art?.title}</h3>
                      <p>{art?.text}</p>
                      <p>Topic: {art?.topic}</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => setCurrentArticleId(art.article_id)}
                        disabled={currentArticleId === art.article_id} // Disable if this is the current article being edited
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteArticle(art.article_id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })
      }
    </div>
  );
}

Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // Can be undefined or null
};
