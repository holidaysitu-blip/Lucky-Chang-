import { LuckyChang, User } from './types';

export const INITIAL_USER: User = {
  id: 'user_1',
  name: 'Panda',
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PandaElephant',
  balance: 1000,
  collection: [],
  generationCount: {
    pixel: 0,
    normal: 0,
    movie: 0,
    variant: 0,
    artbox: 0,
    diy: 0
  }
};

export const STYLE_LABELS: Record<string, string> = {
  pixel: '像素原力',
  normal: '经典纪元',
  movie: '影画传奇',
  variant: '异象觉醒',
  artbox: 'Artbox',
  diy: 'DIY 专属'
};
