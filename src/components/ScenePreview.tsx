import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  createSceneInstance,
  validateSceneInterface,
} from "../scenes/registry";
import type { SceneInterface } from "../types/scene";

interface ScenePreviewProps {
  sceneId: string;
  onBack?: () => void;
}

/**
 * Scene Browser Component
 *
 * Shows all available scenes and allows switching between:
 * - Individual scene previews
 * - Combined scene view
 */
export default function ScenePreview({ sceneId, onBack }: ScenePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | undefined>(undefined);
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined);
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined);
  const animationIdRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });
  const cameraStateRef = useRef({ phi: 0, theta: 0, radius: 15 });

  const [sceneInstance, setSceneInstance] = useState<SceneInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [currentTourPoint, setCurrentTourPoint] = useState(0);
  const tourAnimationRef = useRef<number | undefined>(undefined);
  const autoTourTimeoutRef = useRef<number | undefined>(undefined);
  const isAutoTourRef = useRef(false);

  useEffect(() => {
    // First validate and create scene instance
    const initializeSceneData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate scene interface
        if (!validateSceneInterface(sceneId)) {
          throw new Error(
            `Scene ${sceneId} does not implement the required interface correctly`
          );
        }

        // Create scene instance
        console.log("Creating scene instance for:", sceneId);
        const instance = createSceneInstance(sceneId);
        console.log("Scene instance created:", instance);
        setSceneInstance(instance);
      } catch (error) {
        console.error("Error creating scene:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create scene"
        );
        setLoading(false);
      }
    };

    initializeSceneData();
  }, [sceneId]);

  useEffect(() => {
    // Initialize Three.js after canvas is rendered
    const initThreeJS = async () => {
      try {
        if (!canvasRef.current || !sceneInstance) {
          console.error("Canvas or scene instance not available");
          return;
        }

        console.log("Canvas found, initializing Three.js...");

        // Initialize Three.js
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb); // Sky blue
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.set(15, 10, 15);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        scene.add(directionalLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x888888);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        // Build team scene at origin for preview
        console.log("Building scene:", sceneInstance.sceneId);
        await sceneInstance.buildScene(scene);
        console.log("Scene built successfully, setting up controls...");

        // Add event listeners
        setupEventListeners();

        // Start render loop
        animate();
        console.log("Animation started, preview ready!");

        setLoading(false);
      } catch (error) {
        console.error("Error initializing Three.js:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to initialize 3D scene"
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
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel);

    // Window resize
    window.addEventListener("resize", onWindowResize);
  };

  const onMouseDown = (event: MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = event.clientX;
    mouseRef.current.lastY = event.clientY;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!mouseRef.current.isDown || !cameraRef.current) return;

    const deltaX = event.clientX - mouseRef.current.lastX;
    const deltaY = event.clientY - mouseRef.current.lastY;

    // Update camera rotation
    cameraStateRef.current.phi -= deltaX * 0.01;
    cameraStateRef.current.theta = Math.max(
      0.1,
      Math.min(Math.PI - 0.1, cameraStateRef.current.theta + deltaY * 0.01)
    );

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

    const { phi, theta, radius } = cameraStateRef.current;

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 2, 0);
  };

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
    if (!sceneInstance || !sceneInstance.getTourPoints || !cameraRef.current) return;

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
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />

      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(240, 240, 240, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
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
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(240, 240, 240, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            zIndex: 1000,
          }}
        >
          <div style={{ color: "red", fontSize: "18px" }}>
            Error loading scene: {error}
          </div>
          {onBack && (
            <button
              onClick={onBack}
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              Go Back
            </button>
          )}
        </div>
      )}

      {/* Scene Info Panel */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          fontSize: "14px",
          maxWidth: "300px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>{sceneInstance?.sceneName}</h3>
        <p style={{ margin: "0 0 10px 0" }}>{sceneInstance?.description}</p>
        <div style={{ fontSize: "12px", opacity: 0.8 }}>
          <div>Scene: {sceneInstance?.sceneName}</div>
          <div>Scene ID: {sceneInstance?.sceneId}</div>
        </div>
      </div>

      {/* Controls Panel */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Controls:
        </div>
        <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
          • Left click + drag: Orbit camera
          <br />
          • Mouse wheel: Zoom in/out
          <br />• Scene automatically centers at origin
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "10px 20px",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back
          </button>
        )}

        {sceneInstance?.getTourPoints && sceneInstance.getTourPoints().length > 0 && (
          <>
            <button
              onClick={showTour ? stopTour : startTour}
              style={{
                padding: "10px 20px",
                backgroundColor: showTour ? "#dc3545" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {showTour ? "Stop Tour" : "Start Auto Tour"}
            </button>

            {showTour && (
              <>
                <button
                  onClick={goToPreviousTourPoint}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ← Prev
                </button>
                <button
                  onClick={goToNextTourPoint}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
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
            position: "absolute",
            bottom: "20px",
            right: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "14px",
            maxWidth: "300px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Tour Point: {currentTourPoint + 1} /{" "}
            {sceneInstance.getTourPoints().length}
          </div>
          <div style={{ marginBottom: "5px" }}>
            {sceneInstance.getTourPoints()[currentTourPoint]?.name}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            {sceneInstance.getTourPoints()[currentTourPoint]?.description}
          </div>
        </div>
      )}
    </div>
  );
}
