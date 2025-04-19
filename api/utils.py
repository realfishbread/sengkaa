import redis
from django.conf import settings

def get_redis_connection():
    return redis.StrictRedis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        decode_responses=True  # 문자열로 반환
    )
