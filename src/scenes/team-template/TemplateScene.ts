import * as THREE from 'three';
import type { SceneInterface, TourPoint } from '../../types/scene';
import {
  createBox,
  createSphere,
  createCylinder,
  createCone,
  createGroundPlane,
  COLORS,
} from '../../utils/primitives';

/**
 * Template Scene - Copy this file to create your team's scene!
 *
 * Instructions:
 * 1. Copy this entire folder to src/scenes/your-team-name/
 * 2. Rename this file to match your team (e.g., YourTeamScene.ts)
 * 3. Update the class name and all the properties below
 * 4. Add your scene to src/scenes/registry.ts
 */
export class TemplateScene implements SceneInterface {
  // TODO: Update these properties for your scene
  readonly sceneId = 'template-scene';
  readonly sceneName = 'Template Scene'; // Your scene's display name
  readonly description = 'A template scene for teams to copy and customize';

  /**
   * Build your 3D scene here!
   * Create your unique 3D world with complete creative freedom!
   *
   * @param scene - The Three.js scene to add objects to
   */
  async buildScene(scene: THREE.Scene): Promise<void> {
    // Option 1: Add ground plane for traditional earth-based scenes
    const ground = createGroundPlane({
      size: 30,
      color: COLORS.GRASS,
    });
    scene.add(ground);

    // Option 2: For space scenes, uncomment this instead:
    // import { createSpaceEnvironment } from '../../utils/primitives'
    // createSpaceEnvironment(scene)

    // TODO: Replace this example with your scene!

    // Example: Simple house
    const house = createBox({
      width: 3,
      height: 3,
      depth: 2,
      position: { x: 0, y: 1.5, z: 0 },
      color: COLORS.WOOD,
    });
    scene.add(house);

    // Example: House roof
    const roof = createCone({
      radius: 2.2,
      height: 1.8,
      position: { x: 0, y: 3.9, z: 0 },
      color: COLORS.RED,
    });
    scene.add(roof);

    // Example: Tree
    const trunk = createCylinder({
      radiusTop: 0.3,
      radiusBottom: 0.3,
      height: 2,
      position: { x: -5, y: 1, z: 0 },
      color: COLORS.TREE_TRUNK,
    });
    scene.add(trunk);

    const leaves = createSphere({
      radius: 1.5,
      position: { x: -5, y: 3, z: 0 },
      color: COLORS.TREE_LEAVES,
    });
    scene.add(leaves);

    // Example: Ground decoration
    const flower = createSphere({
      radius: 0.3,
      position: { x: 2, y: 0.3, z: 2 },
      color: COLORS.PINK,
    });
    scene.add(flower);

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
        name: 'Scene Overview',
        description: "Welcome to our scene! Here's the general overview.",
        cameraPosition: new THREE.Vector3(10, 8, 10),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 3,
      },
      {
        name: 'Main Building',
        description: 'Check out our main structure here.',
        cameraPosition: new THREE.Vector3(3, 4, 3),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 2,
      },
      // TODO: Add more tour points to showcase your scene!
      // Each point should highlight something interesting
    ];
  }
}

/*
 * NEXT STEPS:
 *
 * 1. Copy this folder to: src/scenes/your-scene-name/
 * 2. Rename this file to match your scene
 * 3. Update the class name from TemplateScene to YourSceneClass
 * 4. Update sceneId, sceneName, and description
 * 5. Replace the example objects with your scene
 * 6. Add your scene to src/scenes/registry.ts:
 *
 *    import { YourSceneClass } from './your-scene-name/YourSceneClass'
 *
 *    export const SCENE_REGISTRY: SceneRegistryEntry[] = [
 *      // ... existing scenes
 *      {
 *        sceneClass: YourSceneClass,
 *        enabled: true
 *      }
 *    ];
 *
 * 7. Test your scene using npm run dev
 * 8. Navigate to Scene Selector and preview your scene
 * 9. Build something amazing! 🎉
 */
