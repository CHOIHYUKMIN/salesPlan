# ERP 시스템 개발 스프린트 계획 (Sprint Plan)

본 문서는 애자일(Agile) 방법론에 기반하여 ERP 시스템의 MVP(Phase 1)를 성공적으로 런칭하기 위한 스프린트 계획을 정의합니다.
전체 일정은 2주 단위의 4개 스프린트(총 8주)로 구성됩니다.

## 0. 스프린트 개요 (Overview)

*   **스프린트 주기**: 2주 (10 Working Days)
*   **전체 목표**: ERP 시스템 Phase 1 (MVP) 기능 구현 및 배포
*   **참여 인원**: 기획 1, 디자인 1, 퍼블리싱/FE 1, BE 1 (가정)

---

## Sprint 1: 프로젝트 기반 구축 및 인증 (Foundation & Auth)
**목표**: 개발 환경을 셋업하고, 사용자 인증 및 기본 레이아웃을 구현하여 시스템의 뼈대를 완성한다.

### 주요 태스크 (Backlog)
*   **[Infra]** 프로젝트 저장소(Git) 및 모노레포(NestJS + React) 초기화
*   **[Infra]** DB(PostgreSQL), Redis, Docker Compose 환경 구성
*   **[Design]** 공통 UI 컴포넌트(Button, Input, Layout 등) 및 디자인 시스템 적용
*   **[BE]** 사용자(User) 엔티티 설계 및 회원가입/로그인 API (JWT) 구현
*   **[BE]** 조직(Team/Dept) 관리 API 구현
*   **[FE]** 로그인/회원가입 페이지 및 메인 레이아웃(LNB, Header) 구현

### 산출물
*   실행 가능한 개발 환경
*   로그인/로그아웃 기능
*   메인 대시보드(빈 화면) 진입 가능

---

## Sprint 2: 계획 수립 모듈 구현 (Planning Module)
**목표**: 연간 및 월간 계획을 수립하고 승인하는 핵심 프로세스를 구현한다.

### 주요 태스크 (Backlog)
*   **[BE]** 연간 계획(YearPlan) CRUD 및 상태 관리(작성중/승인대기/완료) API
*   **[BE]** 월간 계획(MonthPlan) 생성 및 연간 계획 매핑 로직 구현
*   **[FE]** 연간 계획 수립 UI (목표 및 KPI 입력)
*   **[FE]** 월간 계획 수립 UI (상세 태스크 입력, Drag & Drop 고려)
*   **[FE]** 계획 승인/반려 프로세스 UI

### 산출물
*   연간/월간 계획 등록 및 조회 기능
*   계획 데이터 DB 적재 확인

---

## Sprint 3: 실행 및 실적 관리 (Execution & Sync)
**목표**: Google Calendar 연동을 통해 실적을 자동으로 수집하고, 수동 입력을 지원한다.

### 주요 태스크 (Backlog)
*   **[BE]** Google Calendar API 연동 및 OAuth 인증 처리
*   **[BE]** 캘린더 동기화 배치(Batch) 및 큐(Queue) 처리 로직 구현
*   **[BE]** 실적(Result) 등록/수정 API 및 계획 매핑 로직
*   **[FE]** 캘린더 뷰(Calendar View) 구현 및 일정 표시
*   **[FE]** 실적 팝업(상세 정보 입력) 및 계획-실적 매칭 UI

### 산출물
*   Google Calendar 일정의 시스템 내 표시
*   실적 데이터 생성 및 계획과의 연결

---

## Sprint 4: 대시보드 및 MVP 런칭 (Dashboard & Launch)
**목표**: 축적된 데이터를 시각화하고, 전체 시스템 통합 테스트 후 MVP를 배포한다.

### 주요 태스크 (Backlog)
*   **[BE]** KPI 달성률 계산 로직 및 통계 API 구현
*   **[BE]** 개인/팀/본부별 실적 집계 쿼리 최적화
*   **[FE]** 대시보드 UI 구현 (차트, 요약 카드)
*   **[QA]** 전체 프로세스 통합 테스트 (E2E) 및 버그 수정
*   **[DevOps]** 운영 서버(Staging/Production) 배포 파이프라인 구축

### 산출물
*   완성된 MVP 서비스
*   개인/조직별 성과 대시보드

---

## 향후 계획 (Post-MVP)
*   **Sprint 5**: Google Calendar 양방향 동기화 및 알림 시스템
*   **Sprint 6**: 리포트 자동 생성(PDF) 및 관리자 기능 고도화
