// Ixcham SVG donut — ResponsiveContainer'siz (o'lcham qat'iy), shu sabab headless/jonli — har doim chiziladi.
// data: [{ label, value, color }]
const polar = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const arc = (cx, cy, r, a0, a1) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const nf = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");

const MiniDonut = ({ data = [], size = 150, thickness = 22, centerLabel }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const segments = data.reduce((arr, d) => {
    const prev = arr.length ? arr[arr.length - 1].cum : 0;
    const cum = prev + d.value;
    arr.push({
      ...d,
      a0: (prev / total) * 360,
      a1: (cum / total) * 360 - 0.6,
      pct: (d.value / total) * 100,
      cum,
    });
    return arr;
  }, []);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={thickness} />
        {segments.map((s) => (
          <path key={s.label} d={arc(cx, cy, r, s.a0, s.a1)} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="round" />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 20, fontWeight: 700 }}>
          {centerLabel ?? nf(total)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-foreground/45" style={{ fontSize: 9 }}>
          jami
        </text>
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="truncate text-foreground/70">{s.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums">
              {nf(s.value)} <span className="font-normal text-foreground/40">({s.pct.toFixed(0)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniDonut;
