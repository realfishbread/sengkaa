// DictionaryDetail.js
import React from 'react';
import './DictionaryDetail.css';

function DictionaryDetail({ termInfo, onClose }) {
  return (
    <div className="term-definition-modal">
      <div className="modal-content">
        <h2>{termInfo.term}</h2>
        <p>{termInfo.definition}</p>
        <button onClick={onClose} className="close-button">
          닫기
        </button>
      </div>
    </div>
  );
}

export default DictionaryDetail;