// generateContent.js
import fs from "fs";
import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables");
  process.exit(1);
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Define the prompt for LinkedIn post generation
const prompt = `
You are an AI that writes engaging LinkedIn posts. 
Create a professional, concise, and insightful post about "AI + Automation in Data Science".
Make it sound natural, friendly, and structured with short paragraphs and bullet points if needed.
Add a relevant call-to-action at the end.
Do NOT use hashtags, emojis, or greetings like 'Hi everyone'.
`;

async function generatePost() {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const post =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ No content generated";

    console.log("✅ Generated Content:\n", post);

    // Save to file for GitHub Action
    fs.writeFileSync("post.txt", post, "utf8");
  } catch (err) {
    console.error("❌ Error generating content:", err);
    process.exit(1);
  }
}

generatePost();
