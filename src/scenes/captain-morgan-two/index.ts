import * as THREE from 'three';
import type { SceneInterface, TourPoint } from '../../types/scene';
import {
  createBox,
  createSphere,
  createCylinder,
  COLORS,
  createGroundPlane,
  createTransparentBox,
} from '../../utils/primitives';

export class CaptainMorganScene implements SceneInterface {
  readonly sceneId = 'captain-morgan-two';
  readonly sceneName = 'Captain Morgan Two';
  readonly description =
    'Amazing boat with amazing barbeque with amazing team - By Ishan Gupta and Luiz Nunes';

  async buildScene(scene: THREE.Scene): Promise<void> {
    createBasicLighting(scene);

    const ground = createGroundPlane({
      size: 80,
      color: COLORS.WATER,
    });
    scene.add(ground);

    const boat = createBox({
      width: 40,
      height: 1,
      depth: 15,
      position: { x: -5, y: 0.5, z: 0 },
      color: COLORS.WOOD,
    });
    scene.add(boat);

    const cabinLeftWall = createBox({
      width: 12,
      height: 4,
      depth: 1,
      position: { x: 5, y: 3, z: 7 - 14 },
      color: COLORS.GRAY,
    });
    scene.add(cabinLeftWall);

    const cabinLeftFirstDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: -0.5, y: 7.5, z: 7 - 14 },
      color: COLORS.BLACK,
    });

    scene.add(cabinLeftFirstDivider);

    const cabinLeftSecondDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: 3.83, y: 7.5, z: 7 - 14 },
      color: COLORS.BLACK,
    });
    scene.add(cabinLeftSecondDivider);

    const cabinLeftThirdDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: 7.67, y: 7.5, z: 7 - 14 },
      color: COLORS.BLACK,
    });
    scene.add(cabinLeftThirdDivider);

    const cabinLeftFourthDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: 10.5, y: 7.5, z: 7 - 14 },
      color: COLORS.BLACK,
    });
    scene.add(cabinLeftFourthDivider);

    const cabinRightWall = createBox({
      width: 12,
      height: 4,
      depth: 1,
      position: { x: 5, y: 3, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(cabinRightWall);

    const cabinRightFirstDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: -0.5, y: 7.5, z: 7 },
      color: COLORS.BLACK,
    });
    scene.add(cabinRightFirstDivider);

    const cabinRightSecondDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: 3.83, y: 7.5, z: 7 },
      color: COLORS.BLACK,
    });
    scene.add(cabinRightSecondDivider);

    const cabinRightThirdDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: 7.67, y: 7.5, z: 7 },
      color: COLORS.BLACK,
    });
    scene.add(cabinRightThirdDivider);

    const cabinRightFourthDivider = createBox({
      width: 0.5,
      height: 5,
      depth: 0.5,
      position: { x: 10.5, y: 7.5, z: 7 },
      color: COLORS.BLACK,
    });
    scene.add(cabinRightFourthDivider);

    const cabinBackWall = createBox({
      width: 1,
      height: 10,
      depth: 3.5,
      position: { x: 10.5, y: 5, z: 4.75 },
      color: COLORS.GRAY,
    });
    scene.add(cabinBackWall);

    const cabinSecondBackWall = createBox({
      width: 1,
      height: 5,
      depth: 3.5,
      position: { x: 10.5, y: 2.5, z: -4.75 },
      color: COLORS.GRAY,
    });
    scene.add(cabinSecondBackWall);

    const cabinBackFirstDivider = createBox({
      width: 1,
      height: 10,
      depth: 1,
      position: { x: 10.5, y: 5, z: 2.5 },
      color: COLORS.BLACK,
    });
    scene.add(cabinBackFirstDivider);

    const cabinBackSecondDivider = createBox({
      width: 1,
      height: 10,
      depth: 1,
      position: { x: 10.5, y: 5, z: -2.5 },
      color: COLORS.BLACK,
    });
    scene.add(cabinBackSecondDivider);

    const cabinFrontWall = createBox({
      width: 1,
      height: 5,
      depth: 3.5,
      position: { x: -0.5, y: 2.5, z: 4.75 },
      color: COLORS.GRAY,
    });
    scene.add(cabinFrontWall);

    const cabinSecondFrontWall = createBox({
      width: 1,
      height: 5,
      depth: 3.5,
      position: { x: -0.5, y: 2.5, z: -4.75 },
      color: COLORS.GRAY,
    });
    scene.add(cabinSecondFrontWall);

    const cabinFrontFirstDivider = createBox({
      width: 1,
      height: 10,
      depth: 1,
      position: { x: -0.5, y: 5, z: 2.5 },
      color: COLORS.BLACK,
    });
    scene.add(cabinFrontFirstDivider);

    const cabinFrontSecondDivider = createBox({
      width: 1,
      height: 10,
      depth: 1,
      position: { x: -0.5, y: 5, z: -2.5 },
      color: COLORS.BLACK,
    });
    scene.add(cabinFrontSecondDivider);

    const frontLeftPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -14.5, y: 3, z: -7 },
      color: COLORS.GRAY,
    });
    scene.add(frontLeftPole);

    const frontMiddleLeftPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -7.25, y: 3, z: -7 },
      color: COLORS.GRAY,
    });
    scene.add(frontMiddleLeftPole);

    const frontRightPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -14.5, y: 3, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(frontRightPole);

    const frontMiddleRightPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -7.25, y: 3, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(frontMiddleRightPole);

    const backRightPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: 14.5, y: 3, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(backRightPole);

    const realFrontRightPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -24.5, y: 3, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(realFrontRightPole);

    const realFrontLeftPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -24.5, y: 3, z: -7 },
      color: COLORS.GRAY,
    });
    scene.add(realFrontLeftPole);

    const realFrontMiddleLeftPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -24.5, y: 3, z: 2.5 },
      color: COLORS.GRAY,
    });
    scene.add(realFrontMiddleLeftPole);

    const realFrontMiddleRightPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: -24.5, y: 3, z: -2.5 },
      color: COLORS.GRAY,
    });
    scene.add(realFrontMiddleRightPole);

    const backLeftPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: 14.5, y: 3, z: -7 },
      color: COLORS.GRAY,
    });
    scene.add(backLeftPole);

    const frontLeftRail = createBox({
      width: 18.25,
      height: 1,
      depth: 1,
      position: { x: -15.88, y: 5, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(frontLeftRail);

    const frontRightRail = createBox({
      width: 18.25,
      height: 1,
      depth: 1,
      position: { x: -15.88, y: 5, z: -7 },
      color: COLORS.GRAY,
    });
    scene.add(frontRightRail);

    const realFrontLeftRail = createBox({
      width: 1,
      height: 1,
      depth: 5,
      position: { x: -24.5, y: 5, z: -4.5 },
      color: COLORS.GRAY,
    });
    scene.add(realFrontLeftRail);

    const realFrontRightRail = createBox({
      width: 1,
      height: 1,
      depth: 5,
      position: { x: -24.5, y: 5, z: 4.5 },
      color: COLORS.GRAY,
    });
    scene.add(realFrontRightRail);

    const backRail = createBox({
      width: 1,
      height: 1,
      depth: 15,
      position: { x: 14.5, y: 5, z: 0 },
      color: COLORS.GRAY,
    });
    scene.add(backRail);

    const realBackMiddleLeftPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: 14.5, y: 3, z: 2.5 },
      color: COLORS.GRAY,
    });
    scene.add(realBackMiddleLeftPole);

    const realBackMiddleRightPole = createBox({
      width: 1,
      height: 4,
      depth: 1,
      position: { x: 14.5, y: 3, z: -2.5 },
      color: COLORS.GRAY,
    });
    scene.add(realBackMiddleRightPole);

    const backLeftRail = createBox({
      width: 3,
      height: 1,
      depth: 1,
      position: { x: 12.5, y: 5, z: 7 },
      color: COLORS.GRAY,
    });
    scene.add(backLeftRail);

    const backRightRail = createBox({
      width: 3,
      height: 1,
      depth: 1,
      position: { x: 12.5, y: 5, z: -7 },
      color: COLORS.GRAY,
    });
    scene.add(backRightRail);

    const chair = createChair({ position: { x: -14.5, z: 4.5 } });
    const chair2 = createChair({ position: { x: -9.5, z: 4.5 } });
    const chair3 = createChair({ position: { x: -19.5, z: 4.5 } });

    scene.add(chair);
    scene.add(chair2);
    scene.add(chair3);

    const chair4 = createChair({ position: { x: 19, z: 4.5 } });
    chair4.rotation.y = Math.PI;
    const chair5 = createChair({ position: { x: 14, z: 4.5 } });
    chair5.rotation.y = Math.PI;
    const chair6 = createChair({ position: { x: 9, z: 4.5 } });
    chair6.rotation.y = Math.PI;

    scene.add(chair4);
    scene.add(chair5);
    scene.add(chair6);

    const table = createTable({ position: { x: -14, z: 0 } });
    scene.add(table);

    const tableObject = createBox({
      width: 1,
      height: 1,
      depth: 1,
      position: { x: -14, y: 3, z: 0 },
      color: COLORS.GRAY,
    });
    scene.add(tableObject);

    const wheelSupport = createBox({
      width: 3,
      height: 0.2,
      depth: 3,
      position: { x: 1, y: 4, z: -5 },
      color: COLORS.GRAY,
    });
    wheelSupport.rotation.z = -Math.PI / 4;
    scene.add(wheelSupport);

    const wheel = createCylinder({
      radiusTop: 1,
      radiusBottom: 1,
      height: 0.1,
      segments: 32,
      color: COLORS.BLACK,
    });
    wheel.position.set(2, 5, -5);
    //wheel.rotation.x = Math.PI / 2;
    wheel.rotation.z = -Math.PI / 4;
    scene.add(wheel);

    const wheelBar = createCylinder({
      radiusTop: 0.1,
      radiusBottom: 0.1,
      height: 1.5,
      segments: 32,
      color: COLORS.BLACK,
    });
    wheelBar.position.set(1.4, 4.5, -5);
    wheelBar.rotation.z = -Math.PI / 4;
    scene.add(wheelBar);

    const bench = createBench({
      position: { x: 5, z: 5 },
      color: COLORS.GRASS,
      size: { x: 10, y: 3 },
    });
    scene.add(bench);

    const bench2 = createBench({
      position: { x: 7, z: -5 },
      color: COLORS.GRASS,
      size: { x: 7, y: 3 },
    });
    scene.add(bench2);

    const cabinRoof = createTransparentBox({
      width: 12,
      height: 0.2,
      depth: 15,
      position: { x: 5, y: 10, z: 0 },
      color: COLORS.BLACK,
    });
    scene.add(cabinRoof);

    const motor = motorOfTheBoat();
    motor.position.set(16, 2, 0);
    scene.add(motor);
  }

  getTourPoints(): TourPoint[] {
    return [
      {
        name: 'Epic Overview',
        description: 'See the whole scene from above',
        cameraPosition: new THREE.Vector3(25, 22, 25),
        lookAtTarget: new THREE.Vector3(15, 12, 15),
        duration: 4, // seconds to pause here
      },
      {
        name: 'Cool Detail',
        description: 'Check out this awesome detail',
        cameraPosition: new THREE.Vector3(10, 10, 10),
        lookAtTarget: new THREE.Vector3(-5, -5, -5),
        duration: 2,
      },
    ];
  }
}

