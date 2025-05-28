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

const CATEGORIES = {
  femaleIdols: {
    title: "여자 아이돌",
    items: [
      "블랙핑크", "트와이스", "아이브", "뉴진스", "르세라핌",
      "에스파", "있지", "케플러", "프로미스나인", "스테이씨"
    ]
  },
  maleIdols: {
    title: "남자 아이돌",
    items: [
      "방탄소년단", "엑소", "세븐틴", "NCT", "스트레이 키즈",
      "투모로우바이투게더", "엔하이픈", "더보이즈", "트레저", "에이티즈"
    ]
  },
  streamers: {
    title: "스트리머",
    items: [
      "침착맨", "우왁굳", "주호민", "풍월량", "김도", 
      "쯔양", "이세계아이돌", "왁타버스", "고세구", "릴파"
    ]
  },
  games: {
    title: "게임",
    items: [
      "리그 오브 레전드", "발로란트", "오버워치 2", "배틀그라운드",
      "메이플스토리", "로스트아크", "피파 온라인 4", "서든어택", "던전앤파이터", "디아블로 4"
    ]
  },
  webtoons: {
    title: "웹툰",
    items: [
      "김부장", "독립일기", "연애혁명", "여신강림", "싸움독학",
      "취사병 전설이 되다", "재혼 황후", "나 혼자만 레벨업", "외모지상주의", "화산귀환"
    ]
  }
};

const DictionaryList = () => {
  const [selectedTag, setSelectedTag] = useState('전체');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [terms, setTerms] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [openCategories, setOpenCategories] = useState({});
  const [categorySearches, setCategorySearches] = useState({});

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const data = await fetchDictionaryList();
        setTerms(data.results);
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
    // 태그를 클릭할 때 카테고리를 닫힌 상태로 설정
    setOpenCategories({});
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
      setTerms(updatedList.results);
      setShowForm(false);
    } catch (err) {
      console.error('용어 등록 실패 ❌', err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  // 카테고리 내 검색어 변경 핸들러
  const handleCategorySearch = (categoryKey, searchValue) => {
    setCategorySearches(prev => ({
      ...prev,
      [categoryKey]: searchValue
    }));
  };

  // 카테고리 아이템 필터링 함수
  const getFilteredCategoryItems = (items, categoryKey) => {
    const searchTerm = categorySearches[categoryKey]?.toLowerCase() || '';
    if (!searchTerm) return items;
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm)
    );
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

      <div className="counter">
        <span>📚 용어 수: {filteredTerms.length}</span>
        <span>👁 총 조회수: {totalViews}</span>
      </div>

      {selectedTag !== '전체' && selectedTag !== '아이돌' && (
        <div className="category-list">
          {Object.entries(CATEGORIES)
            .filter(([key, category]) => category.title === selectedTag)
            .map(([key, category]) => (
              <div key={key} className="category-item">
                <button
                  className="category-toggle"
                  onClick={() => setOpenCategories(prev => ({ ...prev, [key]: !prev[key] }))}
                >
                  <span>{category.title}</span>
                  <span className={`arrow ${openCategories[key] ? 'open' : ''}`}>▼</span>
                </button>
                {openCategories[key] && (
                  <>
                    <div className="category-search">
                      <input
                        type="text"
                        placeholder="리스트 내 검색..."
                        value={categorySearches[key] || ''}
                        onChange={(e) => handleCategorySearch(key, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="category-content">
                      {getFilteredCategoryItems(category.items, key).map((item, index) => (
                        <li key={index} onClick={() => setSearchKeyword(item)}>
                          {item}
                        </li>
                      ))}
                      {getFilteredCategoryItems(category.items, key).length === 0 && (
                        <li className="no-results">검색 결과가 없습니다</li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            ))}
        </div>
      )}

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
