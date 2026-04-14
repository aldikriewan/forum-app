import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, decodeHtmlEntities } from '../../utils/helpers';
import { upVoteComment, downVoteComment, neutralizeCommentVote } from '../../redux/thunks/commentThunks';
import './Comment.css';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const {
    id, content, createdAt, owner, upVotesBy = [], downVotesBy = [],
  } = comment;

  const userHasUpVoted = user && upVotesBy.includes(user.id);
  const userHasDownVoted = user && downVotesBy.includes(user.id);
  const totalVotes = upVotesBy.length - downVotesBy.length;

  const handleUpVote = () => {
    if (!isLoggedIn) {
      // eslint-disable-next-line no-alert
      alert('Silakan login untuk memberikan vote');
      return;
    }
    if (userHasUpVoted) {
      dispatch(neutralizeCommentVote({ threadId, commentId: id }));
    } else {
      dispatch(upVoteComment({ threadId, commentId: id }));
    }
  };

  const handleDownVote = () => {
    if (!isLoggedIn) {
      // eslint-disable-next-line no-alert
      alert('Silakan login untuk memberikan vote');
      return;
    }
    if (userHasDownVoted) {
      dispatch(neutralizeCommentVote({ threadId, commentId: id }));
    } else {
      dispatch(downVoteComment({ threadId, commentId: id }));
    }
  };

  const handleNeutralizeVote = () => {
    if (!isLoggedIn) {
      // eslint-disable-next-line no-alert
      alert('Silakan login untuk memberikan vote');
      return;
    }
    dispatch(neutralizeCommentVote({ threadId, commentId: id }));
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img
          src={owner?.avatar || 'https://via.placeholder.com/32'}
          alt={owner?.name}
          className="comment-avatar"
        />
        <div className="comment-meta">
          <p className="comment-author">{owner?.name}</p>
          <p className="comment-time">{formatDate(createdAt)}</p>
        </div>
      </div>

      <div
        className="comment-content"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(content) }}
      />

      <div className="comment-footer">
        <button
          type="button"
          onClick={handleUpVote}
          className={`vote-btn up-vote ${userHasUpVoted ? 'active' : ''}`}
        >
          👍
          {' '}
          {upVotesBy.length}
        </button>
        <button
          type="button"
          onClick={handleDownVote}
          className={`vote-btn down-vote ${userHasDownVoted ? 'active' : ''}`}
        >
          👎
          {' '}
          {downVotesBy.length}
        </button>
        <button
          type="button"
          onClick={handleNeutralizeVote}
          className="vote-btn neutralize-vote"
        >
          😐
        </button>
        <span className="vote-total">Total: {totalVotes}</span>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
