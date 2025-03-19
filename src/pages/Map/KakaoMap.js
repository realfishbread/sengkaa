import React, { useEffect, useState } from "react";

const KakaoMap = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 37.5665,
    lng: 126.9780,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);

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

    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);

    const markerImage = new kakao.maps.MarkerImage(
      "https://cdn-icons-png.flaticon.com/512/684/684908.png", // 일반적인 위치 마커
      new kakao.maps.Size(40, 40),
      { offset: new kakao.maps.Point(20, 40) }
    );

    // 사용자 위치 마커
    const userMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      image: markerImage,
    });
    userMarker.setMap(map);

    const ps = new kakao.maps.services.Places();

    // 📌 **1단계: "카페" 키워드로 검색 후 필터링**
    ps.keywordSearch("카페", (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const birthdayCafes = data.filter((place) => place.place_name.includes("생일"));
        
        if (birthdayCafes.length > 0) {
          birthdayCafes.forEach((place) => displayMarker(place));
        } else {
          console.log("🔍 '생일 카페'가 없음. 일반 카페라도 표시.");
          data.slice(0, 5).forEach((place) => displayMarker(place)); // 최대 5개 표시
        }
      } else {
        console.error("카페 검색 실패");
      }
    }, {
      location: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 5000, // 🔥 반경 5km로 확대
    });

    function displayMarker(place) {
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(place.y, place.x),
        image: markerImage,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        setSelectedPlace({
          ...place,
          image_url: place.image_url || "https://via.placeholder.com/400x200?text=No+Image", // 기본 이미지 설정
        });
      });
    }
  }, [userLocation]);

  return (
    <div style={{ display: "flex", height: "700px" }}>
      {/* 📌 왼쪽 정보 패널 */}
      <div style={{
        width: "30vw",
        maxWidth: "400px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        borderRadius: "15px",
        overflowY: "auto",
        display: selectedPlace ? "block" : "none", // ✨ 마커 클릭 전에는 숨김
        transition: "0.3s ease-in-out"
      }}>
        {selectedPlace && (
          <>
            <button onClick={() => setSelectedPlace(null)} style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              float: "right",
              cursor: "pointer"
            }}>❌</button>

            {/* 📌 포스터 이미지 */}
            <img src={selectedPlace.image_url} alt="포스터 이미지" style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              marginBottom: "10px"
            }} />

            <h2 style={{ color: "#007bff", marginBottom: "10px" }}>📍 {selectedPlace.place_name}</h2>
            <p><strong>🏠 주소:</strong> {selectedPlace.road_address_name || selectedPlace.address_name}</p>
            <p><strong>📞 전화번호:</strong> {selectedPlace.phone ? selectedPlace.phone : "정보 없음"}</p>
            <a href={selectedPlace.place_url} target="_blank" rel="noopener noreferrer" style={{
              display: "block",
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#ff4081",
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "10px",
              fontSize: "14px"
            }}>
              📌 카카오맵에서 보기
            </a>
          </>
        )}
      </div>

      {/* 📌 오른쪽 지도 영역 */}
      <div id="myMap" style={{ width: "70vw", height: "700px" }} />
    </div>
  );
};

export default KakaoMap;