function createChair({ position }: { position: { x: number; z: number } }) {
  const chairGroup = new THREE.Group();
  const y = 3;
  const seat = createBox({
    width: 4,
    height: 0.1,
    depth: 3,
    position: { x: position.x, y: y, z: position.z },
    color: COLORS.SILVER,
  });

  const backrest = createBox({
    width: 4,
    height: 3.5,
    depth: 0.1,
    position: { x: position.x, y: y + 1.8, z: position.z + 1.5 },
    color: COLORS.SILVER,
  });

  chairGroup.add(seat);
  chairGroup.add(backrest);

  chairGroup.add(
    createLeg({
      position: { x: position.x - 1.9, y: y - 1, z: position.z - 1.4 },
      color: COLORS.SILVER,
    })
  );
  chairGroup.add(
    createLeg({
      position: { x: position.x - 1.9, y: y - 1, z: position.z + 1.4 },
      color: COLORS.SILVER,
    })
  );
  chairGroup.add(
    createLeg({
      position: { x: position.x + 2, y: y - 1, z: position.z - 1.4 },
      color: COLORS.SILVER,
    })
  );
  chairGroup.add(
    createLeg({
      position: { x: position.x + 2, y: y - 1, z: position.z + 1.4 },
      color: COLORS.SILVER,
    })
  );

  return chairGroup;
}

