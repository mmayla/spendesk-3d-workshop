import React from 'react'
import { PrimitiveType } from '../utils/primitives'

interface PrimitiveToolbarProps {
  selectedPrimitive: PrimitiveType
  onPrimitiveSelect: (primitive: PrimitiveType) => void
  onAddPrimitive: () => void
  onClearScene: () => void
}

const PrimitiveToolbar: React.FC<PrimitiveToolbarProps> = ({
  selectedPrimitive,
  onPrimitiveSelect,
  onAddPrimitive,
  onClearScene
}) => {
  const primitives: { type: PrimitiveType; label: string; icon: string }[] = [
    { type: 'box', label: 'Box', icon: '□' },
    { type: 'sphere', label: 'Sphere', icon: '●' },
    { type: 'cylinder', label: 'Cylinder', icon: '○' },
    { type: 'cone', label: 'Cone', icon: '△' },
    { type: 'plane', label: 'Plane', icon: '▭' }
  ]

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 1000,
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      minWidth: '150px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', textAlign: 'center' }}>
        Scene Builder
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', color: '#ccc' }}>Select Primitive:</label>
        {primitives.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onPrimitiveSelect(type)}
            style={{
              backgroundColor: selectedPrimitive === type ? '#4CAF50' : '#333',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedPrimitive !== type) {
                e.currentTarget.style.backgroundColor = '#555'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPrimitive !== type) {
                e.currentTarget.style.backgroundColor = '#333'
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={onAddPrimitive}
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          marginTop: '10px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1976D2'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3'
        }}
      >
        Add {selectedPrimitive.charAt(0).toUpperCase() + selectedPrimitive.slice(1)}
      </button>

      <button
        onClick={onClearScene}
        style={{
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          padding: '8px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '5px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d32f2f'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f44336'
        }}
      >
        Clear Scene
      </button>
    </div>
  )
}

export default PrimitiveToolbar