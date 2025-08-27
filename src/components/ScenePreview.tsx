import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createSceneInstance, validateSceneInterface } from '../scenes/registry'
import type { TeamSceneInterface } from '../types/scene'

interface ScenePreviewProps {
  teamId: string
  onBack?: () => void
}

/**
 * Scene Preview Component
 * 
 * Allows teams to preview their individual scenes in isolation
 * Provides full camera controls and scene debugging information
 */
export default function ScenePreview({ teamId, onBack }: ScenePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | undefined>(undefined)
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined)
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined)
  const animationIdRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 })
  const cameraStateRef = useRef({ phi: 0, theta: 0, radius: 15 })

  const [teamScene, setTeamScene] = useState<TeamSceneInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTour, setShowTour] = useState(false)
  const [currentTourPoint, setCurrentTourPoint] = useState(0)
  const tourAnimationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    initializeScene()
    
    return () => {
      cleanup()
    }
  }, [teamId])

  const initializeScene = async () => {
    try {
      setLoading(true)
      setError(null)

      // Validate scene interface
      if (!validateSceneInterface(teamId)) {
        throw new Error(`Scene ${teamId} does not implement the required interface correctly`)
      }

      // Create scene instance
      const sceneInstance = createSceneInstance(teamId)
      setTeamScene(sceneInstance)

      if (!canvasRef.current) return

      // Initialize Three.js
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x87CEEB) // Sky blue
      sceneRef.current = scene

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(15, 10, 15)
      camera.lookAt(0, 0, 0)
      cameraRef.current = camera

      // Renderer
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      rendererRef.current = renderer

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(50, 50, 25)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 100
      directionalLight.shadow.camera.left = -50
      directionalLight.shadow.camera.right = 50
      directionalLight.shadow.camera.top = 50
      directionalLight.shadow.camera.bottom = -50
      scene.add(directionalLight)

      // Ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.receiveShadow = true
      scene.add(ground)

      // Grid helper
      const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x888888)
      gridHelper.material.opacity = 0.3
      gridHelper.material.transparent = true
      scene.add(gridHelper)

      // Build team scene
      await sceneInstance.buildScene(scene)

      // Add event listeners
      setupEventListeners()

      // Start render loop
      animate()

      setLoading(false)
    } catch (error) {
      console.error('Error initializing scene:', error)
      setError(error instanceof Error ? error.message : 'Failed to load scene')
      setLoading(false)
    }
  }

  const setupEventListeners = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    // Mouse controls
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('wheel', onWheel)

    // Window resize
    window.addEventListener('resize', onWindowResize)
  }

  const onMouseDown = (event: MouseEvent) => {
    mouseRef.current.isDown = true
    mouseRef.current.lastX = event.clientX
    mouseRef.current.lastY = event.clientY
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!mouseRef.current.isDown || !cameraRef.current) return

    const deltaX = event.clientX - mouseRef.current.lastX
    const deltaY = event.clientY - mouseRef.current.lastY

    // Update camera rotation
    cameraStateRef.current.phi -= deltaX * 0.01
    cameraStateRef.current.theta = Math.max(
      0.1, 
      Math.min(Math.PI - 0.1, cameraStateRef.current.theta + deltaY * 0.01)
    )

    updateCameraPosition()

    mouseRef.current.lastX = event.clientX
    mouseRef.current.lastY = event.clientY
  }

  const onMouseUp = () => {
    mouseRef.current.isDown = false
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    cameraStateRef.current.radius = Math.max(5, Math.min(50, cameraStateRef.current.radius + event.deltaY * 0.01))
    updateCameraPosition()
  }

  const updateCameraPosition = () => {
    if (!cameraRef.current) return

    const { phi, theta, radius } = cameraStateRef.current
    
    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.cos(theta)
    const z = radius * Math.sin(theta) * Math.sin(phi)
    
    cameraRef.current.position.set(x, y, z)
    cameraRef.current.lookAt(0, 2, 0)
  }

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return

    cameraRef.current.aspect = window.innerWidth / window.innerHeight
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
  }

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationIdRef.current = requestAnimationFrame(animate)
  }

  const startTour = () => {
    if (!teamScene || !teamScene.getTourPoints || !cameraRef.current) return
    
    const tourPoints = teamScene.getTourPoints()
    if (tourPoints.length === 0) return

    setShowTour(true)
    setCurrentTourPoint(0)
    animateToTourPoint(tourPoints[0])
  }

  const animateToTourPoint = (tourPoint: any) => {
    if (!cameraRef.current) return

    const startPos = cameraRef.current.position.clone()
    const targetPos = tourPoint.cameraPosition
    const targetLookAt = tourPoint.lookAtTarget

    let progress = 0
    const duration = 2000 // 2 seconds to move to point

    const animateTour = () => {
      progress += 16 / duration
      
      if (progress >= 1) {
        cameraRef.current!.position.copy(targetPos)
        cameraRef.current!.lookAt(targetLookAt)
        
        // Stay at tour point for specified duration
        setTimeout(() => {
          if (!teamScene || !showTour) return
          
          const tourPoints = teamScene.getTourPoints?.() || []
          const nextIndex = (currentTourPoint + 1) % tourPoints.length
          
          if (nextIndex === 0) {
            // Tour complete
            setShowTour(false)
            setCurrentTourPoint(0)
          } else {
            setCurrentTourPoint(nextIndex)
            animateToTourPoint(tourPoints[nextIndex])
          }
        }, tourPoint.duration * 1000)
        
        return
      }

      const currentPos = startPos.clone().lerp(targetPos, progress)
      cameraRef.current!.position.copy(currentPos)
      cameraRef.current!.lookAt(targetLookAt)
      
      tourAnimationRef.current = requestAnimationFrame(animateTour)
    }

    animateTour()
  }

  const stopTour = () => {
    setShowTour(false)
    setCurrentTourPoint(0)
    if (tourAnimationRef.current) {
      cancelAnimationFrame(tourAnimationRef.current)
    }
  }

  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    if (tourAnimationRef.current) {
      cancelAnimationFrame(tourAnimationRef.current)
    }
    if (rendererRef.current) {
      rendererRef.current.dispose()
    }
    if (teamScene?.dispose) {
      teamScene.dispose()
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f0f0f0'
      }}>
        <div>Loading scene...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f0f0f0',
        gap: '20px'
      }}>
        <div style={{ color: 'red', fontSize: '18px' }}>Error loading scene: {error}</div>
        {onBack && <button onClick={onBack} style={{ padding: '10px 20px', fontSize: '16px' }}>Go Back</button>}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      
      {/* Scene Info Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{teamScene?.teamName}</h3>
        <p style={{ margin: '0 0 10px 0' }}>{teamScene?.description}</p>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          <div>Bounds: {teamScene?.bounds.width}×{teamScene?.bounds.height}×{teamScene?.bounds.depth}</div>
          <div>Team ID: {teamScene?.teamId}</div>
        </div>
      </div>

      {/* Controls Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Controls:</div>
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          • Left click + drag: Orbit camera<br/>
          • Mouse wheel: Zoom in/out<br/>
          • Scene automatically centers at origin
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back
          </button>
        )}
        
        {teamScene?.getTourPoints && teamScene.getTourPoints().length > 0 && (
          <button
            onClick={showTour ? stopTour : startTour}
            style={{
              padding: '10px 20px',
              backgroundColor: showTour ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showTour ? 'Stop Tour' : 'Start Tour'}
          </button>
        )}
      </div>

      {/* Tour Status */}
      {showTour && teamScene?.getTourPoints && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Tour: {currentTourPoint + 1} / {teamScene.getTourPoints().length}
          </div>
          <div>
            {teamScene.getTourPoints()[currentTourPoint]?.name}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
            {teamScene.getTourPoints()[currentTourPoint]?.description}
          </div>
        </div>
      )}
    </div>
  )
}