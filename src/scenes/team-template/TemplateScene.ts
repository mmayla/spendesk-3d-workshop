import * as THREE from 'three'
import type { TeamSceneInterface, TourPoint } from '../../types/scene'
import { createBox, createSphere, createCylinder, createCone, COLORS } from '../../utils/primitives'

/**
 * Template Scene - Copy this file to create your team's scene!
 * 
 * Instructions:
 * 1. Copy this entire folder to src/scenes/your-team-name/
 * 2. Rename this file to match your team (e.g., YourTeamScene.ts)
 * 3. Update the class name and all the properties below
 * 4. Add your scene to src/scenes/registry.ts
 */
export class TemplateScene implements TeamSceneInterface {
  // TODO: Update these properties for your team
  readonly teamId = 'team-template'        // MUST match your folder name
  readonly teamName = 'Template Team'      // Your team's display name
  readonly description = 'A template scene for teams to copy and customize'
  
  // TODO: Set realistic bounds for your scene
  readonly bounds = {
    width: 20,   // How wide your scene is (X axis)
    height: 10,  // How tall your scene is (Y axis) 
    depth: 15    // How deep your scene is (Z axis)
  }

  /**
   * Build your 3D scene here!
   * 
   * @param scene - The Three.js scene to add objects to
   * @param position - World position offset (automatically provided)
   */
  async buildScene(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): Promise<void> {
    // Helper function to position objects relative to your scene's origin
    const pos = (x: number, y: number, z: number) => ({
      x: position.x + x,
      y: position.y + y, 
      z: position.z + z
    })

    // TODO: Replace this example with your scene!
    
    // Example: Simple house
    const house = createBox({
      width: 3, height: 3, depth: 2,
      position: pos(0, 1.5, 0),
      color: COLORS.WOOD
    })
    scene.add(house)

    // Example: House roof
    const roof = createCone({
      radius: 2.2, height: 1.8,
      position: pos(0, 3.9, 0),
      color: COLORS.RED
    })
    scene.add(roof)

    // Example: Tree
    const trunk = createCylinder({
      radiusTop: 0.3, radiusBottom: 0.3, height: 2,
      position: pos(-5, 1, 0),
      color: COLORS.TREE_TRUNK
    })
    scene.add(trunk)

    const leaves = createSphere({
      radius: 1.5,
      position: pos(-5, 3, 0),
      color: COLORS.TREE_LEAVES
    })
    scene.add(leaves)

    // Example: Ground decoration
    const flower = createSphere({
      radius: 0.3,
      position: pos(2, 0.3, 2),
      color: COLORS.PINK
    })
    scene.add(flower)

    // TODO: Add more objects to build your amazing scene!
    // Available shapes:
    // - createBox({ width, height, depth, position, color })
    // - createSphere({ radius, position, color })
    // - createCylinder({ radiusTop, radiusBottom, height, position, color })
    // - createCone({ radius, height, position, color })
    //
    // Available colors: COLORS.RED, COLORS.BLUE, COLORS.GREEN, COLORS.WOOD, etc.
    // See TEAM_GUIDE.md for full color list
  }

  /**
   * Optional: Define tour points for the grand tour
   * Remove this method if you don't want tour points
   */
  getTourPoints(): TourPoint[] {
    return [
      {
        name: "Scene Overview",
        description: "Welcome to our scene! Here's the general overview.",
        cameraPosition: new THREE.Vector3(10, 8, 10),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 3
      },
      {
        name: "Main Building",
        description: "Check out our main structure here.",
        cameraPosition: new THREE.Vector3(3, 4, 3),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 2
      }
      // TODO: Add more tour points to showcase your scene!
      // Each point should highlight something interesting
    ]
  }

  /**
   * Optional: Cleanup method called when scene is removed
   * Remove this method if you don't need cleanup
   */
  dispose(): void {
    // TODO: Clean up any custom resources here if needed
    // For basic primitives, Three.js handles cleanup automatically
    console.log(`Disposing ${this.teamName} scene resources`)
  }
}

/*
 * NEXT STEPS:
 * 
 * 1. Copy this folder to: src/scenes/your-team-name/
 * 2. Rename this file to match your team
 * 3. Update the class name from TemplateScene to YourTeamScene
 * 4. Update teamId, teamName, description, and bounds
 * 5. Replace the example objects with your scene
 * 6. Add your scene to src/scenes/registry.ts:
 * 
 *    import { YourTeamScene } from './your-team-name/YourTeamScene'
 *    
 *    export const SCENE_REGISTRY: Record<string, SceneRegistryEntry> = {
 *      // ... existing scenes
 *      'your-team-name': {
 *        sceneClass: YourTeamScene,
 *        enabled: true
 *      }
 *    }
 * 
 * 7. Test your scene using npm run dev
 * 8. Navigate to Team Selector and preview your scene
 * 9. Build something amazing! 🎉
 */