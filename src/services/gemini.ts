import { GoogleGenAI, Type } from "@google/genai";
import { ChangStyle, LuckyChang } from "../types";

const MASCOT_URL = "https://api.dicebear.com/7.x/notionists/svg?seed=LuckyElephant";

async function getBase64FromUrl(url: string): Promise<{ data: string, mimeType: string }> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const data = Buffer.from(buffer).toString('base64');
  const mimeType = response.headers.get('content-type') || 'image/png';
  return { data, mimeType };
}

export async function generateLuckyChang(style: ChangStyle, prompt?: string): Promise<Partial<LuckyChang>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // 1. Generate Text Details
  const textModel = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an AI designer for "Lucky Chang", a collection of lucky elephant characters.
    Generate a unique Lucky Chang character based on the requested style: ${style}.
    Styles:
    - pixel: Retro 8-bit aesthetic.
    - normal: Cute, modern 3D/2D illustration.
    - movie: Cinematic, detailed, inspired by famous films.
    - variant: Strange, anomalous, cosmic, or surreal versions.
    - artbox: Artistic, designer toy aesthetic, abstract patterns.
    - diy: Custom style based on user prompt.
    
    CRITICAL: The generated character MUST be a "Little Lucky Elephant" (小吉象). 
    CRITICAL: DO NOT include any humans, people, or human-like features in the image.
    CRITICAL: DO NOT include any flowers, floral patterns, or plants in the image.
    
    If a prompt is provided, incorporate it: ${prompt || 'Surprise me!'}
    
    Return the character details in JSON format.
  `;

  let textData: any = null;
  try {
    const textResponse = await ai.models.generateContent({
      model: textModel,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            traits: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
          },
          required: ["name", "traits", "description"]
        }
      },
      contents: [{ role: 'user', parts: [{ text: "Generate a new Lucky Chang character." }] }]
    });
    textData = JSON.parse(textResponse.text);
  } catch (error) {
    console.error("Text generation failed:", error);
    textData = {
      name: "神秘小吉象",
      traits: ["神秘", "未知"],
      description: "一只在时空裂缝中诞生的神秘小吉象。"
    };
  }

  // 2. Generate Image
  const imageModel = "gemini-2.5-flash-image";
  let imageUrl = "";
  try {
    const mascotImg = await getBase64FromUrl(MASCOT_URL);
    const imageResponse = await ai.models.generateContent({
      model: imageModel,
      contents: {
        parts: [
          {
            inlineData: {
              data: mascotImg.data,
              mimeType: mascotImg.mimeType,
            },
          },
          {
            text: `Generate a new Lucky Chang character image based on this mascot image. 
                   Style: ${style}. 
                   The new character should be a variation of the mascot but strictly in the requested style.
                   ${prompt ? `Incorporate these elements: ${prompt}` : ''}
                   Return only the image.`,
          },
        ],
      },
    });

    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
    // Fallback to style-based placeholders if generation fails
    const styleImages: Record<ChangStyle, string> = {
      pixel: MASCOT_URL,
      normal: MASCOT_URL,
      movie: MASCOT_URL,
      variant: MASCOT_URL,
      artbox: MASCOT_URL,
      diy: MASCOT_URL
    };
    imageUrl = styleImages[style];
  }

  return {
    ...textData,
    style,
    image: imageUrl,
    level: 1,
    stats: { happiness: 100, energy: 100, social: 100 }
  };
}
