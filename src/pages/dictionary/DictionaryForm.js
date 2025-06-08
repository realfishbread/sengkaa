import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStarsByGenre } from '../../shared/api/fetchStarsByGroup';
import './DictionaryForm.css';
import {
  checkTermExists,
  createDictionaryItem,
  updateDictionaryItem,
} from './api/DictionaryApi';

const MAIN_CATEGORIES = [
  { value: '', label: '선택하세요' },
  { value: '아이돌', label: '아이돌' },
  { value: '여자 아이돌', label: '여자 아이돌' },
  { value: '남자 아이돌', label: '남자 아이돌' },
  { value: '스트리머', label: '스트리머' },
  { value: '게임', label: '게임' },
  { value: '웹툰', label: '웹툰' },
];

const GENRE_TAG_TO_ID = {
  '아이돌': [1, 6], 
  '여자 아이돌': 1,
  '남자 아이돌': 6,
  스트리머: 2,
  게임: 5,
  웹툰: 4,
};

function DictionaryForm({ onSave, onCancel, initialData = null }) {
  const [term, setTerm] = useState(initialData?.term || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [subCategory, setSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [definitions, setDefinitions] = useState(
    initialData?.definitions || [{ definition: '', example: '' }]
  );
  const [showCategory, setShowCategory] = useState(true);
  const [showDefinitions, setShowDefinitions] = useState(true);
  const navigate = useNavigate();

  // 상위 카테고리가 변경될 때 하위 카테고리 목록 가져오기
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!category) {
        setSubCategories([]);
        return;
      }

      try {
        let allGroups = [];

        if (category === '아이돌') {
          const [female, male] = await Promise.all([
            fetchStarsByGenre(1),
            fetchStarsByGenre(6),
          ]);
          const combined = [...female, ...male];
          setSubCategories(combined);
        } else {
          const genreId = GENRE_TAG_TO_ID[category];
          if (!genreId) {
            setSubCategories([]);
            return;
          }
          allGroups = await fetchStarsByGenre(genreId);
        }

        setSubCategories(allGroups);
      } catch (err) {
        console.error('하위 카테고리 로딩 실패:', err);
        setSubCategories([]);
      }
    };

    loadSubCategories();
  }, [category]);

  const handleAddDefinition = () => {
    setDefinitions([...definitions, { definition: '', example: '' }]);
  };

  const handleDefinitionChange = (index, field, value) => {
    const updated = [...definitions];
    updated[index][field] = value;
    setDefinitions(updated);
  };

  const handleSave = async () => {
    if (!term) return alert('용어를 입력해주세요.');
    if (!category) return alert('카테고리를 선택해주세요.');
    if (!definitions[0].definition) return alert('설명을 입력해주세요.');

    const payload = {
      term,
      category,
      genre: GENRE_TAG_TO_ID[category], // ✅ 여기 숫자로 매핑
      star_group: subCategory ? [subCategory] : [], // ✅ 배열로 감싸기
      definitions,
    };

    try {
      if (initialData) {
        const updated = await updateDictionaryItem(initialData.id, payload);
        alert('수정 완료! ✅');
        onSave(updated);
      } else {
        const saved = await createDictionaryItem(payload);
        if (!saved || !saved.id) {
          console.warn('⚠️ 저장은 되었으나 응답이 예상과 다릅니다:', saved);
          return;
        }
        alert('용어가 성공적으로 등록되었습니다! 🎉');
        onSave(saved);

        // 초기화
        setTerm('');
        setCategory('');
        setSubCategory('');
        setDefinitions([{ definition: '', example: '' }]);
      }
      navigate('/dictionary');
    } catch (err) {
      console.error('등록 실패 ❌', err);
      console.error('🚨 서버 응답 메시지:', err?.response?.data); // 👈 이거 추가!
      alert('등록 중 오류가 발생했습니다');
    }
  };

  const handleCheckDuplicate = async () => {
    if (!term) return alert('용어를 입력해주세요!');
    try {
      const exists = await checkTermExists(term);
      if (exists) {
        alert('이미 존재하는 용어입니다 ❌');
      } else {
        alert('사용 가능한 용어입니다 ✅');
      }
    } catch (err) {
      console.error('중복 확인 오류:', err);
      alert('중복 확인 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="dictionary-form">
      {/* 용어 작성 */}
      <section className="form-section">
        <h3>용어 작성</h3>
        <div className="form-group">
          <label>용어 이름 *</label>
          <div className="input-inline">
            <input
              type="text"
              value={term}
              placeholder="용어 이름을 입력해주세요"
              onChange={(e) => setTerm(e.target.value)}
            />
            {!initialData ? (
              <button className="check-btn" onClick={handleCheckDuplicate}>
                중복 확인
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* 분류 */}
      <section className="form-section collapsible">
        <h3 onClick={() => setShowCategory(!showCategory)}>
          분류 {showCategory ? '▲' : '▼'}
        </h3>
        {showCategory && (
          <div className="form-group">
            <label>카테고리 *</label>
            <div className="category-select-group">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory(''); // 상위 카테고리 변경 시 하위 카테고리 초기화
                }}
              >
                {MAIN_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {category && (
              <div className="subcategory-select-group">
                <label>세부 카테고리 (선택)</label>

                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(Number(e.target.value) || '')}
                  className={subCategories.length === 0 ? 'disabled' : ''}
                >
                  <option value="">선택 안함 (전체 장르 용어)</option>{' '}
                  {/* ✨ 핵심 UX 안내 */}
                  {subCategories.length > 0 ? (
                    subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      검색 결과가 없습니다
                    </option>
                  )}
                </select>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 설명 */}
      <section className="form-section collapsible">
        <h3 onClick={() => setShowDefinitions(!showDefinitions)}>
          설명 {showDefinitions ? '▲' : '▼'}
        </h3>
        {showDefinitions &&
          definitions.map((d, idx) => (
            <div key={idx} className="definition-block">
              <h4>설명 {idx + 1}</h4>

              <label>설명 *</label>
              <input
                type="text"
                placeholder="용어에 대한 설명을 입력해주세요"
                value={d.definition}
                onChange={(e) =>
                  handleDefinitionChange(idx, 'definition', e.target.value)
                }
              />

              <label>예시</label>
              <input
                type="text"
                placeholder="용어를 사용한 예시를 입력해주세요"
                value={d.example}
                onChange={(e) =>
                  handleDefinitionChange(idx, 'example', e.target.value)
                }
              />

              <div className="inline-buttons">
                <button onClick={handleAddDefinition}>＋</button>
                <button
                  onClick={() =>
                    setDefinitions(
                      definitions.length > 1
                        ? definitions.filter((_, i) => i !== idx)
                        : definitions
                    )
                  }
                >
                  접기
                </button>
              </div>
            </div>
          ))}
      </section>

      {/* 저장/취소 */}
      <div className="form-buttons">
        <button onClick={handleSave}>저장</button>
        <button onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

export default DictionaryForm;
