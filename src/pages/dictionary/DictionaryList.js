import { useEffect, useState } from 'react';
import DictionaryDetail from './DictionaryDetail';
import DictionaryForm from './DictionaryForm';
import './DictionaryList.css';
import {
  createDictionaryItem,
  fetchDictionaryList,
  fetchGroupedTermsByGenre,
  fetchStarGroups,
  fetchTotalViews,
} from './api/DictionaryApi';

const TAGS = [
  '전체',
  '아이돌',
  '여자 아이돌',
  '남자 아이돌',
  '스트리머',
  '게임',
  '웹툰',
];

const GENRE_TAG_TO_ID = {
  아이돌: 1,
  '여자 아이돌': 1,
  '남자 아이돌': 1,
  스트리머: 2,
  게임: 3,
  웹툰: 4,
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

  const [groupedTerms, setGroupedTerms] = useState({});
  const [expandedStars, setExpandedStars] = useState({});
  const [starGroups, setStarGroups] = useState([]); // 🔥
  const [categories, setCategories] = useState({});
  const [activeGroupTerms, setActiveGroupTerms] = useState(null);

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

  useEffect(() => {
    const loadStarGroups = async () => {
      try {
        const genreId = GENRE_TAG_TO_ID[selectedTag];
        if (!genreId) return;

        const res = await fetchStarGroups(genreId);
        setStarGroups(res); // ['르세라핌', '뉴진스'...]

        const dynamicCategoryKey = `${selectedTag}-category`; // 키도 유니크하게
        const newCategory = {
          [dynamicCategoryKey]: {
            title: selectedTag,
            items: res, // group 리스트
          },
        };

        setCategories(newCategory); // 🔥 상태로 관리
      } catch (err) {
        console.error('스타 그룹 불러오기 실패 ❌', err);
      }
    };

    if (selectedTag !== '전체' && selectedTag !== '아이돌') {
      loadStarGroups();
    }
  }, [selectedTag]);

  const filteredTerms = terms.filter((term) => {
    const tagMatch = selectedTag === '전체' || term.category === selectedTag;
    const keywordMatch =
      term.term.includes(searchKeyword) ||
      term.definitions?.some((d) => d.definition.includes(searchKeyword)) ||
      term.star_group?.some((star) => star.includes(searchKeyword)); // 🔥추가됨
    return tagMatch && keywordMatch;
  });

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setOpenCategories({});
    setActiveGroupTerms(null); // ⭐ 초기화
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

  const handleStarClick = async (groupName, genreId) => {
    setExpandedStars((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));

    try {
      const res = await fetchGroupedTermsByGenre(genreId);
      setGroupedTerms((prev) => ({
        ...prev,
        ...res,
      }));

      setActiveGroupTerms(res[groupName] || []); // ⭐ 이게 핵심
    } catch (err) {
      console.error('🔥 스타별 용어 로딩 실패:', err);
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
          {Object.entries(categories)
            .filter(([_, category]) => category.title === selectedTag)
            .map(([categoryKey, category]) => (
              <div key={categoryKey} className="category-item">
                <button
                  className="category-toggle"
                  onClick={() =>
                    setOpenCategories((prev) => ({
                      ...prev,
                      [categoryKey]: !prev[categoryKey],
                    }))
                  }
                >
                  <span>{category.title}</span>
                  <span
                    className={`arrow ${
                      openCategories[categoryKey] ? 'open' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openCategories[categoryKey] && (
                  <>
                    <div className="category-search">
                      <input
                        type="text"
                        placeholder="리스트 내 검색..."
                        value={categorySearches[categoryKey] || ''}
                        onChange={(e) =>
                          handleCategorySearch(categoryKey, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <ul className="category-content">
                      {getFilteredCategoryItems(
                        category.items,
                        categoryKey
                      ).map((groupName, index) => (
                        <li
                          key={groupName}
                          onClick={() =>
                            handleStarClick(
                              groupName,
                              GENRE_TAG_TO_ID[selectedTag]
                            )
                          }
                        >
                          {groupName}
                          {expandedStars[groupName] &&
                            groupedTerms[groupName] && (
                              <ul className="term-sublist">
                                {groupedTerms[groupName].map((term) => (
                                  <li
                                    key={term.id}
                                    onClick={() => setSelectedTerm(term)}
                                    className="term-subitem"
                                  >
                                    {term.term}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </li>
                      ))}
                      {getFilteredCategoryItems(category.items, categoryKey)
                        .length === 0 && (
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
        {(activeGroupTerms || filteredTerms).map((term) => (
          <div
            key={term.id}
            className="term-card"
            onClick={() => handleTermClick(term)}
          >
            <div className="term-title">{term.term}</div>
            <div className="term-definition">
              {term.definitions?.[0]?.definition}
            </div>
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
