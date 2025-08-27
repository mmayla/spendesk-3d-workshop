import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createSceneInstance, SCENE_REGISTRY } from '../scenes/registry'
import type { TeamSceneInterface, MasterSceneConfig, TourPoint } from '../types/scene'

interface MasterSceneProps {
  onBack?: () => void
}

/**
 * Master Scene Component
 * 
 * Loads all enabled team scenes and arranges them as districts in a unified world
 * Provides the "big reveal" experience where individual scenes become part of a larger world
 */
export default function MasterScene({ onBack }: MasterSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | undefined>(undefined)
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined)
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined)
  const animationIdRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 })
  const cameraStateRef = useRef({ phi: 0, theta: Math.PI / 3, radius: 50 })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadedScenes, setLoadedScenes] = useState<Array<{
    scene: TeamSceneInterface
    position: THREE.Vector3
    bounds: THREE.Box3
  }>>([])
  const [showTour, setShowTour] = useState(false)
  const [currentTourPoint, setCurrentTourPoint] = useState(0)
  const [allTourPoints, setAllTourPoints] = useState<Array<TourPoint & { teamName: string }>>([])
  const tourAnimationRef = useRef<number | undefined>(undefined)

  // Master scene configuration
  const config: MasterSceneConfig = {
    districtSpacing: 30,
    maxTeamsPerRow: 3,
    showTeamLabels: true,
    autoStartTour: false
  }

  useEffect(() => {
    initializeMasterScene()
    
    return () => {
      cleanup()
    }
  }, [])

  const initializeMasterScene = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!canvasRef.current) return

      // Initialize Three.js
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x87CEEB) // Sky blue
      sceneRef.current = scene

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(50, 30, 50)
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
      directionalLight.position.set(100, 100, 50)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 4096
      directionalLight.shadow.mapSize.height = 4096
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 500
      directionalLight.shadow.camera.left = -200
      directionalLight.shadow.camera.right = 200
      directionalLight.shadow.camera.top = 200
      directionalLight.shadow.camera.bottom = -200
      scene.add(directionalLight)

      // Load and arrange team scenes
      await loadTeamScenes()

      // Create world ground
      createWorldGround()

      // Add world decorations
      addWorldDecorations()

      // Setup event listeners
      setupEventListeners()

      // Start render loop
      animate()

      setLoading(false)
    } catch (error) {
      console.error('Error initializing master scene:', error)
      setError(error instanceof Error ? error.message : 'Failed to load master scene')
      setLoading(false)
    }
  }

  const loadTeamScenes = async () => {
    // Load enabled scenes from registry
    const loadedSceneData: Array<{
      scene: TeamSceneInterface
      position: THREE.Vector3
      bounds: THREE.Box3
    }> = []
    const tourPoints: Array<TourPoint & { teamName: string }> = []

    let currentRow = 0
    let currentCol = 0

    for (const [teamId, sceneEntry] of Object.entries(SCENE_REGISTRY)) {
      if (!sceneEntry.enabled) continue
      
      try {
        const sceneInstance = createSceneInstance(teamId)
        
        // Calculate position in grid
        const xOffset = (currentCol - (config.maxTeamsPerRow - 1) / 2) * config.districtSpacing
        const zOffset = currentRow * config.districtSpacing
        const position = new THREE.Vector3(xOffset, 0, zOffset)

        // Build scene at calculated position
        await sceneInstance.buildScene(sceneRef.current!, position)

        // Calculate bounds for this district
        const bounds = new THREE.Box3()
        bounds.setFromCenterAndSize(
          position,
          new THREE.Vector3(sceneInstance.bounds.width, sceneInstance.bounds.height, sceneInstance.bounds.depth)
        )

        loadedSceneData.push({
          scene: sceneInstance,
          position,
          bounds
        })

        // Add team label if enabled
        if (config.showTeamLabels) {
          addTeamLabel(sceneInstance.teamName, position, sceneInstance.bounds)
        }

        // Collect tour points
        if (sceneInstance.getTourPoints) {
          const sceneTourPoints = sceneInstance.getTourPoints().map(point => ({
            ...point,
            teamName: sceneInstance.teamName,
            // Adjust tour points to world coordinates
            cameraPosition: point.cameraPosition.clone().add(position),
            lookAtTarget: point.lookAtTarget.clone().add(position)
          }))
          tourPoints.push(...sceneTourPoints)
        }

        // Move to next position
        currentCol++
        if (currentCol >= config.maxTeamsPerRow) {
          currentCol = 0
          currentRow++
        }
      } catch (error) {
        console.error(`Error loading scene for team:`, error)
      }
    }

    setLoadedScenes(loadedSceneData)
    setAllTourPoints(tourPoints)
  }

  const addTeamLabel = (teamName: string, position: THREE.Vector3, bounds: any) => {
    // Create text geometry (simplified - in a real app you might use TextGeometry or HTML elements)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = 256
    canvas.height = 64
    
    context.fillStyle = 'rgba(0, 0, 0, 0.8)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    context.fillStyle = 'white'
    context.font = 'bold 24px Arial'
    context.textAlign = 'center'
    context.fillText(teamName, canvas.width / 2, 40)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    
    const geometry = new THREE.PlaneGeometry(8, 2)
    const labelMesh = new THREE.Mesh(geometry, material)
    
    labelMesh.position.set(
      position.x,
      position.y + bounds.height + 3,
      position.z
    )
    
    // Make label always face camera
    labelMesh.lookAt(cameraRef.current!.position)
    
    sceneRef.current!.add(labelMesh)
  }

  const createWorldGround = () => {
    if (!sceneRef.current) return

    // Calculate world size based on loaded scenes
    const worldSize = Math.max(
      config.maxTeamsPerRow * config.districtSpacing + 50,
      Math.ceil(loadedScenes.length / config.maxTeamsPerRow) * config.districtSpacing + 50,
      200 // Minimum size
    )

    // Main ground
    const groundGeometry = new THREE.PlaneGeometry(worldSize, worldSize)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    sceneRef.current.add(ground)

    // Grid helper
    const gridHelper = new THREE.GridHelper(worldSize, worldSize / 5, 0x888888, 0x888888)
    gridHelper.material.opacity = 0.2
    gridHelper.material.transparent = true
    sceneRef.current.add(gridHelper)
  }

  const addWorldDecorations = () => {
    if (!sceneRef.current) return

    // Add some world-level decorations (clouds, distant mountains, etc.)
    
    // Distant mountains (simple cones)
    const mountainPositions = [
      { x: -100, z: -100 }, { x: -80, z: -95 }, { x: -60, z: -90 },
      { x: 100, z: -100 }, { x: 80, z: -95 }, { x: 60, z: -90 },
      { x: -100, z: 100 }, { x: -80, z: 95 }, { x: -60, z: 90 },
      { x: 100, z: 100 }, { x: 80, z: 95 }, { x: 60, z: 90 }
    ]

    mountainPositions.forEach(pos => {
      const mountainGeometry = new THREE.ConeGeometry(
        Math.random() * 10 + 5,  // Random radius
        Math.random() * 20 + 15, // Random height
        8
      )
      const mountainMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B7355 // Mountain brown
      })
      const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial)
      mountain.position.set(pos.x, 10, pos.z)
      mountain.receiveShadow = true
      sceneRef.current!.add(mountain)
    })

    // Add some clouds (white spheres)
    for (let i = 0; i < 20; i++) {
      const cloudGeometry = new THREE.SphereGeometry(Math.random() * 5 + 3, 8, 6)
      const cloudMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.7
      })
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
      cloud.position.set(
        (Math.random() - 0.5) * 200,
        Math.random() * 30 + 20,
        (Math.random() - 0.5) * 200
      )
      sceneRef.current!.add(cloud)
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
    cameraStateRef.current.radius = Math.max(20, Math.min(200, cameraStateRef.current.radius + event.deltaY * 0.1))
    updateCameraPosition()
  }

  const updateCameraPosition = () => {
    if (!cameraRef.current) return

    const { phi, theta, radius } = cameraStateRef.current
    
    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.cos(theta)
    const z = radius * Math.sin(theta) * Math.sin(phi)
    
    cameraRef.current.position.set(x, y, z)
    cameraRef.current.lookAt(0, 5, 0)
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
    if (allTourPoints.length === 0) return

    setShowTour(true)
    setCurrentTourPoint(0)
    animateToTourPoint(allTourPoints[0])
  }

  const animateToTourPoint = (tourPoint: typeof allTourPoints[0]) => {
    if (!cameraRef.current) return

    const startPos = cameraRef.current.position.clone()
    const targetPos = tourPoint.cameraPosition
    const targetLookAt = tourPoint.lookAtTarget

    let progress = 0
    const duration = 3000 // 3 seconds to move to point

    const animateTour = () => {
      progress += 16 / duration
      
      if (progress >= 1) {
        cameraRef.current!.position.copy(targetPos)
        cameraRef.current!.lookAt(targetLookAt)
        
        // Stay at tour point for specified duration
        setTimeout(() => {
          if (!showTour) return
          
          const nextIndex = (currentTourPoint + 1) % allTourPoints.length
          
          if (nextIndex === 0) {
            // Tour complete
            setShowTour(false)
            setCurrentTourPoint(0)
            // Return to overview
            cameraStateRef.current = { phi: 0, theta: Math.PI / 3, radius: 50 }
            updateCameraPosition()
          } else {
            setCurrentTourPoint(nextIndex)
            animateToTourPoint(allTourPoints[nextIndex])
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
    
    // Cleanup all loaded scenes
    loadedScenes.forEach(({ scene }) => {
      if (scene.dispose) {
        scene.dispose()
      }
    })
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f0f0f0'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>Loading master scene...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Combining all team scenes into one world</div>
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
        <div style={{ color: 'red', fontSize: '18px' }}>Error loading master scene: {error}</div>
        {onBack && <button onClick={onBack} style={{ padding: '10px 20px', fontSize: '16px' }}>Go Back</button>}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      
      {/* Master Scene Info Panel */}
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
        <h3 style={{ margin: '0 0 10px 0' }}>🌍 Combined World</h3>
        <p style={{ margin: '0 0 10px 0' }}>
          All team scenes have been combined into one massive virtual world!
        </p>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          <div>Districts: {loadedScenes.length}</div>
          <div>Tour Points: {allTourPoints.length}</div>
          <div>Grid: {config.maxTeamsPerRow} per row</div>
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
          • Left click + drag: Orbit around world<br/>
          • Mouse wheel: Zoom in/out<br/>
          • Explore different team districts!
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
              padding: '12px 20px',
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
        
        {allTourPoints.length > 0 && (
          <button
            onClick={showTour ? stopTour : startTour}
            style={{
              padding: '12px 20px',
              backgroundColor: showTour ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {showTour ? 'Stop Tour' : '🎬 Grand Tour'}
          </button>
        )}
      </div>

      {/* District List */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '250px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Team Districts:</div>
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          {loadedScenes.map(({ scene }) => (
            <div key={scene.teamId} style={{ marginBottom: '5px' }}>
              📍 {scene.teamName}
            </div>
          ))}
        </div>
      </div>

      {/* Tour Status */}
      {showTour && allTourPoints.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          fontSize: '16px',
          textAlign: 'center',
          minWidth: '300px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Grand Tour: {currentTourPoint + 1} / {allTourPoints.length}
          </div>
          <div style={{ fontSize: '18px', marginBottom: '5px' }}>
            {allTourPoints[currentTourPoint]?.name}
          </div>
          <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>
            {allTourPoints[currentTourPoint]?.teamName}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            {allTourPoints[currentTourPoint]?.description}
          </div>
        </div>
      )}
    </div>
  )
}