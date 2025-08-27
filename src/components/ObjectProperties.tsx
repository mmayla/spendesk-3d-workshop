import React from 'react'
import type { SceneObject } from '../hooks/useSceneManager'
import { COLORS } from '../utils/primitives'

interface ObjectPropertiesProps {
  selectedObject: SceneObject | null
  onUpdatePosition: (position: { x: number; y: number; z: number }) => void
  onUpdateRotation: (rotation: { x: number; y: number; z: number }) => void
  onUpdateScale: (scale: { x: number; y: number; z: number }) => void
  onUpdateColor: (color: number) => void
  onDeleteObject: () => void
}

const ObjectProperties: React.FC<ObjectPropertiesProps> = ({
  selectedObject,
  onUpdatePosition,
  onUpdateRotation,
  onUpdateScale,
  onUpdateColor,
  onDeleteObject
}) => {
  if (!selectedObject) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: 1000,
        minWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', textAlign: 'center' }}>
          Object Properties
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#ccc', textAlign: 'center' }}>
          Select an object to edit its properties
        </p>
      </div>
    )
  }

  const predefinedColors = [
    { name: 'Red', value: COLORS.RED },
    { name: 'Green', value: COLORS.GREEN },
    { name: 'Blue', value: COLORS.BLUE },
    { name: 'Yellow', value: COLORS.YELLOW },
    { name: 'Orange', value: COLORS.ORANGE },
    { name: 'Purple', value: COLORS.PURPLE },
    { name: 'Wood', value: COLORS.WOOD },
    { name: 'Stone', value: COLORS.STONE },
    { name: 'Metal', value: COLORS.METAL },
    { name: 'Gold', value: COLORS.GOLD }
  ]

  const NumberInput: React.FC<{
    label: string
    value: number
    onChange: (value: number) => void
    step?: number
    min?: number
    max?: number
  }> = ({ label, value, onChange, step = 0.1, min, max }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <label style={{ minWidth: '20px', fontSize: '12px', color: '#ccc' }}>
        {label}:
      </label>
      <input
        type="number"
        value={value.toFixed(2)}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
        style={{
          backgroundColor: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '3px',
          padding: '4px 6px',
          fontSize: '12px',
          width: '60px',
          marginLeft: '8px'
        }}
      />
    </div>
  )

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1000,
      minWidth: '200px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', textAlign: 'center' }}>
        {selectedObject.name}
      </h3>

      {/* Position Controls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4CAF50' }}>
          Position
        </h4>
        <NumberInput
          label="X"
          value={selectedObject.position.x}
          onChange={(x) => onUpdatePosition({ ...selectedObject.position, x })}
        />
        <NumberInput
          label="Y"
          value={selectedObject.position.y}
          onChange={(y) => onUpdatePosition({ ...selectedObject.position, y })}
        />
        <NumberInput
          label="Z"
          value={selectedObject.position.z}
          onChange={(z) => onUpdatePosition({ ...selectedObject.position, z })}
        />
      </div>

      {/* Rotation Controls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2196F3' }}>
          Rotation (degrees)
        </h4>
        <NumberInput
          label="X"
          value={(selectedObject.rotation.x * 180) / Math.PI}
          onChange={(degrees) => onUpdateRotation({ 
            ...selectedObject.rotation, 
            x: (degrees * Math.PI) / 180 
          })}
          step={5}
        />
        <NumberInput
          label="Y"
          value={(selectedObject.rotation.y * 180) / Math.PI}
          onChange={(degrees) => onUpdateRotation({ 
            ...selectedObject.rotation, 
            y: (degrees * Math.PI) / 180 
          })}
          step={5}
        />
        <NumberInput
          label="Z"
          value={(selectedObject.rotation.z * 180) / Math.PI}
          onChange={(degrees) => onUpdateRotation({ 
            ...selectedObject.rotation, 
            z: (degrees * Math.PI) / 180 
          })}
          step={5}
        />
      </div>

      {/* Scale Controls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#FF9800' }}>
          Scale
        </h4>
        <NumberInput
          label="X"
          value={selectedObject.scale.x}
          onChange={(x) => onUpdateScale({ ...selectedObject.scale, x })}
          min={0.1}
          step={0.1}
        />
        <NumberInput
          label="Y"
          value={selectedObject.scale.y}
          onChange={(y) => onUpdateScale({ ...selectedObject.scale, y })}
          min={0.1}
          step={0.1}
        />
        <NumberInput
          label="Z"
          value={selectedObject.scale.z}
          onChange={(z) => onUpdateScale({ ...selectedObject.scale, z })}
          min={0.1}
          step={0.1}
        />
      </div>

      {/* Color Selection */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9C27B0' }}>
          Color
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '4px'
        }}>
          {predefinedColors.map(({ name, value }) => (
            <button
              key={name}
              onClick={() => onUpdateColor(value)}
              style={{
                width: '25px',
                height: '25px',
                backgroundColor: `#${value.toString(16).padStart(6, '0')}`,
                border: selectedObject.color === value ? '2px solid white' : '1px solid #555',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: 0
              }}
              title={name}
            />
          ))}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDeleteObject}
        style={{
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          width: '100%'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d32f2f'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f44336'
        }}
      >
        Delete Object
      </button>
    </div>
  )
}

export default ObjectProperties