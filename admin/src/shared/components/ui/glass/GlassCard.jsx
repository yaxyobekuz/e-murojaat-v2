import { cn } from "@/shared/utils/cn";

// Elevated dark/ice card — hairline border + soft depth (renders .surface)
const GlassCard = ({ glow = false, className = "", children, ...props }) => (
  <div
    className={cn("surface p-5", glow && "surface-glow", className)}
    {...props}
  >
    {children}
  </div>
);

export default GlassCard;
