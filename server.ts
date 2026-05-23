/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY" && API_KEY.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client successfully initialized.");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in high-fidelity fallback preview mode.");
}

// Ensure error responses always return fallback or standard json
const handleAndLogError = (error: any, res: Response, fallbackData: any, message: string) => {
  console.error(message, error);
  res.json({
    ...fallbackData,
    aiGenerated: false,
    debugInfo: error?.message || String(error),
    warning: "Running with fallback generation engine.",
  });
};

/* ==========================================
   1. AI CHARACTER GENERATION ENDPOINT
   ========================================== */
app.post("/api/character/generate", async (req: Request, res: Response): Promise<void> => {
  const { name, classType, gender, promptDescription } = req.body;

  const localFallbackCharacter = {
    id: `char_${Date.now()}`,
    name: name || "Astraea Nightrunner",
    gender: gender || "Female",
    classType: classType || "Cyberpunk Rogue",
    tagline: "Shadowing the grid, light-years ahead of the corporate hounds.",
    backstory: `${name || "Astraea"} was raised in the lower neon-soaked underbelly of Sector 7. After a corporate syndicate double-crossed their street gang, they integrated top-tier cybernetic sensory modules to wage a quiet digital and surgical war on the mega-conglomerates. Now wandering as an elite courier, no firewall or strike team can capture a trail.`,
    stats: {
      strength: Math.floor(Math.random() * 30) + 50,
      agility: Math.floor(Math.random() * 25) + 75,
      intellect: Math.floor(Math.random() * 20) + 70,
      charisma: Math.floor(Math.random() * 35) + 45,
      luck: Math.floor(Math.random() * 40) + 50,
    },
    abilities: [
      {
        name: "Neon Cloak",
        description: "Bends ambient light and holographic advertisements to turn fully invisible in metropolis gridlines.",
        powerCost: 25,
        abilityType: "Tactical Stealth"
      },
      {
        name: "Synapse Burn",
        description: "Overloads the neural implants of up to three hostile targets in close proximity.",
        powerCost: 40,
        abilityType: "Offensive Hack"
      },
      {
        name: "Adrenaline Burst",
        description: "Temporary boosts agility and reaction speeds by 150%, allowing rapid evasion.",
        powerCost: 15,
        abilityType: "Self Buff"
      }
    ],
    visualPrompt: `A gorgeous high-tech character portrait of ${name || "Astraea"}, ${gender || "Female"} ${classType || "Cyberpunk Rogue"}, digital illustration style, highly detailed neon glowing textures, cyberware face-plates, deep charcoal helmet side pieces, cinematic lighting, purple and teal backlighting, 8k resolution.`,
    themeColor: classType?.toLowerCase().includes("cyber") ? "#a855f7" : "#0ea5e9",
    createdAt: new Date().toISOString(),
    aiGenerated: false
  };

  if (!ai) {
    res.json(localFallbackCharacter);
    return;
  }

  try {
    const prompt = `Generate a fully functional sci-fi/fantasy RPG/story character in JSON format based on these input guidelines:
Name: "${name || 'random'}"
Gender: "${gender || 'any'}"
Class/Genre: "${classType || 'any'}"
Description/Custom prompt: "${promptDescription || 'No specified backlog'}"

You must respond with a JSON object that strictly adheres to the schema below.
DO NOT wrap the JSON in Markdown headings or codeblocks unless requested, but to be safe, return a clean parseable JSON object matching this structure:
{
  "name": "Creative full name fitting the theme",
  "gender": "specified gender",
  "classType": "genre class",
  "tagline": "A powerful 1-sentence catchy motto or character tagline",
  "backstory": "A rich 3-4 sentence background story of their origin, personal struggle, and current purpose in the universe",
  "stats": {
    "strength": Integer between 10 and 100,
    "agility": Integer between 10 and 100,
    "intellect": Integer between 10 and 100,
    "charisma": Integer between 10 and 100,
    "luck": Integer between 10 and 100
  },
  "abilities": [
    {
      "name": "Spell or cyber skill name",
      "description": "Short explanation of functional effect",
      "powerCost": Integer between 10 and 80,
      "abilityType": "Category like offensive, utility, healer, movement"
    }
  ],
  "visualPrompt": "A highly detailed aesthetic prompt for generating a landscape/portrait image of this character",
  "themeColor": "A single hex color (e.g. #3b82f6) that best represents the character's elemental affinity or vibe"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            gender: { type: Type.STRING },
            classType: { type: Type.STRING },
            tagline: { type: Type.STRING },
            backstory: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                strength: { type: Type.INTEGER },
                agility: { type: Type.INTEGER },
                intellect: { type: Type.INTEGER },
                charisma: { type: Type.INTEGER },
                luck: { type: Type.INTEGER },
              },
              required: ["strength", "agility", "intellect", "charisma", "luck"],
            },
            abilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  powerCost: { type: Type.INTEGER },
                  abilityType: { type: Type.STRING },
                },
                required: ["name", "description", "powerCost", "abilityType"],
              },
            },
            visualPrompt: { type: Type.STRING },
            themeColor: { type: Type.STRING },
          },
          required: ["name", "gender", "classType", "tagline", "backstory", "stats", "abilities", "visualPrompt", "themeColor"],
        },
      },
    });

    const text = response.text || "";
    const characterData = JSON.parse(text);
    res.json({
      id: `char_${Date.now()}`,
      ...characterData,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    });
  } catch (error) {
    handleAndLogError(error, res, localFallbackCharacter, "Error generating character from Gemini API");
  }
});

/* ==========================================
   2. AI THUMBNAIL LAYOUT GENERATION ENDPOINT
   ========================================== */
app.post("/api/thumbnail/generate", async (req: Request, res: Response): Promise<void> => {
  const { title, subtitle, style, focusSubject } = req.body;

  const localFallbackThumbnail = {
    id: `thumb_${Date.now()}`,
    title: title || "Mastering React 19 Backend",
    subtitle: subtitle || "Complete Fullstack Guide",
    style: style || "Tech-Minimal",
    layoutType: "Split-Screen Banner",
    focusSubject: focusSubject || "Glowing server node interconnected with orbital rings",
    primaryColor: "#0ea5e9",
    secondaryColor: "#0f172a",
    overlayElements: ["Hologram CPU chip", "Subtle neon grid lines", "Code brackets highlight"],
    contrastRatio: "High contrast (4.5:1 target)",
    generatedPrompt: `An eye-catching video thumbnail, high contrast, typography mockup layout. Left side features readable clean futuristic font text: "${title || 'Vite React'}". Right side features detailed 3D artwork of: "${focusSubject || 'Glowing server node interconnected with orbital rings'}". Styling matches ${style || 'Tech-Minimal'} design language. High detail volumetric, octane render.`,
    createdAt: new Date().toISOString(),
    aiGenerated: false
  };

  if (!ai) {
    res.json(localFallbackThumbnail);
    return;
  }

  try {
    const prompt = `You are a professional Graphic Designer and YouTube growth manager.
Design an eye-catching video thumbnail layout in JSON format based on:
Title: "${title || 'Mastering AI Development'}"
Subtitle: "${subtitle || 'Secrets Revealed'}"
Theme/Style: "${style || 'Dark High-Contrast Cyperpunk'}"
Primary Subject/Focus: "${focusSubject || 'Cute robot programming on futuristic laptop'}"

Generate the creative JSON specifications detailing:
{
  "title": "A slightly optimized, CTR-friendly punchy version of the title",
  "subtitle": "Short supporting text, less than 5 words",
  "style": "The visual design style (e.g. Cyberpunk, Vaporwave, Corporate Bold, Minimalist Luxe)",
  "layoutType": "Layout structure description (e.g. Face Close-up Right, Bold Left Text with Central Asset, Diagonally Split Screen)",
  "focusSubject": "A highly precise visual subject descriptions for image generators",
  "primaryColor": "First hex code accent theme matching the branding",
  "secondaryColor": "Second supporting hex code backdrop/accent color",
  "overlayElements": ["An array of 2-3 visual decals or icons (e.g. neon light trails, badge, glowing text frame)"],
  "contrastRatio": "Accessibility feedback rating",
  "generatedPrompt": "A highly descriptive prompt tailored for image models (like Midjourney/Imagen) to create the background texture or assets for this thumbnail layout"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            style: { type: Type.STRING },
            layoutType: { type: Type.STRING },
            focusSubject: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
            overlayElements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            contrastRatio: { type: Type.STRING },
            generatedPrompt: { type: Type.STRING },
          },
          required: ["title", "subtitle", "style", "layoutType", "focusSubject", "primaryColor", "secondaryColor", "overlayElements", "contrastRatio", "generatedPrompt"],
        },
      },
    });

    const text = response.text || "";
    const thumbnailData = JSON.parse(text);
    res.json({
      id: `thumb_${Date.now()}`,
      ...thumbnailData,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    });
  } catch (error) {
    handleAndLogError(error, res, localFallbackThumbnail, "Error generating thumbnail spec from Gemini");
  }
});

