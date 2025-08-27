import * as THREE from 'three'
import type { TeamSceneInterface, TourPoint } from '../../types/scene'
import { createBox, createSphere, createCylinder, createCone, COLORS } from '../../utils/primitives'

/**
 * Example team scene: Carnival Builders
 * 
 * This demonstrates a colorful carnival with rides, tents, and festive elements
 * Using bright colors and playful shapes to create a fun fair atmosphere
 */
export class CarnivalScene implements TeamSceneInterface {
  readonly teamId = 'carnival'
  readonly teamName = 'Carnival Builders'
  readonly description = 'A vibrant carnival with rides, game booths, and colorful attractions'
  
  readonly bounds = {
    width: 30,   // Carnival spans 30 units
    height: 15,  // Ferris wheel reaches 15 units
    depth: 20    // Carnival depth is 20 units
  }

  async buildScene(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): Promise<void> {
    const pos = (x: number, y: number, z: number) => ({
      x: position.x + x,
      y: position.y + y, 
      z: position.z + z
    })

    // Ferris wheel base
    const ferrisBase = createBox({
      width: 2, height: 1, depth: 2,
      position: pos(0, 0.5, 0),
      color: COLORS.METAL
    })
    scene.add(ferrisBase)

    // Ferris wheel support posts
    const leftSupport = createBox({
      width: 0.5, height: 8, depth: 0.5,
      position: pos(-1.5, 4, 0),
      color: COLORS.METAL
    })
    scene.add(leftSupport)

    const rightSupport = createBox({
      width: 0.5, height: 8, depth: 0.5,
      position: pos(1.5, 4, 0),
      color: COLORS.METAL
    })
    scene.add(rightSupport)

    // Ferris wheel
    const ferrisWheel = createSphere({
      radius: 6,
      position: pos(0, 8, 0),
      color: COLORS.RED,
      scale: { x: 1, y: 1, z: 0.2 }
    })
    scene.add(ferrisWheel)

    // Ferris wheel gondolas
    const gondolaPositions = [
      { angle: 0, radius: 5.5 },
      { angle: Math.PI / 3, radius: 5.5 },
      { angle: 2 * Math.PI / 3, radius: 5.5 },
      { angle: Math.PI, radius: 5.5 },
      { angle: 4 * Math.PI / 3, radius: 5.5 },
      { angle: 5 * Math.PI / 3, radius: 5.5 }
    ]

    gondolaPositions.forEach(gondola => {
      const x = Math.cos(gondola.angle) * gondola.radius
      const y = Math.sin(gondola.angle) * gondola.radius + 8

      const gondolaBox = createBox({
        width: 1, height: 0.8, depth: 1,
        position: pos(x, y, 0),
        color: COLORS.BLUE
      })
      scene.add(gondolaBox)
    })

    // Carousel base
    const carouselBase = createCylinder({
      radiusTop: 4, radiusBottom: 4, height: 0.5,
      position: pos(-12, 0.25, 0),
      color: COLORS.GOLD
    })
    scene.add(carouselBase)

    // Carousel center pole
    const carouselPole = createCylinder({
      radiusTop: 0.3, radiusBottom: 0.3, height: 4,
      position: pos(-12, 2, 0),
      color: COLORS.METAL
    })
    scene.add(carouselPole)

    // Carousel roof
    const carouselRoof = createCone({
      radius: 4.5, height: 2,
      position: pos(-12, 5, 0),
      color: COLORS.RED
    })
    scene.add(carouselRoof)

    // Carousel horses
    const horsePositions = [
      { angle: 0, radius: 2.5 },
      { angle: Math.PI / 2, radius: 2.5 },
      { angle: Math.PI, radius: 2.5 },
      { angle: 3 * Math.PI / 2, radius: 2.5 }
    ]

    horsePositions.forEach(horse => {
      const x = Math.cos(horse.angle) * horse.radius - 12
      const z = Math.sin(horse.angle) * horse.radius

      const horseBody = createBox({
        width: 0.6, height: 1, depth: 1.5,
        position: pos(x, 1, z),
        color: COLORS.WHITE
      })
      scene.add(horseBody)

      const horseHead = createBox({
        width: 0.4, height: 0.6, depth: 0.4,
        position: pos(x, 1.3, z + 0.8),
        color: COLORS.WHITE
      })
      scene.add(horseHead)
    })

    // Game booth 1 - Ring Toss
    const booth1 = createBox({
      width: 3, height: 2.5, depth: 2,
      position: pos(8, 1.25, -6),
      color: COLORS.YELLOW
    })
    scene.add(booth1)

    const booth1Roof = createCone({
      radius: 2, height: 1,
      position: pos(8, 3, -6),
      color: COLORS.BLUE
    })
    scene.add(booth1Roof)

    // Ring toss posts
    for (let i = 0; i < 3; i++) {
      const post = createCylinder({
        radiusTop: 0.1, radiusBottom: 0.1, height: 0.8,
        position: pos(7 + i * 0.5, 0.4, -5),
        color: COLORS.WOOD
      })
      scene.add(post)
    }

    // Game booth 2 - Ball Toss
    const booth2 = createBox({
      width: 3, height: 2.5, depth: 2,
      position: pos(8, 1.25, 6),
      color: COLORS.GREEN
    })
    scene.add(booth2)

    const booth2Roof = createCone({
      radius: 2, height: 1,
      position: pos(8, 3, 6),
      color: COLORS.ORANGE
    })
    scene.add(booth2Roof)

    // Ball toss targets
    for (let i = 0; i < 3; i++) {
      const target = createSphere({
        radius: 0.3,
        position: pos(7.2 + i * 0.3, 0.8, 7),
        color: COLORS.RED
      })
      scene.add(target)
    }

    // Cotton candy stand
    const candyStand = createBox({
      width: 2, height: 2, depth: 1.5,
      position: pos(-8, 1, -8),
      color: COLORS.PINK
    })
    scene.add(candyStand)

    const candyStandRoof = createBox({
      width: 2.5, height: 0.3, depth: 2,
      position: pos(-8, 2.15, -8),
      color: COLORS.WHITE
    })
    scene.add(candyStandRoof)

    // Cotton candy machine
    const candyMachine = createCylinder({
      radiusTop: 0.8, radiusBottom: 0.8, height: 1,
      position: pos(-8, 0.5, -8),
      color: COLORS.SILVER
    })
    scene.add(candyMachine)

    // Popcorn stand
    const popcornStand = createBox({
      width: 2, height: 2, depth: 1.5,
      position: pos(-8, 1, 8),
      color: COLORS.RED
    })
    scene.add(popcornStand)

    const popcornStandRoof = createBox({
      width: 2.5, height: 0.3, depth: 2,
      position: pos(-8, 2.15, 8),
      color: COLORS.YELLOW
    })
    scene.add(popcornStandRoof)

    // Fun house entrance
    const funHouse = createBox({
      width: 4, height: 3, depth: 3,
      position: pos(12, 1.5, 0),
      color: COLORS.PURPLE
    })
    scene.add(funHouse)

    const funHouseRoof = createCone({
      radius: 2.5, height: 1.5,
      position: pos(12, 3.75, 0),
      color: COLORS.ORANGE
    })
    scene.add(funHouseRoof)

    // Fun house entrance door
    const door = createBox({
      width: 1, height: 2, depth: 0.1,
      position: pos(10, 1, 0),
      color: COLORS.BLACK
    })
    scene.add(door)

    // Balloons
    const balloonColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN]
    for (let i = 0; i < 4; i++) {
      const balloon = createSphere({
        radius: 0.4,
        position: pos(6, 3 + i * 0.5, -8),
        color: balloonColors[i]
      })
      scene.add(balloon)

      // Balloon string
      const string = createCylinder({
        radiusTop: 0.02, radiusBottom: 0.02, height: 2 + i * 0.5,
        position: pos(6, 1.5 + i * 0.25, -8),
        color: COLORS.BLACK
      })
      scene.add(string)
    }

