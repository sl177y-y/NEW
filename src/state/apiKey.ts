import { create } from 'zustand';

interface ApiKeyState {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
})); 