/* ==========================================
   3. AI PROMPT ENGINEERING ARCHITECT ENDPOINT
   ========================================== */
app.post("/api/prompt/generate", async (req: Request, res: Response): Promise<void> => {
  const { coreIdea, selectedMedium, toneAspect } = req.body;

  const localFallbackPrompt = {
    id: `prompt_${Date.now()}`,
    subject: coreIdea || "Astronaut fishing on a lunar lake of mercury",
    medium: selectedMedium || "Photorealistic Render",
    lighting: "Ethereal lunar moonlight, soft glow reflection off the fluid mercury surface, harsh cosmic rim-light",
    cameraSettings: "Shot on Hasselblad 500C, 85mm lens, f/1.8 aperture, cinematic wide angle, focus on fishing float bob",
    colorGrade: "Prism cold steel blues, deep obsidian black background space, subtle gold accent stars",
    artStyle: toneAspect || "Hyper-detailed Cinematic",
    additionalModifiers: ["high fidelity reflections", "NASA decal detail", "volumetric space dust mist", "8k resolution", "octane-render look"],
    negativePrompt: "low resolution, deformed suit, flat colors, cartoon drawing, drawing illustration, extra limbs, watermark",
    fullMidjourneyPrompt: `A photorealistic Hasselblad 500C wide-angle shot of ${coreIdea || 'an astronaut fishing on a lunar lake of mercury'}. Cold steel blues color grading, ethereal cosmic moonlight gleaming off liquid mercury surface. Volumetric space dust, cinematic lighting, hyper-detailed, NASA space decal, 8k --ar 16:9 --style raw --v 6.0`,
    fullStableDiffusionPrompt: `(highly detailed, masterpiece), photorealistic rendering of ${coreIdea || 'an astronaut fishing on a lunar lake of mercury'}. Hasselblad 85mm shot, beautiful cold steel color scheme, glowing mercury fluid physics, volumetric mist. Cinematic light, extreme detail, NASA helmet reflections. Negative prompt: low resolution, cartoon, painting, deformed hands, texts, badges, signature.`,
    createdAt: new Date().toISOString(),
    aiGenerated: false
  };

  if (!ai) {
    res.json(localFallbackPrompt);
    return;
  }

  try {
    const prompt = `You are an elite Prompt Engineer with specialized knowledge of model-specific grammar.
Transform this core user idea into optimized generative prompts:
Core Idea: "${coreIdea || 'cyberpunk cat on mechanical mouse'}"
Medium / Style: "${selectedMedium || 'Digital Painting'}"
Tone / Mood: "${toneAspect || 'Cinematic & Moody'}"

Create a highly detailed breakdown in JSON format:
{
  "subject": "The core refined subject with rich details",
  "medium": "The selected medium description",
  "lighting": "Creative directions for lighting effects (e.g. volumetric rays, chiaroscuro, golden hour bounce)",
  "cameraSettings": "Hypothetical camera models, shutter, focal length, or viewport rendering descriptors",
  "colorGrade": "Stylistic coloration grading notes (e.g. teal and amber, muted pastel, monochromatic chrome)",
  "artStyle": "Specific historical art styles, trends, or octane-render properties",
  "additionalModifiers": ["Array of short booster keywords e.g. 'unreal engine 5', 'sharp focus', 'editorial portrait'"],
  "negativePrompt": "Heavy negative weights to filter out visual artifacts, deformed elements, blurriness",
  "fullMidjourneyPrompt": "The consolidated ready-to-copy Midjourney v6.0 prompt containing parameters like --ar 16:9, --style raw, --v 6.0",
  "fullStableDiffusionPrompt": "The consolidated prompt ready for SDXL, emphasizing weights using parentheses with proper structural syntax"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            medium: { type: Type.STRING },
            lighting: { type: Type.STRING },
            cameraSettings: { type: Type.STRING },
            colorGrade: { type: Type.STRING },
            artStyle: { type: Type.STRING },
            additionalModifiers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            negativePrompt: { type: Type.STRING },
            fullMidjourneyPrompt: { type: Type.STRING },
            fullStableDiffusionPrompt: { type: Type.STRING },
          },
          required: ["subject", "medium", "lighting", "cameraSettings", "colorGrade", "artStyle", "additionalModifiers", "negativePrompt", "fullMidjourneyPrompt", "fullStableDiffusionPrompt"],
        },
      },
    });

    const text = response.text || "";
    const promptSpec = JSON.parse(text);
    res.json({
      id: `prompt_${Date.now()}`,
      ...promptSpec,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    });
  } catch (error) {
    handleAndLogError(error, res, localFallbackPrompt, "Error compiling optimized prompts with Gemini");
  }
});

/* ==========================================
   3A. DESIGN INSPIRATION HUB ENDPOINT
   ========================================== */
app.post("/api/inspiration/generate", async (req: Request, res: Response): Promise<void> => {
  const { niche } = req.body;

  const localFallbackInspiration = {
    id: `insp_${Date.now()}`,
    niche: niche || "SaaS User Analytics",
    recommendedConcept: "Dark mode data grid with translucent glassmorphic components, high contrast neon mint green stats.",
    wireframeBlueprint: "Stretched sidebar navigation with mini-icons. Main viewport presents three large performance card metric nodes with miniature positive growth tick indicators. Below, a scrollable table layout highlights user logins with green active dots.",
    typographySystem: {
      displayFont: "Space Grotesk (700 heavy, tight letter-spacing for large figures)",
      bodyFont: "Inter (400 medium weight, highly legible high-contrast color body)",
      monoFont: "Fira Code (for numerical rates and database queries)"
    },
    aestheticTokens: {
      background: "#090A0F (Midnight Black)",
      primaryAccent: "#10b981 (Mint Emerald)",
      secondaryAccent: "#3b82f6 (Vivid Blue)",
      surface: "#12131A (Titanium Dark Slate)",
      border: "rgba(255,255,255,0.08)"
    },
    uxHotspots: [
      "Hover feedback that lifts stat cards up slightly using standard transform animations.",
      "Integrated live search bar at the header that triggers client-side table rendering in under 5ms.",
      "Custom quick-action buttons aligned directly alongside user list rows for instant account modification."
    ],
    visualPrompts: {
      uiArtwork: `SaaS analytical dashboard mockup design, modular cards displaying charts and metrics, glassmorphism, intense mint blue neon accents, sleek layout, elegant interface, high-end 8k resolution design render.`
    },
    createdAt: new Date().toISOString(),
    aiGenerated: false
  };

  if (!ai) {
    res.json(localFallbackInspiration);
    return;
  }

  try {
    const prompt = `You are an elite product designer and UX architect.
Create a complete design system blueprint, recommended styleconcept, wireframe guideline, typography scale, aesthetic colors, and visual prompt in JSON format for the niche: "${niche || 'SaaS Web Dashboard'}".

Return a clean, valid JSON object matching this schema exactly:
{
  "niche": "the requested niche",
  "recommendedConcept": "A detailed 1-2 sentence high-level creative layout style concept (e.g. brutalist slate, luxury dark minimalist)",
  "wireframeBlueprint": "A highly detailed structured visual setup blueprint explaining the page grid, layout elements, and components layout.",
  "typographySystem": {
    "displayFont": "A stylish font pair display recommendation (e.g., Space Grotesk, Outfit, Playfair Display) with styling guidelines",
    "bodyFont": "Legible body typeface (e.g., Inter, Plus Jakarta Sans) with guidelines",
    "monoFont": "Highly precise mono typeface recommendation (e.g., JetBrains Mono, Fira Code)"
  },
  "aestheticTokens": {
    "background": "A hex color and creative descriptive label for canvas backdrop",
    "primaryAccent": "Primary high-contrast hex color",
    "secondaryAccent": "Supporting hex color",
    "surface": "Main surface container hex color",
    "border": "Borders color design (e.g., rgba color or hex)"
  },
  "uxHotspots": ["An array of 3 distinct high-fidelity UX interactive items or micro-interactions unique to this niche"],
  "visualPrompts": {
    "uiArtwork": "A rich, descriptive prompt for generating the background or screenshot asset for this style inspiration in Midjourney/Imagen"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            niche: { type: Type.STRING },
            recommendedConcept: { type: Type.STRING },
            wireframeBlueprint: { type: Type.STRING },
            typographySystem: {
              type: Type.OBJECT,
              properties: {
                displayFont: { type: Type.STRING },
                bodyFont: { type: Type.STRING },
                monoFont: { type: Type.STRING },
              },
              required: ["displayFont", "bodyFont", "monoFont"],
            },
            aestheticTokens: {
              type: Type.OBJECT,
              properties: {
                background: { type: Type.STRING },
                primaryAccent: { type: Type.STRING },
                secondaryAccent: { type: Type.STRING },
                surface: { type: Type.STRING },
                border: { type: Type.STRING },
              },
              required: ["background", "primaryAccent", "secondaryAccent", "surface", "border"],
            },
            uxHotspots: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            visualPrompts: {
              type: Type.OBJECT,
              properties: {
                uiArtwork: { type: Type.STRING }
              },
              required: ["uiArtwork"]
            }
          },
          required: ["niche", "recommendedConcept", "wireframeBlueprint", "typographySystem", "aestheticTokens", "uxHotspots", "visualPrompts"],
        },
      },
    });

    const text = response.text || "";
    const inspirationData = JSON.parse(text);
    res.json({
      id: `insp_${Date.now()}`,
      ...inspirationData,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    });
  } catch (error) {
    handleAndLogError(error, res, localFallbackInspiration, "Error generating design concept from Gemini");
  }
});

