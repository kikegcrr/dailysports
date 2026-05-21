"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface VoiceArticle {
  title: string;
  text: string;
}

interface VoiceReaderContextType {
  article: VoiceArticle | null;
  playerOpen: boolean;
  openWithArticle: (a: VoiceArticle) => void;
  setPlayerOpen: (open: boolean) => void;
}

export const VoiceReaderContext = createContext<VoiceReaderContextType>({
  article: null,
  playerOpen: false,
  openWithArticle: () => {},
  setPlayerOpen: () => {},
});

export function VoiceReaderProvider({ children }: { children: ReactNode }) {
  const [article, setArticle] = useState<VoiceArticle | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const openWithArticle = useCallback((a: VoiceArticle) => {
    setArticle(a);
    setPlayerOpen(true);
  }, []);

  return (
    <VoiceReaderContext.Provider value={{ article, playerOpen, openWithArticle, setPlayerOpen }}>
      {children}
    </VoiceReaderContext.Provider>
  );
}

export const useVoiceReader = () => useContext(VoiceReaderContext);
