import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function generateContent() {
  try {
    const prompt = "Generate a professional LinkedIn post about AI and productivity.";
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating content:", error.response?.data || error.message);
    return "Automation test post.";
  }
}

async function postToLinkedIn(content) {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:YOUR_LINKEDIN_USER_ID`, // Replace with your LinkedIn URN
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Post published:", response.data);
  } catch (error) {
    console.error("❌ LinkedIn post failed:", error.response?.data || error.message);
  }
}

(async () => {
  const content = await generateContent();
  console.log("Generated Post:", content);
  await postToLinkedIn(content);
})();
