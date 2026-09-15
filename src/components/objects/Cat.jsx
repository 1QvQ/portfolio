import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, MathUtils, Quaternion, Vector3 } from 'three'

const fur = '#c9783f'
const lightFur = '#e99b62'
const stripe = '#684535'
const cream = '#f3d1ae'
const collarRed = '#c83f36'

function TailStripe({ curve, t }) {
  const { position, quaternion } = useMemo(() => {
    const point = curve.getPoint(t)
    const tangent = curve.getTangent(t).normalize()
    const rotation = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      tangent,
    )

    return { position: point, quaternion: rotation }
  }, [curve, t])

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <torusGeometry args={[0.067, 0.012, 10, 24]} />
      <meshStandardMaterial color={stripe} roughness={0.95} />
    </mesh>
  )
}

function ForeheadStripe({ x, rotation = 0 }) {
  return (
    <mesh position={[x, 0.79, 0.455]} rotation={[0.12, 0, rotation]}>
      <boxGeometry args={[0.038, 0.19, 0.025]} />
      <meshStandardMaterial color={stripe} roughness={0.95} />
    </mesh>
  )
}

export default function Cat(props) {
  const content = useRef()
  const tail = useRef()
  const [hovered, setHovered] = useState(false)
  const tailCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, 0, 0),
        new Vector3(0.16, 0.01, -0.02),
        new Vector3(0.31, 0.08, 0),
        new Vector3(0.43, 0.2, 0.08),
        new Vector3(0.45, 0.33, 0.2),
      ]),
    [],
  )

  useFrame((state, delta) => {
    if (!content.current || !tail.current) return
    const targetY = hovered ? 0.08 : 0
    content.current.position.y = MathUtils.damp(content.current.position.y, targetY, 7, delta)
    tail.current.rotation.y = MathUtils.damp(
      tail.current.rotation.y,
      Math.sin(state.clock.elapsedTime * (hovered ? 5 : 2.2)) * 0.12,
      7,
      delta,
    )
  })

  return (
    <group {...props}>
      <group
        ref={content}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto'
        }}
      >
        <mesh position={[0, 0.3, -0.06]} scale={[0.75, 0.92, 1.08]} castShadow>
          <sphereGeometry args={[0.33, 18, 14]} />
          <meshStandardMaterial color={fur} roughness={0.9} flatShading />
        </mesh>

        {[-0.18, -0.05, 0.08].map((z, index) => (
          <mesh key={z} position={[0, 0.555 - index * 0.02, z]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.38 - index * 0.04, 0.035, 0.06]} />
            <meshStandardMaterial color={stripe} roughness={0.95} />
          </mesh>
        ))}

        <mesh position={[0, 0.68, 0.2]} castShadow>
          <sphereGeometry args={[0.29, 18, 14]} />
          <meshStandardMaterial color={hovered ? lightFur : fur} roughness={0.88} flatShading />
        </mesh>

        <mesh position={[-0.16, 0.91, 0.19]} rotation={[0, 0, -0.12]} castShadow>
          <coneGeometry args={[0.115, 0.27, 4]} />
          <meshStandardMaterial color={fur} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.16, 0.91, 0.19]} rotation={[0, 0, 0.12]} castShadow>
          <coneGeometry args={[0.115, 0.27, 4]} />
          <meshStandardMaterial color={fur} roughness={0.9} flatShading />
        </mesh>

        <ForeheadStripe x={-0.075} rotation={-0.08} />
        <ForeheadStripe x={0} />
        <ForeheadStripe x={0.075} rotation={0.08} />

        <mesh position={[-0.09, 0.625, 0.445]} scale={[1, 0.82, 0.55]}>
          <sphereGeometry args={[0.1, 14, 10]} />
          <meshStandardMaterial color={cream} roughness={0.9} />
        </mesh>
        <mesh position={[0.09, 0.625, 0.445]} scale={[1, 0.82, 0.55]}>
          <sphereGeometry args={[0.1, 14, 10]} />
          <meshStandardMaterial color={cream} roughness={0.9} />
        </mesh>

        <mesh position={[-0.1, 0.72, 0.46]}>
          <sphereGeometry args={[0.036, 10, 8]} />
          <meshStandardMaterial color="#28302c" roughness={0.7} />
        </mesh>
        <mesh position={[0.1, 0.72, 0.46]}>
          <sphereGeometry args={[0.036, 10, 8]} />
          <meshStandardMaterial color="#28302c" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.64, 0.505]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.043, 0.06, 3]} />
          <meshStandardMaterial color="#8f4d45" roughness={0.8} />
        </mesh>

        <mesh position={[0, 0.49, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.23, 0.043, 8, 20]} />
          <meshStandardMaterial color={collarRed} roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.43, 0.43]} castShadow>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color="#e0b05a" metalness={0.35} roughness={0.45} />
        </mesh>

        <group ref={tail} position={[0.2, 0.36, -0.31]}>
          <mesh castShadow>
            <tubeGeometry args={[tailCurve, 40, 0.065, 16, false]} />
            <meshStandardMaterial color={fur} roughness={0.9} />
          </mesh>
          {[0.46, 0.61, 0.74].map((t) => (
            <TailStripe key={t} curve={tailCurve} t={t} />
          ))}
        </group>
      </group>
    </group>
  )
}
