import * as THREE from 'three';
import type { PrimitiveType } from '../types';

export interface PrimitiveOptions {
  color?: number;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface BoxOptions extends PrimitiveOptions {
  width?: number;
  height?: number;
  depth?: number;
}

export interface SphereOptions extends PrimitiveOptions {
  radius?: number;
  segments?: number;
}

export interface CylinderOptions extends PrimitiveOptions {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
  segments?: number;
}

export interface ConeOptions extends PrimitiveOptions {
  radius?: number;
  height?: number;
  segments?: number;
}

export interface PlaneOptions extends PrimitiveOptions {
  width?: number;
  height?: number;
}

const applyCommonProperties = (
  mesh: THREE.Mesh,
  options: PrimitiveOptions = {}
) => {
  if (options.position) {
    mesh.position.set(
      options.position.x,
      options.position.y,
      options.position.z
    );
  }

  if (options.rotation) {
    mesh.rotation.set(
      options.rotation.x,
      options.rotation.y,
      options.rotation.z
    );
  }

  if (options.scale) {
    mesh.scale.set(options.scale.x, options.scale.y, options.scale.z);
  }

  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? false;

  return mesh;
};

export const createBox = (options: BoxOptions = {}): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(
    options.width ?? 1,
    options.height ?? 1,
    options.depth ?? 1
  );

