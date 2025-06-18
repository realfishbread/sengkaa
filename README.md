
## **생일카페, 이벤트 주최, 이벤트 찾기를 보다 편하게 할 수 있는** **팬들을 위한 플랫폼, 이벤트카페입니다.**


> 생일카페, 팬 이벤트 주최/참여를 간편하게  
> 할 수 있는 팬덤 기반 이벤트 플랫폼

---

## 📆 프로젝트 소개

- 팬 커뮤니티의 오프라인/온라인 이벤트를  
  누구나 쉽게 주최하고 참여할 수 있는 플랫폼
- 2025년 상반기 졸업작품으로 개발 진행

🌐 **배포 주소**: [https://gungangazi.site](https://gungangazi.site)

---

>앱 프로젝트 상세 진행 노션:
[링크](https://www.notion.so/1f3cd9738881816294cbcbde78bede66) 

>앱 프로젝트 리포지토리:
[링크](https://github.com/JYJ-0605/eventcafeapp)   

- FE web, app Devops, BE: realfishbread
- FE web, app, Design: JYJ-0605


| Frontend | Devops | Backend |
| --- | --- | --- |
| React | github action | Django |
| React Native |  | Redis |

---

> 역할 분담

| 이름 | 담당 역할 및 구현 사항 |
|------|------------------------|
| **최윤희 (realfishbread)L** | - 웹, 앱 프론트엔드 주요 기능 구현 (React)<br> - Django 기반 백엔드 구축 및 API 개발<br> - Redis 기반 인증 및 토큰 시스템 구현<br> - EC2 및 Nginx를 활용한 배포 설정<br> - CI/CD 자동 배포 구성 (GitHub Actions) |
| **주예진 (JYJ-0605)** | - 앱 프론트엔드 (React Native) UI UX 구현<br> - 웹 프론트엔드 서브 기능 및 디자인<br> - UI/UX 디자인 설계 총괄 |


---

## ✨ 주요 기능 요약

- 사용자 회원가입, 로그인, 이메일 인증
- 이벤트 주최 및 예약 시스템 (웹 기반)
- Kakao Map 기반 위치 검색 및 커스터마이징
- Toss Payments 결제 연동
- 관리자 승인 기능 (이벤트 관리)
- 사용자 좋아요/조회수/CRUD 기능
- 실시간 채팅 (Django Channels + Redis, JWT 인증 포함)
- 이미지 업로드 (AWS S3 활용)

---

## 🛠️ 배포 구성

- EC2 인스턴스에서 백엔드 + Nginx Reverse Proxy 설정
- 도메인 연결 + HTTPS SSL 적용 (Let's Encrypt)
- CI/CD: GitHub Actions 기반 자동 배포 파이프라인
- MySQL (RDS) 설정 및 직접 쿼리 작성

---

## 📌 현재 상태

- ✅ MVP 기능 구현 및 배포 완료
- 🔧 UX 개선 및 디자인 고도화 진행 중
- 🎯 테스트 후 앱 스토어 배포 준비 중

---


