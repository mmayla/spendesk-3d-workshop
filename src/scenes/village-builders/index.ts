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

// Example scene demonstrating how to implement SceneInterface
export class VillageScene implements SceneInterface {
  readonly sceneId = 'village-builders';
  readonly sceneName = 'Village Builders';
  readonly description =
    'A peaceful medieval village with houses, trees, and a well';

  private cloud?: THREE.Mesh;

  async buildScene(scene: THREE.Scene): Promise<void> {
    createBasicLighting(scene);

    const ground = createGroundPlane({
      size: 30,
      color: COLORS.GRASS,
    });
    scene.add(ground);

    // Main house with chimney
    const house = createBox({
      width: 3,
      height: 3,
      depth: 2,
      position: { x: 0, y: 1.5, z: 0 },
      color: COLORS.WOOD,
    });
    scene.add(house);

    const roof = createCone({
      radius: 2.2,
      height: 1.8,
      position: { x: 0, y: 3.9, z: 0 },
      color: COLORS.RED,
    });
    scene.add(roof);

    // Chimney
    const chimney = createBox({
      width: 0.6,
      height: 1.5,
      depth: 0.6,
      position: { x: -1, y: 4.2, z: -0.5 },
      color: COLORS.STONE,
    });
    scene.add(chimney);

    // Oak tree
    const trunk1 = createCylinder({
      radiusTop: 0.3,
      radiusBottom: 0.3,
      height: 2,
      position: { x: -6, y: 1, z: 0 },
      color: COLORS.TREE_TRUNK,
    });
    scene.add(trunk1);

    const leaves1 = createSphere({
      radius: 1.8,
      position: { x: -6, y: 3, z: 0 },
      color: COLORS.TREE_LEAVES,
    });
    scene.add(leaves1);

    // Pine tree
    const trunk2 = createCylinder({
      radiusTop: 0.2,
      radiusBottom: 0.2,
      height: 2.5,
      position: { x: 4, y: 1.25, z: -3 },
      color: COLORS.TREE_TRUNK,
    });
    scene.add(trunk2);

    const pine = createCone({
      radius: 1.2,
      height: 2,
      position: { x: 4, y: 3.5, z: -3 },
      color: COLORS.TREE_LEAVES,
    });
    scene.add(pine);

    // Village well
    const wellBase = createCylinder({
      radiusTop: 1.5,
      radiusBottom: 1.5,
      height: 1.6,
      position: { x: -2, y: 0.8, z: 4 },
      color: COLORS.STONE,
    });
    scene.add(wellBase);

    const wellRoof = createCone({
      radius: 1.8,
      height: 1.2,
      position: { x: -2, y: 2.5, z: 4 },
      color: COLORS.WOOD,
    });
    scene.add(wellRoof);

    // Wooden fence
    for (let i = 0; i < 3; i++) {
      const fencePost = createBox({
        width: 0.3,
        height: 1.6,
        depth: 0.3,
        position: { x: 2 + i, y: 0.8, z: 2 },
        color: COLORS.WOOD,
      });
      scene.add(fencePost);
    }

    const fenceRail = createBox({
      width: 2.4,
      height: 0.2,
      depth: 0.2,
      position: { x: 2.5, y: 1.2, z: 2 },
      color: COLORS.WOOD,
    });
    scene.add(fenceRail);

    // Flower decorations
    const flower1 = createSphere({
      radius: 0.3,
      position: { x: 1, y: 0.3, z: 1 },
      color: COLORS.RED,
    });
    scene.add(flower1);

    const flower2 = createSphere({
      radius: 0.3,
      position: { x: 1.5, y: 0.3, z: 0.5 },
      color: COLORS.YELLOW,
    });
    scene.add(flower2);

    // Small storage shed
    const shed = createBox({
      width: 1.5,
      height: 1.5,
      depth: 1,
      position: { x: 6, y: 0.75, z: 2 },
      color: COLORS.WOOD,
    });
    scene.add(shed);

    const shedRoof = createBox({
      width: 1.8,
      height: 0.3,
      depth: 1.3,
      position: { x: 6, y: 1.65, z: 2 },
      color: COLORS.STONE,
    });
    scene.add(shedRoof);

    // Animated cloud in the sky
    this.cloud = createSphere({
      radius: 1.2,
      position: { x: -10, y: 8, z: 3 },
      color: COLORS.WHITE,
      scale: { x: 2, y: 1, z: 1.5 },
    });
    scene.add(this.cloud);
  }

  animate(deltaTime: number): void {
    if (this.cloud) {
      // Move cloud slowly across the sky
      this.cloud.position.x += deltaTime * 2; // 2 units per second
      
      // Reset cloud position when it goes too far
      if (this.cloud.position.x > 15) {
        this.cloud.position.x = -15;
      }
    }
  }

  getTourPoints(): TourPoint[] {
    return [
      {
        name: 'Village Overview',
        description:
          'Welcome to our peaceful medieval village! See the main house, trees, and well.',
        cameraPosition: new THREE.Vector3(8, 6, 8),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 3,
      },
      {
        name: 'Main House',
        description:
          "The village's main house with a red roof and stone chimney.",
        cameraPosition: new THREE.Vector3(3, 4, 3),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 2,
      },
      {
        name: 'Village Well',
        description: 'The community well where villagers gather water.',
        cameraPosition: new THREE.Vector3(-2, 3, 7),
        lookAtTarget: new THREE.Vector3(-2, 1, 4),
        duration: 2,
      },
      {
        name: 'Ancient Oak',
        description:
          'This majestic oak tree has watched over the village for generations.',
        cameraPosition: new THREE.Vector3(-9, 5, 3),
        lookAtTarget: new THREE.Vector3(-6, 3, 0),
        duration: 2,
      },
      {
        name: 'Sky View',
        description:
          'Look up to see the peaceful clouds drifting across the village sky.',
        cameraPosition: new THREE.Vector3(0, 5, 10),
        lookAtTarget: new THREE.Vector3(0, 8, 0),
        duration: 3,
      },
    ];
  }
}
