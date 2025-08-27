import * as THREE from 'three'

/**
 * Interface that all scenes must implement
 * Create your unique 3D world with complete creative freedom
 */
export interface SceneInterface {
  /**
   * Unique identifier for the scene
   * Must be URL-safe and match the folder name
   */
  readonly sceneId: string

  /**
   * Display name for the scene
   */
  readonly sceneName: string

  /**
   * Brief description of the scene concept
   */
  readonly description: string

  /**
   * Build and populate your scene
   * Create your 3D world with complete creative freedom!
   * 
   * @param scene - THREE.Scene to add objects to
   * @returns Promise that resolves when scene building is complete
   */
  buildScene(scene: THREE.Scene): Promise<void>

  /**
   * Optional method to get tour points of interest in this scene
   * Create cinematic camera positions to showcase your work!
   */
  getTourPoints?(): TourPoint[]
}

/**
 * Tour point definition for guided tours
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
   */
  cameraPosition: THREE.Vector3

  /**
   * Camera look-at target
   */
  lookAtTarget: THREE.Vector3

  /**
   * Duration to pause at this point (in seconds)
   */
  duration: number
}

/**
 * Scene registry entry
 */
export interface SceneRegistryEntry {
  sceneClass: new () => SceneInterface
  enabled: boolean
}