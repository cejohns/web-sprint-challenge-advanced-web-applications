import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
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
    const { name, value } = evt.target;
    setValues({ ...values, [name]: value });
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
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop the form submission if validation fails
    }
    
    setErrors({}); // Clear previous errors
    if (currentArticle) {
      await updateArticle({ article_id: currentArticle.article_id, article: values });
    } else {
      await postArticle(values);
    }
    setSuccessMessage('Article successfully submitted!');
    setValues(initialFormValues); // Reset form values after submission
    setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
  };

  const isDisabled = () => {
    return !values.title.trim() || !values.text.trim() || !values.topic;
  };

  const cancelEdit = () => {
    setCurrentArticleId(null); // Reset current editing state
    setValues(initialFormValues); // Reset form values
    setErrors({}); // Clear any validation errors
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit Article" : "Create Article"}</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        name="title"
      />
      {errors.title && <div className="error-message">{errors.title}</div>}
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        name="text"
      />
      {errors.text && <div className="error-message">{errors.text}</div>}
      <select onChange={onChange} name="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      {errors.topic && <div className="error-message">{errors.topic}</div>}
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {currentArticle && <button type="button" onClick={cancelEdit}>Cancel edit</button>}
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
