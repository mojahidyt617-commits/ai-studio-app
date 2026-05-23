import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader } from 'lucide-react'

const DesignInspiration: React.FC = () => {
  const [formData, setFormData] = useState({
    niche: 'SaaS User Analytics'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateInspiration = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/inspiration/generate', {
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
        <h2 className="text-4xl font-bold gradient-text">🎨 Design Inspiration Hub</h2>
        <p className="text-gray-400 text-lg">Get complete design system blueprints for any niche</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Design Niche</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Industry / Niche</label>
              <input
                type="text"
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., SaaS Dashboard, E-commerce, FinTech"
              />
            </div>

            <button
              onClick={generateInspiration}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Design System
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{result.niche}</h3>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-2">Concept:</p>
                <p className="text-white text-sm">{result.recommendedConcept}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 font-medium mb-2">Wireframe Blueprint:</p>
                <p className="text-white text-xs leading-relaxed">{result.wireframeBlueprint}</p>
              </div>

              {result.typographySystem && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 font-medium mb-3">Typography System</p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-purple-400">Display:</span>
                      <span className="text-white ml-2">{result.typographySystem.displayFont}</span>
                    </div>
                    <div>
                      <span className="text-purple-400">Body:</span>
                      <span className="text-white ml-2">{result.typographySystem.bodyFont}</span>
                    </div>
                    <div>
                      <span className="text-purple-400">Mono:</span>
                      <span className="text-white ml-2">{result.typographySystem.monoFont}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.aestheticTokens && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 font-medium mb-3">Color Tokens</p>
                  <div className="space-y-2 text-xs">
                    {Object.entries(result.aestheticTokens).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-slate-600" style={{
                          backgroundColor: typeof value === 'string' && value.startsWith('#') ? value : 'transparent'
                        }}></div>
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <code className="text-white">{value}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.uxHotspots && (
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-2">UX Hotspots:</p>
                  <ul className="space-y-2">
                    {result.uxHotspots.map((hotspot: string, idx: number) => (
                      <li key={idx} className="text-xs text-white flex gap-2">
                        <span className="text-purple-400">•</span>
                        <span>{hotspot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DesignInspiration