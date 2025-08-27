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
export default function TeamSelector({ onShowMasterScene }: { 
  onShowMasterScene: () => void 
}) {
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
            Teams build individual 3D scenes using Three.js primitives. Preview your scene in isolation or see how they all combine together.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={onShowMasterScene}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              🌍 View All Scenes
            </button>
          </div>
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
                    
                    <div style={{
                      marginBottom: '20px',
                      fontSize: '14px',
                      color: '#555',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong>Size:</strong> {scene.bounds.width}×{scene.bounds.height} units
                      </div>
                      <div>
                        {scene.hasTourPoints && '🎬'}
                      </div>
                    </div>
                    
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

        {/* Instructions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          marginTop: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
            For Teams: How to Add Your Scene
          </h3>
          <ol style={{ margin: '0', paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
            <li>Create a new folder under <code>src/scenes/your-team-name/</code></li>
            <li>Create a scene class that implements <code>TeamSceneInterface</code></li>
            <li>Add your scene to the registry in <code>src/scenes/registry.ts</code></li>
            <li>Your scene will automatically appear here for preview!</li>
          </ol>
          
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>💡 Pro tip:</strong> Copy the template scene from <code>src/scenes/team-template/</code> to get started quickly!
          </div>
          
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#e8f4fd',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>🧱 Available Primitives:</strong>
            <div style={{ marginTop: '8px', fontFamily: 'monospace' }}>
              createBox, createSphere, createCylinder, createCone, createPlane
            </div>
            <div style={{ marginTop: '8px', fontFamily: 'monospace' }}>
              createTree, createHouse (pre-made composites)
            </div>
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#f0f8e8',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>🎨 Available Colors:</strong>
            <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
              RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE, PINK, WHITE, BLACK, GRAY<br/>
              WOOD, STONE, GRASS, WATER, SAND, METAL, GOLD, SILVER<br/>
              TREE_TRUNK, TREE_LEAVES, SKY_BLUE, SUNSET_ORANGE, EARTH_BROWN
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}