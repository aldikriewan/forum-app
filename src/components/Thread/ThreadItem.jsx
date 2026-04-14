import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDate, truncateText, stripHtml } from '../../utils/helpers';
import './Thread.css';

function ThreadItem({ thread }) {
  const users = useSelector((state) => state.users.users);
  const {
    id, title, body, createdAt, ownerId, totalComments, upVotesBy, downVotesBy,
  } = thread;

  const authorName = users[ownerId]?.name || 'Loading...';

  return (
    <div className="thread-item">
      <div className="thread-content">
        <Link to={`/thread/${id}`} className="thread-title">
          <h3>{title}</h3>
        </Link>

        {body && <p className="thread-body">{truncateText(stripHtml(body), 150)}</p>}

        <div className="thread-meta">
          <span className="author-info">
            by&nbsp;
            <strong>{authorName}</strong>
          </span>
          <span className="separator">•</span>
          <span className="timestamp">{formatDate(createdAt)}</span>
        </div>
      </div>

      <div className="thread-stats">
        <div className="stat">
          <span className="stat-label">Comments</span>
          <span className="stat-value">{totalComments}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Votes</span>
          <span className="stat-value">👍 {upVotesBy?.length || 0} | 👎 {downVotesBy?.length || 0}</span>
        </div>
      </div>
    </div>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    totalComments: PropTypes.number,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ThreadItem;
