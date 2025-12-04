# ERP 시스템 개발 가이드

## 프로젝트 구조

```
salesPlan/
├── client/          # React 프론트엔드
├── server/          # NestJS 백엔드
├── docker-compose.yml
└── 문서 파일들 (*.md)
```

## 사전 요구사항

1. **Node.js** (v18 이상)
2. **Docker Desktop** (PostgreSQL 및 Redis 실행용)
   - 다운로드: https://www.docker.com/products/docker-desktop/

## 설치 및 실행 가이드

### 1단계: Docker 서비스 시작

```bash
# Docker Desktop이 실행 중인지 확인 후
docker compose up -d
```

이 명령은 PostgreSQL과 Redis를 백그라운드에서 실행합니다.

### 2단계: 서버 환경 설정

```bash
cd server

# .env 파일 생성 (.env.example을 복사)
copy .env.example .env

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 실행
npx prisma migrate dev --name init
```

### 3단계: 서버 실행

```bash
# server 디렉토리에서
npm run start:dev
```

서버가 http://localhost:4000 에서 실행됩니다.

### 4단계: 클라이언트 실행

새 터미널을 열고:

```bash
cd client
npm run dev
```

클라이언트가 http://localhost:3000 에서 실행됩니다.

## Docker 없이 개발하기 (대안)

Docker를 사용할 수 없는 경우:

1. **PostgreSQL 직접 설치**
   - Windows: https://www.postgresql.org/download/windows/
   - 설치 후 데이터베이스 생성:
     ```sql
     CREATE DATABASE erp_db;
     CREATE USER erp_user WITH PASSWORD 'erp_password';
     GRANT ALL PRIVILEGES ON DATABASE erp_db TO erp_user;
     ```

2. **Redis 직접 설치** (선택사항)
   - Windows: https://github.com/microsoftarchive/redis/releases
   - 또는 Redis 기능을 나중에 추가

3. **server/.env 파일 수정**
   ```
   DATABASE_URL="postgresql://erp_user:erp_password@localhost:5432/erp_db?schema=public"
   ```

## 개발 도구

### Prisma Studio (데이터베이스 GUI)

```bash
cd server
npx prisma studio
```

http://localhost:5555 에서 데이터베이스를 시각적으로 관리할 수 있습니다.

## 현재 구현 상태

### ✅ 완료
- [x] 프로젝트 구조 초기화 (Client/Server)
- [x] React + Vite + TypeScript + Tailwind CSS 설정
- [x] NestJS 백엔드 초기화
- [x] Prisma ORM 설정 및 데이터베이스 스키마 정의
- [x] Docker Compose 설정 (PostgreSQL + Redis)
- [x] 로그인 페이지 UI
- [x] 대시보드 페이지 UI (기본 레이아웃)

### 🚧 진행 중 (Sprint 1)
- [ ] JWT 인증 구현 (Backend)
- [ ] 로그인 API 연동 (Frontend)
- [ ] 사용자 관리 API

### 📋 예정 (Sprint 2~4)
- Sprint 2: 계획 수립 모듈
- Sprint 3: Google Calendar 연동 및 실적 관리
- Sprint 4: 대시보드 및 KPI 시각화

## 다음 단계

1. **Docker Desktop 설치** (권장)
2. **데이터베이스 마이그레이션 실행**
3. **인증 모듈 구현 시작**

## 문제 해결

### Docker 명령어가 인식되지 않는 경우
- Docker Desktop이 설치되어 있는지 확인
- Docker Desktop이 실행 중인지 확인
- PowerShell을 재시작

### Prisma 마이그레이션 오류
- PostgreSQL이 실행 중인지 확인
- .env 파일의 DATABASE_URL이 올바른지 확인
