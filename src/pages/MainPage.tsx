import React from 'react';
import CategoryToggle from '../components/CategoryToggle';

const MainPage: React.FC = () => {
  const categories = {
    femaleIdols: {
      title: "여자 아이돌",
      items: [
        "블랙핑크", "트와이스", "아이브", "뉴진스", "르세라핌",
        "에스파", "있지", "케플러", "프로미스나인", "스테이씨"
      ]
    },
    maleIdols: {
      title: "남자 아이돌",
      items: [
        "방탄소년단", "엑소", "세븐틴", "NCT", "스트레이 키즈",
        "투모로우바이투게더", "엔하이픈", "더보이즈", "트레저", "에이티즈"
      ]
    },
    streamers: {
      title: "스트리머",
      items: [
        "침착맨", "우왁굳", "주호민", "풍월량", "김도", 
        "쯔양", "이세계아이돌", "왁타버스", "고세구", "릴파"
      ]
    },
    games: {
      title: "게임",
      items: [
        "리그 오브 레전드", "발로란트", "오버워치 2", "배틀그라운드",
        "메이플스토리", "로스트아크", "피파 온라인 4", "서든어택", "던전앤파이터", "디아블로 4"
      ]
    },
    webtoons: {
      title: "웹툰",
      items: [
        "김부장", "독립일기", "연애혁명", "여신강림", "싸움독학",
        "취사병 전설이 되다", "재혼 황후", "나 혼자만 레벨업", "외모지상주의", "화산귀환"
      ]
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">카테고리</h1>
      <div className="space-y-4">
        {Object.values(categories).map((category, index) => (
          <CategoryToggle
            key={index}
            title={category.title}
            items={category.items}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage; 