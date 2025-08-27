import * as THREE from 'three'

/**
 * Strict interface that all team scenes must implement
 * This ensures compatibility with the master scene system
 */
export interface TeamSceneInterface {
  /**
   * Unique identifier for the team/scene
   * Must be URL-safe and match the folder name
   */
  readonly teamId: string

  /**
   * Display name for the team (shown in master scene labels)
   */
  readonly teamName: string

  /**
   * Brief description of the scene concept
   */
  readonly description: string

  /**
   * Estimated bounding box dimensions for scene positioning
   * Used by master scene to arrange districts properly
   */
  readonly bounds: {
    width: number   // X-axis extent
    height: number  // Y-axis extent  
    depth: number   // Z-axis extent
  }

  /**
   * Build and populate the team's scene
   * This method will be called by both individual preview and master scene
   * 
   * @param scene - THREE.Scene to add objects to
   * @param position - World position offset (provided by master scene)
   * @returns Promise that resolves when scene building is complete
   */
  buildScene(scene: THREE.Scene, position?: THREE.Vector3): Promise<void>

  /**
   * Optional cleanup method called when scene is removed
   * Use this to dispose of geometries, materials, textures etc.
   */
  dispose?(): void

  /**
   * Optional method to get tour points of interest in this scene
   * Used by master scene for the guided tour feature
   */
  getTourPoints?(): TourPoint[]
}

/**
 * Tour point definition for guided tours in master scene
 */
export interface TourPoint {
  /**
   * Name/title of this point of interest
   */
  name: string

  /**
   * Description shown during tour
   */
  description: string

  /**
   * Camera position for viewing this point
   * Relative to the scene's origin position
   */
  cameraPosition: THREE.Vector3

  /**
   * Camera look-at target
   * Relative to the scene's origin position
   */
  lookAtTarget: THREE.Vector3

  /**
   * Duration to pause at this point (in seconds)
   */
  duration: number
}

/**
 * Scene registry entry used by master scene
 */
export interface SceneRegistryEntry {
  sceneClass: new () => TeamSceneInterface
  enabled: boolean
}

/**
 * Master scene configuration
 */
export interface MasterSceneConfig {
  /**
   * Spacing between team districts
   */
  districtSpacing: number

  /**
   * Maximum teams per row in the grid layout
   */
  maxTeamsPerRow: number

  /**
   * Whether to show team labels in the master scene
   */
  showTeamLabels: boolean

  /**
   * Whether to automatically start the tour
   */
  autoStartTour: boolean
}