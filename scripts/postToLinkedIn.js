import fs from "fs";
import fetch from "node-fetch";

async function postToLinkedIn() {
  try {
    // 1. Read post content from file
    const postText = fs.readFileSync("linkedin_post.txt", "utf-8").trim();
    if (!postText) {
      throw new Error("linkedin_post.txt is empty");
    }

    // 2. Get access token from environment variable
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Missing LINKEDIN_ACCESS_TOKEN environment variable");
    }

    // 3. (Optional) Replace with your LinkedIn User URN or Organization URN
    // Example: "urn:li:person:xxxxxxxx" or "urn:li:organization:xxxxxx"
    const authorUrn = process.env.LINKEDIN_AUTHOR_URN; 

    if (!authorUrn) {
      throw new Error("Missing LINKEDIN_AUTHOR_URN environment variable");
    }

    // 4. LinkedIn API endpoint
    const url = "https://api.linkedin.com/v2/ugcPosts";

    // 5. Request body (UGC post with text only)
    const body = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postText,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS",
      },
    };

    // 6. API call
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LinkedIn API Error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ Post published successfully:", data);

  } catch (err) {
    console.error("❌ Error posting to LinkedIn:", err.message);
    process.exit(1);
  }
}

postToLinkedIn();
