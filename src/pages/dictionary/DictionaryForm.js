import React, { useState } from 'react';
// API 호출 import 필요
import './DictionaryForm.css';

function DictionaryForm({ onSave, onCancel }) {
  const [category, setCategory] = useState('idol');
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');

  const handleSave = () => {
    if (term && definition) {
      onSave({ category, term, definition });
      setCategory('idol');
      setTerm('');
      setDefinition('');
    } else {
      alert('용어와 설명을 모두 입력해주세요.');
    }
  };

  return (
    <div className="new-term-form">
      <h2>새 용어 작성</h2>
      <label htmlFor="category">분야:</label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="idol">아이돌</option>
        <option value="streamer">스트리머</option>
        <option value="game">게임</option>
      </select>
      <label htmlFor="term">용어:</label>
      <input
        type="text"
        id="term"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <label htmlFor="definition">설명:</label>
      <textarea
        id="definition"
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
      />
      <div className="form-buttons">
        <button onClick={handleSave}>저장</button>
        <button onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

export default DictionaryForm;