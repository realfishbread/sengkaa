import axios from 'axios';

export const fetchStarsByGenre = async (genreId) => {
  const response = await axios.get(`https://eventcafe.site/user/star/by-genre/`, {
    params: { genre_id: genreId }
  });
  return response.data;  // [{ id, name, group }, ...]
};

export const fetchGroupNamesByGenre = async (genreId) => {
  const res = await axios.get('https://eventcafe.site/user/star/groups/', {
    params: { genre_id: genreId }
  });
  return res.data; // ["에스파", "뉴진스", "르세라핌"]
};

export const fetchMultiGenreGroups = async (genreIds) => {
  try {
    const res = await axios.get(`https://eventcafe.site/user/dictionary/star-groups-multi/?genre_ids=${genreIds.join(',')}`);
    return res.data; // ✅ axios는 바로 data 반환!
  } catch (err) {
    console.error('🔥 그룹 불러오기 실패', err);
    throw err; // 필요하면 사용자 알림용 에러 다시 throw
  }
};