/* ==========================================
   3B. BRAND IDENTITY GENERATOR ENDPOINT
   ========================================== */
app.post("/api/brand/generate", async (req: Request, res: Response): Promise<void> => {
  const { brandName, industry, personality, values } = req.body;

  const localFallbackBrand = {
    id: `brand_${Date.now()}`,
    brandName: brandName || "ApexGlow",
    industry: industry || "Premium Cosmetics Tech",
    personality: personality || "Elegant Luxe",
    tagline: "Unveiling natural confidence through synchronized skin diagnostics.",
    brandStory: `Born at the intersection of biological science and visual purity, ${brandName || "ApexGlow"} crafts custom skincare formulations guided by automated scanning devices. Our products are formulated using minimalist ingredients of pristine origin, preserving your canvas while engineering real, quantifiable changes in skin health and glow.`,
    logoCreativeConcept: "A pure clean aesthetic monogram featuring letter 'A' coupled with a minimalist single dewdrop profile, placed elegantly within a light champagne-colored backdrop.",
    idealColorPalette: ["#FAF8F5", "#F2EBE1", "#C7B299", "#111111", "#A3A3A3"],
    marketingPitch: `Stop guessing your formula. ${brandName || "ApexGlow"} customizes skin remedies using digital diagnostics. Experience premium clean beauty crafted exclusively for active urban lives. Get your personalized skin analysis and kit delivered in 2 days.`,
    brandToneGuidelines: [
      "Speak with gentle, sophisticated, yet deeply scientific authority.",
      "Use warm human analogies and literal, non-exaggerated skin wellness terminologies.",
      "Ensure every design banner employs luxurious white space and calm, low-saturation backgrounds."
    ],
    createdAt: new Date().toISOString(),
    aiGenerated: false
  };

  if (!ai) {
    res.json(localFallbackBrand);
    return;
  }

  try {
    const prompt = `You are an elite brand strategist, logo designer, and copywriter.
Create a complete premium Brand Identity package in JSON format based on:
Brand Name Target: "${brandName || 'ApexGlow'}"
Industry Segment: "${industry || 'Custom Technology solutions'}"
Brand Personality: "${personality || 'Bold Minimalist Modern'}"
Core Values: "${values || 'Integrity, Scalability, Simplicity'}"

Return a valid JSON object matching this schema exactly:
{
  "brandName": "Optimized styled Brand Name with perfect capitalization",
  "industry": "Clean sector categorization",
  "personality": "Primary brand personality direction",
  "tagline": "A powerful, punchy brand tagline (under 8 words)",
  "brandStory": "A compelling, high-end 3-4 sentence brand story explaining the catalyst, current mission, and consumer connection.",
  "logoCreativeConcept": "A vivid description of a minimal vector logo concept suitable for modern web representation.",
  "idealColorPalette": ["An array of exactly 5 color hex codes matching the visual guidelines perfectly"],
  "marketingPitch": "A high-converting, premium marketing elevator pitch targeting their ideal consumer segment.",
  "brandToneGuidelines": ["Array of exactly 3 tactical guidelines for brand voice and copywriting demeanor"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brandName: { type: Type.STRING },
            industry: { type: Type.STRING },
            personality: { type: Type.STRING },
            tagline: { type: Type.STRING },
            brandStory: { type: Type.STRING },
            logoCreativeConcept: { type: Type.STRING },
            idealColorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            marketingPitch: { type: Type.STRING },
            brandToneGuidelines: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["brandName", "industry", "personality", "tagline", "brandStory", "logoCreativeConcept", "idealColorPalette", "marketingPitch", "brandToneGuidelines"],
        },
      },
    });

    const text = response.text || "";
    const brandData = JSON.parse(text);
    res.json({
      id: `brand_${Date.now()}`,
      ...brandData,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    });
  } catch (error) {
    handleAndLogError(error, res, localFallbackBrand, "Error generating brand strategy from Gemini");
  }
});

/* ==========================================
   3C. COLOR PALETTE GENERATOR ENDPOINT
   ========================================== */
app.post("/api/color/generate", async (req: Request, res: Response): Promise<void> => {
  const { nicheOrMood, generationRule } = req.body;

  const localFallbackColor = {
    id: `col_${Date.now()}`,
    paletteName: nicheOrMood ? `${nicheOrMood} Theme` : "Neon Horizon",
    moodDescription: "A high-octane cyberpunk tone-set utilizing deep pitch-black backdrops and blazing vivid neon highlights for futuristic interfaces.",
    colors: [
      { hex: "#08070b", name: "Deep Void", usage: "Main canvas base color, low reflection visual bedrock." },
      { hex: "#ec4899", name: "Laser Violet", usage: "Primary buttons, active indicators, and attention-grabbing metrics." },
      { hex: "#3b82f6", name: "Cyber Sky", usage: "Supporting icons, active state borders, and header outlines." },
      { hex: "#1e1b4b", name: "Starlight Ink", usage: "Card backgrounds, secondary dividers, and navigation buttons." },
      { hex: "#f8fafc", name: "Titanium White", usage: "High-contrast primary headers, body text, and highlighted metrics." }
    ],
    contrastAudit: "Cyber Sky text on Deep Void exceeds 5:1 contrast, satisfying standard accessibility rules for dark mode layouts.",
    landingPageDemo: {
      heroText: "Architecting the Next Cyber Horizon",
      ctaText: "Launch Grid Node",
      themeType: "dark"
    },
    createdAt: new Date().toISOString(),
    aiGenerated: false
  };

  if (!ai) {
    res.json(localFallbackColor);
    return;
  }

  try {
    const prompt = `You are a visual design expert.
Generate a cohesive high-end color palette of 5 distinct colors based on:
Niche or Mood search: "${nicheOrMood || 'Modern SaaS Fin-Tech'}"
Harmony structural rule: "${generationRule || 'Complementary High-Contrast'}"

You must respond with a clean, valid JSON object matching this schema:
{
  "paletteName": "A catchy artistic name for the color palette",
  "moodDescription": "A 1-2 sentence description explaining why these specific colors reinforce the desired mood and target consumer feeling.",
  "colors": [
    {
      "hex": "A valid 6-character hex code, e.g., #ef4444",
      "name": "An elegant, creative design-industry name for this shade",
      "usage": "A highly precise visual application tip inside an interface (e.g. primary hover action background, screen backdrop, dense text body)"
    }
  ],
  "contrastAudit": "A brief, professional evaluation stating whether contrast guidelines are satisfied.",
  "landingPageDemo": {
    "heroText": "A catchy, brief sample header that uses these colors (e.g., 'Empowering Decentralized Financial Growth')",
    "ctaText": "An action label (e.g., 'Claim Free Node')",
    "themeType": "either 'dark' or 'light'"
  }
}

Important: The "colors" array MUST contain exactly 5 colors. All hex codes must strictly start with '#' and be valid CSS colors.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paletteName: { type: Type.STRING },
            moodDescription: { type: Type.STRING },
            colors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING },
                  usage: { type: Type.STRING }
                },
                required: ["hex", "name", "usage"]
              }
            },
            contrastAudit: { type: Type.STRING },
            landingPageDemo: {
              type: Type.OBJECT,
              properties: {
                heroText: { type: Type.STRING },
                ctaText: { type: Type.STRING },
                themeType: { type: Type.STRING }
              },
              required: ["heroText", "ctaText", "themeType"]
            }
          },
          required: ["paletteName", "moodDescription", "colors", "contrastAudit", "landingPageDemo"],
        },
      },
    });

    const text = response.text || "";
    const colorData = JSON.parse(text);
    res.json({
      id: `col_${Date.now()}`,
      ...colorData,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    });
  } catch (error) {
    handleAndLogError(error, res, localFallbackColor, "Error synthesizing dynamic color palette from Gemini");
  }
});

