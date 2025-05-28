import { useEffect, useState } from 'react';
import './DictionaryDetail.css';
import {
  fetchDictionaryItemWithView,
  likeDictionaryItem,
} from './api/DictionaryApi';

function DictionaryDetail({ termInfo, onClose }) {
  const [detail, setDetail] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (termInfo?.id) {
      fetchDictionaryItemWithView(termInfo.id)
        .then((data) => setDetail(data))
        .catch((err) => console.error('조회 실패:', err));
    }
  }, [termInfo]);

  const handleLike = async () => {
    if (!detail || liked) return;
    try {
      const updated = await likeDictionaryItem(detail.id);
      setDetail(updated);
      setLiked(true); // 중복 클릭 방지
    } catch (err) {
      console.error('좋아요 실패 ❌', err);
    }
  };

  if (!detail) return null;

  return (
    <div className="term-definition-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="term-title">{detail.term}</h2>
        <p className="term-definition">{detail.definitions?.[0]?.definition}</p>

        <div className="term-meta">
          <button className="like-button" onClick={handleLike}>
            ❤️ {detail.likes}
          </button>
          &nbsp;&nbsp; 👁 {detail.views}
        </div>

        {detail.definitions?.length > 1 && (
          <div className="extra-definitions">
            {detail.definitions.map((def, idx) => (
              <div key={idx}>
                <p>
                  <strong>뜻풀이 {idx + 1}:</strong> {def.definition}
                </p>
                {def.example && (
                  <p className="example">💬 예문: {def.example}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default DictionaryDetail;
