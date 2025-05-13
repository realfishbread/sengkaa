// src/hooks/useLoginModal.js
import { createContext, useContext, useState } from 'react';

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <LoginModalContext.Provider value={{ showModal, setShowModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);
