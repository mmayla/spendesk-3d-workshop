# 🎯 Team Guide: Building Your 3D Scene

Welcome to the **3D Scene Building Workshop**! Your mission is to create an awesome 3D scene using only primitive shapes that will be combined with other teams' scenes into one massive virtual world.

## 🚀 Quick Start

### 1. Create Your Team Folder
```bash
# Create your team's scene folder
mkdir src/scenes/your-team-name
cd src/scenes/your-team-name
```

### 2. Create Your Scene Class
Create a new file `YourTeamScene.ts` that implements the `TeamSceneInterface`:

```typescript
import * as THREE from 'three'
import { TeamSceneInterface, TourPoint } from '../../types/scene'
import { createBox, createSphere, createCylinder, createCone, COLORS } from '../../utils/primitives'

export class YourTeamScene implements TeamSceneInterface {
  readonly teamId = 'your-team-name'           // Must match folder name
  readonly teamName = 'Your Team Name'          // Display name
  readonly description = 'Brief description of your scene'
  
  readonly bounds = {
    width: 20,   // How wide your scene is (X axis)
    height: 10,  // How tall your scene is (Y axis) 
    depth: 15    // How deep your scene is (Z axis)
  }

  async buildScene(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): Promise<void> {
    // Helper function to position objects relative to your scene's origin
    const pos = (x: number, y: number, z: number) => ({
      x: position.x + x,
      y: position.y + y, 
      z: position.z + z
    })

    // Build your scene here!
    const house = createBox({
      width: 2, height: 3, depth: 1.5,
      position: pos(0, 1.5, 0),
      color: COLORS.WOOD
    })
    scene.add(house)

    // Add more objects...
  }

  // Optional: Define tour points for the grand tour
  getTourPoints?(): TourPoint[] {
    return [
      {
        name: "Scene Overview",
        description: "Welcome to our amazing scene!",
        cameraPosition: new THREE.Vector3(10, 8, 10),
        lookAtTarget: new THREE.Vector3(0, 2, 0),
        duration: 3
      }
      // Add more tour points...
    ]
  }

  // Optional: Cleanup resources
  dispose?(): void {
    console.log(`Disposing ${this.teamName} scene resources`)
  }
}
```

### 3. Register Your Scene
Add your scene to the registry in `src/scenes/registry.ts`:

```typescript
import { YourTeamScene } from './your-team-name/YourTeamScene'

export const SCENE_REGISTRY: Record<string, SceneRegistryEntry> = {
  // ... existing scenes ...
  
  'your-team-name': {
    sceneClass: YourTeamScene,
    enabled: true
  }
}
```

### 4. Test Your Scene
```bash
npm run dev
```
- Navigate to the Team Selector
- Find your scene in the list
- Click "Preview Scene" to test it in isolation

## 🛠️ Available Primitives

You have access to these shape-building functions:

### Basic Shapes

```typescript
// Box (cubes, buildings, walls)
const box = createBox({
  width: 2, height: 3, depth: 1,
  position: pos(0, 1.5, 0),
  color: COLORS.WOOD
})

// Sphere (balls, planets, decorations)
const sphere = createSphere({
  radius: 1,
  position: pos(0, 1, 0),
  color: COLORS.BLUE
})

// Cylinder (trees, pillars, towers)
const cylinder = createCylinder({
  radiusTop: 0.5, radiusBottom: 1, height: 2,
  position: pos(0, 1, 0),
  color: COLORS.STONE
})

// Cone (roofs, mountains, hats)
const cone = createCone({
  radius: 1, height: 2,
  position: pos(0, 1, 0),
  color: COLORS.RED
})
```

### Helper Functions

```typescript
// Pre-built tree
const tree = createTree({
  position: pos(-5, 0, 0),
  trunkHeight: 2,
  leavesRadius: 1.2
})

// Pre-built house
const house = createHouse({
  position: pos(0, 0, 0),
  width: 2, height: 2, depth: 1.5,
  roofColor: COLORS.RED
})
```

## 🎨 Color Palette

Use these predefined colors for consistency:

```typescript
// Basic Colors
COLORS.RED, COLORS.GREEN, COLORS.BLUE, COLORS.YELLOW
COLORS.ORANGE, COLORS.PURPLE, COLORS.PINK, COLORS.WHITE
COLORS.BLACK, COLORS.GRAY

// Material Colors
COLORS.WOOD, COLORS.STONE, COLORS.METAL, COLORS.GOLD
COLORS.SILVER, COLORS.GRASS, COLORS.WATER, COLORS.SAND

// Nature Colors
COLORS.TREE_TRUNK, COLORS.TREE_LEAVES, COLORS.SKY_BLUE
COLORS.SUNSET_ORANGE, COLORS.EARTH_BROWN
```

