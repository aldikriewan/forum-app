import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncPopulateUsersAndThreads } from '../redux/thunks/threadThunks';
import { setFilterCategory } from '../redux/slices/threadSlice';
import ThreadItem from '../components/Thread/ThreadItem';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const { list: threads, filterCategory } = useSelector((state) => state.threads);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [ dispatch ]);

  // Get unique categories from threads using Array.from and Set
  const categories = Array.from(new Set(threads.map((t) => t.category).filter(Boolean)));

  // Filter threads based on search term and category
  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase())
      || (thread.body && thread.body.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || thread.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Forum Diskusi</h1>
          <p>Berbagi dan diskusikan topik menarik bersama komunitas</p>
        </div>

        {isLoggedIn && (
          <Link to="/create-thread" className="btn btn-primary">
            Buat Thread Baru
          </Link>
        )}
      </div>

      <div className="home-container">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Cari Thread</h3>
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau konten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h3>Kategori</h3>
            <button
              type="button"
              className={`category-btn ${!filterCategory ? 'active' : ''}`}
              onClick={() => dispatch(setFilterCategory(null))}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-btn ${filterCategory === category ? 'active' : ''}`}
                onClick={() => dispatch(setFilterCategory(category))}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <main className="threads-main">
          {filteredThreads.length > 0 ? (
            <div className="threads-list">
              {filteredThreads.map((thread) => (
                <ThreadItem key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="no-threads">
              <p>Belum ada thread yang sesuai dengan pencarian Anda</p>
              {!isLoggedIn && (
                <p className="no-threads-action">
                  <Link to="/login">Login</Link>
                  {' '}
                  untuk membuat thread baru
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
