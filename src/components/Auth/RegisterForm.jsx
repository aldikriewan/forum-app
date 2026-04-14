import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../../redux/thunks/authThunks';
import { isValidEmail } from '../../utils/helpers';
import './AuthForm.css';

function RegisterForm() {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');
  const [ errors, setErrors ] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      // Auto login after registration
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result) {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err });
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>

        {error && <div className="error-message">{error}</div>}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-group">
          <label htmlFor="name">
            Full Name
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'input-error' : ''}
              placeholder="John Doe"
            />
          </label>
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

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
              placeholder="••••••"
            />
          </label>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm">
            Confirm Password
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={errors.passwordConfirm ? 'input-error' : ''}
              placeholder="••••••"
            />
          </label>
          {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="auth-link">
          Already have an account?
          {' '}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
