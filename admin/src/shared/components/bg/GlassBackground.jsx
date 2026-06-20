// Fixed ambient backdrop — faint purple/cyan glow + subtle grid (theme-aware)
const GlassBackground = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-background" />

    {/* Subtle grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--accent-purple)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--accent-purple)/0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

    {/* Glow blobs */}
    <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-purple/20 blur-[140px]" />
    <div className="absolute -bottom-40 right-[8%] h-[380px] w-[380px] rounded-full bg-brand-cyan/15 blur-[140px]" />
    <div className="absolute right-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-brand-yellow/10 blur-[150px]" />
  </div>
);

export default GlassBackground;
