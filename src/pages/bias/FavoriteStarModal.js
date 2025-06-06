import { useEffect, useState } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';
import { fetchStarsByGenre } from '../../shared/api/fetchStarsByGroup';
import './FavoriteStarModal.css';

const genreList = [
  { id: 0, name: '전체' },
  { id: 1, name: '여자 아이돌' },
  { id: 2, name: '스트리머' },
  { id: 3, name: '애니' },
  { id: 4, name: '웹툰' },
  { id: 5, name: '게임' },
  { id: 6, name: '남자 아이돌' },
];

const FavoriteStarModal = ({ onClose, onSelect }) => {
  const [stars, setStars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState(0);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        let res;
        if (selectedGenreId === 0) {
          res = await axiosInstance.get('/user/star/stars/');
        } else {
          res = await fetchStarsByGenre(selectedGenreId); // ✅ 숫자만 넘겨줘야 함!
        }
        setStars(res.data);
      } catch (err) {
        console.error('스타 불러오기 실패 ❌', err);
        setStars([]);
      }
    };

    fetchStars();
  }, [selectedGenreId]);

  // 👉 여기가 바로 그 위치!
  if (!stars || stars.length === 0) {
    return <div style={{ padding: 20 }}>로딩 중...</div>;
  }

  const filteredStars = (stars || []).filter((star) => {
    const matchesSearch =
      star.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      star.group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      star.display?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>최애 스타 선택 ✨</h2>
        <button
          className="close-button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#aaa',
          }}
        >
          ✕
        </button>
        {/* ⭐ 장르 탭 */}
        <div className="genre-tabs">
          {genreList.map((g) => (
            <button
              key={g.id}
              type="button" // ✅ 이걸 꼭 추가!
              className={selectedGenreId === g.id ? 'active' : ''}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGenreId(g.id);
              }}
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
              onClick={() => onSelect(star)}
            >
              <img
                src={star.image}
                alt={star.name}
                className="star-image"
                onError={(e) => {
                  e.target.src = '/default_star.jpg';
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
      </div>
    </div>
  );
};

export default FavoriteStarModal;
