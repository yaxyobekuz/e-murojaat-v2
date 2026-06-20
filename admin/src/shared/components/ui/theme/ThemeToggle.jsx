import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/shared/utils/cn";

const ThemeToggle = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch flash — render after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Mavzuni almashtirish"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "grid size-9 place-items-center rounded-full border text-foreground/70 transition-colors hover:text-foreground",
        "border-[rgb(var(--card-border))] bg-card/60 backdrop-blur",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-[18px]" strokeWidth={1.75} />
        ) : (
          <Moon className="size-[18px]" strokeWidth={1.75} />
        )
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  );
};

export default ThemeToggle;
