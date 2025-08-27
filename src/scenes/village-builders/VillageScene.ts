import * as THREE from 'three'
import type { TeamSceneInterface, TourPoint } from '../../types/scene'
import { createBox, createSphere, createCylinder, createCone, COLORS } from '../../utils/primitives'

/**
 * Example team scene: Village Builders
 * 
 * This demonstrates how teams should implement their scenes
 * Following the TeamSceneInterface contract
 */
export class VillageScene implements TeamSceneInterface {
  readonly teamId = 'village-builders'
  readonly teamName = 'Village Builders'
  readonly description = 'A peaceful medieval village with houses, trees, and a well'
  
  readonly bounds = {
    width: 20,   // Village spans 20 units in X
    height: 8,   // Tallest building is ~8 units
    depth: 15    // Village spans 15 units in Z
  }

  async buildScene(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): Promise<void> {
    // All positions are relative to the provided position offset
    const pos = (x: number, y: number, z: number) => ({
      x: position.x + x,
      y: position.y + y, 
      z: position.z + z
    })

    // Main house with chimney
    const house = createBox({
      width: 3, height: 3, depth: 2,
      position: pos(0, 1.5, 0),
      color: COLORS.WOOD
    })
    scene.add(house)

    // House roof
    const roof = createCone({
      radius: 2.2, height: 1.8,
      position: pos(0, 3.9, 0),
      color: COLORS.RED
    })
    scene.add(roof)

    // Chimney
    const chimney = createBox({
      width: 0.6, height: 1.5, depth: 0.6,
      position: pos(-1, 4.2, -0.5),
      color: COLORS.STONE
    })
    scene.add(chimney)

    // Oak tree
    const trunk1 = createCylinder({
      radiusTop: 0.3, radiusBottom: 0.3, height: 2,
      position: pos(-6, 1, 0),
      color: COLORS.TREE_TRUNK
    })
    scene.add(trunk1)

    const leaves1 = createSphere({
      radius: 1.8,
      position: pos(-6, 3, 0),
      color: COLORS.TREE_LEAVES
    })
    scene.add(leaves1)

    // Pine tree
    const trunk2 = createCylinder({
      radiusTop: 0.2, radiusBottom: 0.2, height: 2.5,
      position: pos(4, 1.25, -3),
      color: COLORS.TREE_TRUNK
    })
    scene.add(trunk2)

    const pine = createCone({
      radius: 1.2, height: 2,
      position: pos(4, 3.5, -3),
      color: COLORS.TREE_LEAVES
    })
    scene.add(pine)

    // Village well
    const wellBase = createCylinder({
      radiusTop: 1.5, radiusBottom: 1.5, height: 1.6,
      position: pos(-2, 0.8, 4),
      color: COLORS.STONE
    })
    scene.add(wellBase)

    const wellRoof = createCone({
      radius: 1.8, height: 1.2,
      position: pos(-2, 2.5, 4),
      color: COLORS.WOOD
    })
    scene.add(wellRoof)

    // Wooden fence
    for (let i = 0; i < 3; i++) {
      const fencePost = createBox({
        width: 0.3, height: 1.6, depth: 0.3,
        position: pos(2 + i, 0.8, 2),
        color: COLORS.WOOD
      })
      scene.add(fencePost)
    }

    const fenceRail = createBox({
      width: 2.4, height: 0.2, depth: 0.2,
      position: pos(2.5, 1.2, 2),
      color: COLORS.WOOD
    })
    scene.add(fenceRail)

    // Flower decorations
    const flower1 = createSphere({
      radius: 0.3,
      position: pos(1, 0.3, 1),
      color: COLORS.RED
    })
    scene.add(flower1)

    const flower2 = createSphere({
      radius: 0.3,
      position: pos(1.5, 0.3, 0.5),
      color: COLORS.YELLOW
    })
    scene.add(flower2)

    // Small storage shed
    const shed = createBox({
      width: 1.5, height: 1.5, depth: 1,
      position: pos(6, 0.75, 2),
      color: COLORS.WOOD
    })
    scene.add(shed)

    const shedRoof = createBox({
      width: 1.8, height: 0.3, depth: 1.3,
      position: pos(6, 1.65, 2),
      color: COLORS.STONE
    })
    scene.add(shedRoof)
  }

  getTourPoints(): TourPoint[] {
    return [
      {
        name: "Village Overview",
        description: "Welcome to our peaceful medieval village! See the main house, trees, and well.",
        cameraPosition: new THREE.Vector3(8, 6, 8),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 3
      },
      {
        name: "Main House",
        description: "The village's main house with a red roof and stone chimney.",
        cameraPosition: new THREE.Vector3(3, 4, 3),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 2
      },
      {
        name: "Village Well",
        description: "The community well where villagers gather water.",
        cameraPosition: new THREE.Vector3(-2, 3, 7),
        lookAtTarget: new THREE.Vector3(-2, 1, 4),
        duration: 2
      },
      {
        name: "Ancient Oak",
        description: "This majestic oak tree has watched over the village for generations.",
        cameraPosition: new THREE.Vector3(-9, 5, 3),
        lookAtTarget: new THREE.Vector3(-6, 3, 0),
        duration: 2
      }
    ]
  }

  dispose(): void {
    // Clean up any resources if needed
    // For basic primitives, Three.js handles most cleanup
    console.log(`Disposing ${this.teamName} scene resources`)
  }
}