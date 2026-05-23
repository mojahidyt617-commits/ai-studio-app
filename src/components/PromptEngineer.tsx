import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader } from 'lucide-react'

const PromptEngineer: React.FC = () => {
  const [formData, setFormData] = useState({
    coreIdea: 'Astronaut fishing on a lunar lake of mercury',
    selectedMedium: 'Photorealistic Render',
    toneAspect: 'Hyper-detailed Cinematic'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generatePrompt = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/prompt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-bold gradient-text">✨ Prompt Engineering Architect</h2>
        <p className="text-gray-400 text-lg">Transform ideas into optimized AI image generation prompts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Prompt Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Core Idea</label>
              <textarea
                name="coreIdea"
                value={formData.coreIdea}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe your core idea..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Medium / Style</label>
              <select
                name="selectedMedium"
                value={formData.selectedMedium}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Photorealistic Render</option>
                <option>Digital Painting</option>
                <option>3D Render</option>
                <option>Oil Painting</option>
                <option>Watercolor</option>
                <option>Concept Art</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tone / Mood</label>
              <input
                type="text"
                name="toneAspect"
                value={formData.toneAspect}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., Cinematic, Moody, Ethereal"
              />
            </div>

            <button
              onClick={generatePrompt}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Engineering...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Engineer Prompt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in max-h-[600px] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white">Optimized Prompts</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Medium:</span>
                <span className="text-white font-medium">{result.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Art Style:</span>
                <span className="text-white font-medium">{result.artStyle}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400 font-medium">Midjourney Prompt</p>
                  <button
                    onClick={() => copyPrompt(result.fullMidjourneyPrompt)}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <code className="block bg-slate-700/50 p-3 rounded text-xs text-white overflow-x-auto">
                  {result.fullMidjourneyPrompt}
                </code>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400 font-medium">Stable Diffusion Prompt</p>
                  <button
                    onClick={() => copyPrompt(result.fullStableDiffusionPrompt)}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <code className="block bg-slate-700/50 p-3 rounded text-xs text-white overflow-x-auto">
                  {result.fullStableDiffusionPrompt}
                </code>
              </div>
            </div>

            {result.additionalModifiers && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-gray-400 font-medium mb-2">Modifiers:</p>
                <div className="flex flex-wrap gap-2">
                  {result.additionalModifiers.map((mod: string, idx: number) => (
                    <span key={idx} className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-white">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PromptEngineer