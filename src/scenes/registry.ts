import type { SceneInterface } from '../types/scene';

// Dynamic imports for hot reload support
async function getVillageScene() {
  // Dynamic import for hot reload support
  const module = await import('./village-builders/VillageScene.js');
  return module.VillageScene;
}

async function getSpaceStationScene() {
  const module = await import('./space-station/SpaceStationScene.js');
  return module.SpaceStationScene;
}

async function getTemplateScene() {
  const module = await import('./team-template/TemplateScene.js');
  return module.TemplateScene;
}

/**
 * Central registry for all scenes
 *
 * Add your scene classes here to make them available in the preview system.
 *
 * To add a new scene:
 * 1. Add a dynamic import function above
 * 2. Add an entry to SCENE_REGISTRY with your scene loader and enabled: true
 * 3. Your scene will automatically appear in the scene selector
 */
export const SCENE_REGISTRY: Array<{
  sceneId: string;
  sceneLoader: () => Promise<new () => SceneInterface>;
  enabled: boolean;
}> = [
  {
    sceneId: 'village-builders',
    sceneLoader: getVillageScene,
    enabled: true,
  },
  {
    sceneId: 'space-station',
    sceneLoader: getSpaceStationScene,
    enabled: true,
  },
  {
    sceneId: 'template-scene',
    sceneLoader: getTemplateScene,
    enabled: true,
  },

  // Add your scene here!
  // Example:
  // {
  //   sceneId: 'your-scene-id',
  //   sceneLoader: getYourScene,
  //   enabled: true
  // }
];

/**
 * Get all enabled scene IDs
 */
export function getEnabledSceneIds(): string[] {
  return SCENE_REGISTRY.filter((entry) => entry.enabled).map((entry) => entry.sceneId);
}

/**
 * Create an instance of a scene (with dynamic loading for hot reload)
 */
export async function createSceneInstance(sceneId: string) {
  const entry = SCENE_REGISTRY.find((entry) => entry.enabled && entry.sceneId === sceneId);

  if (!entry) {
    throw new Error(`Scene not found for scene ID: ${sceneId}`);
  }

  // Load the scene class dynamically
  const SceneClass = await entry.sceneLoader();
  return new SceneClass();
}

/**
 * Validate that a scene implements the required interface
 */
export async function validateSceneInterface(sceneId: string): Promise<boolean> {
  try {
    const scene = await createSceneInstance(sceneId);

    // Check required properties
    const requiredProps = ['sceneId', 'sceneName', 'description', 'buildScene'];
    for (const prop of requiredProps) {
      if (!(prop in scene)) {
        console.error(`Scene ${sceneId} missing required property: ${prop}`);
        return false;
      }
    }

    // Check buildScene is a function
    if (typeof scene.buildScene !== 'function') {
      console.error(`Scene ${sceneId} buildScene is not a function`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error validating scene ${sceneId}:`, error);
    return false;
  }
}

/**
 * Get scene metadata for all enabled scenes
 */
export async function getSceneMetadata() {
  const sceneIds = getEnabledSceneIds();
  const results = [];
  
  for (const sceneId of sceneIds) {
    try {
      const scene = await createSceneInstance(sceneId);
      results.push({
        sceneId: scene.sceneId,
        sceneName: scene.sceneName,
        description: scene.description,
        hasTourPoints: typeof scene.getTourPoints === 'function',
      });
    } catch (error) {
      console.error(`Error getting metadata for scene ${sceneId}:`, error);
    }
  }
  
  return results;
}

// Development mode logging
if (import.meta.env.DEV) {
  console.log('🎯 Scene Registry Loaded');
  console.log('📋 Registered Scenes:', SCENE_REGISTRY.map(e => e.sceneId));
  console.log('✅ Enabled Scenes:', getEnabledSceneIds());
}
