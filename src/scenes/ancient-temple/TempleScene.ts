import * as THREE from 'three'
import type { TeamSceneInterface, TourPoint } from '../../types/scene'
import { createBox, createSphere, createCylinder, createCone, COLORS } from '../../utils/primitives'

/**
 * Example team scene: Ancient Temple Builders
 * 
 * This demonstrates a mystical ancient temple with stone pillars, altar, and ceremonial elements
 * Using earth tones and classical architecture patterns
 */
export class TempleScene implements TeamSceneInterface {
  readonly teamId = 'ancient-temple'
  readonly teamName = 'Ancient Temple Builders'
  readonly description = 'A mystical temple with stone pillars, altar, and ancient ceremonial elements'
  
  readonly bounds = {
    width: 22,   // Temple spans 22 units
    height: 10,  // Tallest structures reach 10 units
    depth: 16    // Temple depth is 16 units
  }

  async buildScene(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): Promise<void> {
    const pos = (x: number, y: number, z: number) => ({
      x: position.x + x,
      y: position.y + y, 
      z: position.z + z
    })

    // Temple base platform
    const platform = createBox({
      width: 20, height: 1, depth: 14,
      position: pos(0, 0.5, 0),
      color: COLORS.STONE
    })
    scene.add(platform)

    // Main temple structure
    const templeBase = createBox({
      width: 12, height: 4, depth: 8,
      position: pos(0, 3, 0),
      color: COLORS.STONE
    })
    scene.add(templeBase)

    // Temple roof
    const templeRoof = createBox({
      width: 13, height: 0.8, depth: 9,
      position: pos(0, 5.4, 0),
      color: COLORS.EARTH_BROWN
    })
    scene.add(templeRoof)

    // Front pillars (Doric style)
    const pillarPositions = [
      { x: -4, z: -5 }, { x: -2, z: -5 }, { x: 0, z: -5 }, 
      { x: 2, z: -5 }, { x: 4, z: -5 }
    ]

    pillarPositions.forEach(pillarPos => {
      const pillar = createCylinder({
        radiusTop: 0.4, radiusBottom: 0.5, height: 4,
        position: pos(pillarPos.x, 3, pillarPos.z),
        color: COLORS.STONE
      })
      scene.add(pillar)

      // Pillar capitals
      const capital = createBox({
        width: 1, height: 0.3, depth: 1,
        position: pos(pillarPos.x, 5.15, pillarPos.z),
        color: COLORS.STONE
      })
      scene.add(capital)
    })

    // Side pillars
    const sidePillarPositions = [
      { x: -6, z: -2 }, { x: -6, z: 0 }, { x: -6, z: 2 },
      { x: 6, z: -2 }, { x: 6, z: 0 }, { x: 6, z: 2 }
    ]

    sidePillarPositions.forEach(pillarPos => {
      const pillar = createCylinder({
        radiusTop: 0.4, radiusBottom: 0.5, height: 4,
        position: pos(pillarPos.x, 3, pillarPos.z),
        color: COLORS.STONE
      })
      scene.add(pillar)

      const capital = createBox({
        width: 1, height: 0.3, depth: 1,
        position: pos(pillarPos.x, 5.15, pillarPos.z),
        color: COLORS.STONE
      })
      scene.add(capital)
    })

    // Central altar
    const altar = createBox({
      width: 3, height: 1.5, depth: 2,
      position: pos(0, 1.75, 1),
      color: COLORS.STONE
    })
    scene.add(altar)

    // Sacred fire brazier
    const brazier = createCylinder({
      radiusTop: 0.8, radiusBottom: 0.6, height: 0.5,
      position: pos(0, 2.75, 1),
      color: COLORS.GOLD
    })
    scene.add(brazier)

    // Sacred flame
    const flame = createCone({
      radius: 0.4, height: 1,
      position: pos(0, 3.5, 1),
      color: COLORS.ORANGE
    })
    scene.add(flame)

    // Temple steps
    for (let i = 0; i < 3; i++) {
      const step = createBox({
        width: 14 + i * 2, height: 0.3, depth: 2,
        position: pos(0, 0.15 + i * 0.3, -6 - i),
        color: COLORS.STONE
      })
      scene.add(step)
    }

    // Ancient statues (guardian figures)
    const statue1 = createBox({
      width: 1, height: 3, depth: 0.8,
      position: pos(-8, 2.5, -3),
      color: COLORS.STONE
    })
    scene.add(statue1)

    const statue1Head = createSphere({
      radius: 0.5,
      position: pos(-8, 4.2, -3),
      color: COLORS.STONE
    })
    scene.add(statue1Head)

    const statue2 = createBox({
      width: 1, height: 3, depth: 0.8,
      position: pos(8, 2.5, -3),
      color: COLORS.STONE
    })
    scene.add(statue2)

    const statue2Head = createSphere({
      radius: 0.5,
      position: pos(8, 4.2, -3),
      color: COLORS.STONE
    })
    scene.add(statue2Head)

    // Sacred obelisk
    const obelisk = createBox({
      width: 0.8, height: 6, depth: 0.8,
      position: pos(-10, 4, 0),
      color: COLORS.STONE
    })
    scene.add(obelisk)

    const obeliskTop = createCone({
      radius: 0.6, height: 1.5,
      position: pos(-10, 7.25, 0),
      color: COLORS.STONE
    })
    scene.add(obeliskTop)

    // Temple bells
    const bellStand = createCylinder({
      radiusTop: 0.2, radiusBottom: 0.2, height: 3,
      position: pos(10, 2.5, 0),
      color: COLORS.WOOD
    })
    scene.add(bellStand)

    const bell = createSphere({
      radius: 0.6,
      position: pos(10, 4.2, 0),
      color: COLORS.GOLD,
      scale: { x: 1, y: 0.8, z: 1 }
    })
    scene.add(bell)

    // Ceremonial urns
    const urn1 = createCylinder({
      radiusTop: 0.6, radiusBottom: 0.4, height: 1.2,
      position: pos(-3, 1.6, 3),
      color: COLORS.EARTH_BROWN
    })
    scene.add(urn1)

    const urn2 = createCylinder({
      radiusTop: 0.6, radiusBottom: 0.4, height: 1.2,
      position: pos(3, 1.6, 3),
      color: COLORS.EARTH_BROWN
    })
    scene.add(urn2)

    // Temple garden elements
    const tree1 = createCylinder({
      radiusTop: 0.3, radiusBottom: 0.3, height: 2,
      position: pos(-12, 2, 4),
      color: COLORS.TREE_TRUNK
    })
    scene.add(tree1)

    const leaves1 = createSphere({
      radius: 1.5,
      position: pos(-12, 3.5, 4),
      color: COLORS.TREE_LEAVES
    })
    scene.add(leaves1)

    const tree2 = createCylinder({
      radiusTop: 0.3, radiusBottom: 0.3, height: 2,
      position: pos(12, 2, 4),
      color: COLORS.TREE_TRUNK
    })
    scene.add(tree2)

    const leaves2 = createSphere({
      radius: 1.5,
      position: pos(12, 3.5, 4),
      color: COLORS.TREE_LEAVES
    })
    scene.add(leaves2)
  }

