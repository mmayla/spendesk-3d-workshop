import { useState } from 'react'
import { getSceneMetadata } from '../scenes/registry'
import ScenePreview from './ScenePreview'

/**
 * Scene Browser Component
 * 
 * Shows all available scenes and allows switching between:
 * - Individual scene previews
 * - Combined scene view
 */
export default function TeamSelector() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const sceneMetadata = getSceneMetadata()

  if (selectedTeam) {
    return (
      <ScenePreview
        teamId={selectedTeam}
        onBack={() => setSelectedTeam(null)}
      />
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: '0 0 15px 0', 
            color: '#333',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            🎯 3D Scene Workshop
          </h1>
          <p style={{ 
            margin: '0 0 20px 0', 
            color: '#666',
            fontSize: '18px',
            lineHeight: '1.5'
          }}>
            Teams build individual 3D scenes using Three.js primitives. Create your unique 3D world with complete creative freedom.
          </p>
          
        </div>

        {/* Scenes Grid */}
        <div>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            color: '#333',
            fontSize: '24px' 
          }}>
            Scenes
          </h2>
          
          {sceneMetadata.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏗️</div>
              <h3 style={{ margin: '0 0 10px 0' }}>No scenes found</h3>
              <p style={{ margin: '0' }}>
                Teams need to add their scenes to the registry.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {sceneMetadata.map((scene) => {
                if (!scene) return null
                
                return (
                  <div
                    key={scene.teamId}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '25px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '2px solid #e9ecef'
                    }}
                  >
                    <div style={{
                      marginBottom: '15px'
                    }}>
                      <h3 style={{ 
                        margin: 0,
                        fontSize: '20px',
                        color: '#333'
                      }}>
                        {scene.teamName}
                      </h3>
                    </div>
                    
                    <p style={{
                      margin: '0 0 15px 0',
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {scene.description}
                    </p>
                    
                    
                    <button
                      onClick={() => setSelectedTeam(scene.teamId)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      👁️ Preview Scene
                    </button>
                    
                    <div style={{
                      marginTop: '10px',
                      fontSize: '12px',
                      color: '#888',
                      fontFamily: 'monospace'
                    }}>
                      ID: {scene.teamId}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          marginTop: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Ready to Build Your Scene?
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '16px' }}>
            Check out the <strong>TEAM_GUIDE.md</strong> file for complete instructions on creating your 3D scene.
          </p>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#555'
          }}>
            💡 <strong>Quick Start:</strong> Copy the template from <code>src/scenes/team-template/</code> and follow the guide!
          </div>
        </div>
      </div>
    </div>
  )
}