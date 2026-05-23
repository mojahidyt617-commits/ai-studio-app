<div align="center">
<img width="1200" height="475" alt="AI Studio Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🚀 AI Character and Quantum Deep Research Suite

An interactive full-stack workspace featuring AI Character Generation, Thumbnail Layout Makers, Prompt Engineering, Design Inspiration, Brand Identity Generator, Color Palette Creator, and an Autonomous Self-Learning Quantum Deep-Research Agent with live search grounding and widget compiler.

## ✨ Features

### 🎭 AI Character Generator
Create unique RPG/fantasy characters with AI-powered generation including stats, abilities, backstories, and visual prompts.

### 🎬 Thumbnail Layout Maker
Design eye-catching video thumbnails with optimized layouts, color schemes, and accessibility features.

### ⚡ Prompt Engineering Architect
Transform ideas into optimized AI image generation prompts for Midjourney, Stable Diffusion, and other models.

### 🎨 Design Inspiration Hub
Get complete design system blueprints including typography, colors, wireframes, and UX hotspots for any niche.

### 🏢 Brand Identity Generator
Create comprehensive brand strategies including taglines, brand stories, logo concepts, and marketing pitches.

### 🌈 Color Palette Generator
Generate cohesive, accessible color palettes based on mood, niche, and harmony rules.

### 🔬 Quantum Deep Research Agent
Autonomous AI agent with live web search, continuous learning memory, and dynamic interactive widgets.

### 🖼️ AI Image Generator
Generate stunning images using Google's Gemini 2.5 Flash Image model.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini API (@google/genai)
- **UI Components**: Lucide React Icons
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- Google Gemini API Key

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mojahidyt617-commits/ai-studio-app.git
cd ai-studio-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ai-studio-app/
├── src/
│   ├── components/
│   │   ├── CharacterGenerator.tsx
│   │   ├── ThumbnailMaker.tsx
│   │   ├── PromptEngineer.tsx
│   │   ├── DesignInspiration.tsx
│   │   ├── BrandIdentity.tsx
│   │   ├── ColorPalette.tsx
│   │   ├── QuantumAgent.tsx
│   │   ├── ImageGenerator.tsx
│   │   └── Navigation.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.ts
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Character Generation
- `POST /api/character/generate`
- Body: `{ name, classType, gender, promptDescription }`

### Thumbnail Design
- `POST /api/thumbnail/generate`
- Body: `{ title, subtitle, style, focusSubject }`

### Prompt Engineering
- `POST /api/prompt/generate`
- Body: `{ coreIdea, selectedMedium, toneAspect }`

### Design Inspiration
- `POST /api/inspiration/generate`
- Body: `{ niche }`

### Brand Identity
- `POST /api/brand/generate`
- Body: `{ brandName, industry, personality, values }`

### Color Palette
- `POST /api/color/generate`
- Body: `{ nicheOrMood, generationRule }`

### Quantum Research Agent
- `POST /api/quantum-agent/research`
- Body: `{ prompt, memories, tone, activePreset }`

### Image Generation
- `POST /api/generate-image`
- Body: `{ prompt }`

## 🎨 Customization

### Tailwind Colors
Edit `tailwind.config.js` to customize the color scheme.

### API Models
Change the Gemini model in `server.ts` by modifying:
```typescript
model: "gemini-3.5-flash" // or another model
```

## 🚀 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Google Generative AI](https://ai.google.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check the [Google AI Studio Documentation](https://ai.google.dev)

---

**Made with ❤️ by the AI Studio Community**
