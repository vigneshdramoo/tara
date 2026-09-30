export type ProductImagePresentation = {
  fit: "cover" | "contain";
  position: string;
  scale: number;
  padding: string;
};

const defaultPresentation: ProductImagePresentation = {
  fit: "contain",
  position: "center center",
  scale: 1,
  padding: "8%",
};

export const productImagePresentations: Record<string, ProductImagePresentation> = {
  theon: { fit: "cover", position: "center center", scale: 1.02, padding: "0" },
  aureya: { fit: "contain", position: "center center", scale: 1.1, padding: "5.5%" },
  zephyr: { fit: "cover", position: "center center", scale: 0.97, padding: "0" },
  maris: { fit: "cover", position: "center center", scale: 0.97, padding: "0" },
  eliora: { fit: "cover", position: "center center", scale: 0.99, padding: "0" },
  ashoka: { fit: "cover", position: "center center", scale: 0.98, padding: "0" },
  ardor: { fit: "cover", position: "center center", scale: 0.98, padding: "0" },
  kameira: { fit: "contain", position: "center center", scale: 1.06, padding: "7%" },
};

export function getProductImagePresentation(slug: string): ProductImagePresentation {
  return productImagePresentations[slug] ?? defaultPresentation;
}
