import type { CheckoutProduct } from "@/content/products";
import { cn } from "@/lib/utils";

export function ProductAvailability({
  product,
  className,
  showDetail = false,
}: {
  product: Pick<
    CheckoutProduct,
    "availabilityLabel" | "availabilityDetail"
  >;
  className?: string;
  showDetail?: boolean;
}) {
  return (
    <div className={cn("text-sm leading-6", className)}>
      <p className="font-semibold text-[var(--color-onyx-black)]">
        {product.availabilityLabel}
      </p>
      {showDetail ? (
        <p className="mt-1 text-black/54">{product.availabilityDetail}</p>
      ) : null}
    </div>
  );
}
