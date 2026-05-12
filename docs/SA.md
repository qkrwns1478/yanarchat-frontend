# Yanarchat Frontend — 시스템 아키텍처 문서

## 1. 개요

Yanarchat는 사용자가 AI 캐릭터 페르소나를 직접 생성하고, 그 캐릭터와 자연스러운 대화를 나눌 수 있는 웹 서비스다. 프론트엔드는 Next.js, 백엔드는 Spring Boot(`localhost:8080`), AI 추론은 LM Studio 로컬 모델을 사용한다.

---

## 2. 전체 시스템 구성

```
┌─────────────────────────────────────────┐
│               Browser                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       Next.js App Router         │    │
│  │  (Pages / Components / Hooks)    │    │
│  └──────────────┬──────────────────┘    │
└─────────────────┼───────────────────────┘
                  │ REST + SSE
                  │ JWT Bearer
┌─────────────────▼───────────────────────┐
│       Spring Boot Backend               │
│           localhost:8080                │
│                                         │
│  Auth  │  Character  │  Conversation    │
│        │             │  Memory          │
└───────────────────┬─────────────────────┘
                    │
          ┌─────────▼──────────┐
          │     LM Studio       │
          │  (Local AI Model)   │
          └────────────────────┘
```

---

## 3. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS (권장) |
| 상태 관리 | React Context + useState / zustand (권장) |
| 서버 통신 | fetch API, SSE (`EventSource`) |
| 인증 | JWT (Access Token + Refresh Token) |
| AI 모델 | LM Studio (로컬, 백엔드에서 호출) |
| 백엔드 | Spring Boot (`localhost:8080`) |

---

## 4. 인증 아키텍처

### 토큰 전략

- **Access Token**: API 요청 헤더에 포함 (`Authorization: Bearer <token>`)
- **Refresh Token**: 만료 시 `/api/auth/refresh`로 재발급

### 인증 흐름

```
[사용자 로그인]
     │
     ▼
POST /api/auth/login
     │
     ▼
TokenResponse { accessToken, refreshToken }
     │
     ├── accessToken → 메모리(zustand / Context)
     └── refreshToken → httpOnly Cookie 또는 localStorage
     
[API 요청 시]
     │
     ▼
Authorization: Bearer {accessToken} 헤더 첨부
     │
  401 응답 시
     │
     ▼
POST /api/auth/refresh { refreshToken }
     │
     ▼
새 accessToken 발급 → 원래 요청 재시도
```

### 인증 관련 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/refresh` | Access Token 재발급 |
| POST | `/api/auth/logout` | 로그아웃 |

---

## 5. 도메인 모델

### Character

AI 캐릭터 페르소나 엔티티. 사용자가 이름과 설명을 입력하면 백엔드가 AI를 통해 나머지 속성을 자동 생성한다.

```
CharacterResponse
  ├── id: UUID
  ├── name: string
  ├── personaDescription: string     # 사용자 입력
  ├── speechStyle: string            # AI 생성
  ├── personality: string            # AI 생성
  ├── traits: string[]               # AI 생성
  ├── background: string             # AI 생성
  ├── systemPrompt: string           # AI 생성 (대화 시 사용)
  ├── avatarUrl: string
  ├── files: FileInfo[]              # 첨부 파일
  ├── createdAt: datetime
  └── updatedAt: datetime

CharacterSummary (목록용)
  ├── id, name, personality, avatarUrl, createdAt
```

### Conversation & Message

```
ConversationResponse
  ├── id: UUID
  ├── characterId: UUID
  ├── characterName: string
  ├── title: string
  └── createdAt: datetime

ConversationDetail (상세 — 메시지 포함)
  ├── id, characterId, characterName, title
  └── messages: MessageResponse[]
        ├── id: UUID
        ├── role: "user" | "assistant"
        ├── content: string
        └── createdAt: datetime
```

### Memory

캐릭터가 대화 중 학습하는 장기 기억.

```
MemoryResponse
  ├── id: UUID
  ├── content: string
  ├── memoryType: string    # 기억 분류 (e.g., "fact", "preference")
  └── createdAt: datetime
```

---

## 6. API 명세 요약

### Character API

| 메서드 | 경로 | 설명 | 요청 |
|--------|------|------|------|
| GET | `/api/characters` | 내 캐릭터 목록 | — |
| POST | `/api/characters` | 캐릭터 생성 | `name`, `personaDescription` (query) + `files` (multipart) |
| GET | `/api/characters/{id}` | 캐릭터 상세 | — |
| PUT | `/api/characters/{id}` | 캐릭터 수정 | `name`, `personaDescription` (query) + `files` (multipart) |
| DELETE | `/api/characters/{id}` | 캐릭터 삭제 | — |

### Conversation API

| 메서드 | 경로 | 설명 | 요청 |
|--------|------|------|------|
| GET | `/api/conversations` | 대화 목록 | `characterId?`, `page`, `size` |
| POST | `/api/conversations` | 대화 생성 | `{ characterId, title }` |
| GET | `/api/conversations/{id}` | 대화 상세 (메시지 포함) | `page`, `size` |
| DELETE | `/api/conversations/{id}` | 대화 삭제 | — |
| POST | `/api/conversations/{id}/messages` | 메시지 전송 (SSE) | `{ content }` |

