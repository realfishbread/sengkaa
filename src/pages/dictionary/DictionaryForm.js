import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DictionaryForm.css';

const dummyWords = [
  { id: 1, title: '뷔', summary: 'BTS의 멤버, 팬들 사이에서 독보적인 존재감으로 알려짐.' },
  { id: 2, title: '슬로건', summary: '이벤트에서 배포되는 응원 슬로건 용품.' },
];

const DictionaryList = () => {
  const navigate = useNavigate();

  return (
    <div className="dict-container">
      <h1 className="dict-title">📚 팬들이 만드는 덕질 사전</h1>
      <button className="dict-add-button" onClick={() => navigate('/dictionary/new')}>
        ➕ 새 항목 추가
      </button>
      <ul className="dict-list">
        {dummyWords.map((word) => (
          <li key={word.id} onClick={() => navigate(`/dictionary/${word.id}`)}>
            <h3>{word.title}</h3>
            <p>{word.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DictionaryList;
