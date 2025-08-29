import * as THREE from 'three';
import type { SceneInterface, TourPoint } from '../../types/scene';
import {
  createBox,
  createSphere,
  createCylinder,
  createCone,
  createGroundPlane,
  createBasicLighting,
  COLORS,
} from '../../utils/primitives';

const makeChair = (
  x: number,
  y: number,
  z: number,
  scene: THREE.Scene,
  rotation: number
) => {
  const groupChair = new THREE.Group();
  groupChair.position.set(0, 0,0);
  const backHeight = 1.5;
  const back = createBox({
    width: 1,
    height: backHeight,
    depth: 0.3,
    position: { x, y: y + backHeight / 2, z },
    color: COLORS.WOOD,
  });
  groupChair.add(back);

  const seatDepth = 1;
  const seatHeight = 0.3;
  const seat = createBox({
    width: 1,
    height: seatHeight,
    depth: seatDepth,
    position: { x, y, z: z + seatDepth / 2 - seatHeight / 2 },
    color: COLORS.WOOD,
  });
  groupChair.add(seat);

  const legHeight = 1.5;
  const leg1 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x - 0.4, y: y - legHeight / 2, z: z - 0.05 },
    color: COLORS.WOOD,
  });
  groupChair.add(leg1);

  const leg2 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x + 0.4, y: y - legHeight / 2, z: z - 0.05 },
    color: COLORS.WOOD,
  });
  groupChair.add(leg2);

  const leg3 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x + 0.4, y: y - legHeight / 2, z: z + 1 - 0.3 + 0.05 },
    color: COLORS.WOOD,
  });
  groupChair.add(leg3);

  const leg4 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x - 0.4, y: y - legHeight / 2, z: z + 1 - 0.3 + 0.05 },
    color: COLORS.WOOD,
  });
  groupChair.add(leg4);

  groupChair.rotateY(rotation);
  scene.add(groupChair);
};

const makeTable = (
  x: number,
  y: number,
  z: number,
  scene: THREE.Scene,
) => {
  const groupTable = new THREE.Group();

  const seat = createCylinder({
    radiusTop: 1.5,
    radiusBottom: 1.5,
    height: 0.2,
    segments: 32,
    position: { x, y, z },
    color: COLORS.WOOD,
  });
  groupTable.add(seat);

  const legHeight = 1.5;
  const leg1 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x - 0.5, y: y - legHeight / 2, z: z - 0.5 },
    color: COLORS.WOOD,
  });
  groupTable.add(leg1);

  const leg2 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x + 0.5, y: y - legHeight / 2, z: z + 0.5 },
    color: COLORS.WOOD,
  });
  groupTable.add(leg2);

  const leg3 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x - 0.5, y: y - legHeight / 2, z: z + 0.5 },
    color: COLORS.WOOD,
  });
  groupTable.add(leg3);

  const leg4 = createBox({
    width: 0.2,
    height: legHeight,
    depth: 0.2,
    position: { x: x + 0.5, y: y - legHeight / 2, z: z - 0.5 },
    color: COLORS.WOOD,
  });
  groupTable.add(leg4);

  scene.add(groupTable);
};

/*
 * Template Scene - Copy this file to create your scene
 *
 * Instructions:
 * 1. Copy this folder to src/scenes/your-scene-name/
 * 2. Rename this file (e.g., YourScene.ts)
 * 3. Update the class name and properties below
 * 4. Add your scene to SCENE_CONFIGS in src/scenes/registry.ts
 */
export class CoffeeShop implements SceneInterface {
  readonly sceneId = 'coffee-shop';
  readonly sceneName = 'Coffee shop'; // Your scene's display name
  readonly description = 'A nice cosy coffee shop with a few plants';

  /**
   * Build your 3D scene here!
   * Create your unique 3D world with complete creative freedom!
   *
   * @param scene - The Three.js scene to add objects to
   */
  async buildScene(scene: THREE.Scene): Promise<void> {
    // Add basic lighting - gives your scene good illumination and shadows
    createBasicLighting(scene);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Option 1: Add ground plane for traditional earth-based scenes
    const ground = createGroundPlane({
      size: 30,
      color: COLORS.WOOD,
    });
    scene.add(ground);
    // load a texture, set wrap mode to repeat
    new THREE.TextureLoader().load(
      'public/wooden-floor.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        ground.material = new THREE.MeshLambertMaterial({
          map: texture,
          color: COLORS.SUNSET_ORANGE,
          side: THREE.DoubleSide,
        });
        ground.material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error('Error loading texture:', err);
      }
    );

    // TODO: Replace this example with your scene!

    // Example: Simple house
    const wall1 = createBox({
      width: 30,
      height: 10,
      depth: 1,
      position: { x: 0, y: 5, z: 15 },
      color: COLORS.WHITE,
    });
    //scene.add(wall1);
    const wall2 = createBox({
      width: 30,
      height: 10,
      depth: 1,
      position: { x: 0, y: 5, z: -15 },
      color: COLORS.WHITE,
    });
    //scene.add(wall2);
    const wall3 = createBox({
      width: 1,
      height: 10,
      depth: 30,
      position: { x: 15, y: 5, z: 0 },
      color: COLORS.WHITE,
    });
    //scene.add(wall3);

    // Example: House roof
    const height = 3;
    const bar = createBox({
      width: 15,
      height: height,
      depth: 1.5,
      position: { x: 15 / 2, y: height / 2, z: -5 },
      color: COLORS.METAL,
    });
    scene.add(bar);

    const light = new THREE.PointLight(COLORS.YELLOW, 20, 100);
    light.position.set(0, 10, 0);
    scene.add(light);

    makeChair(5, 1.5, 5, scene, 1);
    makeTable(5, 1.5, 5, scene);
    makeChair(3, 1.5, 5, scene, 2);


    // TODO: Add more objects to build your amazing scene!
    // Available shapes:
    // - createBox({ width, height, depth, position, color })
    // - createSphere({ radius, position, color })
    // - createCylinder({ radiusTop, radiusBottom, height, position, color })
    // - createCone({ radius, height, position, color })
    //
    // Available lighting helpers:
    // - createBasicLighting(scene) - good general lighting with shadows
    // - createSpaceEnvironment(scene) - for space scenes
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
