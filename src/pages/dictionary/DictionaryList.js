import React, { useState } from 'react';
import './DictionaryList.css';
import DictionaryDetail from './DictionaryDetail';
import DictionaryForm from './DictionaryForm';

const TAGS = ['전체', '아이돌', '여자 아이돌', '남자 아이돌', '스트리머', '게임', '웹툰'];

const DictionaryList = () => {
  const [selectedTag, setSelectedTag] = useState('전체');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

const allTerms = [
  // 아이돌
  { id: 1, term: '최애', category: '아이돌', definition: '가장 좋아하는 멤버', likes: 5, views: 120 },
  { id: 2, term: '입덕', category: '아이돌', definition: '새로운 팬이 됨', likes: 3, views: 95 },
  { id: 8, term: '덕질', category: '아이돌', definition: '팬 활동을 열심히 하는 것', likes: 8, views: 130 },
  { id: 9, term: '컴백', category: '아이돌', definition: '앨범 발매와 함께 활동 재개', likes: 6, views: 140 },
  { id: 10, term: '스밍', category: '아이돌', definition: '스트리밍을 반복해서 듣는 것', likes: 12, views: 180 },
  { id: 11, term: '비하인드', category: '아이돌', definition: '무대나 촬영 외의 뒷이야기 영상', likes: 4, views: 70 },

  // 스트리머
  { id: 3, term: '칼픽', category: '스트리머', definition: '고정 픽을 빠르게 선택함', likes: 7, views: 80 },
  { id: 18, term: '노잼', category: '스트리머', definition: '재미없을 때 자주 쓰는 말', likes: 2, views: 40 },
  { id: 19, term: '채팅창', category: '스트리머', definition: '시청자와의 실시간 소통 공간', likes: 5, views: 85 },
  { id: 20, term: '리액션', category: '스트리머', definition: '시청자 반응에 대한 행동 표현', likes: 6, views: 100 },

  // 게임
  { id: 4, term: '메타', category: '게임', definition: '최적 전략', likes: 10, views: 200 },
  { id: 21, term: '버프', category: '게임', definition: '캐릭터나 능력치를 상승시키는 효과', likes: 7, views: 110 },
  { id: 22, term: '너프', category: '게임', definition: '캐릭터나 아이템의 성능을 약화시키는 것', likes: 6, views: 90 },
  { id: 23, term: '탱커', category: '게임', definition: '앞에서 피해를 막는 역할', likes: 5, views: 100 },
  { id: 24, term: '딜러', category: '게임', definition: '주로 공격을 담당하는 포지션', likes: 9, views: 130 },

  // 웹툰
  { id: 5, term: '휴재', category: '웹툰', definition: '연재 중단', likes: 1, views: 20 },
  { id: 25, term: '정주행', category: '웹툰', definition: '처음부터 끝까지 한 번에 보는 것', likes: 8, views: 100 },
  { id: 26, term: '회차별 결제', category: '웹툰', definition: '개별 에피소드를 유료로 구매하여 보는 방식', likes: 3, views: 40 },
  { id: 27, term: '쿠키', category: '웹툰', definition: '플랫폼에서 사용하는 결제 단위', likes: 4, views: 60 },
  { id: 28, term: '선댓글 후감상', category: '웹툰', definition: '먼저 댓글을 읽고 나중에 웹툰 감상', likes: 2, views: 35 },
];

  const filteredTerms = allTerms.filter(term => {
    const tagMatch = selectedTag === '전체' || term.category === selectedTag;
    const keywordMatch = term.term.includes(searchKeyword) || term.definition.includes(searchKeyword);
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

  const handleSaveTerm = (newTerm) => {
    console.log('새 용어 저장:', newTerm);
    setShowForm(false);
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
        <span>👁 총 조회수: {filteredTerms.reduce((sum, t) => sum + t.views, 0)}</span>
      </div>

      <div className="term-card-list">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            className="term-card"
            onClick={() => handleTermClick(term)}
          >
            <div className="term-title">{term.term}</div>
            <div className="term-definition">{term.definition}</div>
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
