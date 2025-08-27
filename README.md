# 🎯 3D Scene Building Workshop

Welcome to the **3D Scene Building Challenge**! Teams create amazing 3D scenes using Three.js primitives, then all scenes get combined into one massive virtual world.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- Modern web browser with WebGL support

### Setup
```bash
# Clone or download the project
cd spendesk-threejs-workshop

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎨 Workshop Overview

### The Challenge
Teams build 3D scenes using only primitive shapes:
- **Boxes** (houses, buildings, walls)
- **Spheres** (balls, planets, decorations)
- **Cylinders** (trees, pillars, towers)
- **Cones** (roofs, mountains, decorations)
- **Planes** (floors, walls, signs)

### The Magic Reveal
Teams think they're building individual scenes → **All get combined into districts of a massive virtual world!**

## 🛠️ How to Build Your Scene

### 1. Scene Building Mode
- **Left Panel**: Select primitive shapes
- **Click "Add [Shape]"**: Places objects randomly in your scene
- **Click Objects**: Select them to edit properties
- **Right Panel**: Edit position, rotation, scale, and color

### 2. Object Controls
- **Position**: Move objects in 3D space (X, Y, Z coordinates)
- **Rotation**: Rotate objects (in degrees)
- **Scale**: Resize objects (X, Y, Z scaling)
- **Color**: Choose from predefined colors or materials

### 3. Camera Navigation
- **Left Click + Drag**: Orbit around the scene
- **Mouse Wheel**: Zoom in/out
- **Right Click + Drag**: Pan the camera

### 4. Scene Management
- **Save Scene**: Export your scene as JSON
- **Load Scene**: Import a previously saved scene
- **Clear Scene**: Start fresh

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

### Individual Building Mode
Default mode where teams build their scenes independently.

### Workshop Master Mode
Click **"🎯 Workshop Mode"** to access instructor controls:
- Load multiple team scene files
- Combine all scenes into one world
- Export the combined virtual world

### Combined World Viewer
The magical reveal showing all team scenes as districts in one massive world!

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

## 🎯 Workshop Timeline (3 hours)

### Phase 1: Setup & Tutorial (15 minutes)
- Project setup verification
- Basic Three.js concepts
- Tool demonstration

### Phase 2: Scene Building (2.5 hours)
- Team brainstorming (15 min)
- Individual/team building (2 hours)
- Scene refinement (15 min)

### Phase 3: The Big Reveal (15 minutes)
- Scene collection
- Combined world generation
- Virtual world exploration

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

## 📝 Workshop Instructions for Instructors

### Preparation
1. Ensure all participants can access the development server
2. Test the scene combination feature beforehand
3. Prepare example scenes for demonstration

### During the Workshop
1. Start with a quick demo of the tools
2. Let teams build for ~2 hours
3. Collect scene JSON files (via file sharing or upload)
4. Load all scenes in Workshop Master Mode
5. Reveal the combined world!

### Tips
- Encourage creativity with primitive combinations
- Suggest themes but allow freedom
- Take screenshots of individual scenes before combining
- Export the final combined world for sharing

## 🎉 Have Fun!

The magic moment when individual scenes become districts in a shared virtual world never gets old. Enjoy building, creating, and exploring!

---

*Built with ❤️ for the Three.js Workshop Experience*
