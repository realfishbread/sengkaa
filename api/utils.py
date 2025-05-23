import redis
from django.conf import settings
import requests

def get_redis_connection():
    return redis.StrictRedis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        decode_responses=True  # 문자열로 반환
    )
def geocode_kakao(address):
    headers = {
        "Authorization": "KakaoAK 4083ddda8b18709f62bb857f2c52f127"
    }
    params = {"query": address}
    res = requests.get("https://dapi.kakao.com/v2/local/search/address.json", headers=headers, params=params)
    data = res.json()

    if data["documents"]:
        lat = float(data["documents"][0]["y"])
        lng = float(data["documents"][0]["x"])
        return lat, lng

    # 🔁 fallback: 공백 나누고 앞부분만 시도
    simplified = address.strip().split(" ")[0:3]  # 예: 너무 긴 주소 줄이기
    if len(simplified) >= 2:
        fallback_address = " ".join(simplified)
        print(f"⚠️ 기본 실패, fallback 주소 시도: '{fallback_address}'")
        params["query"] = fallback_address
        res = requests.get("https://dapi.kakao.com/v2/local/search/address.json", headers=headers, params=params)
        data = res.json()
        if data["documents"]:
            lat = float(data["documents"][0]["y"])
            lng = float(data["documents"][0]["x"])
            return lat, lng

    return None, None
