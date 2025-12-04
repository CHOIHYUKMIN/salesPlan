# ERP 시스템 아키텍처 및 프로세스 다이어그램

`erp_plan.md`를 기반으로 한 전체 시스템 아키텍처와 핵심 프로세스 흐름도입니다.

## 1. 전체 시스템 아키텍처

시스템은 사용자(Web), ERP 코어 서버, 데이터베이스, 그리고 외부 서비스(Google Calendar)로 구성됩니다.

```mermaid
graph TD
    subgraph Client ["클라이언트 계층"]
        WebBrowser["웹 브라우저 (사용자 인터페이스)"]
    end

    subgraph Server ["서버 계층"]
        APIGateway["API 게이트웨이 / 로드 밸런서"]
        AuthService["인증 서비스 (SSO/JWT)"]
        PlanService["계획 관리 서비스"]
        ResultService["실적 및 KPI 서비스"]
        SyncService["Google Calendar 동기화 서비스"]
        BatchJob["배치 스케줄러"]
    end

    subgraph Data ["데이터 계층"]
        MainDB[("주 데이터베이스 (RDBMS)")]
        Redis[("캐시 (Redis)")]
    end

    subgraph External ["외부 서비스"]
        GCalAPI["Google Calendar API"]
    end

    %% 연결
    WebBrowser -->|HTTPS| APIGateway
    APIGateway --> AuthService
    APIGateway --> PlanService
    APIGateway --> ResultService
    
    PlanService --> MainDB
    ResultService --> MainDB
    
    SyncService -->|양방향 동기화| GCalAPI
    SyncService --> MainDB
    
    BatchJob -->|트리거| SyncService
    BatchJob -->|일간/월간 집계| ResultService
```

## 2. 핵심 프로세스 흐름

연간 계획 수립부터 월간 계획 상세화, 실행(Google Calendar 연동), 그리고 실적 분석 및 피드백까지의 흐름입니다.

```mermaid
flowchart TD
    %% 노드
    Start((시작))
    
    subgraph AnnualPlan ["1. 연간 계획 수립"]
        SetYearGoal["연간 목표 및 KPI 설정"]
        ApproveYear["연간 계획 승인"]
    end
    
    subgraph MonthlyPlan ["2. 월간 계획 수립"]
        CreateMonth["월간 계획 생성"]
        ImportYear["연간 계획 매핑"]
        DetailPlan["상세 태스크 정의"]
        ApproveMonth["월간 계획 승인"]
    end
    
    subgraph Execution ["3. 실행 및 실적"]
        Work["일일 업무 / 미팅"]
        GCal["Google Calendar"]
        Sync["자동 동기화 시스템"]
        ManualInput["실적 수동 입력"]
        ResultData["실적 데이터"]
    end
    
    subgraph Review ["4. 검토 및 피드백"]
        Compare["계획 vs 실적 비교 (GAP)"]
        KPICalc["KPI 점수 산출"]
        Dashboard["대시보드 및 리포팅"]
    end

    %% 흐름
    Start --> SetYearGoal
    SetYearGoal --> ApproveYear
    ApproveYear --> CreateMonth
    
    CreateMonth --> ImportYear
    ImportYear --> DetailPlan
    DetailPlan --> ApproveMonth
    
    ApproveMonth --> Work
    
    Work -->|일정 등록| GCal
    Work -->|직접 입력| ManualInput
    
    GCal <-->|동기화| Sync
    Sync --> ResultData
    ManualInput --> ResultData
    
    ResultData --> Compare
    Compare --> KPICalc
    KPICalc --> Dashboard
    
    Dashboard -->|피드백| CreateMonth
```

## 3. 데이터 흐름 개요

1.  **계획**: 연간 계획이 월간 계획으로 구체화됩니다.
2.  **실행**: 사용자가 업무를 수행합니다. 미팅은 Google Calendar에서 관리됩니다.
3.  **동기화**: 시스템이 Google Calendar와 동기화하여 미팅 기록을 '실적'으로 가져옵니다.
4.  **분석**: 시스템이 '월간 계획'과 '실적'을 비교하여 KPI를 계산하고 대시보드에 표시합니다.
