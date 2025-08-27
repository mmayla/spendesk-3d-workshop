import * as THREE from 'three'
import { createPrimitive } from './primitives'
import type { PrimitiveType } from '../types'

export interface SceneData {
  id: string
  type: PrimitiveType | 'group'
  name: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  color: number
}

export interface TeamScene {
  teamName: string
  objects: SceneData[]
  metadata?: {
    createdAt: string
    description?: string
  }
}

export interface CombinedSceneConfig {
  gridSize: number
  spacing: number
  maxTeamsPerRow: number
}

export class SceneCombiner {
  private scene: THREE.Scene
  private config: CombinedSceneConfig

  constructor(scene: THREE.Scene, config: CombinedSceneConfig = {
    gridSize: 50,
    spacing: 60,
    maxTeamsPerRow: 4
  }) {
    this.scene = scene
    this.config = config
  }

  calculateTeamPosition(teamIndex: number): { x: number; z: number } {
    const row = Math.floor(teamIndex / this.config.maxTeamsPerRow)
    const col = teamIndex % this.config.maxTeamsPerRow
    
    // Center the grid
    const totalCols = Math.min(teamIndex + 1, this.config.maxTeamsPerRow)
    const startX = -(totalCols - 1) * this.config.spacing / 2
    
    return {
      x: startX + col * this.config.spacing,
      z: row * this.config.spacing
    }
  }

  loadTeamScene(teamScene: TeamScene, teamIndex: number): THREE.Group {
    const teamGroup = new THREE.Group()
    teamGroup.name = `team-${teamScene.teamName}`
    
    // Calculate team's position in the combined world
    const teamOffset = this.calculateTeamPosition(teamIndex)
    
    // Create objects from the team's scene data
    teamScene.objects.forEach(objData => {
      if (objData.type !== 'group') {
        const mesh = createPrimitive(objData.type as PrimitiveType, {
          color: objData.color,
          position: {
            x: objData.position.x,
            y: objData.position.y,
            z: objData.position.z
          },
          rotation: objData.rotation,
          scale: objData.scale
        })
        
        teamGroup.add(mesh)
      }
    })
    
    // Position the team's scene in the world grid
    teamGroup.position.set(teamOffset.x, 0, teamOffset.z)
    
    // Add team label
    this.addTeamLabel(teamGroup, teamScene.teamName, teamOffset)
    
    return teamGroup
  }

  private addTeamLabel(teamGroup: THREE.Group, teamName: string, _position: { x: number; z: number }): void {
    // Create a simple text representation using basic geometry
    // In a real implementation, you might want to use TextGeometry or Canvas texture
    const labelGeometry = new THREE.PlaneGeometry(20, 4)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    
    canvas.width = 512
    canvas.height = 128
    
    // Draw text on canvas
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000000'
    context.font = 'bold 48px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(teamName, canvas.width / 2, canvas.height / 2)
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    const labelMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    })
    
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)
    labelMesh.position.set(0, 15, -this.config.gridSize / 2 - 5)
    labelMesh.rotation.x = -Math.PI / 4
    
    teamGroup.add(labelMesh)
  }

  combineAllScenes(teamScenes: TeamScene[]): void {
    // Clear existing combined scenes (keep only ground and lighting)
    const objectsToRemove: THREE.Object3D[] = []
    this.scene.traverse((child) => {
      if (child.name.startsWith('team-')) {
        objectsToRemove.push(child)
      }
    })
    objectsToRemove.forEach(obj => this.scene.remove(obj))

    // Add each team's scene
    teamScenes.forEach((teamScene, index) => {
      const teamGroup = this.loadTeamScene(teamScene, index)
      this.scene.add(teamGroup)
    })

    // Add district boundaries
    this.addDistrictBoundaries(teamScenes.length)
  }

  private addDistrictBoundaries(totalTeams: number): void {
    // Add visual boundaries between team districts
    const boundaryMaterial = new THREE.LineBasicMaterial({ 
      color: 0x444444,
      opacity: 0.5,
      transparent: true
    })

    for (let i = 0; i < totalTeams; i++) {
      const position = this.calculateTeamPosition(i)
      const halfSize = this.config.gridSize / 2

      // Create boundary box for each team's area
      const points = [
        new THREE.Vector3(position.x - halfSize, 0, position.z - halfSize),
        new THREE.Vector3(position.x + halfSize, 0, position.z - halfSize),
        new THREE.Vector3(position.x + halfSize, 0, position.z + halfSize),
        new THREE.Vector3(position.x - halfSize, 0, position.z + halfSize),
        new THREE.Vector3(position.x - halfSize, 0, position.z - halfSize)
      ]

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, boundaryMaterial)
      line.name = `boundary-${i}`
      
      this.scene.add(line)
    }
  }

  exportCombinedScene(): string {
    const combinedData = {
      metadata: {
        createdAt: new Date().toISOString(),
        totalTeams: 0,
        description: 'Combined workshop scenes'
      },
      teams: [] as any[]
    }

    this.scene.traverse((child) => {
      if (child.name.startsWith('team-')) {
        const teamName = child.name.replace('team-', '')
        const teamObjects: SceneData[] = []

        child.traverse((mesh) => {
          if (mesh instanceof THREE.Mesh && mesh !== child) {
            const material = mesh.material as THREE.MeshLambertMaterial
            teamObjects.push({
              id: `${teamName}-${teamObjects.length}`,
              type: 'box', // Simplified for demo
              name: `${teamName}-object-${teamObjects.length}`,
              position: {
                x: mesh.position.x,
                y: mesh.position.y,
                z: mesh.position.z
              },
              rotation: {
                x: mesh.rotation.x,
                y: mesh.rotation.y,
                z: mesh.rotation.z
              },
              scale: {
                x: mesh.scale.x,
                y: mesh.scale.y,
                z: mesh.scale.z
              },
              color: material.color.getHex()
            })
          }
        })

        combinedData.teams.push({
          teamName,
          objects: teamObjects
        })
      }
    })

    combinedData.metadata.totalTeams = combinedData.teams.length

    return JSON.stringify(combinedData, null, 2)
  }

  // Helper method to create sample team scenes for testing
  static createSampleTeamScenes(): TeamScene[] {
    return [
      {
        teamName: 'Village Builders',
        objects: [
          {
            id: 'house1',
            type: 'box',
            name: 'Main House',
            position: { x: 0, y: 1.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 2, y: 3, z: 1.5 },
            color: 0x8B4513
          },
          {
            id: 'tree1',
            type: 'cylinder',
            name: 'Tree Trunk',
            position: { x: -5, y: 1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.6, y: 2, z: 0.6 },
            color: 0x8B4513
          },
          {
            id: 'leaves1',
            type: 'sphere',
            name: 'Tree Leaves',
            position: { x: -5, y: 3, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1.2, y: 1.2, z: 1.2 },
            color: 0x228B22
          }
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          description: 'A peaceful village scene'
        }
      },
      {
        teamName: 'Space Station Alpha',
        objects: [
          {
            id: 'module1',
            type: 'box',
            name: 'Command Module',
            position: { x: 0, y: 2, z: 0 },
            rotation: { x: 0, y: Math.PI / 4, z: 0 },
            scale: { x: 3, y: 1.5, z: 3 },
            color: 0xC0C0C0
          },
          {
            id: 'antenna1',
            type: 'cylinder',
            name: 'Communications Array',
            position: { x: 0, y: 4, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.2, y: 2, z: 0.2 },
            color: 0xFFD700
          }
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          description: 'Advanced space station'
        }
      }
    ]
  }
}