import React, { useState } from 'react'
import { Wand2, Loader } from 'lucide-react'

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('A breathtaking sci-fi landscape with floating islands and aurora borealis')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'Failed to generate image' })
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = (imageData: string) => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-bold gradient-text">🖼️ AI Image Generator</h2>
        <p className="text-gray-400 text-lg">Generate stunning images using Google's Gemini 2.5 Flash Image model</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Image Prompt</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Describe Your Image</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe the image you want to generate in detail..."
              />
            </div>

            <div className="space-y-2 text-xs text-gray-400">
              <p className="font-medium">💡 Tips for better results:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be specific about colors, style, and mood</li>
                <li>Mention the medium (oil painting, digital art, etc.)</li>
                <li>Include lighting and composition details</li>
                <li>Add quality keywords like "highly detailed", "8k", "cinematic"</li>
              </ul>
            </div>

            <button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in">
          <h3 className="text-2xl font-bold text-white">Generated Image</h3>

          {!result && !loading && (
            <div className="aspect-square rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-5xl">🎨</div>
                <p className="text-gray-400">Your generated image will appear here</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="aspect-square rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader size={40} className="animate-spin text-purple-500 mx-auto" />
                <p className="text-gray-400">Creating your masterpiece...</p>
              </div>
            </div>
          )}

          {result && !result.error && result.image && (
            <div className="space-y-4">
              <img
                src={result.image}
                alt="Generated"
                className="w-full rounded-lg shadow-2xl"
              />
              <button
                onClick={() => downloadImage(result.image)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                ⬇️ Download Image
              </button>
            </div>
          )}

          {result && result.error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">❌ {result.error}</p>
              <p className="text-red-300 text-xs mt-2">{result.message}</p>
            </div>
          )}

          {result && result.success === false && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-sm font-medium">⚠️ Please configure your API key</p>
              <p className="text-yellow-300 text-xs mt-2">Add your GEMINI_API_KEY to enable image generation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageGenerator