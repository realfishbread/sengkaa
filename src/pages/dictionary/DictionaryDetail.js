import React from 'react';
import './DictionaryDetail.css';

function DictionaryDetail({ termInfo, onClose }) {
  return (
    <div className="term-definition-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="term-title">{termInfo.term}</h2>
        <p className="term-definition">{termInfo.definition}</p>
        <div className="term-meta">
          ❤️ {termInfo.likes} &nbsp;&nbsp; 👁 {termInfo.views}
        </div>
      </div>
    </div>
  );
}

export default DictionaryDetail;
