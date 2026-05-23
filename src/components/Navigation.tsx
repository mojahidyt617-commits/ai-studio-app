import React from 'react'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: any) => void
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const tabs = [
    { id: 'character', label: '🎭 Character Generator', icon: '👤' },
    { id: 'thumbnail', label: '🎬 Thumbnail Maker', icon: '📺' },
    { id: 'prompt', label: '✨ Prompt Engineer', icon: '💡' },
    { id: 'inspiration', label: '🎨 Design Inspiration', icon: '🌈' },
    { id: 'brand', label: '🏢 Brand Identity', icon: '💼' },
    { id: 'color', label: '🎨 Color Palette', icon: '🖌️' },
    { id: 'quantum', label: '🔬 Quantum Agent', icon: '🤖' },
    { id: 'image', label: '🖼️ Image Generator', icon: '🎆' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✨</div>
            <h1 className="text-xl font-bold gradient-text">AI Studio Suite</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
                title={tab.label}
              >
                {tab.icon}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-slate-700 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsOpen(false)
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-lg">{tab.icon}</div>
                  <div className="text-xs mt-1">{tab.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation