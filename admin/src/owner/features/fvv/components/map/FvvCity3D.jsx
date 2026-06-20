// FVV — 3D mini shahar + firetruck simulyatsiyasi (R3F + three.js).
// 5×5 yo'l panjarasi (25 chorraha), 16 blok-bino, yo'l grafi + BFS yo'l topish.
// Truck holat mashinasi: PATROL → EN_ROUTE → EXTINGUISHING → RETURNING.
// Yong'in generatori + suv zarrachalari + dispetcher HUD. Theme-aware (dark/light).
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

import { HOUSEHOLDS } from "../../mock/fvv.cityMap";

// ── Panjara / yo'l grafi ───────────────────────────────────────────────────────
const GRID = [-40, -20, 0, 20, 40]; // yo'l koordinatalari (x va z)
const N = GRID.length;
const nodeCoord = (ix, iz) => ({ x: GRID[ix], z: GRID[iz] });
const nodeId = (ix, iz) => ix * N + iz;
const neighbors = (ix, iz) => {
  const out = [];
  if (ix > 0) out.push([ix - 1, iz]);
  if (ix < N - 1) out.push([ix + 1, iz]);
  if (iz > 0) out.push([ix, iz - 1]);
  if (iz < N - 1) out.push([ix, iz + 1]);
  return out;
};
// BFS — start (ix,iz) dan goal (ix,iz) gacha tugunlar ro'yxati
const bfs = (start, goal) => {
  const key = (a) => `${a[0]},${a[1]}`;
  const q = [start];
  const prev = { [key(start)]: null };
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === goal[0] && cur[1] === goal[1]) break;
    for (const nb of neighbors(cur[0], cur[1])) {
      if (!(key(nb) in prev)) {
        prev[key(nb)] = cur;
        q.push(nb);
      }
    }
  }
  const path = [];
  let c = goal;
  if (!(key(goal) in prev)) return [start];
  while (c) {
    path.unshift(c);
    c = prev[key(c)];
  }
  return path;
};

// ── Binolar (16 blok markazi) ──────────────────────────────────────────────────
const BLOCKS = [-30, -10, 10, 30];
const nearestNode = (x, z) => {
  const ix = GRID.reduce((b, v, i) => (Math.abs(v - x) < Math.abs(GRID[b] - x) ? i : b), 0);
  const iz = GRID.reduce((b, v, i) => (Math.abs(v - z) < Math.abs(GRID[b] - z) ? i : b), 0);
  return [ix, iz];
};
const BUILDINGS = (() => {
  const list = [];
  let k = 0;
  for (let a = 0; a < BLOCKS.length; a++) {
    for (let b = 0; b < BLOCKS.length; b++) {
      const x = BLOCKS[a];
      const z = BLOCKS[b];
      const hh = HOUSEHOLDS[k];
      const floors = hh ? hh.floors : 3 + ((a * 4 + b) % 6);
      list.push({
        idx: k,
        x,
        z,
        h: Math.max(6, floors * 2.4 + 3),
        floors,
        householdId: hh ? hh.id : null,
        risk: hh ? hh.risk : "Past",
        entry: nearestNode(x, z),
      });
      k++;
    }
  }
  return list;
})();
const RISK_COLOR = { Yuqori: "#ef4444", "O'rta": "#f59e0b", Past: "#22c55e" };
const FIREHOUSE_NODE = [0, 0]; // burchak chorraha

// ── Palitra (theme-aware) ──────────────────────────────────────────────────────
const PALETTE = {
  dark: {
    bg: "#070b14", ground: "#0c1322", road: "#222b3a", dash: "#fbbf24", sidewalk: "#334155",
    building: "#1e2a44", buildingTop: "#0f1830", window: "#bae6fd", tree: "#14532d", trunk: "#5b3a21",
    sun: "#fff1d6", ambient: 0.45, sunI: 1.1,
  },
  light: {
    bg: "#dbe9f4", ground: "#cfe0ee", road: "#9aabbf", dash: "#fde047", sidewalk: "#e6eef6",
    building: "#c4d4e6", buildingTop: "#aebfd4", window: "#7fb6e0", tree: "#3f8f4f", trunk: "#8a5a36",
    sun: "#ffffff", ambient: 0.85, sunI: 1.0,
  },
};

