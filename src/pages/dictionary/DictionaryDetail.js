import { useContext, useEffect, useState } from 'react';
import CustomButton from '../../components/common/CustomButton';
import { UserContext } from '../../context/UserContext';
import {
  deleteDictionaryItem,
  fetchDictionaryItemWithView,
  likeDictionaryItem,
} from './api/DictionaryApi';
import './DictionaryDetail.css';
import DictionaryForm from './DictionaryForm';

function DictionaryDetail({ termInfo, onClose }) {
  const [detail, setDetail] = useState(null);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDefinitions, setEditedDefinitions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (termInfo?.id) {
      fetchDictionaryItemWithView(termInfo.id)
        .then((data) => {
          setDetail(data);
          setEditedDefinitions(data.definitions || []);
        })
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


  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 삭제할까요?');
    if (!confirmDelete) return;

    try {
      await deleteDictionaryItem(detail.id); // ❗ API 필요
      alert('삭제 완료!');
      onClose(); // 모달 닫기
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류 발생');
    }
  };

  if (!detail) return;

  return (
    <div className="term-definition-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="term-title">{detail.term}</h2>
        <p className="term-definition">{detail.definitions?.[0]?.definition}</p>

        {isEditing ? (
          <DictionaryForm
            initialData={detail}
            onSave={(updated) => {
              setDetail(updated);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
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

            <div className="term-meta">
              <div className="term-meta-left">
                <CustomButton className="like-button" onClick={handleLike}>
                  ❤️ {detail.likes}
                </CustomButton>
              </div>
              <div className="term-meta-right">
                &nbsp;&nbsp; 👁 {detail.views}
                  <div className="term-actions">
                      <CustomButton onClick={() => setIsEditing(true)}>
                        ✏️ 수정
                      </CustomButton>
                      <CustomButton onClick={handleDelete}>🗑 삭제</CustomButton>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DictionaryDetail;
