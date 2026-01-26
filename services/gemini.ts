
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectStructure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateReactCode = async (
  html: string,
  styles: any,
  url: string
): Promise<ProjectStructure> => {
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    You are a world-class senior frontend engineer and UI/UX expert.
    Your task is to recreate a website's UI from provided raw HTML and computed styles.
    
    GOAL:
    Convert the raw data into a modern, clean, and modular Next.js (App Router) project using Tailwind CSS.
    
    CONSTRAINTS:
    - Use React Functional Components with TypeScript.
    - Use Tailwind CSS for all styling. No custom CSS files.
    - Prefer semantic HTML (header, nav, main, section, footer).
    - Group logical UI blocks into separate components in 'components/' directory.
    - 'app/page.tsx' should be the main entry point assembling the sections.
    - Use 'lucide-react' icons where appropriate (simulated via standard SVGs).
    - Ensure the layout is responsive (mobile-first).
    - Remove tracking scripts, ads, and unnecessary boilerplate.
    
    OUTPUT FORMAT:
    You MUST return a JSON object with a 'files' property.
    'files' MUST be an ARRAY of objects, where each object contains:
    - 'path': The full file path (e.g., "components/Header.tsx").
    - 'content': The full string content of the file.
    
    Example Structure:
    {
      "files": [
        { "path": "app/layout.tsx", "content": "..." },
        { "path": "app/page.tsx", "content": "..." },
        { "path": "components/Header.tsx", "content": "..." }
      ]
    }
  `;

  const prompt = `
    Analyze the following website data:
    URL: ${url}
    
    HTML SNIPPET:
    ${html.substring(0, 10000)}
    
    COMPUTED STYLES KEY-VALUES:
    ${JSON.stringify(styles).substring(0, 5000)}
    
    Please generate the complete project files for this landing page.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: {
                  type: Type.STRING,
                  description: "The full path of the file including directory."
                },
                content: {
                  type: Type.STRING,
                  description: "The source code content of the file."
                }
              },
              required: ["path", "content"]
            }
          }
        },
        required: ["files"]
      }
    }
  });

  try {
    const rawResult = JSON.parse(response.text);
    
    // Transform the array of file objects back into the dictionary format expected by the UI
    const filesMap: { [path: string]: string } = {};
    if (Array.isArray(rawResult.files)) {
      rawResult.files.forEach((file: { path: string, content: string }) => {
        filesMap[file.path] = file.content;
      });
    }

    return { files: filesMap };
  } catch (err) {
    console.error("Failed to parse Gemini response:", err);
    throw new Error("Invalid response format from AI");
  }
};
