import { useEffect, useState } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';
import './FavoriteStarModal.css';

const genreList = [
  { id: 0, name: '전체' },
  { id: 1, name: 'idol' },
  { id: 2, name: 'youtuber' },
  { id: 3, name: 'comic' },
  { id: 4, name: 'webtoon' },
  { id: 5, name: 'game' },
];

const FavoriteStarModal = ({ onClose, onSelect }) => {
  const [stars, setStars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState(0);

  useEffect(() => {
    axiosInstance.get('/user/star/stars/').then((res) => setStars(res.data));
  }, []);

  const filteredStars = stars.filter((star) => {
    const matchesGenre =
      selectedGenreId === 0 || star.genre?.id === selectedGenreId;

    const matchesSearch =
      star.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      star.group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      star.display?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>최애 스타 선택 ✨</h2>

        {/* ⭐ 장르 탭 */}
        <div className="genre-tabs">
          {genreList.map((g) => (
            <button
              key={g.id}
              className={selectedGenreId === g.id ? 'active' : ''}
              onClick={() => setSelectedGenreId(g.id)}
            >
              {g.name === '전체' ? '전체' : g.name}
            </button>
          ))}
        </div>

        {/* 🔍 검색창 */}
        <input
          type="text"
          className="search-input"
          placeholder="이름 또는 그룹명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 🌟 스타 목록 */}
        <div className="star-grid">
          {filteredStars.map((star) => (
            <div
              key={star.id}
              className="star-card"
              onClick={() => onSelect(star.id)}
            >
              <img
                src={star.image}
                alt={star.name}
                className="star-image"
                onError={(e) => {
                  e.target.src = '/default_star.png';
                }}
              />
              <p>{star.name}</p>
            </div>
          ))}
          {filteredStars.length === 0 && (
            <p style={{ marginTop: '20px', color: '#777' }}>
              검색 결과가 없어요 😢
            </p>
          )}
        </div>

        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default FavoriteStarModal;
