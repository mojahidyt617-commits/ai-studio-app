import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader } from 'lucide-react'

const BrandIdentity: React.FC = () => {
  const [formData, setFormData] = useState({
    brandName: 'ApexGlow',
    industry: 'Premium Cosmetics Tech',
    personality: 'Elegant Luxe',
    values: 'Innovation, Quality, Sustainability'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateBrand = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/brand/generate', {
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
        <h2 className="text-4xl font-bold gradient-text">🏢 Brand Identity Generator</h2>
        <p className="text-gray-400 text-lg">Create comprehensive brand strategies and identities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Brand Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Your brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., SaaS, Fintech, Fashion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Personality</label>
              <input
                type="text"
                name="personality"
                value={formData.personality}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., Bold, Professional, Playful"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Core Values</label>
              <textarea
                name="values"
                value={formData.values}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="List your brand values..."
              />
            </div>

            <button
              onClick={generateBrand}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Brand
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">{result.brandName}</h3>
                <p className="text-sm text-gray-400">{result.industry}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Tagline:</p>
                <p className="text-white text-lg font-semibold">"{result.tagline}"</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 font-medium mb-2">Brand Story:</p>
                <p className="text-white text-sm leading-relaxed">{result.brandStory}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 font-medium mb-2">Logo Concept:</p>
                <p className="text-white text-sm">{result.logoCreativeConcept}</p>
              </div>

              {result.idealColorPalette && (
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-2">Color Palette:</p>
                  <div className="flex gap-2">
                    {result.idealColorPalette.map((color: string, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-lg border-2 border-slate-600" style={{ backgroundColor: color }}></div>
                        <code className="text-xs text-gray-400">{color}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-400 font-medium mb-2">Marketing Pitch:</p>
                <p className="text-white text-sm italic">"{result.marketingPitch}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrandIdentity