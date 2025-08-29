import type { SceneInterface } from '../types/scene';

// Static imports for all scene modules
import { BoatBarbecueScene } from './boat-barbecue/index';
import { CaptainMorganScene } from './captain-morgan-two/index';
import { CoffeeShop } from './coffee-shop/index';

// Scene registry with static references
const SCENE_CLASSES = {
  'boat-barbecue-scene': BoatBarbecueScene,
  'captain-morgan-two': CaptainMorganScene,
  'coffee-shop': CoffeeShop,
} as const;

export const SCENE_REGISTRY = Object.entries(SCENE_CLASSES).map(
  ([sceneId, SceneClass]) => ({
    sceneId,
    SceneClass,
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

  const SceneClass = entry.SceneClass;

  if (!SceneClass) {
    throw new Error(`No valid scene class found for: ${sceneId}`);
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
  console.log(
    'Registered Scenes:',
    SCENE_REGISTRY.map((e) => e.sceneId)
  );
  console.log('Enabled Scenes:', getEnabledSceneIds());
}
