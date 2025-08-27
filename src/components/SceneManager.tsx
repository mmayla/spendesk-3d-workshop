import React, { useRef } from 'react'

interface SceneManagerProps {
  onSaveScene: () => void
  onLoadScene: (data: any[]) => void
  onExportScene: () => string
}

const SceneManager: React.FC<SceneManagerProps> = ({
  onSaveScene: _onSaveScene,
  onLoadScene,
  onExportScene
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveToFile = () => {
    const sceneData = onExportScene()
    const dataBlob = new Blob([sceneData], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `scene-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const sceneData = JSON.parse(e.target?.result as string)
        onLoadScene(sceneData)
      } catch (error) {
        alert('Error loading scene file. Please make sure it\'s a valid scene file.')
        console.error('Error parsing scene file:', error)
      }
    }
    reader.readAsText(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      display: 'flex',
      gap: '10px',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleLoadFromFile}
        style={{ display: 'none' }}
      />
      
      <button
        onClick={handleSaveToFile}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50'
        }}
      >
        💾 Save Scene
      </button>
      
      <button
        onClick={triggerFileInput}
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1976D2'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3'
        }}
      >
        📁 Load Scene
      </button>
    </div>
  )
}

export default SceneManager