import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const position = [37.5665, 126.9780]; // 서울 중심 좌표

  return (
    <div className="App">
      <header className="header">
        <h1>🗺️ 반응형 지도 웹</h1>
      </header>
      <main className="map-container">
        <MapContainer center={position} zoom={13} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              서울 중심지입니다. <br /> 즐거운 탐험하세요!
            </Popup>
          </Marker>
        </MapContainer>
      </main>
      <footer className="footer">
        <p>© 2024 지도 서비스 | 고객문의 : sengkaa@gmail.com</p>
      </footer>
    </div>
  );
}

export default App;