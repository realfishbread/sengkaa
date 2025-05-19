import React, { useEffect, useState } from 'react';
import './KakaoMap.css';

const KakaoMap = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const markerIcons = {
    general: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  };

  const getCategory = (place) => {
    const name = place.place_name;

    if (
      (name.includes('아이돌') || name.includes('생일')) &&
      name.includes('카페')
    ) {
      return 'idol';
    }
    if (name.includes('대관') || name.includes('개인')) {
      return 'rental';
    }
    if (name.includes('유튜버')) {
      return 'youtuber';
    }
    if (name.includes('게임')) {
      return 'game';
    }
    if (
      name.includes('만화') ||
      name.includes('애니') ||
      name.includes('웹툰')
    ) {
      return 'comic';
    }
    return 'general';
  };

  const borderColors = {
    idol: '#FFD700',
    rental: '#32CD32',
    game: '#FF8C00',
    comic: '#DC143C',
    youtuber: '#1E90FF',
    general: '#ffffff',
  };

  // ✅ SDK 로드 및 지도 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2a1d16dca2b187d288b52687ea868276&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };
  }, [userLocation]);

  // ✅ 사용자 위치 갱신
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
          console.error('위치 정보를 가져오는 중 오류 발생:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // ✅ 마커 클릭 핸들러 전역 바인딩
  useEffect(() => {
    window.handleMarkerClick = (placeName) => {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(placeName, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const found = data.find((p) => p.place_name === placeName);
          if (found) {
            setSelectedPlace({
              ...found,
              image_url:
                found.image_url ||
                'https://via.placeholder.com/400x200?text=No+Image',
            });
          }
        }
      });
    };
  }, []);

  // ✅ 지도 초기화
  const initMap = () => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    const container = document.getElementById('myMap');
    const options = {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);

    const defaultMarkerImage = new kakao.maps.MarkerImage(
      markerIcons.general,
      new kakao.maps.Size(40, 40),
      { offset: new kakao.maps.Point(20, 40) }
    );

    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      image: defaultMarkerImage,
      map,
    });

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(
      '카페',
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          data.forEach((place) => {
            const category = getCategory(place);
            displayMarker(place, category, map);
          });
        }
      },
      {
        location: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 5000,
      }
    );
  };

  // ✅ 마커 출력 함수 (initMap 바깥으로 분리)
  const displayMarker = (place, category, map) => {
    const imageUrl =
      place.image_url ||
      'https://via.placeholder.com/100x100.png?text=No+Image';
    const borderColor = borderColors[category] || '#ffffff';

    const content = `
      <div class="custom-marker" style="border-color: ${borderColor}" onclick="window.handleMarkerClick('${place.place_name.replace(
      /'/g,
      "\\'"
    )}')">
        <img src="${imageUrl}" alt="포스터" />
      </div>
    `;

    new window.kakao.maps.CustomOverlay({
      map: map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
      content: content,
      yAnchor: 1,
    });
  };

  return (
    <div className="kakao-map-container">
      <div className={`info-panel ${selectedPlace ? '' : 'hidden'}`}>
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
              <strong>🏠 주소:</strong>{' '}
              {selectedPlace.road_address_name || selectedPlace.address_name}
            </p>
            <p>
              <strong>📞 전화번호:</strong> {selectedPlace.phone || '정보 없음'}
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

      <div id="myMap" className="map-container" />
    </div>
  );
};

export default KakaoMap;
