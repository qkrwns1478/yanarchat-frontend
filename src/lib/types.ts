export interface FileInfo {
  id: string;
  originalName: string;
  fileType: string;
}

export interface CharacterResponse {
  id: string;
  name: string;
  personaDescription: string;
  speechStyle: string;
  personality: string;
  traits: string[];
  background: string;
  systemPrompt: string;
  avatarUrl: string;
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  personality: string;
  avatarUrl: string;
  createdAt: string;
}

export interface ConversationResponse {
  id: string;
  characterId: string;
  characterName: string;
  title: string;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  characterId: string;
  characterName: string;
  title: string;
  updatedAt: string;
}

export interface ConversationPageResponse {
  content: ConversationSummary[];
  totalElements: number;
  totalPages: number;
}

export interface MessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ConversationDetail extends ConversationResponse {
  messages: MessageResponse[];
}

export interface MemoryResponse {
  id: string;
  content: string;
  memoryType: string;
  createdAt: string;
}
