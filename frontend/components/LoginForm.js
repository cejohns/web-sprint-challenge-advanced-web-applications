import React, { useState } from 'react';
import PT from 'prop-types';

const initialFormValues = {
  username: '',
  password: '',
};

export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues);
  const { login } = props; // Destructure login prop

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await login(values); // Call the login function with username and password
      // Optional: Handle additional actions after successful login, if needed.
    } catch (error) {
      // Error handling if the login function throws an error
      // You might not need this catch block if the login function itself handles all errors
    }
  };
  

  const isDisabled = () => {
    // Check if username or password doesn't meet the required length
    return values.username.trim().length < 3 || values.password.trim().length < 8;
  };

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  );
}

LoginForm.propTypes = {
  login: PT.func.isRequired,
};
