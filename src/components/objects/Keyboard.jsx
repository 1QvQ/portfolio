import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'

// High-contrast, distinctive mechanical keyboard colorway
const colorCase = '#ede8dd'
const colorCaseBottom = '#ded8cc'
const colorPlate = '#1e2522'
const colorAlpha = '#ffffff'
const colorMod = '#526858'
const colorEsc = '#e05e45'
const colorEnter = '#f0ab46'
const colorGold = '#d4af37'
const colorRubber = '#222825'

function playThockSound() {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Switch contact click (transient)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(720 + Math.random() * 100, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.03)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)

    // Deep "thock" acoustic bottom-out resonance
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(210 + Math.random() * 30, now)
    subOsc.frequency.exponentialRampToValueAtTime(50, now + 0.065)
    subGain.gain.setValueAtTime(0.25, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)
    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 0.065)
  } catch {
    // Graceful fallback
  }
}

function CoiledCable() {
  const curve = useMemo(() => {
    const points = []
    points.push(new Vector3(-0.32, 0.05, -0.21))
    points.push(new Vector3(-0.32, 0.05, -0.29))
    const coilCount = 12
    for (let i = 0; i < coilCount; i++) {
      const t = i / coilCount
      const angle = t * Math.PI * 6
      const x = -0.32 - t * 0.22
      const y = 0.038 + Math.sin(angle) * 0.016
      const z = -0.29 + Math.cos(angle) * 0.016
      points.push(new Vector3(x, y, z))
    }
    points.push(new Vector3(-0.58, 0.025, -0.3))
    points.push(new Vector3(-0.76, 0.018, -0.32))
    return new CatmullRomCurve3(points)
  }, [])

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 40, 0.01, 8, false]} />
        <meshStandardMaterial color="#6a7d70" roughness={0.7} />
      </mesh>
      {/* Aviator connector */}
      <mesh position={[-0.62, 0.026, -0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 16]} />
        <meshStandardMaterial color={colorGold} metalness={0.9} roughness={0.22} />
      </mesh>
    </group>
  )
}

// Structured 65% mechanical keyboard layout with precise spacing and no overlaps
const keyRows = [
  // Row 0: Function / Number row (z = -0.14)
  {
    z: -0.14,
    keys: [
      { x: -0.44, w: 0.065, color: colorEsc },
      { x: -0.37, w: 0.052, color: colorAlpha },
      { x: -0.305, w: 0.052, color: colorAlpha },
      { x: -0.24, w: 0.052, color: colorAlpha },
      { x: -0.175, w: 0.052, color: colorAlpha },
      { x: -0.11, w: 0.052, color: colorAlpha },
      { x: -0.045, w: 0.052, color: colorAlpha },
      { x: 0.02, w: 0.052, color: colorAlpha },
      { x: 0.085, w: 0.052, color: colorAlpha },
      { x: 0.15, w: 0.052, color: colorAlpha },
      { x: 0.215, w: 0.052, color: colorAlpha },
      { x: 0.28, w: 0.052, color: colorAlpha },
      { x: 0.36, w: 0.082, color: colorMod },
    ],
  },
  // Row 1: QWERTY (z = -0.07)
  {
    z: -0.07,
    keys: [
      { x: -0.435, w: 0.075, color: colorMod },
      { x: -0.36, w: 0.052, color: colorAlpha },
      { x: -0.295, w: 0.052, color: colorAlpha },
      { x: -0.23, w: 0.052, color: colorAlpha },
      { x: -0.165, w: 0.052, color: colorAlpha },
      { x: -0.1, w: 0.052, color: colorAlpha },
      { x: -0.035, w: 0.052, color: colorAlpha },
      { x: 0.03, w: 0.052, color: colorAlpha },
      { x: 0.095, w: 0.052, color: colorAlpha },
      { x: 0.16, w: 0.052, color: colorAlpha },
      { x: 0.225, w: 0.052, color: colorAlpha },
      { x: 0.29, w: 0.052, color: colorAlpha },
      { x: 0.36, w: 0.068, color: colorMod },
      { x: 0.44, w: 0.052, color: colorMod },
    ],
  },
  // Row 2: ASDF / Home (z = 0.00)
  {
    z: 0.0,
    keys: [
      { x: -0.43, w: 0.088, color: colorMod },
      { x: -0.345, w: 0.052, color: colorAlpha },
      { x: -0.28, w: 0.052, color: colorAlpha },
      { x: -0.215, w: 0.052, color: colorAlpha },
      { x: -0.15, w: 0.052, color: colorAlpha },
      { x: -0.085, w: 0.052, color: colorAlpha },
      { x: -0.02, w: 0.052, color: colorAlpha },
      { x: 0.045, w: 0.052, color: colorAlpha },
      { x: 0.11, w: 0.052, color: colorAlpha },
      { x: 0.175, w: 0.052, color: colorAlpha },
      { x: 0.24, w: 0.052, color: colorAlpha },
      { x: 0.335, w: 0.112, color: colorEnter },
      { x: 0.44, w: 0.052, color: colorMod },
    ],
  },
  // Row 3: ZXCV / Shift (z = 0.07)
  {
    z: 0.07,
    keys: [
      { x: -0.415, w: 0.118, color: colorMod },
      { x: -0.315, w: 0.052, color: colorAlpha },
      { x: -0.25, w: 0.052, color: colorAlpha },
      { x: -0.185, w: 0.052, color: colorAlpha },
      { x: -0.12, w: 0.052, color: colorAlpha },
      { x: -0.055, w: 0.052, color: colorAlpha },
      { x: 0.01, w: 0.052, color: colorAlpha },
      { x: 0.075, w: 0.052, color: colorAlpha },
      { x: 0.14, w: 0.052, color: colorAlpha },
      { x: 0.205, w: 0.052, color: colorAlpha },
      { x: 0.285, w: 0.088, color: colorMod },
      { x: 0.37, w: 0.052, color: colorEsc },
      { x: 0.44, w: 0.052, color: colorMod },
    ],
  },
  // Row 4: Spacebar / Arrow cluster (z = 0.14)
  {
    z: 0.14,
    keys: [
      { x: -0.435, w: 0.065, color: colorMod },
      { x: -0.36, w: 0.058, color: colorMod },
      { x: -0.288, w: 0.058, color: colorMod },
      { x: -0.05, w: 0.35, color: colorAlpha },
      { x: 0.18, w: 0.058, color: colorMod },
      { x: 0.245, w: 0.058, color: colorMod },
      { x: 0.305, w: 0.052, color: colorMod },
      { x: 0.37, w: 0.052, color: colorMod },
      { x: 0.44, w: 0.052, color: colorMod },
    ],
  },
]

