import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Pre-written rich educational fallbacks for Cosmo when offline or if API key is not set
const fallbackFacts = [
  "Did you know? A day on Venus is longer than a year on Venus! It rotates super slowly backwards!",
  "Fun fact! Olympus Mons on Mars is the biggest volcano in our whole Solar System—three times taller than Mount Everest!",
  "Hold onto your helmet! Saturn's rings aren't solid—they are made of billions of pieces of glittering water ice, rock, and dust!",
  "Astronaut secret: In zero gravity, astronauts grow about 2 inches taller because their spines relax and stretch!",
  "Cosmic mystery: The Moon has no atmosphere or wind, so the Apollo astronauts' footprints will stay there for millions of years!",
  "Super speed: Light from our Sun travels at 300,000 km per second, taking about 8 minutes and 20 seconds to reach Earth!",
  "Jupiter's Great Red Spot is a giant spinning storm that has been raging for over 300 years and is bigger than planet Earth!",
  "On Mars, sunsets look blue because the fine red dust scatters red light and lets blue light through!"
];

const fallbackCosmoAnswers: Record<string, string> = {
  blackhole: "A black hole is a region in space where gravity is so strong that not even light can escape! Think of it like a cosmic whirlpool created when huge stars collapse at the end of their lives.",
  gravity: "Gravity is the invisible attraction between anything with mass! The bigger the object, the stronger the pull. That's why Earth pulls you down, and why you'd bounce 6 times higher on the Moon!",
  moon: "The Moon is Earth's only natural satellite. It has no liquid water or breathable air, and its gravity is only 1/6th of Earth's. Driving a lunar rover feels like gliding across a trampoline!",
  mars: "Mars is nicknamed the Red Planet because iron minerals in its soil oxidize (rust)! It has frozen polar ice caps, huge canyons, and two tiny potato-shaped moons named Phobos and Deimos.",
  rocket: "Rockets work thanks to Newton's 3rd Law of Motion: for every action, there is an equal and opposite reaction! Hot exhaust gas blasts downward at crazy speeds, pushing the rocket skyward into orbit!",
  sun: "The Sun is a glowing ball of hot plasma at the center of our solar system. It's so big that about 1.3 million Earths could fit inside it!",
  jupiter: "Jupiter is the giant king of planets! It has more than 95 known moons, including Europa (an icy moon with an ocean underneath) and Io (covered in active volcanoes)!"
};

// API: Chat with Cosmo AI Space Buddy
app.post('/api/cosmo/chat', async (req: Request, res: Response) => {
  try {
    const { message, missionContext, rank } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedMsg = message.trim().slice(0, 500);

    // If Gemini is available, query gemini-3.8-flash with kid-safe educational system instruction
    if (ai) {
      try {
        const systemPrompt = `You are COSMO, an adorable, enthusiastic, friendly alien companion and flight mentor in the kids' 3D game "ASTRO QUEST" (for children aged 8-14).
You have bright purple-teal antennae, love space science, and speak with excitement, warmth, and kid-friendly analogies.
Your rules:
1. Always be encouraging, kind, celebratory, and curious.
2. Explain space science, astrophysics, rockets, and astronomy simply and vividly (like a fun science show host).
3. Keep answers concise (2-4 sentences max) so it's easy for kids to read on screen.
4. If the user mentions their mission (${missionContext || 'exploring the hub'}), give a cheerful hint or fun tip.
5. Address the child as "Cadet" or "Astronaut" (current rank: ${rank || 'Cadet'}).
6. Never say you are an AI model or mention OpenAI/Google/prompts. You are Cosmo, their alien buddy from the Star Cluster Nebula!`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: trimmedMsg,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const reply = response.text?.trim() || "Bloop blip! Space waves got a little fuzzy, but I'm right here with you, Cadet!";
        return res.json({ reply, source: 'gemini' });
      } catch (geminiErr) {
        console.warn('Gemini request failed, falling back to smart educational responses:', geminiErr);
      }
    }

    // Smart kid-friendly fallback
    const lower = trimmedMsg.toLowerCase();
    let reply = "";

    for (const [key, answer] of Object.entries(fallbackCosmoAnswers)) {
      if (lower.includes(key)) {
        reply = `Bloop! Cosmo here! 🌟 ${answer}`;
        break;
      }
    }

    if (!reply) {
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        reply = "Zorp zorp! Greetings, Space Explorer! Cosmo is powered up and ready for flight! Ask me about planets, rockets, gravity, or tips for your missions!";
      } else if (lower.includes('hint') || lower.includes('help')) {
        reply = "Cosmo's Flight Tip: Keep your thrusters steady! Check the objective panel in your mission or explore the Solar System to collect Star Badges!";
      } else {
        const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        reply = `Awesome cosmic question, Cadet! Space is full of wonder! Here's a secret from my star charts: ${randomFact}`;
      }
    }

    return res.json({ reply, source: 'fallback' });
  } catch (err: any) {
    console.error('Error in /api/cosmo/chat:', err);
    return res.status(500).json({
      reply: "Bzzzt! Cosmo's space radio had static! Let's try again in a second, Cadet!",
      error: err.message
    });
  }
});

// API: Get quick random Cosmo space fact
app.get('/api/cosmo/fact', (_req: Request, res: Response) => {
  const fact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
  res.json({ fact });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`🚀 Astro Quest server running on http://localhost:${port}`);
  });
}

startServer();