// ── Yo'llar + trotuar + markaz chiziqlari ──────────────────────────────────────
function Roads({ p }) {
  const dashes = useMemo(() => {
    const arr = [];
    for (const gx of GRID) for (let z = -48; z <= 48; z += 8) arr.push([gx, z, false]);
    for (const gz of GRID) for (let x = -48; x <= 48; x += 8) arr.push([x, gz, true]);
    return arr;
  }, []);
  return (
    <group>
      {GRID.map((gx) => (
        <mesh key={`rx${gx}`} position={[gx, 0.05, 0]} receiveShadow>
          <boxGeometry args={[7, 0.1, 96]} />
          <meshStandardMaterial color={p.road} />
        </mesh>
      ))}
      {GRID.map((gz) => (
        <mesh key={`rz${gz}`} position={[0, 0.05, gz]} receiveShadow>
          <boxGeometry args={[96, 0.1, 7]} />
          <meshStandardMaterial color={p.road} />
        </mesh>
      ))}
      {/* markaz chiziqlari (uzuq sariq) */}
      {dashes.map(([x, z, horiz], i) => (
        <mesh key={`d${i}`} position={[x, 0.12, z]}>
          <boxGeometry args={horiz ? [3, 0.02, 0.5] : [0.5, 0.02, 3]} />
          <meshStandardMaterial color={p.dash} emissive={p.dash} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

// ── Bino ───────────────────────────────────────────────────────────────────────
function Building({ b, p, active, onSelect }) {
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh
        position={[0, b.h / 2, 0]}
        castShadow
        receiveShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          if (b.householdId) onSelect(b.householdId);
        }}
        onPointerOver={(e) => { e.stopPropagation(); if (b.householdId) document.body.style.cursor = "pointer"; }}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <boxGeometry args={[12, b.h, 12]} />
        <meshStandardMaterial
          color={active ? "#38bdf8" : p.building}
          emissive={active ? "#0ea5e9" : "#000"}
          emissiveIntensity={active ? 0.4 : 0}
        />
      </mesh>
      {/* tom */}
      <mesh position={[0, b.h + 0.3, 0]} castShadow>
        <boxGeometry args={[12.6, 0.6, 12.6]} />
        <meshStandardMaterial color={p.buildingTop} />
      </mesh>
      {/* xavf belgisi (tom ustida) */}
      {b.householdId && (
        <mesh position={[0, b.h + 1.2, 0]}>
          <boxGeometry args={[2, 1, 2]} />
          <meshStandardMaterial color={RISK_COLOR[b.risk]} emissive={RISK_COLOR[b.risk]} emissiveIntensity={0.5} />
        </mesh>
      )}
      {/* derazalar (oddiy emissiv chiziqlar) */}
      {Array.from({ length: Math.min(b.floors, 6) }).map((_, f) => (
        <mesh key={f} position={[6.06, 2 + f * 2.2, 0]}>
          <boxGeometry args={[0.06, 1, 9]} />
          <meshStandardMaterial color={p.window} emissive={p.window} emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

// ── Daraxt / ko'cha chirog'i ────────────────────────────────────────────────────
function Tree({ pos, p }) {
  return (
    <group position={pos}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2.4, 6]} />
        <meshStandardMaterial color={p.trunk} />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1.6, 3, 8]} />
        <meshStandardMaterial color={p.tree} />
      </mesh>
    </group>
  );
}
function Lamp({ pos }) {
  return (
    <group position={pos}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 4, 6]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 4.1, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

// ── Firehouse (depo) ────────────────────────────────────────────────────────────
function Firehouse({ p }) {
  const c = nodeCoord(FIREHOUSE_NODE[0], FIREHOUSE_NODE[1]);
  return (
    <group position={[c.x - 6, 0, c.z - 6]}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 8, 10]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      <mesh position={[0, 2.4, 5.05]}>
        <boxGeometry args={[7, 4.8, 0.3]} />
        <meshStandardMaterial color="#1f2937" emissive="#b91c1c" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 8.6, 0]}>
        <boxGeometry args={[12.6, 1.2, 10.6]} />
        <meshStandardMaterial color="#991b1b" />
      </mesh>
    </group>
  );
}

// ── Yong'in (flicker konuslar + tutun + nur) ───────────────────────────────────
function Fire({ data, p, lightOn }) {
  const g = useRef();
  const smoke = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const life = Math.max(0, data.life);
    if (g.current) {
      g.current.children.forEach((m, i) => {
        const fl = 0.7 + Math.sin(t * 12 + i * 1.7) * 0.3;
        m.scale.setScalar(fl * life);
      });
      g.current.visible = life > 0.02;
    }
    if (smoke.current) {
      smoke.current.position.y = 6 + ((t * 2) % 6);
      smoke.current.material.opacity = 0.25 * life;
    }
  });
  return (
    <group position={[data.x, data.y, data.z]}>
      <group ref={g}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 1.4, 1.6 + i * 0.5, 0]}>
            <coneGeometry args={[1.1, 3.2, 8]} />
            <meshStandardMaterial
              color={i === 1 ? "#fde047" : "#f97316"}
              emissive={i === 1 ? "#fbbf24" : "#ef4444"}
              emissiveIntensity={1.4}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>
      <mesh ref={smoke} position={[0, 6, 0]}>
        <sphereGeometry args={[2.4, 8, 8]} />
        <meshStandardMaterial color="#9ca3af" transparent opacity={0.25} />
      </mesh>
      {lightOn && <pointLight position={[0, 4, 0]} color="#ff7a33" intensity={28} distance={36} decay={2} />}
    </group>
  );
}

