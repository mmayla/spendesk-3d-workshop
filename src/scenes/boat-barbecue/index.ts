import * as THREE from 'three';
import type { SceneInterface, TourPoint } from '../../types/scene';
import {
  createBox,
  createSphere,
  createCylinder,
  createGroundPlane,
  createBasicLighting,
  COLORS,
} from '../../utils/primitives';

/*
 * Template Scene - Copy this file to create your scene
 *
 * Instructions:
 * 1. Copy this folder to src/scenes/your-scene-name/
 * 2. Rename this file (e.g., YourScene.ts)
 * 3. Update the class name and properties below
 * 4. Add your scene to SCENE_CONFIGS in src/scenes/registry.ts
 */
export class BoatBarbecueScene implements SceneInterface {
  // TODO: Update these properties for your scene
  readonly sceneId = 'boat-barbecue-scene';
  readonly sceneName = 'Boat Barbecue'; // Your scene's display name
  readonly description =
    'A fun scene featuring a boat barbecue party by Yannis and Nico';

  /**
   * Build your 3D scene here!
   * Create your unique 3D world with complete creative freedom!
   *
   * @param scene - The Three.js scene to add objects to
   */
  async buildScene(scene: THREE.Scene): Promise<void> {
    // Add basic lighting - gives your scene good illumination and shadows
    createBasicLighting(scene);

    // Option 1: Add ground plane for traditional earth-based scenes
    const ground = createGroundPlane({
      size: 60,
      color: COLORS.WATER,
    });
    scene.add(ground);

    // Option 2: For space scenes, uncomment this instead:
    // import { createSpaceEnvironment } from '../../utils/primitives'
    // createSpaceEnvironment(scene)

    // TODO: Replace this example with your scene!
    const poleSize = 0.5;
    const boatBaseWidth = 12;

    const boatBase = createBox({
      width: boatBaseWidth,
      height: 1,
      depth: 24,
      position: { x: 0, y: 0, z: 0 },
      color: COLORS.WOOD,
    });
    scene.add(boatBase);

    const boatFenceLeft = createBox({
      width: poleSize,
      height: poleSize,
      depth: 24,
      position: { x: -5.5, y: 3, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(boatFenceLeft);

    const boatFenceRight = createBox({
      width: poleSize,
      height: poleSize,
      depth: 24,
      position: { x: 5.5, y: 3, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(boatFenceRight);

    const cabinPoleLeftFront = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: 5.5, y: 3, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleLeftFront);

    const cabinPoleMiddleLeftFront = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: -2.5, y: 3, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleMiddleLeftFront);

    const cabinPoleMiddleRightFront = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: 2.5, y: 3, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleMiddleRightFront);

    const cabinPoleRightFront = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: -5.5, y: 3, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleRightFront);

    const cabinPoleLeftRear = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: 5.5, y: 3, z: -7 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleLeftRear);

    const cabinPoleMiddleRightRear = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: 2.5, y: 3, z: -7 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleMiddleRightRear);

    const cabinPoleMiddleLeftRear = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: -2.5, y: 3, z: -7 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleMiddleLeftRear);

    const cabinPoleRightRear = createBox({
      width: poleSize,
      height: 15,
      depth: poleSize,
      position: { x: -5.5, y: 3, z: -7 },
      color: COLORS.METAL,
    });
    scene.add(cabinPoleRightRear);

    const cabinTopLeftBar = createBox({
      width: poleSize,
      height: poleSize,
      depth: 7.5,
      position: { x: -5.5, y: 10.5, z: -3.5 },
      color: COLORS.METAL,
    });
    scene.add(cabinTopLeftBar);

    const cabinTopRightBar = createBox({
      width: poleSize,
      height: poleSize,
      depth: 7.5,
      position: { x: 5.5, y: 10.5, z: -3.5 },
      color: COLORS.METAL,
    });
    scene.add(cabinTopRightBar);

    const cabinTopFrontBar = createBox({
      width: boatBaseWidth - 1,
      height: poleSize,
      depth: poleSize,
      position: { x: 0, y: 10.5, z: 0 },
      color: COLORS.METAL,
    });
    scene.add(cabinTopFrontBar);

    const cabinTopRearBar = createBox({
      width: boatBaseWidth - 1,
      height: poleSize,
      depth: poleSize,
      position: { x: 0, y: 10.5, z: -7 },
      color: COLORS.METAL,
    });
    scene.add(cabinTopRearBar);

