import React, { useState } from 'react'
import { Wand2, Copy, Check, Loader, MessageCircle } from 'lucide-react'

const QuantumAgent: React.FC = () => {
  const [formData, setFormData] = useState({
    prompt: 'What are the latest trends in AI and machine learning?',
    tone: 'Expert Analyst',
    activePreset: 'Generalist Agent',
    memories: [] as string[]
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateResearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quantum-agent/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      setResult(data)

      // Add to memories if new learning
      if (data.newLearnings && data.newLearnings.length > 0) {
        setFormData(prev => ({
          ...prev,
          memories: [...prev.memories, ...data.newLearnings]
        }))
      }
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
        <h2 className="text-4xl font-bold gradient-text">🔬 Quantum Deep Research Agent</h2>
        <p className="text-gray-400 text-lg">Autonomous AI agent with live web search and continuous learning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Research Query</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Research Question</label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Ask anything about current trends, technology, or research..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Expert Analyst</option>
                <option>Researcher</option>
                <option>Journalist</option>
                <option>Casual Explainer</option>
                <option>Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Agent Preset</label>
              <select
                name="activePreset"
                value={formData.activePreset}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Generalist Agent</option>
                <option>Tech Specialist</option>
                <option>Research Scholar</option>
                <option>Market Analyst</option>
              </select>
            </div>

            {formData.memories.length > 0 && (
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 font-medium mb-2">🧠 Agent Memory ({formData.memories.length})</p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {formData.memories.map((memory, idx) => (
                    <p key={idx} className="text-xs text-gray-300">• {memory.substring(0, 60)}...</p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={generateResearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 glow-effect"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <MessageCircle size={20} />
                  Execute Research
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6 fade-in max-h-[700px] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-white">Research Findings</h3>
              <button
                onClick={() => copyToClipboard(result.analysisText)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>

            {/* Analysis Text */}
            <div className="prose prose-invert max-w-none text-sm">
              <div className="text-white leading-relaxed whitespace-pre-wrap break-words text-xs">
                {result.analysisText}
              </div>
            </div>

            {/* New Learnings */}
            {result.newLearnings && result.newLearnings.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-gray-400 font-medium mb-2">🧠 New Learnings:</p>
                <div className="space-y-2">
                  {result.newLearnings.map((learning: string, idx: number) => (
                    <div key={idx} className="bg-slate-700/50 p-2 rounded text-xs text-white">
                      • {learning}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citations */}
            {result.citations && result.citations.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-gray-400 font-medium mb-2">📚 Sources:</p>
                <div className="space-y-2">
                  {result.citations.map((citation: any, idx: number) => (
                    <a
                      key={idx}
                      href={citation.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-blue-400 hover:text-blue-300 break-words"
                    >
                      {idx + 1}. {citation.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Self Evaluation */}
            {result.selfEvaluation && (
              <div className="border-t border-slate-700 pt-4 bg-slate-700/30 p-3 rounded-lg">
                <p className="text-xs text-gray-400 font-medium mb-1">✅ Self-Evaluation:</p>
                <p className="text-xs text-white italic">"{result.selfEvaluation}"</p>
              </div>
            )}

            {/* Dynamic Widget */}
            {result.dynamicWidget && (
              <div className="border-t border-slate-700 pt-4 bg-slate-700/30 p-4 rounded-lg">
                <p className="text-sm text-gray-400 font-medium mb-3">📊 {result.dynamicWidget.title}</p>
                <div className="text-white text-xs space-y-2">
                  {result.dynamicWidget.widgetType === 'metric-slider' && (
                    <div>
                      <p className="text-gray-400 mb-2">{result.dynamicWidget.config.metricLabel}</p>
                      <input
                        type="range"
                        min={result.dynamicWidget.config.min}
                        max={result.dynamicWidget.config.max}
                        defaultValue={result.dynamicWidget.config.defaultValue}
                        className="w-full"
                        disabled
                      />
                      <p className="text-center mt-2 font-bold text-purple-400">
                        {result.dynamicWidget.config.defaultValue} {result.dynamicWidget.config.unit}
                      </p>
                    </div>
                  )}
                  {result.dynamicWidget.widgetType === 'smart-checklist' && (
                    <div className="space-y-2">
                      {result.dynamicWidget.config.items?.map((item: string, idx: number) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuantumAgent