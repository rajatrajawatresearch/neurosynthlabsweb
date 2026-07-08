"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/lib/store";
import { seeded } from "@/lib/utils";

function toColor(hex: string, fallback = "#7c5cff") {
  try {
    return new THREE.Color(hex || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}

/** A soft round sprite so points render as glowing dots, not squares. */
function makeDotTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function Field() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // read tunables (rounded where live-dragging would thrash the memo)
  const rawCount = useAppStore((s) => Number(s.values["fx-particles"]) || 900);
  const count = Math.round(rawCount / 50) * 50;
  const linkDist = useAppStore((s) => Number(s.values["fx-link-distance"]) || 1.5);
  const depth = useAppStore((s) => Number(s.values["fx-depth"]) || 6);
  const nodeSize = useAppStore((s) => Number(s.values["fx-node-size"]) || 3.2);
  const linkOpacity = useAppStore((s) => Number(s.values["fx-link-opacity"]) || 22) / 100;
  const speed = useAppStore((s) => Number(s.values["fx-speed"]) ?? 1);
  const parallax = useAppStore((s) => Number(s.values["fx-parallax"]) ?? 0.4);
  const nodeHex = useAppStore((s) => String(s.values["fx-node"] || "#8b6bff"));
  const node2Hex = useAppStore((s) => String(s.values["fx-node-2"] || "#2fe6d6"));
  const linkHex = useAppStore((s) => String(s.values["fx-link"] || "#4d7cff"));

  const dot = useMemo(() => makeDotTexture(), []);

  // node positions + per-node color, computed when structural params change
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cA = toColor(nodeHex);
    const cB = toColor(node2Hex);
    const spreadX = 11;
    const spreadY = 7;
    for (let i = 0; i < count; i++) {
      const x = (seeded(i * 3 + 1) - 0.5) * spreadX;
      const y = (seeded(i * 3 + 2) - 0.5) * spreadY;
      const z = (seeded(i * 3 + 3) - 0.5) * depth;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      const t = seeded(i * 7 + 5);
      const mixed = cA.clone().lerp(cB, t);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return { positions: pos, colors: col };
  }, [count, depth, nodeHex, node2Hex]);

  // link segments between nearby nodes (computed once per structural change, capped)
  const linkPositions = useMemo(() => {
    const segs: number[] = [];
    const maxLinks = count * 3;
    const d2 = linkDist * linkDist;
    for (let i = 0; i < count && segs.length < maxLinks * 6; i++) {
      let made = 0;
      for (let j = i + 1; j < count && made < 3; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < d2) {
          segs.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          );
          made++;
        }
      }
    }
    return new Float32Array(segs);
  }, [positions, count, linkDist]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const g = group.current;
    g.rotation.y += delta * 0.04 * speed;
    // ease toward pointer for a parallax feel
    const targetX = pointer.y * 0.25 * parallax;
    const targetY = pointer.x * 0.4 * parallax + g.rotation.y;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
    g.position.x += (pointer.x * parallax - g.position.x) * 0.03;
    g.position.y += (pointer.y * parallax * 0.6 - g.position.y) * 0.03;
    void targetY;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={nodeSize * 0.012}
          sizeAttenuation
          vertexColors
          map={dot}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={toColor(linkHex)}
          transparent
          opacity={linkOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function NeuralField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 62 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Field />
    </Canvas>
  );
}
