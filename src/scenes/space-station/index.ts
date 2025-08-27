import * as THREE from 'three';
import type { SceneInterface, TourPoint } from '../../types/scene';
import {
  createBox,
  createSphere,
  createCylinder,
  createSpaceEnvironment,
  createBasicLighting,
  COLORS,
} from '../../utils/primitives';

/**
 * Example team scene: Space Station Builders
 *
 * Demonstrates a space environment with no ground plane
 * Shows how teams can create any environment they want
 */
export class SpaceStationScene implements SceneInterface {
  readonly sceneId = 'space-station';
  readonly sceneName = 'Space Station Builders';
  readonly description =
    'A modular orbital space station with command modules and solar arrays';

  async buildScene(scene: THREE.Scene): Promise<void> {
    // Create space environment with stars and dark background
    createSpaceEnvironment(scene);

    // Add better lighting for space station visibility
    createBasicLighting(scene);

    // Central command module (large box)
    const commandModule = createBox({
      width: 6,
      height: 4,
      depth: 3,
      position: { x: 0, y: 2, z: 0 },
      color: COLORS.SILVER,
    });
    scene.add(commandModule);

    // Command module antenna
    const antenna = createSphere({
      radius: 0.3,
      position: { x: 0, y: 4.5, z: 0 },
      color: COLORS.RED,
    });
    scene.add(antenna);

    // Left habitat module
    const habitatLeft = createCylinder({
      radiusTop: 1.5,
      radiusBottom: 1.5,
      height: 8,
      position: { x: -8, y: 2, z: 0 },
      color: COLORS.METAL,
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
    });
    scene.add(habitatLeft);

    // Right habitat module
    const habitatRight = createCylinder({
      radiusTop: 1.5,
      radiusBottom: 1.5,
      height: 8,
      position: { x: 8, y: 2, z: 0 },
      color: COLORS.METAL,
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
    });
    scene.add(habitatRight);

    // Connecting corridors
    const corridorLeft = createBox({
      width: 4,
      height: 0.8,
      depth: 0.8,
      position: { x: -4, y: 2, z: 0 },
      color: COLORS.GRAY,
    });
    scene.add(corridorLeft);

    const corridorRight = createBox({
      width: 4,
      height: 0.8,
      depth: 0.8,
      position: { x: 4, y: 2, z: 0 },
      color: COLORS.GRAY,
    });
    scene.add(corridorRight);

    // Solar panel arrays (top)
    const solarPanelTop1 = createBox({
      width: 12,
      height: 0.2,
      depth: 6,
      position: { x: 0, y: 8, z: -6 },
      color: COLORS.BLUE,
    });
    scene.add(solarPanelTop1);

    const solarPanelTop2 = createBox({
      width: 12,
      height: 0.2,
      depth: 6,
      position: { x: 0, y: 8, z: 6 },
      color: COLORS.BLUE,
    });
    scene.add(solarPanelTop2);

    // Solar panel support struts
    const strutTop1 = createBox({
      width: 0.3,
      height: 6,
      depth: 0.3,
      position: { x: -5, y: 5, z: -6 },
      color: COLORS.METAL,
    });
    scene.add(strutTop1);

    const strutTop2 = createBox({
      width: 0.3,
      height: 6,
      depth: 0.3,
      position: { x: 5, y: 5, z: -6 },
      color: COLORS.METAL,
    });
    scene.add(strutTop2);

    const strutTop3 = createBox({
      width: 0.3,
      height: 6,
      depth: 0.3,
      position: { x: -5, y: 5, z: 6 },
      color: COLORS.METAL,
    });
    scene.add(strutTop3);

    const strutTop4 = createBox({
      width: 0.3,
      height: 6,
      depth: 0.3,
      position: { x: 5, y: 5, z: 6 },
      color: COLORS.METAL,
    });
    scene.add(strutTop4);

    // Docking bay
    const dockingBay = createBox({
      width: 2,
      height: 2,
      depth: 4,
      position: { x: 0, y: 1, z: -5 },
      color: COLORS.YELLOW,
    });
    scene.add(dockingBay);

    // Communication dishes
    const dish1 = createSphere({
      radius: 1,
      position: { x: -10, y: 4, z: 3 },
      color: COLORS.WHITE,
      scale: { x: 2, y: 0.3, z: 2 },
    });
    scene.add(dish1);

    const dish2 = createSphere({
      radius: 1,
      position: { x: 10, y: 4, z: -3 },
      color: COLORS.WHITE,
      scale: { x: 2, y: 0.3, z: 2 },
    });
    scene.add(dish2);

    // Engine thrusters (small cylinders)
    const thruster1 = createCylinder({
      radiusTop: 0.3,
      radiusBottom: 0.5,
      height: 1.5,
      position: { x: -2, y: 0.75, z: 2 },
      color: COLORS.ORANGE,
    });
    scene.add(thruster1);

    const thruster2 = createCylinder({
      radiusTop: 0.3,
      radiusBottom: 0.5,
      height: 1.5,
      position: { x: 0, y: 0.75, z: 2 },
      color: COLORS.ORANGE,
    });
    scene.add(thruster2);

    const thruster3 = createCylinder({
      radiusTop: 0.3,
      radiusBottom: 0.5,
      height: 1.5,
      position: { x: 2, y: 0.75, z: 2 },
      color: COLORS.ORANGE,
    });
    scene.add(thruster3);

    // External storage pods
    const storagePod1 = createSphere({
      radius: 0.8,
      position: { x: -3, y: 4.5, z: -1 },
      color: COLORS.METAL,
    });
    scene.add(storagePod1);

    const storagePod2 = createSphere({
      radius: 0.8,
      position: { x: 3, y: 4.5, z: -1 },
      color: COLORS.METAL,
    });
    scene.add(storagePod2);
  }

  getTourPoints(): TourPoint[] {
    return [
      {
        name: 'Station Overview',
        description:
          'Welcome to the orbital space station! See the modular design with central command and habitat rings.',
        cameraPosition: new THREE.Vector3(15, 12, 15),
        lookAtTarget: new THREE.Vector3(0, 4, 0),
        duration: 4,
      },
      {
        name: 'Command Module',
        description:
          'The central command center with communication array and life support systems.',
        cameraPosition: new THREE.Vector3(3, 6, 5),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 3,
      },
      {
        name: 'Habitat Modules',
        description:
          'Rotating habitat rings provide artificial gravity for the crew living quarters.',
        cameraPosition: new THREE.Vector3(-12, 2, 8),
        lookAtTarget: new THREE.Vector3(-8, 2, 0),
        duration: 3,
      },
      {
        name: 'Solar Arrays',
        description:
          'Massive solar panel arrays provide power to the entire station.',
        cameraPosition: new THREE.Vector3(0, 12, -12),
        lookAtTarget: new THREE.Vector3(0, 8, 0),
        duration: 2,
      },
      {
        name: 'Docking Bay',
        description:
          'Ships dock here to transfer crew and supplies to the station.',
        cameraPosition: new THREE.Vector3(2, 3, -8),
        lookAtTarget: new THREE.Vector3(0, 1, -5),
        duration: 2,
      },
    ];
  }
}
