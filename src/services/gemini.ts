import { GoogleGenAI, Type } from "@google/genai";
import { ChangStyle, LuckyChang } from "../types";

export const LUCKY_CHANG_SOURCE_IMAGE = `${import.meta.env.BASE_URL}lucky-chang.jpg`;

const STYLE_GUIDES: Record<ChangStyle, string> = {
  pixel: "retro 8-bit pixel art theme, blocky background and pixel props",
  normal: "clean cute commercial cartoon illustration theme",
  movie: "cinematic poster theme with dramatic lighting and film-like scene",
  variant: "surreal fantasy theme while the mascot body stays unchanged",
  artbox: "designer toy and collectible packaging theme",
  diy: "custom user-requested theme",
};

async function getBase64FromUrl(url: string): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const data = Buffer.from(buffer).toString("base64");
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  return { data, mimeType };
}

function buildThemePrompt(style: ChangStyle, prompt?: string) {
  const userTheme = prompt?.trim() || "a bright lucky theme";

  return `
Use the provided Lucky Chang image as the exact character identity reference.

Core rule: keep the same mascot, not a redesign. The subject must remain the same yellow cartoon elephant from the reference image.

Must preserve: yellow cartoon elephant body, large round ears, brown round eyes, small eyebrows, curved elephant trunk, white tusks, white belly, cute rounded proportions, friendly raised-hand greeting pose, warm lucky child-friendly feeling.

Allowed to change only: background, scene, clothing accessories, small props, lighting, composition, and theme atmosphere.

Do not change the species, body color, face structure, ears, trunk, tusks, white belly, or friendly pose. Do not create a different elephant character.

Style direction: ${STYLE_GUIDES[style]}.
Theme request: ${userTheme}.

Create an image where the same Lucky Chang mascot appears in this theme. Return only the image.
`;
}

function fallbackLuckyChang(style: ChangStyle, prompt?: string): Partial<LuckyChang> {
  const theme = prompt?.trim() || STYLE_GUIDES[style];

  return {
    name: "主题小吉象",
    traits: ["主体不变", "主题延展", "好运陪伴"],
    description: `以原始 Lucky Chang 小黄象为本体，预览主题：${theme}。正式配置 GEMINI_API_KEY 后会生成对应主题图片。`,
    style,
    image: LUCKY_CHANG_SOURCE_IMAGE,
    level: 1,
    stats: { happiness: 100, energy: 100, social: 100 },
  };
}

export async function generateLuckyChang(style: ChangStyle, prompt?: string): Promise<Partial<LuckyChang>> {
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fallbackLuckyChang(style, prompt);
  }

  const ai = new GoogleGenAI({ apiKey });
  const themePrompt = buildThemePrompt(style, prompt);

  let textData: Pick<LuckyChang, "name" | "traits" | "description">;
  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `
You write short Chinese product copy for Lucky Chang, a fixed yellow cartoon elephant mascot.
The image generation changes theme, scene, accessories, and background only. The mascot identity stays unchanged.
Return JSON only.
`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            traits: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
          },
          required: ["name", "traits", "description"],
        },
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Style: ${style}. Theme: ${prompt || "surprise me"}. Keep Lucky Chang as the same mascot.`,
            },
          ],
        },
      ],
    });
    textData = JSON.parse(textResponse.text);
  } catch (error) {
    console.error("Text generation failed:", error);
    textData = {
      name: "主题小吉象",
      traits: ["主体不变", "主题延展", "好运陪伴"],
      description: "以原始 Lucky Chang 小黄象为本体，只改变主题场景、道具和氛围。",
    };
  }

  let imageUrl = LUCKY_CHANG_SOURCE_IMAGE;
  try {
    const mascotImg = await getBase64FromUrl(LUCKY_CHANG_SOURCE_IMAGE);
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: mascotImg.data,
              mimeType: mascotImg.mimeType,
            },
          },
          { text: themePrompt },
        ],
      },
    });

    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
    imageUrl = LUCKY_CHANG_SOURCE_IMAGE;
  }

  return {
    ...textData,
    style,
    image: imageUrl,
    level: 1,
    stats: { happiness: 100, energy: 100, social: 100 },
  };
}
