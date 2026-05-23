import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader } from 'lucide-react'

const CharacterGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Astraea',
    classType: 'Cyberpunk Rogue',
    gender: 'Female',
    promptDescription: 'A tech-savvy hacker with cybernetic enhancements'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateCharacter = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/character/generate', {
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
        <h2 className="text-4xl font-bold gradient-text">🎭 AI Character Generator</h2>
        <p className="text-gray-400 text-lg">Create unique RPG characters with AI-powered generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Character Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Character Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter character name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Class/Type</label>
              <input
                type="text"
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., Cyberpunk Rogue, Knight, Mage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="promptDescription"
                value={formData.promptDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe your ideal character..."
              />
            </div>

            <button
              onClick={generateCharacter}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Character
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{result.name}</h3>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy JSON"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Gender:</span>
                <span className="text-white font-medium">{result.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Class:</span>
                <span className="text-white font-medium">{result.classType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tagline:</span>
                <span className="text-white font-medium">{result.tagline}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-gray-400 mb-2 font-medium">Backstory:</p>
              <p className="text-white text-sm leading-relaxed">{result.backstory}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 bg-slate-700/50 p-4 rounded-lg">
              {Object.entries(result.stats).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <div className="text-xs font-bold text-purple-400 uppercase">{stat.slice(0, 3)}</div>
                  <div className="text-lg font-bold text-white mt-1">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-medium">Abilities:</p>
              {result.abilities?.map((ability: any, idx: number) => (
                <div key={idx} className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="font-medium text-white">{ability.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{ability.description}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-purple-400">{ability.abilityType}</span>
                    <span className="text-xs text-orange-400">Cost: {ability.powerCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterGenerator