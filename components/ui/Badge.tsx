import { cn, CATEGORY_COLORS, SPORT_ICONS } from "@/lib/utils";

interface BadgeProps {
  category: "football" | "basketball" | "other";
  size?: "sm" | "md";
  className?: string;
}

export default function CategoryBadge({ category, size = "sm", className }: BadgeProps) {
  const labels: Record<string, string> = {
    football: "Fútbol",
    basketball: "Baloncesto",
    other: "Otros",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        CATEGORY_COLORS[category],
        className
      )}
    >
      {SPORT_ICONS[category]} {labels[category]}
    </span>
  );
}
