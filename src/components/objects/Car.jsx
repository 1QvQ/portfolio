import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { DoubleSide, MathUtils } from 'three'

const paint = '#111514'
const paintHover = '#242a29'
const trim = '#b9bfbd'

function Wheel({ position }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.255, 0.255, 0.18, 32]} />
        <meshStandardMaterial color="#252a29" roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.024, 32]} />
        <meshStandardMaterial color="#aeb5b2" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.116, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.028, 32]} />
        <meshStandardMaterial color="#454d4a" metalness={0.55} roughness={0.38} />
      </mesh>
    </group>
  )
}

function AudiRings() {
  return (
    <group position={[0, 0.43, 0.911]}>
      {[-0.105, -0.035, 0.035, 0.105].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <torusGeometry args={[0.052, 0.009, 12, 32]} />
          <meshStandardMaterial color={trim} metalness={0.78} roughness={0.24} />
        </mesh>
      ))}
    </group>
  )
}

export default function Car(props) {
  const content = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!content.current) return
    const target = hovered ? 0.055 + Math.sin(state.clock.elapsedTime * 7) * 0.012 : 0
    content.current.position.y = MathUtils.damp(content.current.position.y, target, 8, delta)
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
        <RoundedBox args={[1.28, 0.3, 1.72]} radius={0.15} smoothness={8} position={[0, 0.33, 0]} castShadow>
          <meshStandardMaterial color={hovered ? paintHover : paint} metalness={0.7} roughness={0.24} />
        </RoundedBox>

        <RoundedBox args={[1.16, 0.19, 0.72]} radius={0.13} smoothness={8} position={[0, 0.5, 0.48]} castShadow>
          <meshStandardMaterial color={hovered ? paintHover : paint} metalness={0.7} roughness={0.23} />
        </RoundedBox>

        <RoundedBox
          args={[1.02, 0.48, 0.86]}
          radius={0.21}
          smoothness={10}
          position={[0, 0.59, -0.14]}
          castShadow
        >
          <meshStandardMaterial color={paint} metalness={0.65} roughness={0.24} />
        </RoundedBox>

        <mesh position={[0, 0.64, 0.292]} rotation={[-0.16, 0, 0]}>
          <planeGeometry args={[0.78, 0.25]} />
          <meshStandardMaterial
            color="#536970"
            metalness={0.26}
            roughness={0.28}
            transparent
            opacity={0.92}
            side={DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        <mesh position={[-0.511, 0.62, -0.14]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.45, 0.23]} />
          <meshStandardMaterial
            color="#61767c"
            metalness={0.24}
            roughness={0.3}
            side={DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
        <mesh position={[0.511, 0.62, -0.14]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.45, 0.23]} />
          <meshStandardMaterial
            color="#61767c"
            metalness={0.24}
            roughness={0.3}
            side={DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        <mesh position={[0, 0.63, -0.571]} rotation={[0.14, 0, 0]}>
          <planeGeometry args={[0.72, 0.2]} />
          <meshStandardMaterial
            color="#4f6268"
            metalness={0.24}
            roughness={0.3}
            side={DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        <RoundedBox args={[0.7, 0.22, 0.035]} radius={0.06} smoothness={8} position={[0, 0.39, 0.88]}>
          <meshStandardMaterial color="#29302f" metalness={0.38} roughness={0.35} />
        </RoundedBox>
        <AudiRings />

        <RoundedBox args={[0.33, 0.095, 0.038]} radius={0.04} smoothness={8} position={[-0.39, 0.51, 0.88]} rotation={[0, 0, -0.1]}>
          <meshStandardMaterial color="#dbe7e1" emissive="#b8d3cb" emissiveIntensity={0.28} roughness={0.26} />
        </RoundedBox>
        <RoundedBox args={[0.33, 0.095, 0.038]} radius={0.04} smoothness={8} position={[0.39, 0.51, 0.88]} rotation={[0, 0, 0.1]}>
          <meshStandardMaterial color="#dbe7e1" emissive="#b8d3cb" emissiveIntensity={0.28} roughness={0.26} />
        </RoundedBox>

        <RoundedBox args={[0.28, 0.08, 0.035]} radius={0.03} smoothness={6} position={[-0.41, 0.43, -0.865]}>
          <meshStandardMaterial color="#b23b35" emissive="#8f2c28" emissiveIntensity={0.22} roughness={0.35} />
        </RoundedBox>
        <RoundedBox args={[0.28, 0.08, 0.035]} radius={0.03} smoothness={6} position={[0.41, 0.43, -0.865]}>
          <meshStandardMaterial color="#b23b35" emissive="#8f2c28" emissiveIntensity={0.22} roughness={0.35} />
        </RoundedBox>

        <Wheel position={[-0.65, 0.22, 0.5]} />
        <Wheel position={[0.65, 0.22, 0.5]} />
        <Wheel position={[-0.65, 0.22, -0.52]} />
        <Wheel position={[0.65, 0.22, -0.52]} />
      </group>
    </group>
  )
}
