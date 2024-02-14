import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle } = props;

  useEffect(() => {
    if (currentArticle) {
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic,
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!values.title.trim()) errors.title = 'Title is required.';
    if (!values.text.trim()) errors.text = 'Text is required.';
    if (!values.topic) errors.topic = 'Please select a topic.';
    return errors;
  };

  const onSubmit = async evt => {
    evt.preventDefault();
    setIsLoading(true); // Enable loading state
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false); // Disable loading state if validation fails
      return;
    }
    
    try {
      if (currentArticle) {
        await updateArticle({ article_id: currentArticle.article_id, article: values });
      } else {
        await postArticle(values);
      }
      setCurrentArticleId(); 
      setSuccessMessage("Article successfully submitted!");
      setValues(initialFormValues); // Reset form values after submission
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setErrors({...errors, submit: error.message}); // Handle potential server-side errors
    } finally {
      setIsLoading(false); // Disable loading state
    }
  };

  const isDisabled = () => {
    return !values.title.trim() || !values.text.trim() || !values.topic || isLoading;
  };

  const cancelEdit = () => {
    setCurrentArticleId(null);
    setValues(initialFormValues);
    setErrors({});
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit Article" : "Create Article"}</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      <input
        aria-label="Title"
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        name="title"
      />
      {errors.title && <div className="error-message">{errors.title}</div>}
      <textarea
        aria-label="Text"
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        name="text"
      />
      {errors.text && <div className="error-message">{errors.text}</div>}
      <select
        aria-label="Topic"
        onChange={onChange}
        name="topic"
        value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      {errors.topic && <div className="error-message">{errors.topic}</div>}
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          {isLoading ? "Submitting..." : "Submit"}
        </button>
        {currentArticle && (
          <button type="button" onClick={cancelEdit} disabled={isLoading}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
