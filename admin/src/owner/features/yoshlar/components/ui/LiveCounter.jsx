// Hisoblagich — yuklanganda 0 dan target qiymatga bir marta o'sadi (count-up).
// Tebranish YO'Q — value o'zgarmasa qayta animatsiya bo'lmaydi (barqaror).
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";

const fmt = (n) => Math.round(n).toLocaleString("uz-UZ");

// live prop saqlanadi (API mosligi uchun), lekin endi tebranishga sabab bo'lmaydi.
const LiveCounter = ({ value, suffix = "", className = "" }) => {
  const display = useCountUp(value, 1200);
  return (
    <span className={className}>
      {fmt(display)}
      {suffix}
    </span>
  );
};

export default LiveCounter;
