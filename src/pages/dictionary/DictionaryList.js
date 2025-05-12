// DictionaryList.js
import React, { useState } from 'react';
import './DictionaryList.css'; // CSS 파일 import
import DictionaryForm from './DictionaryForm';
import DictionaryDetail from './DictionaryDetail';

function DictionaryList() {
  // 각 분야별 용어 데이터를 상태로 관리
  const [idolTerms, setIdolTerms] = useState([
    { id: 1, term: '최애', definition: '가장 좋아하는 멤버' },
    { id: 2, term: '입덕', definition: '새로운 팬이 됨' },
    // ... 더 많은 아이돌 용어
  ]);

  const [streamerTerms, setStreamerTerms] = useState([
    { id: 3, term: '구독', definition: '스트리머 채널을 후원하는 행위' },
    { id: 4, term: '트수', definition: '트위치 시청자를 이르는 말' },
    // ... 더 많은 스트리머 용어
  ]);

  const [gameTerms, setGameTerms] = useState([
    { id: 5, term: '핵', definition: '불법적인 프로그램' },
    { id: 6, term: '뉴비', definition: '새로운 유저' },
    // ... 더 많은 게임 용어
  ]);

  // 새 용어 작성 폼 표시 상태 관리
  const [isAddingNewTerm, setIsAddingNewTerm] = useState(false);

  // 각 분야별 토글 상태 관리
  const [isIdolOpen, setIsIdolOpen] = useState(false);
  const [isStreamerOpen, setIsStreamerOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');

  // 선택된 용어 정보 상태 관리
  const [selectedTermInfo, setSelectedTermInfo] = useState(null);

  // 검색 기능 (간단한 필터링)
  const filteredIdolTerms = idolTerms.filter(termInfo =>
    termInfo.term.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredStreamerTerms = streamerTerms.filter(termInfo =>
    termInfo.term.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredGameTerms = gameTerms.filter(termInfo =>
    termInfo.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewTermClick = () => {
    setIsAddingNewTerm(true);
  };

  const handleSaveNewTerm = (newTermData) => {
    switch (newTermData.category) {
      case 'idol':
        setIdolTerms(prevTerms => [...prevTerms, { id: Date.now(), ...newTermData }]);
        break;
      case 'streamer':
        setStreamerTerms(prevTerms => [...prevTerms, { id: Date.now(), ...newTermData }]);
        break;
      case 'game':
        setGameTerms(prevTerms => [...prevTerms, { id: Date.now(), ...newTermData }]);
        break;
      default:
        break;
    }
    setIsAddingNewTerm(false);
  };

  const handleCancelNewTerm = () => {
    setIsAddingNewTerm(false);
  };

  const handleTermClick = (termInfo) => {
    setSelectedTermInfo(termInfo);
  };

  const handleCloseDefinition = () => {
    setSelectedTermInfo(null);
  };

  return (
    <div className="dictionary-list">
      <div className="title-container">
        <h1>덕질 용어 사전</h1>
        <button onClick={handleAddNewTermClick} className="add-term-button">
          용어 작성하기
        </button>
      </div>

      <input
        type="text"
        placeholder="용어 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {isAddingNewTerm && (
        <DictionaryForm
          onSave={handleSaveNewTerm}
          onCancel={handleCancelNewTerm}
        />
      )}

      {selectedTermInfo && (
        <DictionaryDetail termInfo={selectedTermInfo} onClose={handleCloseDefinition} />
      )}

      <div className="category">
        <button onClick={() => setIsIdolOpen(!isIdolOpen)} className="category-button">
          아이돌 ({idolTerms.length}) {isIdolOpen ? '▲' : '▼'}
        </button>
        {isIdolOpen && (
          <ul className="term-list">
            {filteredIdolTerms.map(termInfo => (
              <li key={termInfo.id} onClick={() => handleTermClick(termInfo)}>
                {termInfo.term}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="category">
        <button onClick={() => setIsStreamerOpen(!isStreamerOpen)} className="category-button">
          스트리머 ({streamerTerms.length}) {isStreamerOpen ? '▲' : '▼'}
        </button>
        {isStreamerOpen && (
          <ul className="term-list">
            {filteredStreamerTerms.map(termInfo => (
              <li key={termInfo.id} onClick={() => handleTermClick(termInfo)}>
                {termInfo.term}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="category">
        <button onClick={() => setIsGameOpen(!isGameOpen)} className="category-button">
          게임 ({gameTerms.length}) {isGameOpen ? '▲' : '▼'}
        </button>
        {isGameOpen && (
          <ul className="term-list">
            {filteredGameTerms.map(termInfo => (
              <li key={termInfo.id} onClick={() => handleTermClick(termInfo)}>
                {termInfo.term}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DictionaryList;