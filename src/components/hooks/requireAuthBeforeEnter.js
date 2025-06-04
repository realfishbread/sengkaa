// utils/authCheck.js

import axiosInstance from '../../shared/api/axiosInstance';

export const requireAuthBeforeEnter = async (checkUrl, navigateTo) => {
  try {
    await axiosInstance.get(checkUrl);
    window.location.href = navigateTo; // 또는 navigate(navigateTo) (라우터 안일 경우)
  } catch (err) {
    console.warn('🚫 접근 실패:', err);
    // axiosInstance가 401/403을 자동 처리하니까 따로 안 해도 됨!
  }
};
