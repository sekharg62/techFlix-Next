/**
 * Gold diagonal ribbon across the top-left corner of a product image.
 * The parent must be `relative overflow-hidden` so the ribbon ends are clipped.
 */
export function PlanRibbon({ count, size = "sm" }: { count: number; size?: "sm" | "lg" }) {
  if (count < 2) return null;
  const pos =
    size === "lg"
      ? "top-[26px] -left-[46px] w-[180px] py-1.5 text-xs"
      : "top-[18px] -left-[34px] w-[130px] py-1 text-[10px]";
  return (
    <div
      className={`absolute ${pos} -rotate-45 z-10 text-center font-black uppercase tracking-wider text-neutral-900 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 border-y border-yellow-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.5)]`}
    >
      {count} plans
    </div>
  );
}