/* ==========================================
   3D. UNIFIED GENERAL PURPOSE AI GENERATOR
   ========================================== */
app.post("/api/studio/general-generate", async (req: Request, res: Response): Promise<void> => {
  const { prompt, systemInstruction, fallbackJson } = req.body;

  if (!ai) {
    res.json({
      success: true,
      data: fallbackJson || { error: "Fallback engine active" },
      aiGenerated: false
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are an expert design assistant. Return a clean JSON object corresponding exactly to the requested data.",
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    res.json({
      success: true,
      data: parsedData,
      aiGenerated: true
    });
  } catch (error: any) {
    console.error("Error in general-generate:", error);
    res.json({
      success: true,
      data: fallbackJson || { error: "Fallback triggered due to API error" },
      aiGenerated: false,
      debug: error?.message
    });
  }
});

/* ==========================================
   4. AI IMAGE GENERATION PROXY
   ========================================== */
app.post("/api/generate-image", async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (!ai) {
    res.status(403).json({
      error: "No Gemini Key Configured",
      message: "Please add your GEMINI_API_KEY inside the secrets panel to activate live image creation."
    });
    return;
  }

  try {
    console.log("Calling gemini-2.5-flash-image models/generateContent for image generation...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let base64String = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64String = part.inlineData.data;
          break;
        }
      }
    }

    if (base64String) {
      res.json({
        success: true,
        image: `data:image/png;base64,${base64String}`
      });
    } else {
      res.status(502).json({
        error: "Image model returned no image content",
        message: "The model executed successfully but did not produce a valid raw image response."
      });
    }
  } catch (error: any) {
    console.error("Gemini 2.5 Image generation error:", error);
    res.status(500).json({
      error: "API key/quota restriction",
      message: error?.message || "There was an error invoking the image generation models on this API-token."
    });
  }
});