export default function Keyboard({ onFactClick, ...props }) {
  const root = useRef()
  const keysGroup = useRef()
  const knob = useRef()
  const pressY = useRef(0)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    // Smooth keypress depression rebound
    if (keysGroup.current) {
      pressY.current = MathUtils.damp(pressY.current, 0, 18, delta)
      keysGroup.current.position.y = 0.064 - pressY.current
    }

    // Spin rotary encoder knob when hovered
    if (knob.current && hovered) {
      knob.current.rotation.y += delta * 4
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    pressY.current = 0.016
    playThockSound()
    onFactClick?.()
  }

  return (
    <group ref={root} {...props}>
      <group
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto'
        }}
      >
        {/* Invisible hit-box: prevents hover event flicker while keeping mouse events reliable */}
        <mesh position={[0, 0.07, 0]} visible={false}>
          <boxGeometry args={[1.1, 0.14, 0.48]} />
          <meshBasicMaterial />
        </mesh>

        {/* Keyboard Chassis (inclined wedge case with rounded corners) */}
        <group rotation={[-0.09, 0, 0]}>
          {/* Main Top Bevel Frame */}
          <RoundedBox
            args={[1.04, 0.055, 0.44]}
            radius={0.024}
            smoothness={4}
            position={[0, 0.03, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={colorCase} roughness={0.65} />
          </RoundedBox>

          {/* Recessed switch plate (dark anodized matte aluminum for key contrast) */}
          <mesh position={[0, 0.054, 0]} receiveShadow>
            <boxGeometry args={[0.98, 0.005, 0.38]} />
            <meshStandardMaterial color={colorPlate} roughness={0.92} />
          </mesh>

          {/* Underglow accent light bar on front edge */}
          <mesh position={[0, 0.012, 0.218]}>
            <boxGeometry args={[0.88, 0.01, 0.006]} />
            <meshStandardMaterial color="#ff8d6d" emissive="#ff8d6d" emissiveIntensity={0.65} />
          </mesh>

          {/* Rotary Knob (custom mechanical keyboard hallmark) */}
          <group ref={knob} position={[0.44, 0.088, -0.14]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.038, 20]} />
              <meshStandardMaterial color={colorGold} metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.004, 20]} />
              <meshStandardMaterial color="#b89324" metalness={0.95} roughness={0.18} />
            </mesh>
          </group>

          {/* Keycaps: Elevated clearly above plate with crisp beveled definition */}
          <group ref={keysGroup} position={[0, 0.066, 0]}>
            {keyRows.map((row) =>
              row.keys.map((key, i) => (
                <mesh
                  key={`${row.z}-${i}`}
                  position={[key.x, 0.021, row.z]}
                  castShadow={false}
                  receiveShadow
                >
                  <boxGeometry args={[key.w - 0.006, 0.038, 0.058]} />
                  <meshStandardMaterial color={key.color} roughness={0.35} />
                </mesh>
              )),
            )}
          </group>
        </group>

        {/* Bottom Base */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[1.0, 0.02, 0.41]} />
          <meshStandardMaterial color={colorCaseBottom} roughness={0.85} />
        </mesh>

        {/* Polished Brass Back Weight */}
        <mesh position={[0, 0.005, -0.02]} receiveShadow>
          <boxGeometry args={[0.5, 0.004, 0.15]} />
          <meshStandardMaterial color={colorGold} metalness={0.94} roughness={0.18} />
        </mesh>

        {/* 4 Rubber Feet */}
        {[
          [-0.44, -0.16],
          [0.44, -0.16],
          [-0.44, 0.16],
          [0.44, 0.16],
        ].map(([rx, rz]) => (
          <mesh key={`${rx}-${rz}`} position={[rx, 0.002, rz]}>
            <cylinderGeometry args={[0.02, 0.02, 0.006, 12]} />
            <meshStandardMaterial color={colorRubber} roughness={0.9} />
          </mesh>
        ))}

        {/* Coiled Aviator Cable */}
        <CoiledCable />
      </group>
    </group>
  )
}
