
import React, { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense 광고 로딩 실패:", e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3324628579192842"  // 너의 퍼블리셔 ID
      data-ad-slot="4472276591"   // 광고 단위 ID
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default AdBanner;
