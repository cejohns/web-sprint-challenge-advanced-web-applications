import React, { useEffect, useState } from 'react';
import PT from 'prop-types';


const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  const [successMessage, setSuccessMessage] = useState('');
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

  const onSubmit = async evt => {
    evt.preventDefault();
    if (currentArticle) {
      // Assuming updateArticle is correctly implemented to make a PUT request
      await updateArticle({ article_id: currentArticle.article_id, article: values });
    } else {
      // Assuming postArticle is correctly implemented to make a POST request
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
        name="title" // Changed from id to name for binding
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        name="text" // Changed from id to name for binding
      />
      <select onChange={onChange} name="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
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
  })
};
