import type { SceneInterface } from '../types/scene';

// Add your scene here with sceneId and module path
const SCENE_CONFIGS = {
  'village-builders': './village-builders/VillageScene.js',
  'space-station': './space-station/SpaceStationScene.js',
  'template-scene': './team-template/TemplateScene.js',
  // 'your-scene-id': './your-folder/YourScene.js',
} as const;

export const SCENE_REGISTRY = Object.entries(SCENE_CONFIGS).map(
  ([sceneId, modulePath]) => ({
    sceneId,
    modulePath,
    enabled: true,
  })
);

export function getEnabledSceneIds(): string[] {
  return SCENE_REGISTRY.filter((entry) => entry.enabled).map(
    (entry) => entry.sceneId
  );
}

export async function createSceneInstance(sceneId: string) {
  const entry = SCENE_REGISTRY.find(
    (entry) => entry.enabled && entry.sceneId === sceneId
  );

  if (!entry) {
    throw new Error(`Scene not found for scene ID: ${sceneId}`);
  }

  const module = await import(/* @vite-ignore */ entry.modulePath);

  const SceneClass =
    module.default ||
    module[Object.keys(module).find((key) => key.includes('Scene')) || ''] ||
    Object.values(module)[0];

  if (!SceneClass) {
    throw new Error(`No valid scene class found in module for: ${sceneId}`);
  }

  return new (SceneClass as new () => SceneInterface)();
}

export async function validateSceneInterface(
  sceneId: string
): Promise<boolean> {
  try {
    const scene = await createSceneInstance(sceneId);

    const requiredProps = ['sceneId', 'sceneName', 'description', 'buildScene'];
    for (const prop of requiredProps) {
      if (!(prop in scene)) {
        console.error(`Scene ${sceneId} missing required property: ${prop}`);
        return false;
      }
    }

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

if (import.meta.env.DEV) {
  console.log('Scene Registry Loaded');
  console.log('Registered Scenes:', SCENE_REGISTRY.map((e) => e.sceneId));
  console.log('Enabled Scenes:', getEnabledSceneIds());
}
