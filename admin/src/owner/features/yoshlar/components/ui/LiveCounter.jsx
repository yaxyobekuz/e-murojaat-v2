// "Live" hisoblagich — yuklanganda 0 dan o'sadi (useCountUp), keyin mock interval bilan
// mayda tebranib turadi (real-time tuyg'usi). live=false bo'lsa faqat count-up bo'ladi.
import { useEffect, useState } from "react";

import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";

const fmt = (n) => Math.round(n).toLocaleString("uz-UZ");

const LiveCounter = ({ value, live = true, jitter = 0.0015, suffix = "", className = "" }) => {
  // live tebranish — value atrofida mayda ofset (0 = ofsetsiz)
  const [wobble, setWobble] = useState(0);
  const display = useCountUp(value + wobble, 1200);

  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(() => {
      setWobble(Math.round(value * jitter * Math.sin(Date.now() / 900)));
    }, 2600);
    return () => clearInterval(id);
  }, [value, live, jitter]);

  return (
    <span className={className}>
      {fmt(display)}
      {suffix}
    </span>
  );
};

export default LiveCounter;