    const smallPoleHeight = 2.75;

    const smallFrontLeftPole = createBox({
      width: poleSize,
      height: smallPoleHeight,
      depth: poleSize,
      position: { x: -5.5, y: 1.75, z: 11.75 },
      color: COLORS.METAL,
    });
    scene.add(smallFrontLeftPole);

    const smallFrontRightPole = createBox({
      width: poleSize,
      height: smallPoleHeight,
      depth: poleSize,
      position: { x: 5.5, y: 1.75, z: 11.75 },
      color: COLORS.METAL,
    });
    scene.add(smallFrontRightPole);

    const smallRearLeftPole = createBox({
      width: poleSize,
      height: smallPoleHeight,
      depth: poleSize,
      position: { x: -5.5, y: 1.75, z: -11.75 },
      color: COLORS.METAL,
    });
    scene.add(smallRearLeftPole);

    const smallRearRightPole = createBox({
      width: poleSize,
      height: smallPoleHeight,
      depth: poleSize,
      position: { x: 5.5, y: 1.75, z: -11.75 },
      color: COLORS.METAL,
    });
    scene.add(smallRearRightPole);

    const cabinRoof = createBox({
      width: boatBaseWidth - 0.5 - 2 * poleSize,
      height: poleSize,
      depth: 7.5 - 2 * poleSize,
      position: { x: 0, y: 10.5, z: -3.5 },
      color: COLORS.SILVER,
    });
    scene.add(cabinRoof);

    const barbecueShelf = createBox({
      width: 3,
      height: 0.25,
      depth: 4,
      position: { x: 3.75, y: 3, z: -9.25 },
      color: COLORS.SAND,
    });
    scene.add(barbecueShelf);

