import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

interface NewsItem {
  title: string;
  type: string;
  summary: string;
  source_link: string;
}

export const scheduledFetchNews = functions.pubsub
  .schedule("0 12 * * *") // Runs every day at 12:00 AM UTC
  .timeZone("UTC")
  .onRun(async () => {
    console.log("🚀 Starting scheduled news fetch...");
    let PERPLEXITY_API_KEY;
    try {
      PERPLEXITY_API_KEY = functions.config().perplexity.key;
      console.log("✅ API key found in config");
    } catch (error) {
      console.error("❌ Error getting API key from config:", error);
      throw new Error("Missing Perplexity API key in Firebase config");
    }

    const db = admin.firestore();

    try {
      console.log("📡 Fetching news from Perplexity API...");
      const options = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar-reasoning-pro",
          messages: [
            {
              role: "system",
              content: "Be precise and concise.",
            },
            {
              role: "user",
              content: "What are the 10 latest news of today related to AI, " +
                "ML and LLM in the world. It can be news, articles, blog posts, training etc. " +
                "For both technical and hobby. " +
                "Return only a JSON array with objects containing " +
                "{title, type, summary, source_link}. No other text. " +
                "Do not include any explanations, only return the JSON array.",
            },
          ],
          max_tokens: 5000,
          temperature: 0.2,
          top_p: 0.9,
        }),
      };
      const response = await fetch("https://api.perplexity.ai/chat/completions", options);
      const data = await response.json();
      const content = data.choices[0].message.content;
      console.log("🔍 Content:", content);
      // Extract JSON array from the response by finding the json code block
      const jsonMarker = "```json";
      const jsonStart = content.indexOf(jsonMarker);
      if (jsonStart === -1) {
        throw new Error("Invalid response format: Could not find JSON block");
      }
      const jsonContent = content.slice(jsonStart + jsonMarker.length);
      // Try to find the end marker, but if not found, try to parse until the end
      let jsonString = jsonContent;
      const jsonEnd = jsonContent.indexOf("```");
      if (jsonEnd !== -1) {
        jsonString = jsonContent.slice(0, jsonEnd);
      }
      try {
        // Parse the JSON content, trimming any whitespace
        const newsItems: NewsItem[] = JSON.parse(jsonString.trim());
        console.log(`📰 Received ${newsItems.length} news items`);
        // Create a batch write
        const batch = db.batch();
        console.log("🗑️ Deleting old news...");
        const oldNews = await db.collection("ai_news").get();
        console.log(`Found ${oldNews.docs.length} old items to delete`);
        oldNews.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        console.log("📝 Adding new news items...");
        // Add new news items
        newsItems.forEach((item) => {
          const docRef = db.collection("ai_news").doc();
          batch.set(docRef, {
            ...item,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

        await batch.commit();
        console.log("✨ Successfully completed news update");
        return null;
      } catch (error) {
        console.error("❌ Error in news fetch process:", error);
        throw error;
      }
    } catch (error) {
      console.error("❌ Error in news fetch process:", error);
      throw error;
    }
  });