  const material = new THREE.MeshLambertMaterial({
    color: options.color ?? 0x8b4513,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return applyCommonProperties(mesh, options);
};

export const createSphere = (options: SphereOptions = {}): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(
    options.radius ?? 1,
    options.segments ?? 16,
    options.segments ?? 16
  );

  const material = new THREE.MeshLambertMaterial({
    color: options.color ?? 0x228b22,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return applyCommonProperties(mesh, options);
};

export const createCylinder = (options: CylinderOptions = {}): THREE.Mesh => {
  const geometry = new THREE.CylinderGeometry(
    options.radiusTop ?? 1,
    options.radiusBottom ?? 1,
    options.height ?? 2,
    options.segments ?? 8
  );

  const material = new THREE.MeshLambertMaterial({
    color: options.color ?? 0x8b4513,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return applyCommonProperties(mesh, options);
};

export const createCone = (options: ConeOptions = {}): THREE.Mesh => {
  const geometry = new THREE.ConeGeometry(
    options.radius ?? 1,
    options.height ?? 2,
    options.segments ?? 8
  );

  const material = new THREE.MeshLambertMaterial({
    color: options.color ?? 0xff6347,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return applyCommonProperties(mesh, options);
};

export const createPlane = (options: PlaneOptions = {}): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(
    options.width ?? 1,
    options.height ?? 1
  );

  const material = new THREE.MeshLambertMaterial({
    color: options.color ?? 0x90ee90,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return applyCommonProperties(mesh, options);
};

// Predefined colors for easy access
export const COLORS = {
  // Basic colors
  RED: 0xff0000,
  GREEN: 0x00ff00,
  BLUE: 0x0000ff,
  YELLOW: 0xffff00,
  ORANGE: 0xffa500,
  PURPLE: 0x800080,
  PINK: 0xffc0cb,
  WHITE: 0xffffff,
  BLACK: 0x000000,
  GRAY: 0x808080,

  // Material colors
  WOOD: 0x8b4513,
  STONE: 0x696969,
  GRASS: 0x228b22,
  WATER: 0x1e90ff,
  SAND: 0xf4a460,
  METAL: 0x708090,
  GOLD: 0xffd700,
  SILVER: 0xc0c0c0,

  // Nature colors
  TREE_TRUNK: 0x8b4513,
  TREE_LEAVES: 0x228b22,
  SKY_BLUE: 0x87ceeb,
  SUNSET_ORANGE: 0xff6347,
  EARTH_BROWN: 0x8b4513,
} as const;

// Helper functions for common object combinations
export const createTree = (
  options: {
    position?: { x: number; y: number; z: number };
    trunkHeight?: number;
    leavesRadius?: number;
  } = {}
): THREE.Group => {
  const group = new THREE.Group();

  // Tree trunk
  const trunk = createCylinder({
    radiusTop: 0.3,
    radiusBottom: 0.3,
    height: options.trunkHeight ?? 2,
    color: COLORS.TREE_TRUNK,
    position: { x: 0, y: (options.trunkHeight ?? 2) / 2, z: 0 },
  });

  // Tree leaves
  const leaves = createSphere({
    radius: options.leavesRadius ?? 1.2,
    color: COLORS.TREE_LEAVES,
    position: {
      x: 0,
      y: (options.trunkHeight ?? 2) + (options.leavesRadius ?? 1.2) * 0.8,
      z: 0,
    },
  });

  group.add(trunk);
  group.add(leaves);

  if (options.position) {
    group.position.set(
      options.position.x,
      options.position.y,
      options.position.z
    );
  }

  return group;
};

export const createHouse = (
  options: {
    position?: { x: number; y: number; z: number };
    width?: number;
    height?: number;
    depth?: number;
    roofColor?: number;
  } = {}
): THREE.Group => {
  const group = new THREE.Group();
  const width = options.width ?? 2;
  const height = options.height ?? 2;
  const depth = options.depth ?? 1.5;

  // House base
  const base = createBox({
    width,
    height,
    depth,
    color: COLORS.WOOD,
    position: { x: 0, y: height / 2, z: 0 },
  });

  // Roof
  const roof = createCone({
    radius: Math.max(width, depth) * 0.7,
    height: height * 0.6,
    color: options.roofColor ?? COLORS.RED,
    position: { x: 0, y: height + (height * 0.6) / 2, z: 0 },
  });

  group.add(base);
  group.add(roof);

  if (options.position) {
    group.position.set(
      options.position.x,
      options.position.y,
      options.position.z
    );
  }

  return group;
};

export const createPrimitive = (
  type: PrimitiveType,
  options: PrimitiveOptions = {}
): THREE.Mesh => {
  switch (type) {
    case 'box':
      return createBox(options as BoxOptions);
    case 'sphere':
      return createSphere(options as SphereOptions);
    case 'cylinder':
      return createCylinder(options as CylinderOptions);
    case 'cone':
      return createCone(options as ConeOptions);
    case 'plane':
      return createPlane(options as PlaneOptions);
    default:
      return createBox(options as BoxOptions);
  }
};

// Environment Helpers - Optional utilities for different scene types

/**
 * Creates a large ground plane for traditional earth-based scenes
 * Optional helper - teams can choose to use this or create their own environment
 */
export const createGroundPlane = (
  options: {
    size?: number;
    color?: number;
    position?: { x: number; y: number; z: number };
  } = {}
): THREE.Mesh => {
  const groundSize = options.size ?? 50;
  const ground = createPlane({
    width: groundSize,
    height: groundSize,
    color: options.color ?? COLORS.GRASS,
    position: options.position ?? { x: 0, y: 0, z: 0 },
    rotation: { x: -Math.PI / 2, y: 0, z: 0 }, // Rotate to be horizontal
  });
  ground.receiveShadow = true;
  ground.castShadow = false;
  return ground;
};

/**
 * Creates a space environment setup with dark background and lighting
 * Optional helper for space-themed scenes
 */
export const createSpaceEnvironment = (scene: THREE.Scene): void => {
  // Set space-like background
  scene.background = new THREE.Color(0x000011);

  // Add some distant stars as small white points
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });

  const starsVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Add ambient light for space visibility
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);
};

/**
 * Creates basic lighting setup for general 3D scenes
 * Provides a good starting point for most scenes with ambient and directional lighting
 */
export const createBasicLighting = (scene: THREE.Scene): void => {
  // Ambient light for general illumination - brighter for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light (like sun) - positioned higher and further for better coverage
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 25);
  directionalLight.castShadow = true;
  
  // Shadow settings for better quality - larger shadow camera for bigger scenes
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  
  scene.add(directionalLight);
};