function createLeg({
  position,
  color,
}: {
  position: { x: number; y: number; z: number };
  color: number;
}) {
  const leg = createBox({
    width: 0.1,
    height: 2,
    depth: 0.1,
    position: { x: position.x, y: position.y, z: position.z },
    color,
  });

  return leg;
}

function createTable({ position }: { position: { x: number; z: number } }) {
  const tableGroup = new THREE.Group();
  const y = 3;
  const board = createTransparentBox({
    width: 4,
    height: 0.1,
    depth: 3,
    position: { x: position.x, y: y, z: position.z },
    color: COLORS.BLACK,
  });

  tableGroup.add(
    createLeg({
      position: { x: position.x - 1.9, y: y - 1, z: position.z - 1.4 },
      color: COLORS.BLACK,
    })
  );
  tableGroup.add(
    createLeg({
      position: { x: position.x - 1.9, y: y - 1, z: position.z + 1.4 },
      color: COLORS.BLACK,
    })
  );
  tableGroup.add(
    createLeg({
      position: { x: position.x + 2, y: y - 1, z: position.z - 1.4 },
      color: COLORS.BLACK,
    })
  );
  tableGroup.add(
    createLeg({
      position: { x: position.x + 2, y: y - 1, z: position.z + 1.4 },
      color: COLORS.BLACK,
    })
  );

  tableGroup.add(board);
  return tableGroup;
}

