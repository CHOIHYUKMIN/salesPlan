# Sprint 1 완료 보고서

## 개요

Sprint 1 (Foundation & Auth)을 성공적으로 완료했습니다. ERP 시스템의 기반 구조와 인증 시스템이 구축되었습니다.

## 완료된 작업

### 1. 프로젝트 구조 초기화

```
salesPlan/
├── client/              # React 프론트엔드
│   ├── src/
│   │   ├── pages/      # LoginPage, DashboardPage
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/              # NestJS 백엔드
│   ├── src/
│   │   ├── auth/       # 인증 모듈
│   │   ├── users/      # 사용자 관리
│   │   ├── prisma/     # 데이터베이스 서비스
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── docker-compose.yml
```

### 2. 프론트엔드 (React + Vite + TypeScript + Tailwind CSS)

**완성된 페이지:**
- ✅ 로그인 페이지 (`LoginPage.tsx`)
  - 이메일/비밀번호 입력 폼
  - 디자인 가이드라인 적용 (Primary 컬러, 그라디언트 배경)
- ✅ 대시보드 페이지 (`DashboardPage.tsx`)
  - KPI 카드 4개 (연간 목표 달성률, 월간 계획 진행률, 완료된 태스크, 업체 미팅)
  - 최근 활동 섹션

**기술 스택:**
- React 18 + TypeScript
- React Router (라우팅)
- TanStack Query (서버 상태 관리)
- Zustand (전역 상태 관리)
- Tailwind CSS (스타일링)
- Axios (HTTP 클라이언트)

### 3. 백엔드 (NestJS + Prisma + JWT)

**구현된 모듈:**

#### Prisma 모듈
- `PrismaService`: 데이터베이스 연결 관리
- 전역 모듈로 설정하여 모든 모듈에서 사용 가능

#### Users 모듈
- `UsersService`: 사용자 CRUD 및 비밀번호 검증
- bcrypt를 사용한 비밀번호 해싱 (salt rounds: 10)

#### Auth 모듈
- `AuthService`: 로그인/회원가입 로직
- `JwtStrategy`: Passport JWT 전략
- `JwtAuthGuard`: 인증 가드
- `AuthController`: `/api/auth/login`, `/api/auth/register` 엔드포인트

**보안 기능:**
- JWT 토큰 기반 인증
- bcrypt 비밀번호 해싱
- CORS 설정 (http://localhost:3000)
- Validation Pipe (입력 검증)

### 4. 데이터베이스 스키마 (Prisma)

**정의된 모델:**
- `User`: 사용자 (이메일, 비밀번호, 이름, 역할, 팀)
- `Team`: 팀 (이름, 부서)
- `Dept`: 부서 (이름)
- `YearPlan`: 연간 계획
- `MonthPlan`: 월간 계획
- `Task`: 태스크 (상세 계획)
- `Result`: 실적
- `Company`: 업체
- `Meeting`: 미팅 (Google Calendar 연동 준비)
- `KPI`: 핵심 성과 지표

**Enum 타입:**
- `UserRole`: USER, TEAM_LEADER, DEPT_LEADER, ADMIN
- `PlanStatus`: DRAFT, PENDING, APPROVED, REJECTED
- `TaskStatus`: TODO, IN_PROGRESS, DONE, CANCELLED
- `Priority`: LOW, MEDIUM, HIGH, URGENT

### 5. 인프라 설정

**Docker Compose:**
- PostgreSQL 16 (포트: 5432)
- Redis 7 (포트: 6379)

## 다음 단계 (사용자 액션 필요)

### 1. Docker 설정

Docker Desktop이 설치되었지만 PowerShell에서 인식되지 않는 상태입니다.

**해결 방법:**
1. PowerShell을 완전히 종료하고 재시작
2. 여전히 안 되면 시스템 재시작
3. Docker Desktop이 실행 중인지 확인

### 2. 데이터베이스 시작

```powershell
cd d:\DEVELOP\salesPlan
docker compose up -d
```

### 3. 데이터베이스 마이그레이션

```powershell
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### 4. 애플리케이션 실행

**서버:**
```powershell
cd server
npm run start:dev
```

**클라이언트 (새 터미널):**
```powershell
cd client
npm run dev
```

## 검증 방법

### API 테스트

**회원가입:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"테스트"}'
```

**로그인:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### UI 테스트

1. http://localhost:3000 접속
2. 로그인 페이지 확인
3. 대시보드로 이동 (현재는 인증 없이 이동 가능)

## Sprint 2 준비 사항

Sprint 2에서는 **계획 수립 모듈**을 구현합니다:
- 연간 계획 CRUD API
- 월간 계획 생성 및 연간 계획 매핑
- 계획 승인 프로세스
- 프론트엔드 계획 수립 UI

## 참고 문서

- [README.md](file:///d:/DEVELOP/salesPlan/README.md): 프로젝트 개요
- [SETUP_GUIDE.md](file:///d:/DEVELOP/salesPlan/SETUP_GUIDE.md): 상세 설정 가이드
- [sprint_plan.md](file:///d:/DEVELOP/salesPlan/sprint_plan.md): 전체 스프린트 계획