## 📐 Positioning & Coordinate System

- **Origin (0, 0, 0)** is the center of your scene
- **Y-axis** points up (positive Y = higher)
- **X-axis** points right (positive X = to the right)
- **Z-axis** points toward the camera (positive Z = toward viewer)

Always use the `pos()` helper function to ensure your objects work correctly in the master scene:

```typescript
const pos = (x: number, y: number, z: number) => ({
  x: position.x + x,
  y: position.y + y, 
  z: position.z + z
})
```

## 🎬 Tour Points (Optional but Recommended!)

Add tour points to showcase your scene in the grand tour:

```typescript
getTourPoints(): TourPoint[] {
  return [
    {
      name: "Epic Overview",
      description: "See the whole scene from above",
      cameraPosition: new THREE.Vector3(15, 12, 15),
      lookAtTarget: new THREE.Vector3(0, 3, 0),
      duration: 4  // seconds to pause here
    },
    {
      name: "Cool Detail",
      description: "Check out this awesome detail",
      cameraPosition: new THREE.Vector3(5, 3, 5),
      lookAtTarget: new THREE.Vector3(0, 1, 0),
      duration: 2
    }
  ]
}
```

## 💡 Scene Ideas & Inspiration

### 🏘️ Village/Town
- Houses with different roof styles
- Village well, market stalls
- Trees, gardens, fences
- Church or town hall

### 🚀 Space Station
- Modular pods and corridors
- Solar panels, communication arrays
- Docking bays, thrusters
- Use metallic colors

### 🏛️ Ancient Temple
- Stone pillars and platforms
- Altar with sacred fire
- Statues, obelisks
- Garden elements

### 🎪 Carnival/Fair
- Ferris wheel, carousel
- Game booths, food stands
- Colorful tents and decorations
- Balloons and flags

### 🏔️ Mountain Base
- Rocky formations (stacked boxes)
- Caves, bridges
- Waterfalls (blue cylinders)
- Alpine trees

### 🏜️ Desert Outpost
- Sand-colored buildings
- Cacti (green cylinders + spheres)
- Wells, solar panels
- Sandstone walls

## ✅ Best Practices

### 1. Scene Bounds
Set realistic bounds that encompass your entire scene:
```typescript
readonly bounds = {
  width: 20,   // Your scene shouldn't extend beyond ±10 on X
  height: 8,   // Tallest object should be around 8 units
  depth: 15    // Your scene shouldn't extend beyond ±7.5 on Z
}
```

### 2. Ground Level
- Place objects on the ground (Y = 0) or above
- Use `position: pos(x, height/2, z)` to place objects on the ground
- The master scene provides a ground plane at Y = 0

### 3. Performance
- Don't create too many objects (< 100 recommended)
- Use groups for complex objects
- Keep geometries simple

### 4. Naming & Organization
- Use descriptive variable names
- Group related objects
- Add comments for complex constructions

## 🐛 Troubleshooting

### Scene Not Appearing
1. Check that your `teamId` matches your folder name exactly
2. Verify you added your scene to `registry.ts`
3. Make sure `enabled: true` in the registry

### Objects Not Visible
1. Check Y positions (objects at Y=0 might be underground)
2. Verify your bounds are large enough
3. Use the scene preview to debug positioning

### Tour Not Working
1. Ensure `getTourPoints()` returns an array
2. Check that camera positions are reasonable distances
3. Verify lookAt targets are within your scene bounds

### Invalid Scene Error
1. Make sure all required interface properties are implemented
2. Check that `buildScene` is an async function
3. Verify `bounds` has `width`, `height`, and `depth` properties

## 🎯 Workshop Timeline

### Phase 1: Planning (15 minutes)
- Decide on your scene theme
- Sketch out the layout
- Plan your objects and colors

### Phase 2: Building (2+ hours)
- Create your scene class
- Build objects one by one
- Test frequently in preview mode
- Add tour points

### Phase 3: Polish (30 minutes)
- Refine positioning and colors
- Add final details
- Test tour points
- Prepare for the big reveal!

## 🚀 Ready for the Magic?

When all teams are done, we'll combine every scene into one massive virtual world where you can explore all the districts created by different teams. Your scene becomes a neighborhood in a larger city!

The grand tour will take everyone through all the scenes, showcasing the amazing diversity and creativity of all the teams.

---

**Need help?** Ask your instructors or check the example scenes in:
- `src/scenes/village-builders/VillageScene.ts`
- `src/scenes/space-station/SpaceStationScene.ts`
- `src/scenes/ancient-temple/TempleScene.ts`
- `src/scenes/carnival/CarnivalScene.ts`

**Happy building! 🎉**