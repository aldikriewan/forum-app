import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createThread } from '../redux/thunks/threadThunks';
import './CreateThreadPage.css';

function CreateThreadPage() {
  const [ title, setTitle ] = useState('');
  const [ body, setBody ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ errors, setErrors ] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [ isLoggedIn, navigate ]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Judul tidak boleh kosong';
    } else if (title.length < 5) {
      newErrors.title = 'Judul minimal 5 karakter';
    }

    if (!body.trim()) {
      newErrors.body = 'Konten tidak boleh kosong';
    } else if (body.length < 20) {
      newErrors.body = 'Konten minimal 20 karakter';
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
      await dispatch(createThread({ title, body, category })).unwrap();
      navigate('/');
    } catch (error) {
      setErrors({ submit: error });
    }
  };

  return (
    <div className="create-thread-page">
      <div className="create-thread-container">
        <h1>Buat Thread Baru</h1>

        <form onSubmit={handleSubmit} className="create-thread-form">
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="form-group">
            <label htmlFor="title">
              Judul Thread
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'input-error' : ''}
                placeholder="Masukkan judul thread yang menarik..."
              />
            </label>
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Kategori (Opsional)
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                <option value="">Pilih Kategori</option>
                <option value="General">General</option>
                <option value="Question">Question</option>
                <option value="Discussion">Discussion</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="body">
              Konten
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={errors.body ? 'input-error' : ''}
                placeholder="Tulis konten thread Anda di sini..."
                rows="10"
              />
            </label>
            {errors.body && <span className="error-text">{errors.body}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-btn">
              Buat Thread
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary cancel-btn"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadPage;
