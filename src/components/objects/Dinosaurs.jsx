import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, DoubleSide, Shape, Vector3 } from 'three'

const dinoBlue = '#4e9fc4'
const dinoBlueLight = '#83c8dc'
const pteroGreen = '#5f9f67'
const pteroWing = '#76b77b'

function smoothStep(value) {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped * clamped * (3 - 2 * clamped)
}

function drinkingAmount(time) {
  const cycle = time % 16
  if (cycle < 7) return 0
  if (cycle < 9.5) return smoothStep((cycle - 7) / 2.5)
  if (cycle < 12.5) return 0.97 + Math.sin(time * 3.2) * 0.03
  if (cycle < 15) return 1 - smoothStep((cycle - 12.5) / 2.5)
  return 0
}

function Brachiosaurus({ reduceMotion }) {
  const dinosaur = useRef()
  const neck = useRef()
  const head = useRef()
  const neckCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, 0, 0),
        new Vector3(0, 0.21, 0.11),
        new Vector3(0, 0.43, 0.15),
        new Vector3(0, 0.6, 0.3),
      ]),
    [],
  )

  useFrame((state) => {
    if (reduceMotion || !dinosaur.current || !neck.current || !head.current) return
    const time = state.clock.elapsedTime
    const drinking = drinkingAmount(time)
    neck.current.rotation.x = drinking * 1.38
    head.current.rotation.y = Math.sin(time * 1.25) * 0.12 * (1 - drinking)
    head.current.rotation.x = Math.sin(time * 4) * 0.045 * drinking
  })

  return (
    <group ref={dinosaur} position={[-0.16, 0, -0.04]} rotation={[0, 1.35, 0]} scale={0.72}>
      <mesh position={[0, 0.4, -0.05]} scale={[0.52, 0.38, 0.72]} castShadow>
        <sphereGeometry args={[0.5, 18, 14]} />
        <meshStandardMaterial color={dinoBlue} roughness={0.88} />
      </mesh>

      {[
        [-0.17, 0.22, -0.23],
        [0.17, 0.22, -0.23],
        [-0.17, 0.22, 0.2],
        [0.17, 0.22, 0.2],
      ].map(([x, y, z]) => (
        <group key={`${x}-${z}`} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.072, 0.085, 0.38, 12]} />
            <meshStandardMaterial color={dinoBlue} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.205, 0.025]} scale={[1.12, 0.58, 1.28]} castShadow>
            <sphereGeometry args={[0.09, 12, 8]} />
            <meshStandardMaterial color={dinoBlueLight} roughness={0.9} />
          </mesh>
        </group>
      ))}

      <group ref={neck} position={[0, 0.44, 0.25]}>
        <mesh castShadow>
          <tubeGeometry args={[neckCurve, 28, 0.105, 14, false]} />
          <meshStandardMaterial color={dinoBlue} roughness={0.88} />
        </mesh>

        <group ref={head} position={[0, 0.6, 0.3]}>
          <mesh scale={[0.22, 0.18, 0.3]} castShadow>
            <sphereGeometry args={[0.5, 16, 12]} />
            <meshStandardMaterial color={dinoBlue} roughness={0.86} />
          </mesh>
          <mesh position={[0, -0.035, 0.18]} scale={[0.2, 0.12, 0.22]} castShadow>
            <sphereGeometry args={[0.5, 14, 10]} />
            <meshStandardMaterial color={dinoBlueLight} roughness={0.9} />
          </mesh>
          {[-0.09, 0.09].map((x) => (
            <mesh key={x} position={[x, 0.05, 0.15]}>
              <sphereGeometry args={[0.027, 10, 8]} />
              <meshStandardMaterial color="#203b43" roughness={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      <mesh position={[0, 0.38, -0.58]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.14, 0.62, 14]} />
        <meshStandardMaterial color={dinoBlue} roughness={0.9} />
      </mesh>

      {[-0.22, 0.03, 0.26].map((z, index) => (
        <mesh key={z} position={[0.25, 0.62 - index * 0.035, z]} scale={[0.05, 0.11, 0.12]}>
          <sphereGeometry args={[0.5, 10, 8]} />
          <meshStandardMaterial color={dinoBlueLight} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export function DinosaurPond({ reduceMotion, ...props }) {
  return (
    <group {...props}>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.76, 0.91, 32]} />
        <meshStandardMaterial color="#72ad69" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 36]} />
        <meshStandardMaterial
          color="#65bdd3"
          transparent
          opacity={0.88}
          roughness={0.28}
          metalness={0.08}
          depthWrite={false}
        />
      </mesh>
      {[0.38, 0.62].map((radius, index) => (
        <mesh key={radius} position={[0.12, 0.026 + index * 0.002, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.008, 8, 28]} />
          <meshStandardMaterial color="#a8e0e7" transparent opacity={0.55 - index * 0.15} />
        </mesh>
      ))}
      <Brachiosaurus reduceMotion={reduceMotion} />
    </group>
  )
}

function Wing({ side, wingRef }) {
  const shape = useMemo(() => {
    const wing = new Shape()
    wing.moveTo(0, 0)
    wing.lineTo(side * 0.92, 0.03)
    wing.lineTo(side * 0.42, -0.44)
    wing.lineTo(side * 0.08, -0.21)
    wing.closePath()
    return wing
  }, [side])

  return (
    <group ref={wingRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={pteroWing} roughness={0.88} side={DoubleSide} />
      </mesh>
      <mesh position={[side * 0.38, 0.018, -0.08]} rotation={[0, 0, side * Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.026, 0.76, 8]} />
        <meshStandardMaterial color="#39774c" roughness={0.92} />
      </mesh>
    </group>
  )
}

export function Pterodactyl({ reduceMotion, ...props }) {
  const orbit = useRef()
  const flyer = useRef()
  const leftWing = useRef()
  const rightWing = useRef()

  useFrame((state) => {
    if (reduceMotion || !orbit.current || !flyer.current || !leftWing.current || !rightWing.current) return
    const time = state.clock.elapsedTime
    const flap = 0.08 + Math.sin(time * 5.2) * 0.28
    orbit.current.rotation.y = time * 0.32
    flyer.current.position.y = 3.7 + Math.sin(time * 1.8) * 0.1
    flyer.current.rotation.z = Math.sin(time * 0.7) * 0.07
    leftWing.current.rotation.z = flap
    rightWing.current.rotation.z = -flap
  })

  return (
    <group ref={orbit} rotation={[0, -0.8, 0]} {...props}>
      <group ref={flyer} position={[0, 3.7, 1.72]} rotation={[0, Math.PI / 2, 0]} scale={0.7}>
        <mesh scale={[0.17, 0.15, 0.54]} castShadow>
          <sphereGeometry args={[0.5, 14, 10]} />
          <meshStandardMaterial color={pteroGreen} roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.02, 0.32]} scale={[0.2, 0.16, 0.24]} castShadow>
          <sphereGeometry args={[0.5, 14, 10]} />
          <meshStandardMaterial color={pteroGreen} roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.01, 0.57]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.095, 0.46, 10]} />
          <meshStandardMaterial color="#8dbb65" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.16, 0.28]} rotation={[-0.18, 0, 0]} castShadow>
          <coneGeometry args={[0.11, 0.34, 10]} />
          <meshStandardMaterial color="#39774c" roughness={0.9} />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 0.08, 0.43]}>
            <sphereGeometry args={[0.025, 8, 6]} />
            <meshStandardMaterial color="#20352a" roughness={0.7} />
          </mesh>
        ))}
        <Wing side={-1} wingRef={leftWing} />
        <Wing side={1} wingRef={rightWing} />
      </group>
    </group>
  )
}
