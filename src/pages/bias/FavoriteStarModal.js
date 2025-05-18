import { useEffect, useState } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';
import './FavoriteStarModal.css'; // ⭐ 스타일은 여기에

const FavoriteStarModal = ({ onClose, onSelect }) => {
  const [stars, setStars] = useState([]);
  

  useEffect(() => {
    axiosInstance.get('/user/star/stars/').then((res) => setStars(res.data));
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container slide-in"
        onClick={(e) => e.stopPropagation()} // 모달 바깥 클릭 시 닫힘 방지
      >
        <h2>최애 스타 선택 ✨</h2>
        <div className="star-grid">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star-card"
              onClick={() => onSelect(star.id)}
            >
              <img src={star.image} alt={star.name} className="star-image" />
              <p>{star.name}</p>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default FavoriteStarModal;
