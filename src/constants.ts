import { User } from "./types";
import { LUCKY_CHANG_SOURCE_IMAGE } from "./services/gemini";

export const INITIAL_USER: User = {
  id: "user_1",
  name: "Lucky Chang",
  avatar: LUCKY_CHANG_SOURCE_IMAGE,
  balance: 1000,
  collection: [
    {
      id: "lc_source",
      name: "小吉象 Lucky Chang",
      style: "normal",
      level: 1,
      image: LUCKY_CHANG_SOURCE_IMAGE,
      ownerId: "user_1",
      ownerName: "Lucky Chang",
      traits: ["固定主体", "幸运陪伴", "主题延展"],
      description: "用户提供的 Lucky Chang 小黄象本体图。后续生成只改变主题、场景、服饰和道具，主体保持不变。",
      stats: { happiness: 100, energy: 100, social: 100 },
    },
  ],
  generationCount: {
    pixel: 0,
    normal: 0,
    movie: 0,
    variant: 0,
    artbox: 0,
    diy: 0,
  },
};

export const STYLE_LABELS: Record<string, string> = {
  pixel: "像素主题",
  normal: "经典主题",
  movie: "电影主题",
  variant: "奇幻主题",
  artbox: "Artbox",
  diy: "DIY 专属",
};
