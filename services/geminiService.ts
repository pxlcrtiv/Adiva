
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AdContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const adContentSchema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "A short, attention-grabbing headline (max 40 characters)."
    },
    body: {
      type: Type.STRING,
      description: "The main ad copy, persuasive and engaging (2-3 sentences, max 280 characters)."
    },
    callToAction: {
      type: Type.STRING,
      description: "A clear and concise call to action (e.g., 'Shop Now', 'Learn More')."
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 3-5 relevant hashtags as strings, without the '#' symbol."
    }
  },
  required: ["headline", "body", "callToAction", "hashtags"]
};


export const generateAdCopy = async (
  platform: string,
  productName: string,
  description: string,
  audience: string
): Promise<AdContent> => {
  const prompt = `
    You are an expert marketing copywriter specializing in high-converting digital ads.
    Generate an ad for the platform: ${platform}.

    Product Name: ${productName}
    Product Description: ${description}
    Target Audience: ${audience}

    Your response must be a single, valid JSON object that adheres to the provided schema. Do not include any text, code block markers, or formatting before or after the JSON object.

    The ad should be engaging, persuasive, and perfectly tailored to the specified platform and audience.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: adContentSchema,
      },
    });

    const text = response.text.trim();
    const parsedJson = JSON.parse(text);

    return parsedJson as AdContent;

  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw new Error("Failed to generate ad copy. Please try again.");
  }
};

export const generateAdImage = async (
  productName: string,
  description: string,
  audience: string
): Promise<string> => {
  const prompt = `Create a visually appealing and professional advertisement image for a product.
  Product Name: "${productName}"
  Description: "${description}"
  Target Audience: "${audience}"
  The image should be high-quality, vibrant, and suitable for a social media ad campaign. Focus on the product's essence and appeal to the target demographic. Do not include any text, logos, or brand names in the image.`;

  try {
    const textPart = { text: prompt };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [textPart] },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("The AI did not return a valid response.");
    }
    
    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        break; 
      }
    }

    if (!imageUrl) {
      throw new Error("The AI did not return an image. Please try a different prompt.");
    }
    return imageUrl;
  } catch (error) {
    console.error("Error generating ad image:", error);
    throw new Error("Failed to generate ad image. Please try again.");
  }
};


export const generateOrEditImage = async (
  prompt: string,
  images: { mimeType: string; data: string }[]
): Promise<{ imageUrl: string; textResponse?: string }> => {
  try {
    const imageParts = images.map(image => ({
      inlineData: { data: image.data, mimeType: image.mimeType },
    }));
    const textPart = { text: prompt };

    const parts = images.length > 0 ? [...imageParts, textPart] : [textPart];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: parts },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    let imageUrl = '';
    let textResponse = '';

    if (!response.candidates || response.candidates.length === 0) {
       throw new Error("The AI did not return a valid response.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textResponse += part.text + ' ';
      } else if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      }
    }

    if (!imageUrl) {
      throw new Error("The AI did not return an image. Please try a different prompt.");
    }
    
    return { imageUrl, textResponse: textResponse.trim() };
    
  } catch(error) {
    console.error("Error in image generation/editing:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred during image processing.";
    throw new Error(message);
  }
};
