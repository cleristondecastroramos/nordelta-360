import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusChipVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-400",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusChipVariants> {}

export function StatusChip({ className, variant, ...props }: StatusChipProps) {
  return (
    <div className={cn(statusChipVariants({ variant }), className)} {...props} />
  );
}
