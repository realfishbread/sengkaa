import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDictionaryList } from '../api/dictionaryApi'; // ✅ API 분리된 파일에서 import
import './DictionaryForm.css';

const DictionaryList = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const data = await fetchDictionaryList();
        setWords(data);
      } catch (error) {
        console.error('사전 목록 불러오기 실패:', error);
      }
    };

    loadWords();
  }, []);

  return (
    <div className="dict-container">
      <h1 className="dict-title">📚 팬들이 만드는 덕질 사전</h1>
      <button className="dict-add-button" onClick={() => navigate('/dictionary/new')}>
        ➕ 새 항목 추가
      </button>
      <ul className="dict-list">
        {words.map((word) => (
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