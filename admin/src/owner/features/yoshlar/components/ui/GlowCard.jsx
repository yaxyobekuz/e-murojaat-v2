// Glassmorphism + 3D tilt karta (framer-motion). Hover'da sichqoncha bo'yicha egiladi,
// accent rang bo'yicha yumshoq glow chiqaradi. Command center "premium" ko'rinish.
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/shared/utils/cn";

const GlowCard = ({ children, className = "", glow = "6,182,212", tilt = true, active = false, ...rest }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    if (!tilt || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-white/[0.03] p-4 backdrop-blur-xl",
        "shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] transition-colors",
        className,
      )}
      {...rest}
    >
      {/* accent glow chetida — active bo'lsa doim yonadi */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 group-hover:opacity-100",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{ boxShadow: `inset 0 0 0 1px rgba(${glow},0.35), 0 0 40px -8px rgba(${glow},0.45)` }}
      />
      {/* yuqori chiziq accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${glow},0.6), transparent)` }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
};

export default GlowCard;