### Memory API

| 메서드 | 경로 | 설명 | 요청 |
|--------|------|------|------|
| GET | `/api/characters/{id}/memories` | 기억 목록 | `type?` |
| DELETE | `/api/characters/{id}/memories/{memoryId}` | 기억 삭제 | — |

---

## 7. SSE 스트리밍 메시지 흐름

메시지 전송은 SSE(Server-Sent Events)로 AI 응답을 실시간 스트리밍한다.

```
[사용자 메시지 입력]
         │
         ▼
POST /api/conversations/{conversationId}/messages
  Body: { content: "..." }
         │
         ▼
  응답: SseEmitter (text/event-stream)
         │
    ┌────┴─────────────┐
    │  SSE 이벤트 수신   │
    │  token by token  │
    └────┬─────────────┘
         │
         ▼
  UI에 글자 단위로 누적 렌더링
         │
         ▼
  스트림 종료 → 완성된 메시지 확정
```

### 프론트엔드 SSE 구현 포인트

- `fetch`의 `ReadableStream`을 사용하거나 `EventSource`를 사용
- POST 요청이므로 `EventSource`(GET 전용)는 사용 불가 → `fetch` + `response.body.getReader()` 패턴 권장
- 스트리밍 중 사용자가 전송 버튼 비활성화 처리 필요

---

## 8. 프론트엔드 라우트 구조 (Next.js App Router)

```
app/
├── (auth)/
│   ├── login/          # 로그인 페이지
│   └── signup/         # 회원가입 페이지
├── characters/
│   ├── page.tsx        # 캐릭터 목록
│   ├── new/
│   │   └── page.tsx    # 캐릭터 생성
│   └── [characterId]/
│       ├── page.tsx    # 캐릭터 상세 / 수정
│       └── memories/
│           └── page.tsx  # 기억 관리
├── conversations/
│   ├── page.tsx        # 대화 목록
│   └── [conversationId]/
│       └── page.tsx    # 대화 화면 (채팅)
└── layout.tsx          # 전역 레이아웃 (인증 상태 Provider)
```

---

## 9. 컴포넌트 구조

```
components/
├── auth/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── character/
│   ├── CharacterCard.tsx       # 목록 카드
│   ├── CharacterForm.tsx       # 생성/수정 폼
│   └── CharacterDetail.tsx     # 상세 정보 표시
├── conversation/
│   ├── ConversationList.tsx
│   ├── MessageBubble.tsx       # 단일 메시지
│   ├── MessageList.tsx         # 메시지 스크롤 뷰
│   └── MessageInput.tsx        # 입력창 + 전송 버튼
├── memory/
│   ├── MemoryList.tsx
│   └── MemoryItem.tsx
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    └── Avatar.tsx
```

---

## 10. 상태 관리 전략

| 상태 | 방식 | 이유 |
|------|------|------|
| 인증 (토큰, 사용자 정보) | Context + Provider | 앱 전역 공유 |
| 캐릭터 목록 | 서버 컴포넌트 또는 SWR/TanStack Query | 서버 데이터, 캐싱 이점 |
| 대화 메시지 | useState + SSE 누적 | 실시간 스트리밍 필요 |
| 기억 목록 | SWR/TanStack Query | 서버 데이터 |
| UI 상태 (모달 등) | 컴포넌트 로컬 useState | 전역 공유 불필요 |

---

## 11. API 클라이언트 설계

```typescript
// lib/api/client.ts
// 모든 요청에 JWT를 자동 첨부하고, 401 시 토큰 재발급 후 재시도
async function apiFetch(path: string, options?: RequestInit): Promise<Response>

// lib/api/auth.ts
export const authApi = { login, signup, refresh, logout }

// lib/api/characters.ts
export const characterApi = { list, create, get, update, delete }

// lib/api/conversations.ts
export const conversationApi = { list, create, get, delete, sendMessage }

// lib/api/memories.ts
export const memoryApi = { list, delete }
```

`sendMessage`는 SSE 스트림을 반환하므로 별도 처리:

```typescript
async function* sendMessage(
  conversationId: string,
  content: string
): AsyncGenerator<string>
```

---

## 12. 환경 변수

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## 13. 핵심 기능 구현 흐름 요약

### 캐릭터 생성

1. 사용자가 이름 + 페르소나 설명 + 아바타 파일 입력
2. `POST /api/characters` (multipart/form-data)
3. 백엔드가 LM Studio를 통해 `speechStyle`, `personality`, `traits`, `background`, `systemPrompt` 자동 생성
4. 생성된 `CharacterResponse`로 상세 페이지 이동

### 채팅

1. 대화 없을 시 `POST /api/conversations`로 대화 생성
2. 사용자 메시지 입력 → `POST /api/conversations/{id}/messages`
3. SSE 스트림을 읽으며 AI 응답 토큰을 화면에 실시간 추가
4. 스트림 종료 시 전송 버튼 활성화

### 기억 관리

1. `GET /api/characters/{id}/memories` 로 기억 목록 조회
2. 불필요한 기억은 `DELETE /api/characters/{id}/memories/{memoryId}` 로 삭제
3. 기억 생성은 대화 과정에서 백엔드가 자동으로 수행 (프론트엔드에서 직접 생성 API 없음)