  getTourPoints(): TourPoint[] {
    return [
      {
        name: "Temple Overview",
        description: "Behold the ancient temple, with its majestic pillars and sacred altar where ceremonies were held.",
        cameraPosition: new THREE.Vector3(15, 8, -12),
        lookAtTarget: new THREE.Vector3(0, 3, 0),
        duration: 4
      },
      {
        name: "Sacred Entrance",
        description: "The temple's grand entrance with Doric columns that have stood for millennia.",
        cameraPosition: new THREE.Vector3(0, 4, -10),
        lookAtTarget: new THREE.Vector3(0, 3, -5),
        duration: 3
      },
      {
        name: "Sacred Altar",
        description: "The central altar where the eternal flame burns, watched over by ancient guardians.",
        cameraPosition: new THREE.Vector3(3, 5, 3),
        lookAtTarget: new THREE.Vector3(0, 2.5, 1),
        duration: 3
      },
      {
        name: "Guardian Statues",
        description: "Ancient stone guardians that have protected the temple throughout the ages.",
        cameraPosition: new THREE.Vector3(-12, 5, -3),
        lookAtTarget: new THREE.Vector3(-8, 3, -3),
        duration: 2
      },
      {
        name: "Sacred Obelisk",
        description: "The mysterious obelisk holds ancient inscriptions and celestial alignments.",
        cameraPosition: new THREE.Vector3(-13, 6, 3),
        lookAtTarget: new THREE.Vector3(-10, 4, 0),
        duration: 2
      },
      {
        name: "Temple Bell",
        description: "The ceremonial bell whose sound once called worshippers from across the land.",
        cameraPosition: new THREE.Vector3(13, 5, 3),
        lookAtTarget: new THREE.Vector3(10, 4, 0),
        duration: 2
      }
    ]
  }

  dispose(): void {
    console.log(`Disposing ${this.teamName} scene resources`)
  }
}