import React, { useEffect, useState } from "react";
import "./KakaoMap.css";

const KakaoMap = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 37.5665,
    lng: 126.9780,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  // 카테고리별 마커 아이콘 URL 정의
  const markerIcons = {
    general: "https://cdn-icons-png.flaticon.com/512/684/684908.png",       // 일반 카페 (예: 파란색 핀)
    characterGame: "https://cdn-icons-png.flaticon.com/512/2948/2948035.png", // 캐릭터/게임 콜라보 (예: 분홍색 마이크)
    idol: "https://cdn-icons-png.flaticon.com/512/206/206663.png",            // 아이돌 콜라보 (예: 노란색 별)
    rental: "https://cdn-icons-png.flaticon.com/512/190/190411.png",           // 대관 가능한 개인카페 (예: 초록색 건물)
    party: "https://cdn-icons-png.flaticon.com/512/2721/2721223.png",          // 파티룸 (예: 보라색 풍선)
  };

  // 카테고리 결정 함수 (카페 이름이나 기타 정보를 기준으로 분류)
  const getCategory = (place) => {
    const name = place.place_name;
    if (name.includes("캐릭터") || name.includes("게임")) {
      return "characterGame";
    }
    if (name.includes("아이돌")) {
      return "idol";
    }
    if (name.includes("대관") || name.includes("개인")) {
      return "rental";
    }
    if (name.includes("파티룸")) {
      return "party";
    }
    return "general";
  };

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보를 가져오는 중 오류 발생:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) {
      console.error("Kakao Maps SDK가 로드되지 않았습니다.");
      return;
    }

    // 지도 초기화
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);

    // 사용자 위치 표시용 기본 마커 생성
    const defaultMarkerImage = new kakao.maps.MarkerImage(
      markerIcons.general,
      new kakao.maps.Size(40, 40),
      { offset: new kakao.maps.Point(20, 40) }
    );
    const userMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      image: defaultMarkerImage,
    });
    userMarker.setMap(map);

    // 장소 검색 서비스 생성
    const ps = new kakao.maps.services.Places();

    // "카페" 키워드로 검색 (반경 5km)
    ps.keywordSearch(
      "카페",
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          data.forEach((place) => {
            const category = getCategory(place);
            displayMarker(place, category);
          });
        } else {
          console.error("카페 검색 실패");
        }
      },
      {
        location: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 5000,
      }
    );

    // 마커 생성 함수
    function displayMarker(place, category) {
      const markerImage = new kakao.maps.MarkerImage(
        markerIcons[category],
        new kakao.maps.Size(40, 40),
        { offset: new kakao.maps.Point(20, 40) }
      );
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(place.y, place.x),
        image: markerImage,
      });

      // 마커 클릭 시 상세 정보 설정
      kakao.maps.event.addListener(marker, "click", () => {
        setSelectedPlace({
          ...place,
          image_url:
            place.image_url ||
            "https://via.placeholder.com/400x200?text=No+Image",
        });
      });
    }
  }, [userLocation]);

  return (
    <div className="kakao-map-container">
      {/* 상세 정보 패널 */}
      <div className={`info-panel ${selectedPlace ? "" : "hidden"}`}>
        {selectedPlace && (
          <>
            <button
              className="close-button"
              onClick={() => setSelectedPlace(null)}
            >
              ❌
            </button>
            <img
              src={selectedPlace.image_url}
              alt="포스터 이미지"
              className="poster-image"
            />
            <h2 className="place-title">📍 {selectedPlace.place_name}</h2>
            <p>
              <strong>🏠 주소:</strong>{" "}
              {selectedPlace.road_address_name || selectedPlace.address_name}
            </p>
            <p>
              <strong>📞 전화번호:</strong>{" "}
              {selectedPlace.phone ? selectedPlace.phone : "정보 없음"}
            </p>
            {selectedPlace.opening_hours && (
              <p>
                <strong>🕒 영업시간:</strong> {selectedPlace.opening_hours}
              </p>
            )}
            {selectedPlace.menu && (
              <p>
                <strong>🍽 메뉴:</strong> {selectedPlace.menu}
              </p>
            )}
            <a
              href={selectedPlace.place_url}
              target="_blank"
              rel="noopener noreferrer"
              className="place-link"
            >
              📌 카카오맵에서 보기
            </a>
          </>
        )}
      </div>

      {/* 지도 영역 */}
      <div id="myMap" className="map-container" />
    </div>
  );
};

export default KakaoMap;
