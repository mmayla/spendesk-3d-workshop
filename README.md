# 🎯 3D Scene Building Workshop - Code First Edition

Welcome to the **3D Scene Building Challenge** for senior software engineers! Teams create amazing 3D scenes by writing **code** using Three.js primitives, then all scenes get combined into one massive virtual world.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- Modern web browser with WebGL support
- Code editor (VS Code recommended)

### Setup
```bash
# Clone or download the project
cd spendesk-threejs-workshop

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser - you'll see the **Team Selector** as the main interface.

## 🎨 Workshop Overview - Code First Approach

### The Challenge
Teams build 3D scenes by **writing TypeScript code** using primitive shapes:
- **Boxes** (houses, buildings, walls)
- **Spheres** (balls, planets, decorations)  
- **Cylinders** (trees, pillars, towers)
- **Cones** (roofs, mountains, decorations)

### The Magic Reveal
Teams work on individual scenes in code → **All get combined into districts of a massive virtual world!**

## 🛠️ How to Build Your Scene (Code First!)

### 1. Create Your Team's Scene Class
Teams write TypeScript code implementing the `TeamSceneInterface`:

```typescript
import { TeamSceneInterface, TourPoint } from '../../types/scene'
import { createBox, createSphere, COLORS } from '../../utils/primitives'

export class YourTeamScene implements TeamSceneInterface {
  readonly teamId = 'your-team-name'
  readonly teamName = 'Your Team Name' 
  readonly description = 'Your amazing scene description'
  readonly bounds = { width: 20, height: 10, depth: 15 }

  async buildScene(scene: THREE.Scene, position: THREE.Vector3) {
    // Build your 3D world with code!
    const house = createBox({
      width: 3, height: 3, depth: 2,
      position: { x: position.x, y: position.y + 1.5, z: position.z },
      color: COLORS.WOOD
    })
    scene.add(house)
  }
}
```

### 2. Preview Your Scene in Isolation
- Use the **Team Selector** to find your scene
- Click **"Preview Scene"** to test it independently
- Debug positioning and verify objects appear correctly

### 3. Navigation in Preview & Master Scene
- **Left Click + Drag**: Orbit camera around the scene
- **Mouse Wheel**: Zoom in/out  
- **Tour System**: Automated camera tours through interesting points

### 4. Scene Registration
Add your scene to `src/scenes/registry.ts` to make it appear in the system

## 🏗️ Building Ideas & Examples

### Village Scene
```typescript
// House (brown box + red cone roof)
createHouse({ 
  position: { x: 0, y: 0, z: 0 },
  width: 2, height: 2, depth: 1.5 
})

