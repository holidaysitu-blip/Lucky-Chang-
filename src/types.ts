export type ChangStyle = 'pixel' | 'normal' | 'movie' | 'variant' | 'artbox' | 'diy';

export interface LuckyChang {
  id: string;
  name: string;
  style: ChangStyle;
  level: number;
  image: string;
  ownerId?: string;
  ownerName?: string;
  traits: string[];
  description: string;
  location?: string;
  age?: number;
  type?: string;
  stats: {
    happiness: number;
    energy: number;
    social: number;
  };
  isDIY?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  collection: LuckyChang[];
  generationCount: Record<ChangStyle, number>;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}
