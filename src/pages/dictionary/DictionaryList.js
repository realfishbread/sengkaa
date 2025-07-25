import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import {
  fetchGroupNamesByGenre,
  fetchMultiGenreGroups,
} from '../../shared/api/fetchStarsByGroup';
import DictionaryDetail from './DictionaryDetail';
import DictionaryForm from './DictionaryForm';
import './DictionaryList.css';
import {
  createDictionaryItem,
  fetchDictionaryList,
  fetchGroupedTermsByGenre,
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
  '만화'
];

const GENRE_TAG_TO_ID = {
  아이돌: [1, 6],
  '여자 아이돌': 1,
  '남자 아이돌': 6,
  스트리머: 2,
  게임: 5,
  웹툰: 4,
  만화: 3
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
  const { user } = useContext(UserContext);

  const [groupedTerms, setGroupedTerms] = useState({});
  const [expandedStars, setExpandedStars] = useState({});
  const [starGroups, setStarGroups] = useState([]); // 🔥
  const [categories, setCategories] = useState({});
  const [activeGroupTerms, setActiveGroupTerms] = useState(null);

  const navigate = useNavigate();

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
        let res;

        if (selectedTag === '아이돌') {
          // ✅ 여자(1), 남자(6) 아이돌 그룹 전부 불러오기
          res = await fetchMultiGenreGroups([1, 6]);
        } else {
          const genreId = GENRE_TAG_TO_ID[selectedTag];
          if (!genreId) return;
          res = await fetchGroupNamesByGenre(genreId);
        }

        setStarGroups(res);

        const dynamicCategoryKey = `${selectedTag}-category`;
        const newCategory = {
          [dynamicCategoryKey]: {
            title: selectedTag,
            items: res,
          },
        };
        setCategories(newCategory);
      } catch (err) {
        console.error('스타 그룹 불러오기 실패 ❌', err);
      }
    };

    if (selectedTag !== '전체') {
      loadStarGroups();
    }
  }, [selectedTag]);

  const filteredTerms = terms.filter((term) => {
    const selectedIds = GENRE_TAG_TO_ID[selectedTag];
    const genreIdList = Array.isArray(selectedIds)
      ? selectedIds
      : [selectedIds];

    const tagMatch = selectedTag === '전체' || genreIdList.includes(term.genre); // ✅ genre 필드를 숫자로 비교

    const keywordMatch =
      term.term.includes(searchKeyword) ||
      term.definitions?.some((d) => d.definition.includes(searchKeyword)) ||
      term.star_group?.some((star) => star.includes(searchKeyword));

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

      // 해당 그룹의 용어만 표시
      setActiveGroupTerms(res[groupName] || []);

      // 다른 그룹의 용어는 숨김
      Object.keys(expandedStars).forEach((key) => {
        if (key !== groupName) {
          setExpandedStars((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      });
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
        <button
          className="write-term-btn"
          onClick={() => {
            if (!user) {
              // ① 비로그인: /login 으로 보내면서 “돌아올 곳” 남기기
              navigate('/login', { state: { from: '/dictionary' } });
              // 혹은 setShowLoginModal(true) 로 모달 열어도 됨
            } else {
              // ② 로그인: 작성 폼 오픈
              setShowForm(true);
            }
          }}
        >
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
        {activeGroupTerms
          ? // ⭐ 특정 그룹 클릭했을 때는 그 그룹에 해당하는 용어만 표시
            activeGroupTerms.map((term) => (
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
            ))
          : // ⭐ 그룹을 클릭하지 않은 상태면, 그룹 없는 용어 먼저, 그다음 그룹 있는 용어
            [
              ...filteredTerms.filter((t) => t.star_group.length === 0),
              filteredTerms.filter((t) => t.star_group.length > 0),
            ]
              .flat()
              .map((term) => (
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
