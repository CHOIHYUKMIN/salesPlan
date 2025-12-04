# ERP 시스템 실행 가이드

## 현재 상태

✅ **완료된 작업:**
- React 클라이언트 (로그인 페이지, 대시보드)
- NestJS 서버 (JWT 인증, 사용자 관리)
- Prisma 데이터베이스 스키마
- Docker Compose 설정

## Docker 설정 및 실행

### 1단계: Docker Desktop 확인

Docker Desktop이 실행 중인지 확인하세요. 시스템 트레이에서 Docker 아이콘을 확인할 수 있습니다.

### 2단계: PowerShell 재시작

Docker를 설치한 후에는 **PowerShell을 완전히 종료하고 다시 시작**해야 합니다.

### 3단계: Docker 명령 확인

```powershell
docker --version
```

이 명령이 작동하지 않으면 시스템을 재시작해야 할 수 있습니다.

### 4단계: 데이터베이스 시작

```powershell
cd d:\DEVELOP\salesPlan
docker compose up -d
```

이 명령은 PostgreSQL과 Redis를 백그라운드에서 실행합니다.

### 5단계: 데이터베이스 마이그레이션

```powershell
cd server

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 실행
npx prisma migrate dev --name init
```

### 6단계: 서버 실행

```powershell
# server 디렉토리에서
npm run start:dev
```

서버가 http://localhost:4000 에서 실행됩니다.

### 7단계: 클라이언트 실행

**새 PowerShell 창을 열고:**

```powershell
cd d:\DEVELOP\salesPlan\client
npm run dev
```

클라이언트가 http://localhost:3000 에서 실행됩니다.

## API 엔드포인트

### 회원가입
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

### 로그인
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

응답:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

## 데이터베이스 관리

### Prisma Studio 실행

```powershell
cd server
npx prisma studio
```

http://localhost:5555 에서 데이터베이스를 GUI로 관리할 수 있습니다.

## 문제 해결

### Docker 명령이 인식되지 않는 경우

1. Docker Desktop이 실행 중인지 확인
2. PowerShell을 완전히 종료하고 재시작
3. 여전히 안 되면 시스템 재시작
4. 시스템 환경 변수 PATH에 Docker가 포함되어 있는지 확인

### 데이터베이스 연결 오류

1. Docker 컨테이너가 실행 중인지 확인:
   ```powershell
   docker ps
   ```

2. PostgreSQL 컨테이너가 목록에 있어야 합니다.

3. 컨테이너를 재시작:
   ```powershell
   docker compose down
   docker compose up -d
   ```

## 다음 단계

1. Docker 설정 완료
2. 클라이언트에서 로그인 API 연동
3. Sprint 2: 계획 수립 모듈 구현 시작
