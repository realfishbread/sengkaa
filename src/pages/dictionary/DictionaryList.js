import axios from 'axios';
import { useEffect, useState } from 'react';
import DictionaryDetail from './DictionaryDetail';
import DictionaryForm from './DictionaryForm';
import './DictionaryList.css';
import {
  createDictionaryItem,
  fetchDictionaryList,
  fetchTotalViews,
} from './api/DictionaryApi';

// 한글 태그 → 영어 슬러그
const TAG_DISPLAY_TO_KEY = {
  여자아이돌: 'idol',
  남자아이돌: 'boy_idol',
  스트리머: 'youtuber',
  게임: 'game',
  웹툰: 'webtoon',
  애니: 'anime',
};

const TAGS = [
  '전체',
  '아이돌',
  '남자 아이돌',
  '스트리머',
  '게임',
  '웹툰',
  '애니',
];

const DictionaryList = () => {
  const [selectedTag, setSelectedTag] = useState('전체');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [terms, setTerms] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [openCategories, setOpenCategories] = useState({});
  const [categorySearches, setCategorySearches] = useState({});
  const [groupedTerms, setGroupedTerms] = useState({});

  const selectedSlug = TAG_DISPLAY_TO_KEY[selectedTag] || 'all';

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
    const slugTag = TAG_DISPLAY_TO_KEY[selectedTag];
    const tagMatch = selectedTag === '전체' || term.category === slugTag;

    const keywordMatch =
      term.term.includes(searchKeyword) ||
      term.definitions?.some((d) => d.definition.includes(searchKeyword)) ||
      term.star_group?.some((star) => star.includes(searchKeyword));

    return tagMatch && keywordMatch;
  });

  const handleTagClick = async (tag) => {
    setSelectedTag(tag);

    const genreSlug = TAG_DISPLAY_TO_KEY[tag];
    if (genreSlug) {
      try {
        const genreRes = await axios.get(
          `/user/dictionary/terms-by-genre/?genre_id=${genreSlug}`
        );
        const genreId = genreRes.data.id;

        const groupedRes = await axios.get(
          `/user/dictionary/grouped-by-star-group/?genre_id=${genreId}`
        );
        setGroupedTerms(groupedRes.data);
      } catch (err) {
        console.error('스타 그룹별 용어 목록 불러오기 실패 ❌', err);
      }
    } else {
      setGroupedTerms({});
    }

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
    setCategorySearches((prev) => ({
      ...prev,
      [categoryKey]: searchValue,
    }));
  };

  // 카테고리 아이템 필터링 함수
  const getFilteredCategoryItems = (items, categoryKey) => {
    const searchTerm = categorySearches[categoryKey]?.toLowerCase() || '';
    if (!searchTerm) return items;
    return items.filter((item) => item.toLowerCase().includes(searchTerm));
  };

  return (
    <div className="dictionary-container">
      <div className="top-bar">
        <div className="tag-filter">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              #{tag} {/* 🔥 여기서 #은 그냥 문자열, tag는 JSX 중괄호로 */}
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

      {selectedTag !== '전체' && groupedTerms && (
        <div className="category-list">
          {Object.entries(groupedTerms)
            .sort(([a], [b]) => a.localeCompare(b))
            .filter(([key, category]) => category.title === selectedTag)
            .map(([key, category]) => (
              <div key={key} className="category-item">
                <button
                  className="category-toggle"
                  onClick={() =>
                    setOpenCategories((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }))
                  }
                >
                  <span>{category.title}</span>
                  <span
                    className={`arrow ${openCategories[key] ? 'open' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                {openCategories[key] && (
                  <>
                    <div className="category-search">
                      <input
                        type="text"
                        placeholder="리스트 내 검색..."
                        value={categorySearches[key] || ''}
                        onChange={(e) =>
                          handleCategorySearch(key, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="category-content">
                      {getFilteredCategoryItems(category.items, key).map(
                        (item, index) => (
                          <li
                            key={index}
                            onClick={() => setSearchKeyword(item)}
                          >
                            {item}
                          </li>
                        )
                      )}
                      {getFilteredCategoryItems(category.items, key).length ===
                        0 && (
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
        {Object.entries(groupedTerms).map(([groupName, terms]) => (
          <div key={groupName} className="group-section">
            <h3>{groupName}</h3>
            <div className="term-card-list">
              {terms.map((term) => (
                <div
                  key={term.id}
                  className="term-card"
                  onClick={() => handleTermClick(term)}
                >
                  <div className="term-title">{term.term}</div>
                  <div className="term-meta">
                    ❤️ {term.likes} &nbsp;&nbsp; 👁 {term.views}
                  </div>
                </div>
              ))}
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
            <DictionaryForm
              onSave={handleSaveTerm}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DictionaryList;
