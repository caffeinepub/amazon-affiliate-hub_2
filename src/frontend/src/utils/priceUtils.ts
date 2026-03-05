export function formatPrice(usd: number): string {
  const inr = usd * 83;
  return `₹${inr.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function getDisplayPrice(supplierPrice: number): number {
  return supplierPrice * 1.5;
}
