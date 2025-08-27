# 🎯 3D Scene Building Workshop

A Three.js workshop platform for building 3D scenes using TypeScript and primitive shapes.

## 🚀 Quick Setup

### Prerequisites
- Node.js 20.19+ or 22.12+
- Modern web browser with WebGL support

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) to access the Scene Selector interface.

## 🏗️ Project Structure

```
src/
├── components/          # React UI components
│   ├── SceneSelector.tsx    # Main scene browser interface
│   └── ScenePreview.tsx     # Individual scene preview
├── scenes/              # Scene implementations
│   ├── registry.ts          # Scene registration system
│   ├── template-scene/      # Template for new scenes
│   ├── village-builders/    # Example village scene
│   └── space-station/       # Example space scene
├── types/               # TypeScript type definitions
│   └── scene.ts            # Scene interface definitions
├── utils/               # Three.js utilities
│   ├── primitives.ts       # Shape creation functions
│   └── sceneCombiner.ts    # Scene management utilities
└── hooks/               # Custom React hooks
```

## 🔧 Technical Stack

- **Three.js**: 3D graphics and WebGL rendering
- **React 18**: Component-based UI framework
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast development server and build tool

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors

# Type checking
npx tsc --noEmit        # Check TypeScript types
```

## 📚 Key Interfaces

### SceneInterface
All scenes must implement this interface:

```typescript
export interface SceneInterface {
  readonly sceneId: string        // Unique identifier
  readonly sceneName: string      // Display name
  readonly description: string    // Brief description
  buildScene(scene: THREE.Scene): Promise<void>  // Main build method
  getTourPoints?(): TourPoint[]   // Optional tour points
}
```

### Scene Registration
Add scenes to the registry in `src/scenes/registry.ts`:

```typescript
export const SCENE_REGISTRY: SceneRegistryEntry[] = [
  {
    sceneClass: YourSceneClass,
    enabled: true
  }
];
```

## 🎨 Available Primitives

The project includes utility functions for creating 3D shapes:

- `createBox()` - Cubes and rectangular objects
- `createSphere()` - Balls and round objects  
- `createCylinder()` - Pillars and cylindrical shapes
- `createCone()` - Cones and pyramid-like shapes
- `createGroundPlane()` - Ground surfaces
- `createSpaceEnvironment()` - Starfield backgrounds

Color constants available in `COLORS` object.

## 🔍 Scene System

### Individual Scene Mode
- Each scene is completely independent
- Scenes control their own environment (ground, space, etc.)
- Preview scenes in isolation via Scene Selector
- Optional tour points for guided viewing

### Scene Validation
The registry automatically validates scenes for:
- Required interface properties (`sceneId`, `sceneName`, `description`, `buildScene`)
- Proper method signatures
- Error handling and logging

## 🎯 Workshop Usage

For workshop instructions and scene building guide, see **[TEAM_GUIDE.md](./TEAM_GUIDE.md)**

## 🤝 Contributing

1. Create a new scene folder in `src/scenes/`
2. Implement the `SceneInterface`
3. Add to scene registry
4. Test via Scene Selector

## 📝 License

Built for educational workshop purposes.

---

*Happy building! 🎉*