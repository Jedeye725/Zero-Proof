import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;
const PROFILE_FILE_PATH = path.join(process.cwd(), "profile.json");

app.use(express.json());

// Load or initialize default profile state
function getProfile(): any {
  if (fs.existsSync(PROFILE_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(PROFILE_FILE_PATH, "utf-8"));
    } catch (e) {
      console.error("Error reading profile.json, initializing default", e);
    }
  }
  return null; // Let the frontend send its initial loaded profile if no server-side backup exists
}

function saveProfile(profile: any) {
  try {
    fs.writeFileSync(PROFILE_FILE_PATH, JSON.stringify(profile, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving profile.json", e);
  }
}

// REST endpoints
app.get("/api/profile", (req, res) => {
  const profile = getProfile();
  if (profile) {
    res.json({ success: true, profile });
  } else {
    res.json({ success: false, message: "No stored profile found" });
  }
});

app.post("/api/profile", (req, res) => {
  const profile = req.body;
  if (!profile || typeof profile !== "object") {
    return res.status(400).json({ success: false, message: "Invalid profile data" });
  }
  saveProfile(profile);
  res.json({ success: true });
});

// AI Encouragement text generator
app.post("/api/generate-encouragement", async (req, res) => {
  const { streakInfo, drinkHistory, currentDayLog } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not set or has placeholder value. Using mock fallback encouragement.");
    return res.json({
      success: true,
      text: "You are doing incredibly well. Every hour, every day, and every sober breath is an investment in your safety, health, and bright future. Keep going!"
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const prompt = `
Generate a compassionate, empathetic, realistic, and short (max 150 characters, like an SMS text alert) message of encouragement for a person tracking their alcohol recovery journey.

Context:
- Current sober streak: ${streakInfo.days} days, ${streakInfo.weeks} weeks, ${streakInfo.months} months.
- They started their recovery on: ${streakInfo.startDate || 'unknown'}.
- Recent drinking state: ${currentDayLog ? `Today they logged alcohol level as "${currentDayLog.status}"` : 'Sober or undetermined log today'}.
- Brief drinking history context: ${JSON.stringify(drinkHistory || {})}

Tone Guidelines:
- Highly supportive, non-judgmental, direct, and encouraging.
- Never use flowery language. Act like a trusted, caring companion.
- Max 150 characters. Must be suitable for checking at any random time off-guard.
- Do not add quotes, introductions, or metadata. Return ONLY the alert message text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const txt = response.text?.trim() || "Every sober moment is a victory. Proud of you for staying committed to your path today. Keep checking in!";
    res.json({ success: true, text: txt });
  } catch (error: any) {
    console.error("Gemini content generation failed:", error);
    res.json({
      success: true,
      text: "Progress isn't a straight line, it's a commitment. One day at a time, you are building a healthier and brighter tomorrow. Keep going!"
    });
  }
});

// AI custom advisory sobriety tip generator
app.post("/api/generate-tip", async (req, res) => {
  const { pathway, activeStreakCount, drinkHistory, simulatedDateStr } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not set or has placeholder value. Using fallback AI tip.");
    return res.json({
      success: true,
      tip: {
        id: "ai-fallback-static",
        title: pathway === "quit" ? "Deep Rooting Your Streaks" : "Maintaining Delay Momentum",
        category: "Mindset",
        content: pathway === "quit"
          ? "Your brain cells are currently in active chemical withdrawal transition. Staying clean for several days signals neural receptors to decrease physical visual cue sensitivity. Celebrate your clarity."
          : "Work on delaying. Moving your first standard drink hour later in the evening prevents continuous cognitive trigger responses, allowing liver and metabolic cells to start self-clearing safely.",
        action: "List one visual cue that you can physically remove or hide inside your living room right now."
      }
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const prompt = `
Generate a highly personalized, practical, evidence-based sobriety advice tip and a corresponding active challenge action.
The recommendation MUST match their current recovery profile:
- Pathway style: "${pathway}" (quit completely OR reduce gradually)
- Active continuous dry streak days count: ${activeStreakCount} days.
- Recent logging history: ${JSON.stringify(drinkHistory || {})}
- Currently selected simulated date: ${simulatedDateStr || 'today'}

Return raw JSON schema matching this exact structure:
{
  "title": "Title of the tip (creative, concise, 2-5 words)",
  "category": "Cravings", "Mindset", "Physical", "Social", or "Taper/Safety",
  "content": "2-3 sentences of empathetic, medical-grade behavioral advice explaining why and how this works.",
  "action": "One specific, immediate, actionable physical/mental challenge for the user to complete today."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            content: { type: Type.STRING },
            action: { type: Type.STRING }
          },
          required: ["title", "category", "content", "action"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Empty response text from Gemini API");

    const parsedData = JSON.parse(textOutput.trim());
    return res.json({
      success: true,
      tip: {
        id: "ai-" + Date.now(),
        title: parsedData.title,
        category: parsedData.category,
        content: parsedData.content,
        action: parsedData.action
      }
    });
  } catch (error: any) {
    console.error("Gemini custom tip generator failed:", error);
    res.json({
      success: true,
      tip: {
        id: "ai-fallback-err",
        title: "Sensory Grounding Routine",
        category: "Cravings",
        content: "Under high trigger fatigue, your cortex struggles to reject habits. Displace the automatic impulse by shocking your sensory systems with temperature contrast or brisk physical work.",
        action: "Splash freezing cold water on your face twice or hold an ice cube for 60 seconds."
      }
    });
  }
});

// Configure Vite and static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for all SPA routes in Express v4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
