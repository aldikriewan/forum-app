import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchThreadDetail, upVoteThread, downVoteThread, neutralizeThreadVote } from '../redux/thunks/threadThunks';
import { createComment } from '../redux/thunks/commentThunks';
import { formatDate, decodeHtmlEntities } from '../utils/helpers';
import CommentItem from '../components/Comment/CommentItem';
import './ThreadDetailPage.css';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ commentContent, setCommentContent ] = useState('');
  const { detailMap } = useSelector((state) => state.threads);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const threadDetail = detailMap[threadId];

  useEffect(() => {
    if (!threadDetail) {
      dispatch(fetchThreadDetail(threadId));
    }
  }, [ threadId, dispatch, threadDetail ]);

  const handleCreateComment = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!commentContent.trim()) {
      alert('Komentar tidak boleh kosong');
      return;
    }

    dispatch(createComment({ threadId, content: commentContent })).then(() => {
      setCommentContent('');
    });
  };

  const handleUpVote = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(upVoteThread(threadId));
  };

  const handleDownVote = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(downVoteThread(threadId));
  };

  const handleNeutralizeVote = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(neutralizeThreadVote(threadId));
  };

  if (!threadDetail) {
    return <div className="thread-detail-loading">Memuat thread...</div>;
  }

  const {
    title, body, createdAt, owner, comments = [], upVotesBy = [], downVotesBy = [],
  } = threadDetail;

  return (
    <div className="thread-detail-page">
      <button type="button" onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Daftar
      </button>

      <article className="thread-detail">
        <header className="thread-header">
          <h1>{title}</h1>
          <div className="thread-info">
            <div className="author-section">
              <img
                src={owner?.avatar || 'https://via.placeholder.com/40'}
                alt={owner?.name}
                className="author-avatar"
              />
              <div className="author-details">
                <p className="author-name">{owner?.name}</p>
                <p className="thread-date">{formatDate(createdAt)}</p>
              </div>
            </div>

            <div className="thread-votes">
              <button type="button" onClick={handleUpVote} className="vote-btn">👍</button>
              <span>{upVotesBy.length}</span>
              <button type="button" onClick={handleDownVote} className="vote-btn">👎</button>
              <span>{downVotesBy.length}</span>
              <button type="button" onClick={handleNeutralizeVote} className="vote-btn">😐</button>
            </div>
          </div>
        </header>

        <div
          className="thread-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(body) }}
        />
      </article>

      <section className="comments-section">
        <h2>Komentar ({comments.length})</h2>

        {isLoggedIn && (
          <form onSubmit={handleCreateComment} className="comment-form">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Tulis komentar Anda..."
              className="comment-textarea"
              rows="4"
            />
            <button type="submit" className="btn btn-primary submit-comment">
              Kirim Komentar
            </button>
          </form>
        )}

        {!isLoggedIn && (
          <p className="login-to-comment">
            <a href="/login">Login</a>
            {' '}
            untuk menambahkan komentar
          </p>
        )}

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                threadId={threadId}
              />
            ))
          ) : (
            <p className="no-comments">Belum ada komentar. Jadilah yang pertama untuk berkomentar!</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ThreadDetailPage;
