import React, { useState } from 'react';
import './DictionaryForm.css';
import { checkTermExists, createDictionaryItem  } from './api/DictionaryApi';

function DictionaryForm({ onSave, onCancel }) {
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('');
  const [definitions, setDefinitions] = useState([{ definition: '', example: '' }]);
  const [showCategory, setShowCategory] = useState(true);
  const [showDefinitions, setShowDefinitions] = useState(true);

  const handleAddDefinition = () => {
    setDefinitions([...definitions, { definition: '', example: '' }]);
  };

  const handleDefinitionChange = (index, field, value) => {
    const updated = [...definitions];
    updated[index][field] = value;
    setDefinitions(updated);
  };

  const handleSave = async () => {
    if (!term) return alert('표제어를 입력해주세요.');
    if (!category) return alert('카테고리를 선택해주세요.');
    if (!definitions[0].definition) return alert('뜻풀이를 입력해주세요.');

    try {
      const payload = { term, category, definitions };
      const saved = await createDictionaryItem(payload);
      alert('용어가 성공적으로 등록되었습니다! 🎉');
      onSave(saved);

      // 초기화
      setTerm('');
      setCategory('');
      setDefinitions([{ definition: '', example: '' }]);
    } catch (err) {
      console.error('등록 실패 ❌', err);
      alert('등록 중 오류가 발생했습니다');
    }
  };

  const handleCheckDuplicate = async () => {
    if (!term) return alert('표제어를 입력해주세요!');
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
      {/* 집필하기 */}
      <section className="form-section">
        <h3>집필하기</h3>
        <div className="form-group">
          <label>표제어 *</label>
          <div className="input-inline">
            <input
              type="text"
              value={term}
              placeholder="표제어를 입력해주세요"
              onChange={(e) => setTerm(e.target.value)}
            />
            <button className="check-btn" onClick={handleCheckDuplicate}>중복 확인</button>
          </div>
        </div>
      </section>

      {/* 표제어부 */}
      <section className="form-section collapsible">
        <h3 onClick={() => setShowCategory(!showCategory)}>
          표제어부 {showCategory ? '▲' : '▼'}
        </h3>
        {showCategory && (
          <div className="form-group">
            <label>카테고리</label>
            <div className="category-select-group">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">선택하세요</option>
                <option value="아이돌">아이돌</option>
                <option value="스트리머">스트리머</option>
                <option value="게임">게임</option>
                <option value="웹툰">웹툰</option>
              </select>
              <button className="add-btn">＋</button>
            </div>
          </div>
        )}
      </section>

      {/* 뜻풀이부 */}
      <section className="form-section collapsible">
        <h3 onClick={() => setShowDefinitions(!showDefinitions)}>
          뜻풀이부 {showDefinitions ? '▲' : '▼'}
        </h3>
        {showDefinitions &&
          definitions.map((d, idx) => (
            <div key={idx} className="definition-block">
              <h4>뜻풀이 {idx + 1}</h4>

              <label>뜻풀이 *</label>
              <input
                type="text"
                placeholder="뜻풀이 입력란"
                value={d.definition}
                onChange={(e) =>
                  handleDefinitionChange(idx, 'definition', e.target.value)
                }
              />

              <label>예문</label>
              <input
                type="text"
                placeholder="예문 입력란"
                value={d.example}
                onChange={(e) =>
                  handleDefinitionChange(idx, 'example', e.target.value)
                }
              />

              <div className="inline-buttons">
                <button onClick={handleAddDefinition}>＋</button>
                <button onClick={() => setDefinitions(
                  definitions.length > 1
                    ? definitions.filter((_, i) => i !== idx)
                    : definitions
                )}>접기</button>
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
