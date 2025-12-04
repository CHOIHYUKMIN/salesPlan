# ERP 시스템 기술 아키텍처 (Technical Architecture)

본 문서는 앞서 정의된 요구사항, 프로세스, 디자인 가이드를 효과적으로 구현하기 위한 최적의 기술 스택과 시스템 구성을 정의합니다.

## 1. 기술 스택 선정 (Technology Stack)

안정성(Stability), 확장성(Scalability), 개발 생산성(Productivity)을 고려하여 최신 엔터프라이즈 웹 애플리케이션 표준 스택을 선정했습니다.

### 1.1 프론트엔드 (Frontend)
*   **Core**: **React** (v18+) + **TypeScript**
    *   *선정 이유*: 컴포넌트 기반의 재사용성, 강력한 생태계, TypeScript를 통한 타입 안정성 확보.
*   **Build Tool**: **Vite**
    *   *선정 이유*: 빠른 빌드 속도와 HMR(Hot Module Replacement)로 개발 생산성 극대화.
*   **State Management**: **Zustand** (전역 상태) + **TanStack Query** (서버 상태)
    *   *선정 이유*: 복잡한 Redux 대비 가볍고 직관적이며, 서버 데이터 캐싱 및 동기화에 최적화.
*   **Styling**: **Tailwind CSS**
    *   *선정 이유*: 디자인 가이드라인(Design System)을 유틸리티 클래스로 빠르게 구현 가능.
*   **UI Components**: **Radix UI** (Headless) + **Shadcn/ui**
    *   *선정 이유*: 접근성이 보장된 Headless 컴포넌트를 기반으로 커스텀 디자인 적용 용이.

### 1.2 백엔드 (Backend)
*   **Framework**: **NestJS** (Node.js 기반)
    *   *선정 이유*: 모듈형 아키텍처로 유지보수가 용이하며, 엔터프라이즈급 구조(DI, Decorator 등) 제공. Google API와 같은 비동기 I/O 처리에 유리.
*   **Language**: **TypeScript**
    *   *선정 이유*: 프론트엔드와 언어 통일로 코드 공유(DTO 등) 및 풀스택 개발 용이.
*   **ORM**: **Prisma**
    *   *선정 이유*: 직관적인 스키마 정의, 강력한 타입 추론, 마이그레이션 자동화.
*   **API Docs**: **Swagger (OpenAPI)**
    *   *선정 이유*: API 명세 자동 생성 및 테스트 환경 제공.

### 1.3 데이터베이스 및 저장소 (Data & Storage)
*   **RDBMS**: **PostgreSQL**
    *   *선정 이유*: 복잡한 쿼리 처리, JSON 타입 지원, 안정적인 트랜잭션 관리.
*   **Cache**: **Redis**
    *   *선정 이유*: 세션 관리, 자주 조회되는 대시보드 데이터 캐싱, Google Calendar 동기화 작업 큐(Queue) 관리.

### 1.4 인프라 및 배포 (Infrastructure & DevOps)
*   **Container**: **Docker** & **Docker Compose**
    *   *선정 이유*: 개발/운영 환경 일치, 간편한 배포.
*   **CI/CD**: **GitHub Actions**
    *   *선정 이유*: 코드 저장소와 통합된 자동화 파이프라인 구축.

---

## 2. 시스템 아키텍처 상세 (System Architecture Details)

### 2.1 논리적 아키텍처 (Logical Architecture)

```mermaid
graph TD
    subgraph "Client Side"
        ReactApp[React SPA]
        Store[Zustand Store]
        Query[TanStack Query]
    end

    subgraph "API Gateway / Load Balancer"
        Nginx[Nginx]
    end

    subgraph "Server Side (NestJS)"
        AuthModule[Auth Module (JWT/Guard)]
        PlanModule[Plan Module]
        ResultModule[Result Module]
        SyncModule[GCal Sync Module]
        
        subgraph "Background Workers"
            BullQueue[BullMQ (Redis)]
            SyncWorker[Sync Worker]
        end
    end

    subgraph "Data Persistence"
        Postgres[(PostgreSQL)]
        RedisCache[(Redis)]
    end

    subgraph "External"
        GoogleAPI[Google Calendar API]
    end

    ReactApp -->|REST/GraphQL| Nginx
    Nginx --> AuthModule
    Nginx --> PlanModule
    
    PlanModule --> Postgres
    ResultModule --> Postgres
    
    SyncModule -->|Add Job| BullQueue
    BullQueue -->|Process| SyncWorker
    SyncWorker -->|Fetch| GoogleAPI
    SyncWorker -->|Upsert| Postgres
```

### 2.2 Google Calendar 동기화 전략
동기화는 시스템 부하를 줄이고 데이터 정합성을 유지하기 위해 **비동기 큐(Queue)** 방식을 사용합니다.

1.  **Trigger**: 사용자의 '동기화' 요청 또는 배치 스케줄러(Cron) 실행.
2.  **Queueing**: `SyncModule`이 Redis Queue(BullMQ)에 동기화 작업을 등록하고 즉시 응답(Accepted).
3.  **Processing**: 별도의 `SyncWorker`가 큐에서 작업을 가져와 Google Calendar API를 호출.
4.  **Upsert**: 가져온 이벤트를 DB의 `Meeting` 테이블에 저장(기존 항목은 업데이트, 신규 항목은 생성).
5.  **Notification**: 작업 완료 시 WebSocket 또는 SSE(Server-Sent Events)로 클라이언트에 알림.

## 3. 데이터베이스 모델링 핵심 (Key ERD Concept)

*   **Plan (계획)**: `YearPlan` (1) -- (*) `MonthPlan` (1) -- (*) `Task`
*   **Result (실적)**: `Task` (1) -- (0..1) `Result` (실적은 태스크와 매핑되거나 독립적으로 존재 가능)
*   **Sync (동기화)**: `GoogleEvent` 테이블을 별도로 두어 원본 데이터를 보존하고, `Result` 테이블로 변환/매핑하는 구조 권장.

## 4. 보안 아키텍처 (Security)

*   **인증 (Authentication)**: JWT(Access Token + Refresh Token) 기반 인증.
*   **권한 (Authorization)**: RBAC (Role-Based Access Control). NestJS Guard를 사용하여 API 엔드포인트별 접근 제어 (`@Roles('ADMIN')`).
*   **민감 정보**: DB 연결 정보, Google API Key 등은 환경변수(`.env`)로 관리하고, 비밀번호는 `bcrypt`로 단방향 암호화 저장.
