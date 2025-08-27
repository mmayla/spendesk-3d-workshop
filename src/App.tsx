import { useState } from 'react'
import ThreeScene from './ThreeScene'
import CombinedSceneViewer from './components/CombinedSceneViewer'
import WorkshopMode from './components/WorkshopMode'
import { TeamScene } from './utils/sceneCombiner'
import './App.css'

type AppMode = 'build' | 'workshop' | 'combined'

function App() {
  const [mode, setMode] = useState<AppMode>('build')
  const [teamScenes, setTeamScenes] = useState<TeamScene[]>([])

  const handleShowWorkshopMode = () => {
    setMode('workshop')
  }

  const handleShowCombined = (scenes: TeamScene[]) => {
    setTeamScenes(scenes)
    setMode('combined')
  }

  const handleBackToBuilding = () => {
    setMode('build')
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {mode === 'build' && (
        <>
          <ThreeScene />
          <button
            onClick={handleShowWorkshopMode}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              zIndex: 1000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F57C00'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9800'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            🎯 Workshop Mode
          </button>
        </>
      )}
      
      {mode === 'workshop' && (
        <>
          <ThreeScene />
          <WorkshopMode
            onShowCombined={handleShowCombined}
            onLoadSampleScenes={handleBackToBuilding}
          />
        </>
      )}
      
      {mode === 'combined' && (
        <CombinedSceneViewer
          teamScenes={teamScenes}
          onClose={handleBackToBuilding}
        />
      )}
    </div>
  )
}

export default App
