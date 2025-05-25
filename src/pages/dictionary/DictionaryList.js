import React, { useState, useEffect } from 'react';
import './DictionaryList.css';
import DictionaryDetail from './DictionaryDetail';
import DictionaryForm from './DictionaryForm';
import {
  fetchDictionaryList,
  fetchTotalViews,
  createDictionaryItem
} from './api/DictionaryApi';

const TAGS = ['전체', '아이돌', '여자 아이돌', '남자 아이돌', '스트리머', '게임', '웹툰'];

const DictionaryList = () => {
  const [selectedTag, setSelectedTag] = useState('전체');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [terms, setTerms] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const data = await fetchDictionaryList();
        setTerms(data);
      } catch (error) {
        console.error('용어 목록 불러오기 실패 ❌', error);
      }
    };

    const loadViews = async () => {
      try {
        const viewData = await fetchTotalViews();
        setTotalViews(viewData);
      } catch (error) {
        console.error('총 조회수 불러오기 실패 ❌', error);
      }
    };

    loadTerms();
    loadViews();
  }, []);



   const filteredTerms = terms.filter((term) => {
    const tagMatch = selectedTag === '전체' || term.category === selectedTag;
    const keywordMatch =
      term.term.includes(searchKeyword) ||
      term.definitions?.some((d) => d.definition.includes(searchKeyword));
    return tagMatch && keywordMatch;
  });


  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const handleTermClick = (term) => {
    setSelectedTerm(term);
  };

  const handleCloseModal = () => {
    setSelectedTerm(null);
  };

  const handleSaveTerm = async (newTerm) => {
    try {
      await createDictionaryItem(newTerm);
      const updatedList = await fetchDictionaryList();
      setTerms(updatedList);
      setShowForm(false);
    } catch (err) {
      console.error('용어 등록 실패 ❌', err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <div className="dictionary-container">
      <div className="top-bar">
        <div className="tag-filter">
          {TAGS.map(tag => (
            <button
              key={tag}
              className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
        <div className="top-right">
          <input
            type="text"
            placeholder="용어 검색"
            className="search-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button className="write-term-btn" onClick={() => setShowForm(true)}>
            용어 작성
          </button>
        </div>
      </div>

      <div className="counter">
        <span>📚 용어 수: {filteredTerms.length}</span>
        <span>👁 총 조회수: {totalViews}</span>
      </div>

      <div className="term-card-list">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            className="term-card"
            onClick={() => handleTermClick(term)}
          >
            <div className="term-title">{term.term}</div>
            <div className="term-definition">{term.definitions?.[0]?.definition}</div>
            <div className="term-meta">
              ❤️ {term.likes} &nbsp;&nbsp; 👁 {term.views}
            </div>
          </div>
        ))}
      </div>

      {selectedTerm && (
        <DictionaryDetail termInfo={selectedTerm} onClose={handleCloseModal} />
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <DictionaryForm onSave={handleSaveTerm} onCancel={handleCancelForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DictionaryList;
