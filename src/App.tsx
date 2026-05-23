import React, { useState } from 'react'
import Navigation from './components/Navigation'
import CharacterGenerator from './components/CharacterGenerator'
import ThumbnailMaker from './components/ThumbnailMaker'
import PromptEngineer from './components/PromptEngineer'
import DesignInspiration from './components/DesignInspiration'
import BrandIdentity from './components/BrandIdentity'
import ColorPalette from './components/ColorPalette'
import QuantumAgent from './components/QuantumAgent'
import ImageGenerator from './components/ImageGenerator'

type ActiveTab = 'character' | 'thumbnail' | 'prompt' | 'inspiration' | 'brand' | 'color' | 'quantum' | 'image'

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('character')

  const renderContent = () => {
    switch (activeTab) {
      case 'character':
        return <CharacterGenerator />
      case 'thumbnail':
        return <ThumbnailMaker />
      case 'prompt':
        return <PromptEngineer />
      case 'inspiration':
        return <DesignInspiration />
      case 'brand':
        return <BrandIdentity />
      case 'color':
        return <ColorPalette />
      case 'quantum':
        return <QuantumAgent />
      case 'image':
        return <ImageGenerator />
      default:
        return <CharacterGenerator />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App