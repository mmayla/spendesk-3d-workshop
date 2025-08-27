import React, { useState } from 'react'
import { SceneCombiner } from '../utils/sceneCombiner'
import type { TeamScene } from '../utils/sceneCombiner'

interface WorkshopModeProps {
  onShowCombined: (teamScenes: TeamScene[]) => void
  onLoadSampleScenes: () => void
}

const WorkshopMode: React.FC<WorkshopModeProps> = ({
  onShowCombined,
  onLoadSampleScenes
}) => {
  const [teamScenes, setTeamScenes] = useState<TeamScene[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadTeamScenes = async () => {
    setIsLoading(true)
    
    // Simulate loading team scenes from multiple files
    // In a real workshop, this would load from a shared folder or server
    try {
      const sampleScenes = SceneCombiner.createSampleTeamScenes()
      setTeamScenes(sampleScenes)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const promises = Array.from(files).map(file => {
      return new Promise<TeamScene>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const sceneData = JSON.parse(e.target?.result as string)
            
            // Convert individual scene to team scene format
            const teamScene: TeamScene = {
              teamName: file.name.replace('.json', '').replace(/[^a-zA-Z0-9]/g, ' '),
              objects: Array.isArray(sceneData) ? sceneData : [sceneData],
              metadata: {
                createdAt: new Date().toISOString(),
                description: `Scene from ${file.name}`
              }
            }
            resolve(teamScene)
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    })

    Promise.all(promises)
      .then(scenes => {
        setTeamScenes(prev => [...prev, ...scenes])
      })
      .catch(error => {
        alert('Error loading some scene files. Please check the file formats.')
        console.error('Error loading team scenes:', error)
      })

    // Reset input
    event.target.value = ''
  }

  const handleRemoveTeam = (index: number) => {
    setTeamScenes(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: '30px',
      borderRadius: '15px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1500,
      minWidth: '400px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '24px', 
        textAlign: 'center',
        background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        🎯 Workshop Master Control
      </h2>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#4CAF50' }}>
          The Big Reveal Setup
        </h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', lineHeight: '1.5', color: '#ccc' }}>
          Teams think they're building individual scenes, but you're about to combine them all 
          into one massive virtual world! Each team's creation becomes a district in the combined universe.
        </p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2196F3' }}>
          Load Team Scenes
        </h4>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <label style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            📁 Upload Team Scenes
            <input
              type="file"
              multiple
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          
          <button
            onClick={handleLoadTeamScenes}
            disabled={isLoading}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? '⏳ Loading...' : '🎲 Load Sample Scenes'}
          </button>
        </div>
      </div>

      {/* Team Scenes List */}
      {teamScenes.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#9C27B0' }}>
            Loaded Team Scenes ({teamScenes.length})
          </h4>
          
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {teamScenes.map((scene, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: '#4CAF50' }}>{scene.teamName}</strong>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>
                    {scene.objects.length} objects
                    {scene.metadata?.description && ` • ${scene.metadata.description}`}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveTeam(index)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={() => onShowCombined(teamScenes)}
          disabled={teamScenes.length === 0}
          style={{
            backgroundColor: teamScenes.length === 0 ? '#666' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            cursor: teamScenes.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          🌟 REVEAL THE COMBINED WORLD! 🌟
        </button>
        
        <button
          onClick={onLoadSampleScenes}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          🔧 Continue Building
        </button>
      </div>

      {teamScenes.length === 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderRadius: '5px',
          border: '1px solid #FFC107',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          <strong>💡 Tip:</strong> Upload JSON scene files from teams or load sample scenes to see the magic!
        </div>
      )}
    </div>
  )
}

export default WorkshopMode