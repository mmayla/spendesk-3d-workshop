import type { SceneRegistryEntry } from '../types/scene'
import { VillageScene } from './village-builders/VillageScene'
import { SpaceStationScene } from './space-station/SpaceStationScene'
import { TempleScene } from './ancient-temple/TempleScene'
import { CarnivalScene } from './carnival/CarnivalScene'

/**
 * Central registry for all team scenes
 * 
 * Teams should add their scene classes here to make them available
 * in the preview system.
 * 
 * To add a new team scene:
 * 1. Import your scene class at the top
 * 2. Add an entry to SCENE_REGISTRY with your scene class and enabled: true
 * 3. Your scene will automatically appear in the scene selector
 */
export const SCENE_REGISTRY: Record<string, SceneRegistryEntry> = {
  'village-builders': {
    sceneClass: VillageScene,
    enabled: true
  },
  
  'space-station': {
    sceneClass: SpaceStationScene,
    enabled: true
  },
  
  'ancient-temple': {
    sceneClass: TempleScene,
    enabled: false
  },
  
  'carnival': {
    sceneClass: CarnivalScene,
    enabled: false
  }
  
  // Teams: Add your scene here!
  // Example:
  // 'your-team-name': {
  //   sceneClass: YourSceneClass,
  //   enabled: true
  // }
}

/**
 * Get all enabled scenes from the registry
 */
export function getEnabledScenes(): SceneRegistryEntry[] {
  return Object.values(SCENE_REGISTRY).filter(entry => entry.enabled)
}

/**
 * Get a specific scene by team ID
 */
export function getSceneByTeamId(teamId: string): SceneRegistryEntry | undefined {
  return SCENE_REGISTRY[teamId]
}

/**
 * Get all registered team IDs
 */
export function getAllTeamIds(): string[] {
  return Object.keys(SCENE_REGISTRY)
}

/**
 * Get all enabled team IDs
 */
export function getEnabledTeamIds(): string[] {
  return Object.entries(SCENE_REGISTRY)
    .filter(([, entry]) => entry.enabled)
    .map(([teamId]) => teamId)
}

/**
 * Create an instance of a team scene
 */
export function createSceneInstance(teamId: string) {
  const entry = SCENE_REGISTRY[teamId]
  if (!entry) {
    throw new Error(`Scene not found for team ID: ${teamId}`)
  }
  
  if (!entry.enabled) {
    throw new Error(`Scene is disabled for team ID: ${teamId}`)
  }
  
  return new entry.sceneClass()
}

/**
 * Validate that a team scene implements the required interface
 */
export function validateSceneInterface(teamId: string): boolean {
  try {
    const scene = createSceneInstance(teamId)
    
    // Check required properties
    const requiredProps = ['teamId', 'teamName', 'description', 'buildScene']
    for (const prop of requiredProps) {
      if (!(prop in scene)) {
        console.error(`Scene ${teamId} missing required property: ${prop}`)
        return false
      }
    }
    
    // Check buildScene is a function
    if (typeof scene.buildScene !== 'function') {
      console.error(`Scene ${teamId} buildScene is not a function`)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`Error validating scene ${teamId}:`, error)
    return false
  }
}

/**
 * Get scene metadata for all enabled scenes
 */
export function getSceneMetadata() {
  return getEnabledTeamIds().map(teamId => {
    try {
      const scene = createSceneInstance(teamId)
      return {
        teamId: scene.teamId,
        teamName: scene.teamName,
        description: scene.description,
        hasTourPoints: typeof scene.getTourPoints === 'function',
        hasDispose: typeof scene.dispose === 'function'
      }
    } catch (error) {
      console.error(`Error getting metadata for scene ${teamId}:`, error)
      return null
    }
  }).filter(Boolean)
}

/**
 * Development helper: Validate all registered scenes
 */
export function validateAllScenes(): Record<string, boolean> {
  const results: Record<string, boolean> = {}
  
  for (const teamId of getAllTeamIds()) {
    results[teamId] = validateSceneInterface(teamId)
  }
  
  return results
}

// Development mode logging
if (import.meta.env.DEV) {
  console.log('🎯 Scene Registry Loaded')
  console.log('📋 Registered Teams:', getAllTeamIds())
  console.log('✅ Enabled Teams:', getEnabledTeamIds())
  
  // Validate all scenes in development
  const validationResults = validateAllScenes()
  const invalidScenes = Object.entries(validationResults)
    .filter(([, isValid]) => !isValid)
    .map(([teamId]) => teamId)
  
  if (invalidScenes.length > 0) {
    console.warn('⚠️  Invalid scenes found:', invalidScenes)
  } else {
    console.log('✨ All scenes are valid!')
  }
}