// ── Suv purkash (parabola zarrachalar) ─────────────────────────────────────────
function WaterSpray({ active, from, to }) {
  const ref = useRef();
  const count = 70;
  const positions = useMemo(() => new Float32Array(count * 3), []);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.visible = active;
    if (!active) return;
    const t0 = s.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const t = ((t0 * 1.6 + i / count) % 1);
      const x = from.x + (to.x - from.x) * t;
      const z = from.z + (to.z - from.z) * t;
      const y = from.y + (to.y - from.y) * t + Math.sin(t * Math.PI) * 6; // parabola
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#7dd3fc" size={0.9} transparent opacity={0.9} />
    </points>
  );
}

// ── Truck (3D model, sim tomonidan boshqariladi) ───────────────────────────────
function Truck({ truckRef, cannonRef, wheelsRef, beaconRef }) {
  return (
    <group ref={truckRef}>
      {/* korpus (uzunligi Z bo'ylab) */}
      <mesh position={[0, 1.4, -0.5]} castShadow>
        <boxGeometry args={[2.6, 2, 7]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* oq yon chiziq */}
      <mesh position={[1.31, 1.4, -0.5]}>
        <boxGeometry args={[0.02, 0.5, 6.6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[-1.31, 1.4, -0.5]}>
        <boxGeometry args={[0.02, 0.5, 6.6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* kabina (old, +Z) */}
      <mesh position={[0, 1.5, 3.4]} castShadow>
        <boxGeometry args={[2.6, 2.2, 2]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0, 1.8, 4.45]}>
        <boxGeometry args={[2.2, 1, 0.1]} />
        <meshStandardMaterial color="#bae6fd" emissive="#bae6fd" emissiveIntensity={0.2} />
      </mesh>
      {/* mayoq paneli */}
      <group ref={beaconRef} position={[0, 2.7, 2.2]}>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.7, 0.4, 0.8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0} />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.7, 0.4, 0.8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0} />
        </mesh>
      </group>
      {/* narvon + suv to'pi (cannon) */}
      <group ref={cannonRef} position={[0, 2.6, -1]}>
        <mesh position={[0, 0, 2]} rotation={[Math.PI / 2.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 5, 6]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      {/* g'ildiraklar */}
      <group ref={wheelsRef}>
        {[[-1.3, -2.4], [1.3, -2.4], [-1.3, 1.6], [1.3, 1.6], [-1.3, -0.4], [1.3, -0.4]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.6, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.4, 12]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Sahna + simulyatsiya (holat mashinasi) ─────────────────────────────────────
function Scene({ p, activeHouseId, onSelect, onHud, registerApi }) {
  const truckRef = useRef();
  const cannonRef = useRef();
  const wheelsRef = useRef();
  const beaconRef = useRef();
  const controls = useRef();
  const { camera } = useThree();

  const [fires, setFires] = useState([]); // {id, idx, x,y,z, data:{life}}
  const firesRef = useRef([]);
  useEffect(() => { firesRef.current = fires; }, [fires]);

  const sim = useRef({
    state: "PATROL",
    pos: { ...nodeCoord(FIREHOUSE_NODE[0], FIREHOUSE_NODE[1]) },
    node: [...FIREHOUSE_NODE],
    path: [], // keyingi tugun koordinatalari
    angle: 0,
    target: null, // joriy yong'in obyekti
    water: 100,
    extinguished: 0,
    fireTimer: 6,
    extElapsed: 0,
    spray: { active: false, from: new THREE.Vector3(), to: new THREE.Vector3() },
    paused: false,
    hudT: 0,
  });

  // Yong'in chiqarish
  const ignite = (idx) => {
    if (idx == null) return;
    if (firesRef.current.some((f) => f.idx === idx)) return;
    const b = BUILDINGS[idx];
    const fire = { id: `${idx}-${firesRef.current.length}-${b.h}`, idx, x: b.x, y: 2, z: b.z, data: { life: 1, x: b.x, y: 2, z: b.z } };
    firesRef.current = [...firesRef.current, fire];
    setFires(firesRef.current);
  };
  const igniteRandom = () => {
    const free = BUILDINGS.filter((b) => !firesRef.current.some((f) => f.idx === b.idx));
    if (!free.length) return;
    ignite(free[Math.floor(Math.random() * free.length)].idx);
  };

  // API ni yuqoriga ulash
  useEffect(() => {
    registerApi({
      igniteRandom,
      togglePause: () => (sim.current.paused = !sim.current.paused),
      resetCamera: () => {
        camera.position.set(70, 60, 70);
        controls.current?.target.set(0, 0, 0);
        controls.current?.update();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SPEED = 16;
  const EXT_TIME = 3.2;

  useFrame((s, dt) => {
    const S = sim.current;
    dt = Math.min(0.05, dt);
    if (!S.paused) {
      // yong'in generatori
      S.fireTimer -= dt;
      if (S.fireTimer <= 0) {
        S.fireTimer = 8 + Math.random() * 7;
        igniteRandom();
      }

      const atFire = firesRef.current;

      // PATROL: yong'in bo'lsa eng yaqinini tanlab yo'lga chiqadi
      if (S.state === "PATROL" && atFire.length) {
        chooseAndRoute(S, atFire);
      }

      // harakat (PATROL/EN_ROUTE/RETURNING)
      if (S.state !== "EXTINGUISHING") {
        if (S.path.length === 0) {
          if (S.state === "PATROL") {
            const nb = neighbors(S.node[0], S.node[1]);
            const pick = nb[Math.floor(Math.random() * nb.length)];
            S.path = [pick];
          } else if (S.state === "EN_ROUTE") {
            // kirish tuguni joriy tugun bilan bir xil — darhol o'chirishga o'tadi
            S.state = "EXTINGUISHING";
            S.extElapsed = 0;
          }
        }
        if (S.path.length) {
          const nextN = S.path[0];
          const nc = nodeCoord(nextN[0], nextN[1]);
          const dx = nc.x - S.pos.x;
          const dz = nc.z - S.pos.z;
          const d = Math.hypot(dx, dz);
          if (d < 0.4) {
            S.pos.x = nc.x; S.pos.z = nc.z; S.node = nextN; S.path.shift();
            onArrive(S, atFire);
          } else {
            S.pos.x += (dx / d) * SPEED * dt;
            S.pos.z += (dz / d) * SPEED * dt;
            S.angle = Math.atan2(dx, dz);
          }
        }
      } else {
        // EXTINGUISHING
        S.extElapsed += dt;
        S.water = Math.max(0, S.water - 9 * dt);
        if (S.target) {
          S.target.data.life = Math.max(0, 1 - S.extElapsed / EXT_TIME);
          S.spray.active = true;
          S.spray.from.set(S.pos.x, 3.4, S.pos.z);
          S.spray.to.set(S.target.x, 4, S.target.z);
          if (S.target.data.life <= 0) {
            // o'chirildi
            firesRef.current = firesRef.current.filter((f) => f.id !== S.target.id);
            setFires(firesRef.current);
            S.extinguished += 1;
            S.spray.active = false;
            S.target = null;
            S.extElapsed = 0;
            if (firesRef.current.length) chooseAndRoute(S, firesRef.current);
            else routeTo(S, FIREHOUSE_NODE, "RETURNING");
          }
        }
      }

      // depoda suv to'ldirish
      if (S.node[0] === FIREHOUSE_NODE[0] && S.node[1] === FIREHOUSE_NODE[1]) {
        S.water = Math.min(100, S.water + 18 * dt);
        if (S.state === "RETURNING" && S.path.length === 0) S.state = "PATROL";
      }
    }

    // truckni joylash
    if (truckRef.current) {
      truckRef.current.position.set(S.pos.x, 0, S.pos.z);
      truckRef.current.rotation.y = S.angle;
    }
    if (wheelsRef.current && S.state !== "EXTINGUISHING") {
      wheelsRef.current.children.forEach((w) => (w.rotation.x += dt * 6));
    }
    // mayoqlar (EN_ROUTE / EXTINGUISHING da yonadi)
    if (beaconRef.current) {
      const on = S.state === "EN_ROUTE" || S.state === "EXTINGUISHING";
      const t = s.clock.elapsedTime;
      const r = beaconRef.current.children[0].material;
      const bl = beaconRef.current.children[1].material;
      r.emissiveIntensity = on ? (Math.sin(t * 10) > 0 ? 2 : 0.1) : 0;
      bl.emissiveIntensity = on ? (Math.sin(t * 10) > 0 ? 0.1 : 2) : 0;
    }
    // cannon — yong'inga buriladi
    if (cannonRef.current && S.state === "EXTINGUISHING" && S.target) {
      cannonRef.current.lookAt(S.target.x, 4, S.target.z);
    }

    // HUD yangilash (~6/sek)
    S.hudT += dt;
    if (S.hudT > 0.16) {
      S.hudT = 0;
      const tb = S.target ? BUILDINGS[S.target.idx] : null;
      onHud({
        state: S.state,
        target: tb ? (tb.householdId ? HOUSEHOLDS.find((h) => h.id === tb.householdId)?.address : `Blok #${tb.idx + 1}`) : null,
        active: firesRef.current.length,
        extinguished: S.extinguished,
        water: Math.round(S.water),
        paused: S.paused,
      });
    }
  });

  // eng yaqin yong'inga marshrut
  function chooseAndRoute(S, list) {
    let best = null;
    let bd = Infinity;
    for (const f of list) {
      const d = Math.hypot(f.x - S.pos.x, f.z - S.pos.z);
      if (d < bd) { bd = d; best = f; }
    }
    if (!best) return;
    S.target = best;
    routeTo(S, BUILDINGS[best.idx].entry, "EN_ROUTE");
  }
  function routeTo(S, goalNode, state) {
    const path = bfs(S.node, goalNode);
    path.shift(); // joriy tugunni olib tashlash
    S.path = path;
    S.state = state;
  }
  function onArrive(S, list) {
    if (S.state === "EN_ROUTE" && S.path.length === 0) {
      // kirish tuguniga yetdi
      S.state = "EXTINGUISHING";
      S.extElapsed = 0;
    }
  }

  // statik elementlar
  const trees = useMemo(() => {
    const arr = [];
    for (const gx of [-40, 0, 40]) for (const gz of [-30, -10, 10, 30]) arr.push([gx + 4, 0, gz]);
    for (const gz of [-40, 40]) for (const gx of [-30, -10, 10, 30]) arr.push([gx, 0, gz + 4]);
    return arr;
  }, []);
  const lamps = useMemo(() => {
    const arr = [];
    for (let i = 0; i < N; i += 2) for (let j = 0; j < N; j += 2) { const c = nodeCoord(i, j); arr.push([c.x + 4, 0, c.z + 4]); }
    return arr;
  }, []);

  return (
    <>
      <color attach="background" args={[p.bg]} />
      <fog attach="fog" args={[p.bg, 90, 220]} />
      <ambientLight intensity={p.ambient} />
      <hemisphereLight intensity={0.35} color={p.sun} groundColor={p.ground} />
      <directionalLight
        position={[60, 90, 40]}
        intensity={p.sunI}
        color={p.sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-camera-far={250}
      />
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        maxPolarAngle={Math.PI / 2.15}
        minDistance={30}
        maxDistance={180}
        target={[0, 0, 0]}
      />

      {/* yer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color={p.ground} />
      </mesh>

      <Roads p={p} />
      {BUILDINGS.map((b) => (
        <Building key={b.idx} b={b} p={p} active={activeHouseId && b.householdId === activeHouseId} onSelect={onSelect} />
      ))}
      {trees.map((pos, i) => <Tree key={i} pos={pos} p={p} />)}
      {lamps.map((pos, i) => <Lamp key={i} pos={pos} />)}
      <Firehouse p={p} />

      {fires.map((f, i) => (
        <Fire key={f.id} data={f.data} p={p} lightOn={i < 3} />
      ))}

      <Truck truckRef={truckRef} cannonRef={cannonRef} wheelsRef={wheelsRef} beaconRef={beaconRef} />
      <WaterSprayBridge sim={sim} />
    </>
  );
}

// Spray sim.spray ni o'qiydi (har kadr)
function WaterSprayBridge({ sim }) {
  const [, setT] = useState(0);
  useFrame(() => setT((n) => (n + 1) % 1000));
  const S = sim.current.spray;
  return <WaterSpray active={S.active} from={S.from} to={S.to} />;
}

// ── HUD (dispetcher konsoli) ───────────────────────────────────────────────────
const STATE_LABEL = {
  PATROL: { t: "Patrulda", c: "#22c55e" },
  EN_ROUTE: { t: "Yo'lda", c: "#f59e0b" },
  EXTINGUISHING: { t: "O'chirilmoqda", c: "#ef4444" },
  RETURNING: { t: "Qaytmoqda", c: "#38bdf8" },
};
function Hud({ hud, api }) {
  const st = STATE_LABEL[hud?.state] || STATE_LABEL.PATROL;
  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-20 w-60 rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-[12px] text-slate-200 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-amber-400">Dispetcher</span>
        <span className="size-2 animate-pulse rounded-full" style={{ backgroundColor: st.c }} />
      </div>
      <Line k="Holat" v={st.t} vc={st.c} />
      <Line k="Nishon" v={hud?.target || "—"} />
      <Line k="Faol yong'in" v={hud?.active ?? 0} vc={hud?.active ? "#ef4444" : "#64748b"} />
      <Line k="O'chirilgan" v={hud?.extinguished ?? 0} vc="#22c55e" />
      <div className="mt-2">
        <div className="mb-0.5 flex justify-between text-[10px] text-slate-400">
          <span>Suv zaxirasi</span>
          <span>{hud?.water ?? 100}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded bg-slate-700">
          <div className="h-full rounded bg-sky-400 transition-all" style={{ width: `${hud?.water ?? 100}%` }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-1.5">
        <button onClick={() => api.current?.igniteRandom?.()} className="rounded-md bg-rose-600/90 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-600">
          🔥 Yong'in chiqarish
        </button>
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={() => api.current?.togglePause?.()} className="rounded-md bg-slate-700 px-2 py-1.5 text-[11px] text-white hover:bg-slate-600">
            {hud?.paused ? "▶ Davom" : "⏸ Pauza"}
          </button>
          <button onClick={() => api.current?.resetCamera?.()} className="rounded-md bg-slate-700 px-2 py-1.5 text-[11px] text-white hover:bg-slate-600">
            🎥 Kamera
          </button>
        </div>
      </div>
    </div>
  );
}
const Line = ({ k, v, vc }) => (
  <div className="flex items-center justify-between gap-2 py-0.5">
    <span className="text-slate-400">{k}:</span>
    <span className="truncate font-semibold" style={{ color: vc || "#e2e8f0" }}>{v}</span>
  </div>
);

// ── Wrapper ─────────────────────────────────────────────────────────────────────
export default function FvvCity3D({ activeHouseId, onSelectHouse }) {
  const { resolvedTheme } = useTheme();
  const p = PALETTE[resolvedTheme === "light" ? "light" : "dark"];
  const [hud, setHud] = useState(null);
  const apiRef = useRef({});

  return (
    <div className="relative h-full w-full">
      <Canvas shadows camera={{ position: [70, 60, 70], fov: 45 }} dpr={[1, 1.8]}>
        <Scene
          p={p}
          activeHouseId={activeHouseId}
          onSelect={onSelectHouse}
          onHud={setHud}
          registerApi={(api) => (apiRef.current = api)}
        />
      </Canvas>
      <Hud hud={hud} api={apiRef} />
    </div>
  );
}
