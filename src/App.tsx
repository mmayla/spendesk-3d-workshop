import { useState } from 'react'
import TeamSelector from './components/TeamSelector'
import MasterScene from './components/MasterScene'
import './App.css'

type AppMode = 'teams' | 'master'

function App() {
  const [mode, setMode] = useState<AppMode>('teams')

  const handleShowTeamSelector = () => {
    setMode('teams')
  }

  const handleShowMasterScene = () => {
    setMode('master')
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      {/* Primary Mode: Team Selector - Code-First Approach */}
      {mode === 'teams' && (
        <TeamSelector 
          onShowMasterScene={handleShowMasterScene}
        />
      )}

      {/* Master Scene - Combined World View */}
      {mode === 'master' && (
        <MasterScene onBack={handleShowTeamSelector} />
      )}
    </div>
  )
}

export default App