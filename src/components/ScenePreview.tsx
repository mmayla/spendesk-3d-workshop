import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  createSceneInstance,
  validateSceneInterface,
} from '../scenes/registry';
import type { SceneInterface } from '../types/scene';

interface ScenePreviewProps {
  sceneId?: string;
  onBack?: () => void;
}
export default function ScenePreview({
  sceneId: propSceneId,
  onBack,
}: ScenePreviewProps) {
  const { sceneId: urlSceneId } = useParams<{ sceneId: string }>();
  const navigate = useNavigate();
  const sceneId = propSceneId || urlSceneId;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | undefined>(undefined);
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined);
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined);
  const animationIdRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0, button: 0 });
  const cameraStateRef = useRef({
    phi: 0,
    theta: 0,
    radius: 15,
    lookAtTarget: new THREE.Vector3(0, 2, 0),
  });

  const [sceneInstance, setSceneInstance] = useState<SceneInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotReloadKey, setHotReloadKey] = useState(0);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  const [showTour, setShowTour] = useState(false);
  const [currentTourPoint, setCurrentTourPoint] = useState(0);
  const tourAnimationRef = useRef<number | undefined>(undefined);
  const autoTourTimeoutRef = useRef<number | undefined>(undefined);
  const isAutoTourRef = useRef(false);

  // Hot reload functionality
  useEffect(() => {
    if (import.meta.hot) {
      const handleHotUpdate = () => {
        console.log('Hot reload detected, refreshing scene...');
        setHotReloadKey((prev) => prev + 1);
      };

      // Listen for various hot reload events
      import.meta.hot.on('vite:beforeUpdate', handleHotUpdate);
      import.meta.hot.on('vite:afterUpdate', handleHotUpdate);

      return () => {
        import.meta.hot?.off('vite:beforeUpdate', handleHotUpdate);
        import.meta.hot?.off('vite:afterUpdate', handleHotUpdate);
      };
    }
  }, []);

  useEffect(() => {
    const initializeSceneData = async () => {
      try {
        if (!sceneId) {
          setError('No scene ID provided');
          setLoading(false);
          return;
        }

        console.log(
          'Initializing scene data for:',
          sceneId,
          'hotReloadKey:',
          hotReloadKey
        );
        setLoading(true);
        setError(null);

        const isValid = await validateSceneInterface(sceneId);
        if (!isValid) {
          throw new Error(
            `Scene ${sceneId} does not implement the required interface correctly`
          );
        }

        const instance = await createSceneInstance(sceneId);
        console.log('Scene instance created:', instance.constructor.name, {
          sceneId: instance.sceneId,
          sceneName: instance.sceneName,
          description: instance.description,
        });
        setSceneInstance(instance);
      } catch (error) {
        console.error('Error creating scene:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to create scene'
        );
        setLoading(false);
      }
    };

    initializeSceneData();
  }, [sceneId, hotReloadKey]);

  useEffect(() => {
    const initThreeJS = async () => {
      try {
        if (!canvasRef.current || !sceneInstance) {
          console.error('Canvas or scene instance not available');
          return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.set(15, 10, 15);
        camera.lookAt(0, 2, 0);
        cameraRef.current = camera;

        const initialPos = camera.position;
        const lookAt = new THREE.Vector3(0, 2, 0);
        const direction = initialPos.clone().sub(lookAt);
        const radius = direction.length();
        const theta = Math.acos(direction.y / radius);
        const phi = Math.atan2(direction.z, direction.x);

        cameraStateRef.current = {
          phi,
          theta,
          radius,
          lookAtTarget: lookAt.clone(),
        };

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x888888);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        // Clear existing scene objects for hot reload (scenes handle their own lighting)
        const childrenToRemove = scene.children.filter(
          (child) => child.type !== 'GridHelper'
        );
        childrenToRemove.forEach((child) => {
          scene.remove(child);
          if (child.type === 'Mesh') {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((material) => material.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });

        await sceneInstance.buildScene(scene);
        setupEventListeners();
        animate();

        setLoading(false);
      } catch (error) {
        console.error('Error initializing Three.js:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to initialize 3D scene'
        );
        setLoading(false);
      }
    };

    if (canvasRef.current && sceneInstance && !error) {
      initThreeJS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneInstance, error]);

  const setupEventListeners = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Mouse controls
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);

    // Keyboard controls
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Window resize
    window.addEventListener('resize', onWindowResize);
  };

  const onMouseDown = (event: MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = event.clientX;
    mouseRef.current.lastY = event.clientY;
    mouseRef.current.button = event.button;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!mouseRef.current.isDown || !cameraRef.current) return;

    const deltaX = event.clientX - mouseRef.current.lastX;
    const deltaY = event.clientY - mouseRef.current.lastY;

    if (mouseRef.current.button === 0) {
      // Left mouse button: orbit camera
      cameraStateRef.current.phi -= deltaX * 0.01;
      cameraStateRef.current.theta = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, cameraStateRef.current.theta + deltaY * 0.01)
      );
    } else if (
      mouseRef.current.button === 1 ||
      (mouseRef.current.button === 0 && event.shiftKey)
    ) {
      // Middle mouse button or Shift+Left: pan the focus target
      const panSpeed = 0.01;
      const camera = cameraRef.current;

      // Get camera's right and up vectors for panning
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();

      camera.getWorldDirection(new THREE.Vector3()); // This updates the camera's matrix
      right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
      up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();

      // Pan the lookAt target
      const panX = right.multiplyScalar(
        (-deltaX * panSpeed * cameraStateRef.current.radius) / 10
      );
      const panY = up.multiplyScalar(
        (deltaY * panSpeed * cameraStateRef.current.radius) / 10
      );

      cameraStateRef.current.lookAtTarget.add(panX).add(panY);
    }

    updateCameraPosition();

    mouseRef.current.lastX = event.clientX;
    mouseRef.current.lastY = event.clientY;
  };

  const onMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    cameraStateRef.current.radius = Math.max(
      5,
      Math.min(50, cameraStateRef.current.radius + event.deltaY * 0.01)
    );
    updateCameraPosition();
  };

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;

    const { phi, theta, radius, lookAtTarget } = cameraStateRef.current;

    const x = radius * Math.sin(theta) * Math.cos(phi) + lookAtTarget.x;
    const y = radius * Math.cos(theta) + lookAtTarget.y;
    const z = radius * Math.sin(theta) * Math.sin(phi) + lookAtTarget.z;

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(lookAtTarget);
  };

  const keysPressed = useRef(new Set<string>());

  const onKeyDown = (event: KeyboardEvent) => {
    keysPressed.current.add(event.code);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    keysPressed.current.delete(event.code);
  };

  useEffect(() => {
    const handleKeyboardMovement = () => {
      if (!cameraRef.current) return;

      const moveSpeed = 0.5;
      const camera = cameraRef.current;

      // Get camera's forward, right, and up vectors
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);

      camera.getWorldDirection(forward);
      right.crossVectors(forward, up).normalize();
      forward.normalize();

      let moved = false;

      // WASD movement
      if (keysPressed.current.has('KeyW')) {
        cameraStateRef.current.lookAtTarget.add(
          forward.multiplyScalar(moveSpeed)
        );
        moved = true;
      }
      if (keysPressed.current.has('KeyS')) {
        cameraStateRef.current.lookAtTarget.add(
          forward.multiplyScalar(-moveSpeed)
        );
        moved = true;
      }
      if (keysPressed.current.has('KeyA')) {
        cameraStateRef.current.lookAtTarget.add(
          right.multiplyScalar(-moveSpeed)
        );
        moved = true;
      }
      if (keysPressed.current.has('KeyD')) {
        cameraStateRef.current.lookAtTarget.add(
          right.multiplyScalar(moveSpeed)
        );
        moved = true;
      }

      if (moved) {
        updateCameraPosition();
      }
    };

    const intervalId = setInterval(handleKeyboardMovement, 16); // ~60fps
    return () => clearInterval(intervalId);
  }, []);

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const startTour = () => {
    if (!sceneInstance || !sceneInstance.getTourPoints || !cameraRef.current)
      return;

    const tourPoints = sceneInstance.getTourPoints();
    if (tourPoints.length === 0) return;

    setShowTour(true);
    setCurrentTourPoint(0);
    isAutoTourRef.current = true;
    animateToTourPoint(tourPoints[0], true); // true = auto-advance
  };

  const animateToTourPoint = (
    tourPoint: {
      cameraPosition: THREE.Vector3;
      lookAtTarget: THREE.Vector3;
      duration: number;
    },
    autoAdvance: boolean = true
  ) => {
    if (!cameraRef.current) return;

    // Cancel any existing animations and timeouts
    if (tourAnimationRef.current) {
      cancelAnimationFrame(tourAnimationRef.current);
    }
    if (autoTourTimeoutRef.current) {
      window.clearTimeout(autoTourTimeoutRef.current);
    }

    const startPos = cameraRef.current.position.clone();
    const targetPos = tourPoint.cameraPosition;
    const targetLookAt = tourPoint.lookAtTarget;

    let progress = 0;
    const duration = 2000; // 2 seconds to move to point

    const animateTour = () => {
      progress += 16 / duration;

      if (progress >= 1) {
        cameraRef.current!.position.copy(targetPos);
        cameraRef.current!.lookAt(targetLookAt);

        // Only auto-advance if this is an auto tour
        if (autoAdvance && isAutoTourRef.current) {
          autoTourTimeoutRef.current = window.setTimeout(() => {
            // Double-check tour is still active
            if (!isAutoTourRef.current || !sceneInstance?.getTourPoints) return;

            const tourPoints = sceneInstance.getTourPoints();
            if (tourPoints.length === 0) return;

            // Get current point from state and advance
            setCurrentTourPoint((prev) => {
              const nextIndex = (prev + 1) % tourPoints.length;
              // Move to next point
              window.setTimeout(() => {
                if (isAutoTourRef.current) {
                  animateToTourPoint(tourPoints[nextIndex], true);
                }
              }, 0);
              return nextIndex;
            });
          }, tourPoint.duration * 1000);
        }

        return;
      }

      const currentPos = startPos.clone().lerp(targetPos, progress);
      cameraRef.current!.position.copy(currentPos);
      cameraRef.current!.lookAt(targetLookAt);

      tourAnimationRef.current = requestAnimationFrame(animateTour);
    };

    animateTour();
  };

  const stopTour = () => {
    setShowTour(false);
    setCurrentTourPoint(0);
    isAutoTourRef.current = false;

    if (tourAnimationRef.current) {
      cancelAnimationFrame(tourAnimationRef.current);
    }
    if (autoTourTimeoutRef.current) {
      window.clearTimeout(autoTourTimeoutRef.current);
    }
  };

  const goToNextTourPoint = () => {
    if (!sceneInstance?.getTourPoints) return;
    isAutoTourRef.current = false; // Stop auto tour
    const tourPoints = sceneInstance.getTourPoints();
    const nextIndex = (currentTourPoint + 1) % tourPoints.length;
    setCurrentTourPoint(nextIndex);
    animateToTourPoint(tourPoints[nextIndex], false);
  };

  const goToPreviousTourPoint = () => {
    if (!sceneInstance?.getTourPoints) return;
    isAutoTourRef.current = false; // Stop auto tour
    const tourPoints = sceneInstance.getTourPoints();
    const prevIndex =
      currentTourPoint === 0 ? tourPoints.length - 1 : currentTourPoint - 1;
    setCurrentTourPoint(prevIndex);
    animateToTourPoint(tourPoints[prevIndex], false);
  };

  useEffect(() => {
    // Cleanup function for component unmount
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (tourAnimationRef.current) {
        cancelAnimationFrame(tourAnimationRef.current);
      }
      if (autoTourTimeoutRef.current) {
        window.clearTimeout(autoTourTimeoutRef.current);
      }
      isAutoTourRef.current = false;
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [sceneInstance]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(240, 240, 240, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            zIndex: 1000,
          }}
        >
          Loading scene...
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(240, 240, 240, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            zIndex: 1000,
          }}
        >
          <div style={{ color: 'red', fontSize: '18px' }}>
            Error loading scene: {error}
          </div>
          <button
            onClick={handleBack}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Go Back
          </button>
        </div>
      )}

      {/* Scene Info Panel */}
      {!showTour && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '300px',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>{sceneInstance?.sceneName}</h3>
          <p style={{ margin: '0 0 10px 0' }}>{sceneInstance?.description}</p>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            <div>Scene: {sceneInstance?.sceneName}</div>
            <div>Scene ID: {sceneInstance?.sceneId}</div>
          </div>
        </div>
      )}

      {/* Controls Panel */}
      {!showTour && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Controls:
          </div>
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            • Left click + drag: Orbit camera
            <br />
            • Middle click + drag or Shift + drag: Pan focus
            <br />
            • WASD keys: Move focus point
            <br />• Mouse wheel: Zoom in/out
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '20px',
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ← Back
        </button>

        {sceneInstance?.getTourPoints &&
          sceneInstance.getTourPoints().length > 0 && (
            <>
              <button
                onClick={showTour ? stopTour : startTour}
                style={{
                  padding: '10px 20px',
                  backgroundColor: showTour ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {showTour ? 'Stop Tour' : 'Start Auto Tour'}
              </button>

              {showTour && (
                <>
                  <button
                    onClick={goToPreviousTourPoint}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={goToNextTourPoint}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Next →
                  </button>
                </>
              )}
            </>
          )}
      </div>

      {/* Tour Status */}
      {showTour && sceneInstance?.getTourPoints && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '300px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Tour Point: {currentTourPoint + 1} /{' '}
            {sceneInstance.getTourPoints().length}
          </div>
          <div style={{ marginBottom: '5px' }}>
            {sceneInstance.getTourPoints()[currentTourPoint]?.name}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {sceneInstance.getTourPoints()[currentTourPoint]?.description}
          </div>
        </div>
      )}
    </div>
  );
}
