import type { SceneRegistryEntry } from "../types/scene";
import { VillageScene } from "./village-builders/VillageScene";
import { SpaceStationScene } from "./space-station/SpaceStationScene";
import { TemplateScene } from "./team-template/TemplateScene";

/**
 * Central registry for all scenes
 *
 * Add your scene classes here to make them available in the preview system.
 *
 * To add a new scene:
 * 1. Import your scene class at the top
 * 2. Add an entry to SCENE_REGISTRY with your scene class and enabled: true
 * 3. Your scene will automatically appear in the scene selector
 */
export const SCENE_REGISTRY: SceneRegistryEntry[] = [
  {
    sceneClass: VillageScene,
    enabled: true,
  },
  {
    sceneClass: SpaceStationScene,
    enabled: true,
  },
  {
    sceneClass: TemplateScene,
    enabled: true,
  },

  // Add your scene here!
  // Example:
  // {
  //   sceneClass: YourSceneClass,
  //   enabled: true
  // }
];

/**
 * Get all enabled scenes from the registry
 */
export function getEnabledScenes(): SceneRegistryEntry[] {
  return SCENE_REGISTRY.filter((entry) => entry.enabled);
}

/**
 * Get a specific scene by scene ID
 */
export function getSceneBySceneId(
  sceneId: string
): SceneRegistryEntry | undefined {
  return SCENE_REGISTRY.find((entry) => {
    if (!entry.enabled) return false;
    const instance = new entry.sceneClass();
    return instance.sceneId === sceneId;
  });
}

/**
 * Get all registered scene IDs
 */
export function getAllSceneIds(): string[] {
  return SCENE_REGISTRY.map((entry) => {
    const instance = new entry.sceneClass();
    return instance.sceneId;
  });
}

/**
 * Get all enabled scene IDs
 */
export function getEnabledSceneIds(): string[] {
  return SCENE_REGISTRY
    .filter((entry) => entry.enabled)
    .map((entry) => {
      const instance = new entry.sceneClass();
      return instance.sceneId;
    });
}

/**
 * Create an instance of a scene
 */
export function createSceneInstance(sceneId: string) {
  const entry = SCENE_REGISTRY.find((entry) => {
    if (!entry.enabled) return false;
    const instance = new entry.sceneClass();
    return instance.sceneId === sceneId;
  });
  
  if (!entry) {
    throw new Error(`Scene not found for scene ID: ${sceneId}`);
  }

  return new entry.sceneClass();
}

/**
 * Validate that a team scene implements the required interface
 */
export function validateSceneInterface(sceneId: string): boolean {
  try {
    const scene = createSceneInstance(sceneId);

    // Check required properties
    const requiredProps = ["sceneId", "sceneName", "description", "buildScene"];
    for (const prop of requiredProps) {
      if (!(prop in scene)) {
        console.error(`Scene ${sceneId} missing required property: ${prop}`);
        return false;
      }
    }

    // Check buildScene is a function
    if (typeof scene.buildScene !== "function") {
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
export function getSceneMetadata() {
  return getEnabledSceneIds()
    .map((sceneId) => {
      try {
        const scene = createSceneInstance(sceneId);
        return {
          sceneId: scene.sceneId,
          sceneName: scene.sceneName,
          description: scene.description,
          hasTourPoints: typeof scene.getTourPoints === "function",
        };
      } catch (error) {
        console.error(`Error getting metadata for scene ${sceneId}:`, error);
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Development helper: Validate all registered scenes
 */
export function validateAllScenes(): Record<string, boolean> {
  const results: Record<string, boolean> = {};

  for (const sceneId of getAllSceneIds()) {
    results[sceneId] = validateSceneInterface(sceneId);
  }

  return results;
}

// Development mode logging
if (import.meta.env.DEV) {
  console.log("🎯 Scene Registry Loaded");
  console.log("📋 Registered Teams:", getAllSceneIds());
  console.log("✅ Enabled Teams:", getEnabledSceneIds());

  // Validate all scenes in development
  const validationResults = validateAllScenes();
  const invalidScenes = Object.entries(validationResults)
    .filter(([, isValid]) => !isValid)
    .map(([sceneId]) => sceneId);

  if (invalidScenes.length > 0) {
    console.warn("⚠️  Invalid scenes found:", invalidScenes);
  } else {
    console.log("✨ All scenes are valid!");
  }
}