    const barbecueRadius = 1;
    const barbecue = createCylinder({
      radiusTop: barbecueRadius,
      radiusBottom: barbecueRadius,
      height: 2,
      position: { x: 3.75, y: 4, z: -9.25 },
      rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 2 },
      color: COLORS.BLACK,
    });
    scene.add(barbecue);

    // Mohamed body

    const mohamedHead = createSphere({
      radius: 0.75,
      position: { x: 12, y: 1.5, z: 0.5 },
      color: COLORS.PINK,
    });
    scene.add(mohamedHead);

    const mohamedBody = createBox({
      width: 2,
      height: 1.5,
      depth: 2.5,
      position: { x: 12, y: 0, z: 0.5 },
      color: COLORS.PINK,
    });
    scene.add(mohamedBody);

    const mohamedArmRadius = 0.75;
    const mohamedLeftArm = createCylinder({
      radiusTop: mohamedArmRadius,
      radiusBottom: mohamedArmRadius,
      height: 1.5,
      position: { x: 12, y: 0, z: -1 },
      color: COLORS.PINK,
    });
    scene.add(mohamedLeftArm);

    const mohamedRightArm = createCylinder({
      radiusTop: mohamedArmRadius,
      radiusBottom: mohamedArmRadius,
      height: 1.5,
      position: { x: 12, y: 0, z: 2 },
      color: COLORS.PINK,
    });
    scene.add(mohamedRightArm);

    // Luiz body

    const luizHead = createSphere({
      radius: 0.5,
      position: { x: 15, y: 1.5, z: 0.5 },
      color: COLORS.PINK,
    });
    scene.add(luizHead);

    const luizBody = createBox({
      width: 1,
      height: 1.5,
      depth: 1.5,
      position: { x: 15, y: 0, z: 0.5 },
      color: COLORS.PINK,
    });
    scene.add(luizBody);

    const luizArmRadius = 0.25;
    const luizLeftArm = createCylinder({
      radiusTop: luizArmRadius,
      radiusBottom: luizArmRadius,
      height: 1.5,
      position: { x: 15, y: 0, z: -0.5 },
      color: COLORS.PINK,
    });
    scene.add(luizLeftArm);

    const luizRightArm = createCylinder({
      radiusTop: luizArmRadius,
      radiusBottom: luizArmRadius,
      height: 1.5,
      position: { x: 15, y: 0, z: 1.5 },
      color: COLORS.PINK,
    });
    scene.add(luizRightArm);

    const couch = createBox({
      width: 3,
      height: 2,
      depth: 7,
      position: { x: 4, y: 1.5, z: -3.5 },
      color: COLORS.TREE_LEAVES,
    });
    scene.add(couch);

    const couchCockpit = createBox({
      width: 3,
      height: 2,
      depth: 4,
      position: { x: -4, y: 1.5, z: -5 },
      color: COLORS.TREE_LEAVES,
    });
    scene.add(couchCockpit);

    const cockpit = createBox({
      width: 3,
      height: 3.5,
      depth: 1.5,
      position: { x: -3.75, y: 1.5, z: -0.5 },
      color: COLORS.METAL,
    });
    scene.add(cockpit);

    const wheelRadius = 1;
    const wheel = createCylinder({
      radiusTop: wheelRadius,
      radiusBottom: wheelRadius,
      height: 0.25,
      position: { x: -4, y: 4.25, z: -0.5 },
      rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 2 },
      color: COLORS.STONE,
    });
    scene.add(wheel);

    const cabinSideRight = createBox({
      width: 0.25,
      height: 15,
      depth: 7,
      position: { x: 5.5, y: 3, z: -3.5 },
      color: COLORS.SKY_BLUE,
      opacity: 0.5,
    });
    scene.add(cabinSideRight);

    const cabinSideLeft = createBox({
      width: 0.25,
      height: 15,
      depth: 7,
      position: { x: -5.5, y: 3, z: -3.5 },
      color: COLORS.SKY_BLUE,
      opacity: 0.5,
    });
    scene.add(cabinSideLeft);

    // Add some distant rain as small white points
    const rainGeometry = new THREE.BufferGeometry();
    const rainMaterial = new THREE.PointsMaterial({
      color: COLORS.BLUE,
      size: 0.15,
      opacity: 0.35,
      transparent: true,
    });

    const rainVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      rainVertices.push(x, y, z);
    }

    rainGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(rainVertices, 3)
    );
    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Add ambient light for space visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Example: House roof
    // const roof = createCone({
    //   radius: 2.2,
    //   height: 1.8,
    //   position: { x: 0, y: 3.9, z: 0 },
    //   color: COLORS.RED,
    // });
    // scene.add(roof);

    // Example: Tree
    // const trunk = createCylinder({
    //   radiusTop: 0.3,
    //   radiusBottom: 0.3,
    //   height: 2,
    //   position: { x: -5, y: 1, z: 0 },
    //   color: COLORS.TREE_TRUNK,
    // });
    // scene.add(trunk);

    // const leaves = createSphere({
    //   radius: 1.5,
    //   position: { x: -5, y: 3, z: 0 },
    //   color: COLORS.TREE_LEAVES,
    // });
    // scene.add(leaves);

    // Example: Ground decoration
    // const flower = createSphere({
    //   radius: 0.3,
    //   position: { x: 2, y: 0.3, z: 2 },
    //   color: COLORS.PINK,
    // });
    // scene.add(flower);

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
        name: 'Right Side Overview',
        description: "Welcome to our scene! Here's the general overview.",
        cameraPosition: new THREE.Vector3(30, 20, 5),
        lookAtTarget: new THREE.Vector3(0, 0, 0),
        duration: 3,
      },
      {
        name: 'Front',
        description: 'Check out our main structure here.',
        cameraPosition: new THREE.Vector3(-15, 10, 20),
        lookAtTarget: new THREE.Vector3(10, 10, 0),
        duration: 2,
      },
      {
        name: 'Right Side Overview',
        description: "Welcome to our scene! Here's the general overview.",
        cameraPosition: new THREE.Vector3(-30, 20, -5),
        lookAtTarget: new THREE.Vector3(0, 0, 0),
        duration: 3,
      },
      {
        name: 'Rear',
        description: 'Check out our main structure here.',
        cameraPosition: new THREE.Vector3(0, 4, -30),
        lookAtTarget: new THREE.Vector3(0, 0, 0),
        duration: 2,
      },
      {
        name: 'Inside',
        description: 'Check out our main structure here.',
        cameraPosition: new THREE.Vector3(0, 4, 0),
        lookAtTarget: new THREE.Vector3(0, 5, 20),
        duration: 2,
      },
      {
        name: 'Front',
        description: 'Check out our main structure here.',
        cameraPosition: new THREE.Vector3(-15, 10, 20),
        lookAtTarget: new THREE.Vector3(10, 10, 0),
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