    // Ticket booth
    const ticketBooth = createBox({
      width: 2, height: 2, depth: 2,
      position: pos(-15, 1, 0),
      color: COLORS.BLUE
    })
    scene.add(ticketBooth)

    const ticketBoothRoof = createCone({
      radius: 1.5, height: 1,
      position: pos(-15, 2.5, 0),
      color: COLORS.RED
    })
    scene.add(ticketBoothRoof)

    // Entrance sign
    const signPost = createCylinder({
      radiusTop: 0.2, radiusBottom: 0.2, height: 4,
      position: pos(-18, 2, 0),
      color: COLORS.WOOD
    })
    scene.add(signPost)

    const sign = createBox({
      width: 3, height: 1, depth: 0.2,
      position: pos(-18, 4.5, 0),
      color: COLORS.YELLOW
    })
    scene.add(sign)
  }

  getTourPoints(): TourPoint[] {
    return [
      {
        name: "Carnival Overview",
        description: "Welcome to the magical carnival! See the Ferris wheel, carousel, and colorful attractions.",
        cameraPosition: new THREE.Vector3(20, 12, 15),
        lookAtTarget: new THREE.Vector3(0, 5, 0),
        duration: 4
      },
      {
        name: "Ferris Wheel",
        description: "The grand Ferris wheel offers spectacular views of the entire carnival grounds.",
        cameraPosition: new THREE.Vector3(8, 8, 8),
        lookAtTarget: new THREE.Vector3(0, 8, 0),
        duration: 3
      },
      {
        name: "Merry Carousel",
        description: "The classic carousel with painted horses has delighted visitors for generations.",
        cameraPosition: new THREE.Vector3(-8, 4, 6),
        lookAtTarget: new THREE.Vector3(-12, 2, 0),
        duration: 3
      },
      {
        name: "Game Booths",
        description: "Test your skill at ring toss and ball games to win amazing prizes!",
        cameraPosition: new THREE.Vector3(12, 4, 0),
        lookAtTarget: new THREE.Vector3(8, 2, 0),
        duration: 2
      },
      {
        name: "Sweet Treats",
        description: "Indulge in cotton candy, popcorn, and other carnival delicacies.",
        cameraPosition: new THREE.Vector3(-12, 3, -4),
        lookAtTarget: new THREE.Vector3(-8, 1, -8),
        duration: 2
      },
      {
        name: "Fun House",
        description: "Enter the mysterious fun house for mirrors, mazes, and magical surprises!",
        cameraPosition: new THREE.Vector3(16, 5, 4),
        lookAtTarget: new THREE.Vector3(12, 2, 0),
        duration: 2
      }
    ]
  }

  dispose(): void {
    console.log(`Disposing ${this.teamName} scene resources`)
  }
}