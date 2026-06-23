// Obodonlashtirish analitika sahifalari uchun yagona sarlavha + "demo" belgisi.
const ObodPageHeader = ({ title, subtitle, legal, right }) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-foreground/50">{subtitle}</p>}
      {legal && (
        <p className="mt-1 inline-flex items-center gap-1.5 rounded-[2px] bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          {legal}
        </p>
      )}
    </div>
    {right}
  </div>
);

export default ObodPageHeader;
