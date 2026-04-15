import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/thunks/authThunks';
import { isValidEmail } from '../../utils/helpers';
import './AuthForm.css';

function LoginForm() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ errors, setErrors ] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};

    console.log('VALIDATE FORM - Email:', email, 'Password:', password);

    if (!email) {
      newErrors.email = 'Email is required';
      console.log('Email is empty');
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email is invalid';
      console.log('Email is invalid:', email);
    }

    if (!password) {
      newErrors.password = 'Password is required';
      console.log('Password is empty');
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      console.log('Password too short:', password.length);
    }

    console.log('Validation result:', newErrors);
    return newErrors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    console.log('=== FORM SUBMIT STARTED ===');
    console.log('Email:', email, 'Password:', password);

    const newErrors = validateForm();
    console.log('Validation result:', newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log('Setting validation errors:', newErrors);
      setErrors(newErrors);
      // Force re-render to show errors
      setTimeout(() => console.log('Errors should be visible now'), 100);
      return;
    }

    console.log('No validation errors, proceeding with login...');
    setErrors({}); // Clear previous errors

    try {
      console.log('Dispatching login action...');
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login successful:', result);
      if (result) {
        console.log('Redirecting to home...');
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login failed with error:', err);
      setErrors({ submit: err || 'Login failed' });
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>


        {error && <div className="error-message" data-testid="redux-error">{error}</div>}
        {errors.submit && <div className="error-message" data-testid="submit-error">{errors.submit}</div>}

        <div className="form-group">
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''}
              placeholder="your@email.com"
            />
          </label>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''}
              placeholder="password"
            />
          </label>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-link">
          Don&apos;t have an account?
          {' '}
          <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