function createBench({
  position,
  color,
  size,
}: {
  position: { x: number; z: number };
  color: number;
  size: { x: number; y: number };
}) {
  const benchGroup = new THREE.Group();
  const y = 1.5;
  const board = createBox({
    width: size.x,
    height: 3,
    depth: size.y,
    position: { x: position.x, y: y, z: position.z },
    color: color,
  });

  benchGroup.add(board);
  return benchGroup;
}
const createBasicLighting = (scene: THREE.Scene): void => {
  // Ambient light for general illumination - brighter for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  // Main directional light (like sun) - positioned higher and further for better coverage
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(50, 50, 25);
  directionalLight.castShadow = true;

  // Shadow settings for better quality - larger shadow camera for bigger scenes
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;

  scene.add(directionalLight);
};

const motorOfTheBoat = () => {
  const motorGroup = new THREE.Group();

  const casing = createBox({
    width: 2,
    height: 2.5,
    depth: 1.5,
    color: COLORS.RED,
    position: { x: 0, y: 0, z: 0 },
  });
  motorGroup.add(casing);

  const shaft = createCylinder({
    radiusTop: 0.2,
    radiusBottom: 0.2,
    height: 3,
    color: COLORS.METAL,
    position: { x: 0, y: -2.5, z: 0 },
  });
  motorGroup.add(shaft);

  const propellerGroup = new THREE.Group();
  propellerGroup.position.set(0, -4, 0);
  motorGroup.add(propellerGroup);

  const propellerHub = createSphere({
    radius: 0.3,
    color: COLORS.BLACK,
  });
  propellerGroup.add(propellerHub);

  const blade1 = createBox({
    width: 1.5,
    height: 0.2,
    depth: 0.1,
    color: COLORS.BLACK,
  });
  blade1.rotation.y = Math.PI / 2;
  propellerGroup.add(blade1);

  const blade2 = createBox({
    width: 1.5,
    height: 0.2,
    depth: 0.1,
    color: COLORS.BLACK,
  });
  blade2.rotation.x = Math.PI / 3; // 60 degrees
  blade2.rotation.y = Math.PI / 2;
  propellerGroup.add(blade2);

  const blade3 = createBox({
    width: 1.5,
    height: 0.2,
    depth: 0.1,
    color: COLORS.BLACK,
  });
  blade3.rotation.x = -Math.PI / 3; // -60 degrees
  blade3.rotation.y = Math.PI / 2;
  propellerGroup.add(blade3);

  return motorGroup;
};