// Tree (brown cylinder + green sphere)
createTree({ 
  position: { x: -4, y: 0, z: 0 },
  trunkHeight: 2, leavesRadius: 1.2 
})
```

### Space Station
- Silver/metal boxes for modules
- Cylinders for connecting corridors
- Small spheres for communication arrays

### Ancient Temple
- Stone-colored boxes for temple base
- Cylinders for pillars
- Cones for decorative elements

### Carnival/Fair
- Colorful cylinders for tents
- Spheres for decorations
- Various shapes for rides and booths

## 🌟 Workshop Modes

### Team Selector (Primary Mode)
**Code-first approach for senior engineers:**
- Browse all registered team scenes
- Preview individual scenes in isolation
- Validate scene implementations
- Access master scene directly

### Master Scene (The Big Reveal!)
**Combined world where all scenes become districts:**
- All team scenes automatically loaded and arranged
- Grand tour visits all team's tour points  
- Explores the massive virtual world created collectively

### Legacy Modes (For Demos)
- **UI Builder**: Original drag-and-drop interface (kept for demonstrations)
- **Workshop Master**: File-based scene loading (legacy approach)

## 📁 File Formats

### Scene File Structure
```json
[
  {
    "id": "object-1",
    "type": "box",
    "name": "house-1",
    "position": { "x": 0, "y": 1.5, "z": 0 },
    "rotation": { "x": 0, "y": 0, "z": 0 },
    "scale": { "x": 2, "y": 3, "z": 1.5 },
    "color": 35653
  }
]
```

### Team Scene Format
```json
{
  "teamName": "Village Builders",
  "objects": [...],
  "metadata": {
    "createdAt": "2024-01-01T12:00:00Z",
    "description": "A peaceful village scene"
  }
}
```

## 🎯 Workshop Timeline (3 hours) - Code First Edition

### Phase 1: Setup & Code Introduction (20 minutes)
- Project setup verification (`npm install && npm run dev`)
- Code-first approach overview
- Interface explanation and example walkthrough
- Template scene demonstration

### Phase 2: Team Scene Development (2.5 hours)
- Team brainstorming and scene planning (15 min)
- Code development using TypeScript (2 hours)
  - Implement `TeamSceneInterface`
  - Use primitive creation functions
  - Test in isolation with scene preview
- Scene refinement and tour points (15 min)

### Phase 3: The Grand Integration (10 minutes)
- All scenes automatically appear in master scene
- **Grand Tour** showcasing all team districts
- Virtual world exploration and celebration!

## 🔧 Technical Details

### Built With
- **Three.js**: 3D graphics library
- **React**: UI components
- **TypeScript**: Type safety
- **Vite**: Fast development server

### Architecture
```
src/
├── components/          # React UI components
├── hooks/              # Custom React hooks
├── utils/              # Three.js utilities
│   ├── primitives.ts   # Shape creation utilities
│   ├── sceneCombiner.ts # Scene combination logic
│   └── cameraControls.ts # Camera navigation
└── ThreeScene.tsx      # Main 3D scene component
```

### Key Features
- **Real-time 3D editing**: Immediate visual feedback
- **Modular primitive system**: Reusable shape components
- **Scene serialization**: JSON import/export
- **Multi-scene combination**: Automatic world generation
- **Responsive design**: Works on different screen sizes

## 🎨 Color Palette

Available colors include:
- **Basic**: Red, Green, Blue, Yellow, Orange, Purple
- **Materials**: Wood, Stone, Metal, Gold, Silver
- **Nature**: Grass Green, Sky Blue, Earth Brown

## 🚀 Advanced Features

### Custom Orbit Controls
Custom-built camera controls optimized for the workshop experience.

### Scene Combination Algorithm
Automatically positions team scenes in a grid layout with:
- Configurable spacing between districts
- Team labels and boundaries
- Optimized lighting for large scenes

### Export Capabilities
- Individual scene JSON files
- Combined world exports
- Metadata preservation

## 🤝 Contributing

This is a workshop template. Feel free to:
- Add new primitive shapes
- Enhance the UI/UX
- Add new scene combination modes
- Improve the export formats

## 📝 Workshop Instructions for Instructors - Code First Edition

### Preparation
1. Ensure all participants can run `npm install && npm run dev`
2. Verify the Team Selector loads and shows example scenes
3. Test the Master Scene with example team scenes
4. Review the `TEAM_GUIDE.md` and template scene

### During the Workshop
1. **Demo the code-first approach** (10 min):
   - Show Team Selector interface
   - Walk through example scene code
   - Demonstrate scene preview functionality
2. **Teams code their scenes** (~2.5 hours):
   - Teams work independently implementing their scene classes
   - Help with TypeScript interface questions
   - Encourage use of scene preview for testing
3. **Grand Reveal** (10 min):
   - Open Master Scene to show all teams' work combined
   - Run the Grand Tour to visit each district
   - Celebrate the collective virtual world!

### Tips for Code-First Workshop
- **Emphasize the interface contract** - scenes must implement `TeamSceneInterface`
- **Encourage scene validation** - use the validation panel to check implementations
- **Promote tour points** - these make the grand reveal much more engaging
- **Help with positioning** - remind teams to use the `pos()` helper function
- **Take screenshots** of individual scene previews before the big reveal

## 🎉 Have Fun!

The magic moment when individual scenes become districts in a shared virtual world never gets old. Enjoy building, creating, and exploring!

---

*Built with ❤️ for the Three.js Workshop Experience*
