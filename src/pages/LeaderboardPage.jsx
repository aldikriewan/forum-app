import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboards } from '../../redux/thunks/leaderboardThunks';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list: leaderboards } = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <p className="leaderboard-desc">Pengguna dengan score tertinggi di forum</p>

        {leaderboards.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="rank-col">Rank</th>
                <th className="user-col">User</th>
                <th className="score-col">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboards.map((item, index) => (
                <tr key={item.user.id} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td className="rank-col">
                    <span className="rank-badge">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index >= 3 && index + 1}
                    </span>
                  </td>
                  <td className="user-col">
                    <div className="user-info">
                      <img
                        src={item.user.avatar || 'https://via.placeholder.com/40'}
                        alt={item.user.name}
                        className="user-avatar"
                      />
                      <span className="user-name">{item.user.name}</span>
                    </div>
                  </td>
                  <td className="score-col">
                    <strong>{item.score}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>Tidak ada data leaderboard</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
