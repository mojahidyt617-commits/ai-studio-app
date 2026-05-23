import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader } from 'lucide-react'

const ThumbnailMaker: React.FC = () => {
  const [formData, setFormData] = useState({
    title: 'Mastering React 19 Backend',
    subtitle: 'Complete Fullstack Guide',
    style: 'Tech-Minimal',
    focusSubject: 'Glowing server node interconnected with orbital rings'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateThumbnail = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/thumbnail/generate', {
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-bold gradient-text">🎬 Thumbnail Layout Maker</h2>
        <p className="text-gray-400 text-lg">Create eye-catching video thumbnail designs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Thumbnail Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Video title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Supporting text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Design Style</label>
              <select
                name="style"
                value={formData.style}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Tech-Minimal</option>
                <option>Cyberpunk</option>
                <option>Vaporwave</option>
                <option>Corporate Bold</option>
                <option>Minimalist Luxe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Focus Subject</label>
              <textarea
                name="focusSubject"
                value={formData.focusSubject}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe the main visual element..."
              />
            </div>

            <button
              onClick={generateThumbnail}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Thumbnail
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{result.title}</h3>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Subtitle:</span>
                <span className="text-white font-medium ml-2">{result.subtitle}</span>
              </div>
              <div>
                <span className="text-gray-400">Style:</span>
                <span className="text-white font-medium ml-2">{result.style}</span>
              </div>
              <div>
                <span className="text-gray-400">Layout:</span>
                <span className="text-white font-medium ml-2">{result.layoutType}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-gray-400 mb-2 font-medium">Focus Subject:</p>
              <p className="text-white text-sm">{result.focusSubject}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Primary Color</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: result.primaryColor }}></div>
                  <code className="text-sm text-white">{result.primaryColor}</code>
                </div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Secondary Color</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: result.secondaryColor }}></div>
                  <code className="text-sm text-white">{result.secondaryColor}</code>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2 font-medium">Generated Prompt:</p>
              <p className="text-white text-xs leading-relaxed">{result.generatedPrompt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThumbnailMaker