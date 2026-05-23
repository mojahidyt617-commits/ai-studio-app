import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader } from 'lucide-react'

const ColorPalette: React.FC = () => {
  const [formData, setFormData] = useState({
    nicheOrMood: 'Modern SaaS Fin-Tech',
    generationRule: 'Complementary High-Contrast'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generatePalette = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/color/generate', {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-bold gradient-text">🎨 Color Palette Generator</h2>
        <p className="text-gray-400 text-lg">Generate cohesive color palettes for any design need</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Palette Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Niche or Mood</label>
              <input
                type="text"
                name="nicheOrMood"
                value={formData.nicheOrMood}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., Cyberpunk, Nature, Luxury"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Harmony Rule</label>
              <select
                name="generationRule"
                value={formData.generationRule}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Complementary High-Contrast</option>
                <option>Analogous Harmony</option>
                <option>Triadic Balance</option>
                <option>Monochromatic</option>
                <option>Split Complementary</option>
              </select>
            </div>

            <button
              onClick={generatePalette}
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Palette
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in">
            <h3 className="text-2xl font-bold text-white">{result.paletteName}</h3>

            <div>
              <p className="text-sm text-gray-400 font-medium mb-2">Mood:</p>
              <p className="text-white text-sm">{result.moodDescription}</p>
            </div>

            {result.colors && (
              <div className="space-y-3">
                {result.colors.map((color: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex)}
                      title="Click to copy hex"
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{color.name}</p>
                      <p className="text-xs text-gray-400">{color.hex}</p>
                      <p className="text-xs text-gray-500 mt-1">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.contrastAudit && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-gray-400 font-medium mb-2">Accessibility:</p>
                <p className="text-white text-sm">{result.contrastAudit}</p>
              </div>
            )}

            {result.landingPageDemo && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-gray-400 font-medium mb-3">Preview:</p>
                <div
                  className="p-6 rounded-lg text-center space-y-2"
                  style={{
                    backgroundColor: result.colors?.[0]?.hex || '#000',
                  }}
                >
                  <h3 className="text-lg font-bold" style={{ color: result.colors?.[4]?.hex }}>
                    {result.landingPageDemo.heroText}
                  </h3>
                  <button
                    style={{
                      backgroundColor: result.colors?.[1]?.hex,
                      color: result.colors?.[0]?.hex
                    }}
                    className="px-4 py-2 rounded font-medium text-sm"
                  >
                    {result.landingPageDemo.ctaText}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorPalette