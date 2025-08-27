# 🎯 3D Scene Building Workshop - Code First Edition

Welcome to the **3D Scene Building Challenge** for senior software engineers! Teams create amazing 3D scenes by writing **code** using Three.js primitives with complete creative freedom.

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

### The Creative Challenge
Teams work independently to create unique 3D worlds using only primitive shapes and code.

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

  async buildScene(scene: THREE.Scene) {
    // Build your 3D world with code!
    const house = createBox({
      width: 3, height: 3, depth: 2,
      position: { x: 0, y: 1.5, z: 0 },
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

### Individual Scene Focus
**Each team creates their unique world:**
- Teams build completely independent scenes
- Preview and tour your own creation
- Complete creative freedom in design and environment

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

### Phase 3: Showcase & Celebration (10 minutes)
- Teams showcase their individual creations
- Tour each team's unique 3D world
- Celebrate the creativity and diversity!

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

### Individual Scene System
Each team creates their own independent scene with:
- Complete environment control
- Optional ground planes or space environments  
- Custom lighting and styling choices

### Export Capabilities
- Individual scene JSON files
- Scene metadata and properties
- Tour point configurations

## 🤝 Contributing

This is a workshop template. Feel free to:
- Add new primitive shapes
- Enhance the UI/UX
- Add new environment helpers
- Improve the scene preview system

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
3. **Showcase** (10 min):
   - Teams present their individual scenes
   - Demo each team's unique creation
   - Celebrate the creative diversity!

### Tips for Code-First Workshop
- **Emphasize creative freedom** - teams can create any environment they want
- **Encourage scene preview** - use the preview system to test and debug
- **Promote tour points** - these make showcasing much more engaging
- **Help with positioning** - remind teams about coordinate system (x, y, z)
- **Take screenshots** of individual scene previews

## 🎉 Have Fun!

Watch teams' creativity come to life as they build amazing 3D worlds from simple primitives. Enjoy the building, creating, and exploring!

---

*Built with ❤️ for the Three.js Workshop Experience*