/* ==========================================
   4A. AUTONOMOUS QUANTUM AGENT & DEEP RESEARCH ROUTER
   ========================================== */
app.post("/api/quantum-agent/research", async (req: Request, res: Response): Promise<void> => {
  const { prompt, memories, tone, activePreset } = req.body;

  const localFallback = {
    analysisText: `### 🔍 Quantum Deep Research Findings: "${prompt}"

I have successfully executed our simulated deep web search audit across active global network indexes.

#### Key Research Insights & Analytical Intel:
1. **Adaptive Synaptic Memory**: Modern AI systems persist knowledge in decentralized local vectors, bypassing static hardcoded pipelines to retrieve real-time data dynamically.
2. **Dynamic Self-Coded UI Generation**: High-end consumer portals compile interactive client-side sandbox widgets in response to real-time structural data, lowering user latency.
3. **Advanced Semantic Grounding**: Seamless integrations with Google Search tool databases enable Gemini to eliminate illusions, verify up-to-date stats, and cite real links.
4. **Autonomous Self-Correcting Check**: AI-augmented logic circuits evaluate response drafts recursively, isolating and correcting logical contradictions prior to presentation.

*Our simulated deep search grounding completes successfully. Feed these learnings back to the Neural Memory Core to update its active instincts.*`,
    newLearnings: [
      `Learned: Research completed for query: "${prompt}"`,
      "Discovered: Client-side persistent sandboxes are premium future AI trends",
      "Calculated: Dynamic UI rendering scales interface simplicity, looking cleaner"
    ],
    citations: [
      { title: "Google AI Developer Portal", uri: "https://ai.google.dev" },
      { title: "Vite SPA Standard Specifications", uri: "https://vite.dev" },
      { title: "MDN Web Components Sandbox", uri: "https://developer.mozilla.org" }
    ],
    selfEvaluation: "Self-reasoning audit passed with outstanding consistency metrics. Swapped generic static examples with high-CTR adaptive layouts to ensure the finest presentation.",
    dynamicWidget: {
      widgetType: "metric-slider",
      title: "Interactive AI Connection Modulator",
      config: {
        metricLabel: "Synaptic Connection Fire Speed",
        min: 10,
        max: 200,
        defaultValue: 110,
        unit: "GHz"
      }
    }
  };

  if (!ai) {
    res.json(localFallback);
    return;
  }

  try {
    const memoryContext = memories && memories.length > 0
      ? `\nActive Evolving Memory (Learned facts from previous inquiries): \n${memories.map((m: any) => `- ${m}`).join("\n")}`
      : "";

    const userInquiry = `User Query: "${prompt}"${memoryContext}\nActive Specialist Preset: "${activePreset || 'Generalist Agent'}"\nTone Style: "${tone || 'Expert Analyst'}"`;

    const systemInstruction = `You are the Quantum AI Research Agent, a futuristic self-correcting neural intelligence.
You have the power to search the real web using the googleSearch tool to answer questions with 100% current accuracy and no hallucinations.
Your response MUST be a clean, valid JSON object corresponding EXACTLY to this TypeScript schema:
{
  "analysisText": "Detailed and thorough research findings in high-quality markdown format. Present deep paragraphs, subheadings, bullet lists, and integrate source citations directly.",
  "newLearnings": [
    "List 2-3 short, highly specific new facts you just discovered or calculated from this online research to update your continuous active memory base"
  ],
  "citations": [
    { "title": "Headline or site name", "uri": "URL address" }
  ],
  "selfEvaluation": "1-2 sentences of self-critic reasoning: state what mistake you self-corrected in your thoughts or how you verified that this answer contains zero hallucinations and represents the absolute truth.",
  "dynamicWidget": {
    "widgetType": "metric-slider | smart-checklist | interactive-chart | translator | unit-calculator",
    "title": "A custom title for a tailored interactive tool to go with this query",
    "config": {
      "metricLabel": "label for widget metric",
      "min": 0,
      "max": 100,
      "defaultValue": 50,
      "unit": "unit label",
      "items": ["checklist items if checklist widgetType selected"],
      "chartData": [
        {"label": "Label 1", "value": 10},
        {"label": "Label 2", "value": 20}
      ]
    }
  }
}
Create a great dynamicWidget that is highly relevant to the user query! For example:
- If they ask about metrics/stats, code an 'interactive-chart' with 'chartData' (array of objects with label and value).
- If they ask about actions/todos/steps/methods, code a 'smart-checklist' with 'items' array.
- If they ask about levels/impact/ratios/sliders, code a 'metric-slider' with min, max, defaultValue, metricLabel, unit.
- If they need custom language/terms, code a 'translator' with some initial config.
- If they need math/conversion/units, code a 'unit-calculator' with initial config.
Ensure you return clean parseable JSON. Use your googleSearch tool on every web query!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInquiry,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text.trim());

    let extractedCitations = parsedData.citations || [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          extractedCitations.push({
            title: chunk.web.title || "Web Reference",
            uri: chunk.web.uri
          });
        }
      });
    }

    const uniqueUris = new Set();
    extractedCitations = extractedCitations.filter((cit: any) => {
      if (cit && cit.uri && !uniqueUris.has(cit.uri)) {
        uniqueUris.add(cit.uri);
        return true;
      }
      return false;
    });

    res.json({
      ...parsedData,
      citations: extractedCitations,
      aiGenerated: true
    });

  } catch (error: any) {
    console.error("Error in Quantum Agent Research API:", error);
    res.json({
      ...localFallback,
      debug: error?.message || String(error),
      aiGenerated: false
    });
  }
});

// Setup Vite integration or build asset serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Creator Suite server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failure starting the Express + Vite unified server:", err);
});
