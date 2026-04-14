import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDate, truncateText, stripHtml } from '../../utils/helpers';
import './Thread.css';

function ThreadItem({ thread }) {
  const {
    id, title, body, createdAt, owner, totalComments, upVotesBy, downVotesBy,
  } = thread;

  const totalVotes = (upVotesBy?.length || 0) - (downVotesBy?.length || 0);

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
            <strong>{owner?.name}</strong>
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
          <span className="stat-value">{totalVotes}</span>
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
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    totalComments: PropTypes.number,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ThreadItem;
