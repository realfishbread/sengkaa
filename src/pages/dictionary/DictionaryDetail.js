import { useContext, useEffect, useState } from 'react';
import CustomButton from '../../components/common/CustomButton';
import { UserContext } from '../../context/UserContext';
import './DictionaryDetail.css';
import {
  deleteDictionaryItem,
  fetchDictionaryItemWithView,
  likeDictionaryItem,
  updateDictionaryItem,
} from './api/DictionaryApi';

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

  const handleUpdate = async () => {
    try {
      const updated = await updateDictionaryItem(detail.id, {
        term: detail.term,
        category: detail.category,
        definitions: editedDefinitions,
      });
      setDetail(updated);
      setIsEditing(false);
      alert('수정되었습니다! ✅');
    } catch (err) {
      console.error('수정 실패 ❌', err);
      alert('수정 중 오류가 발생했습니다');
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
          <div className="edit-definitions">
            {editedDefinitions.map((def, idx) => (
              <div key={idx}>
                <label>뜻풀이 {idx + 1}</label>
                <input
                  type="text"
                  value={def.definition}
                  onChange={(e) => {
                    const updated = [...editedDefinitions];
                    updated[idx].definition = e.target.value;
                    setEditedDefinitions(updated);
                  }}
                />
                <label>예문</label>
                <input
                  type="text"
                  value={def.example || ''}
                  onChange={(e) => {
                    const updated = [...editedDefinitions];
                    updated[idx].example = e.target.value;
                    setEditedDefinitions(updated);
                  }}
                />
              </div>
            ))}
          </div>
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
                {user?.id === detail.user?.id && (
                  <div className="term-actions" >
                    {isEditing ? (
                      <>
                        <CustomButton onClick={handleUpdate} >
                          💾 저장
                        </CustomButton>
                        <CustomButton onClick={() => setIsEditing(false)}>
                          ❌ 취소
                        </CustomButton>
                      </>
                    ) : (
                      <>
                        <CustomButton onClick={() => setIsEditing(true)}>
                          ✏️ 수정
                        </CustomButton>
                        <CustomButton onClick={handleDelete}>
                          🗑 삭제
                        </CustomButton>
                      </>
                    )}
                  </div>
                  
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DictionaryDetail;
