import { useCallback, useRef, useState } from 'react'
import * as THREE from 'three'
import { createPrimitive, COLORS } from '../utils/primitives'
import type { PrimitiveType } from '../types'

export interface SceneObject {
  id: string
  mesh: THREE.Mesh | THREE.Group
  type: PrimitiveType | 'group'
  name: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  color: number
}

export const useSceneManager = (scene?: THREE.Scene) => {
  const [objects, setObjects] = useState<SceneObject[]>([])
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null)
  const objectIdCounter = useRef(0)

  const generateId = useCallback(() => {
    objectIdCounter.current += 1
    return `object-${objectIdCounter.current}`
  }, [])

  const addPrimitive = useCallback((
    type: PrimitiveType, 
    position: { x: number; y: number; z: number } = { x: 0, y: 1, z: 0 },
    options: { color?: number; scale?: { x: number; y: number; z: number } } = {}
  ) => {
    if (!scene) return null

    const id = generateId()
    const color = options.color ?? COLORS.BLUE
    const scale = options.scale ?? { x: 1, y: 1, z: 1 }
    
    const mesh = createPrimitive(type, {
      color,
      position,
      scale
    })

    mesh.userData = { id, type }
    scene.add(mesh)

    const sceneObject: SceneObject = {
      id,
      mesh,
      type,
      name: `${type}-${objectIdCounter.current}`,
      position: { ...position },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { ...scale },
      color
    }

    setObjects(prev => [...prev, sceneObject])
    return sceneObject
  }, [scene, generateId])

  const removeObject = useCallback((id: string) => {
    if (!scene) return

    const objectToRemove = objects.find(obj => obj.id === id)
    if (objectToRemove) {
      scene.remove(objectToRemove.mesh)
      setObjects(prev => prev.filter(obj => obj.id !== id))
      if (selectedObject?.id === id) {
        setSelectedObject(null)
      }
    }
  }, [scene, objects, selectedObject])

  const updateObjectPosition = useCallback((id: string, position: { x: number; y: number; z: number }) => {
    const object = objects.find(obj => obj.id === id)
    if (object) {
      object.mesh.position.set(position.x, position.y, position.z)
      object.position = { ...position }
      
      setObjects(prev => prev.map(obj => 
        obj.id === id ? { ...obj, position: { ...position } } : obj
      ))
    }
  }, [objects])

  const updateObjectRotation = useCallback((id: string, rotation: { x: number; y: number; z: number }) => {
    const object = objects.find(obj => obj.id === id)
    if (object) {
      object.mesh.rotation.set(rotation.x, rotation.y, rotation.z)
      object.rotation = { ...rotation }
      
      setObjects(prev => prev.map(obj => 
        obj.id === id ? { ...obj, rotation: { ...rotation } } : obj
      ))
    }
  }, [objects])

  const updateObjectScale = useCallback((id: string, scale: { x: number; y: number; z: number }) => {
    const object = objects.find(obj => obj.id === id)
    if (object) {
      object.mesh.scale.set(scale.x, scale.y, scale.z)
      object.scale = { ...scale }
      
      setObjects(prev => prev.map(obj => 
        obj.id === id ? { ...obj, scale: { ...scale } } : obj
      ))
    }
  }, [objects])

  const updateObjectColor = useCallback((id: string, color: number) => {
    const object = objects.find(obj => obj.id === id)
    if (object && object.mesh instanceof THREE.Mesh) {
      const material = object.mesh.material as THREE.MeshLambertMaterial
      material.color.setHex(color)
      object.color = color
      
      setObjects(prev => prev.map(obj => 
        obj.id === id ? { ...obj, color } : obj
      ))
    }
  }, [objects])

  const selectObject = useCallback((object: SceneObject | null) => {
    setSelectedObject(object)
  }, [])

  const clearScene = useCallback(() => {
    if (!scene) return

    objects.forEach(obj => {
      scene.remove(obj.mesh)
    })
    
    setObjects([])
    setSelectedObject(null)
    objectIdCounter.current = 0
  }, [scene, objects])

  const getSceneData = useCallback(() => {
    return objects.map(obj => ({
      id: obj.id,
      type: obj.type,
      name: obj.name,
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
      color: obj.color
    }))
  }, [objects])

  const loadSceneData = useCallback((data: any[]) => {
    clearScene()
    
    data.forEach(objData => {
      if (objData.type !== 'group') {
        addPrimitive(objData.type, objData.position, {
          color: objData.color,
          scale: objData.scale
        })
      }
    })
  }, [clearScene, addPrimitive])

  return {
    objects,
    selectedObject,
    addPrimitive,
    removeObject,
    updateObjectPosition,
    updateObjectRotation,
    updateObjectScale,
    updateObjectColor,
    selectObject,
    clearScene,
    getSceneData,
    loadSceneData
  }
}