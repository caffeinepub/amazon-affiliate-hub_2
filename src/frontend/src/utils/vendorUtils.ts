export type VendorKey =
  | "amazon"
  | "aliexpress"
  | "alibaba"
  | "dhgate"
  | "cjdropshipping"
  | "tiktok";

export const VENDOR_CONFIG: Record<
  string,
  { label: string; color: string; bgClass: string; textClass: string }
> = {
  amazon: {
    label: "Amazon",
    color: "#FF9900",
    bgClass: "bg-[#FF9900]",
    textClass: "text-[#FF9900]",
  },
  aliexpress: {
    label: "AliExpress",
    color: "#e62e04",
    bgClass: "bg-[#e62e04]",
    textClass: "text-[#e62e04]",
  },
  alibaba: {
    label: "Alibaba",
    color: "#ff6a00",
    bgClass: "bg-[#ff6a00]",
    textClass: "text-[#ff6a00]",
  },
  dhgate: {
    label: "DHgate",
    color: "#c0392b",
    bgClass: "bg-[#c0392b]",
    textClass: "text-[#c0392b]",
  },
  cjdropshipping: {
    label: "CJ Dropship",
    color: "#2980b9",
    bgClass: "bg-[#2980b9]",
    textClass: "text-[#2980b9]",
  },
  tiktok: {
    label: "TikTok",
    color: "#010101",
    bgClass: "bg-[#010101]",
    textClass: "text-[#010101]",
  },
};

export function getVendorConfig(vendor: string) {
  return (
    VENDOR_CONFIG[vendor.toLowerCase()] ?? {
      label: vendor,
      color: "#888",
      bgClass: "bg-gray-400",
      textClass: "text-gray-600",
    }
  );
}

// Kept for backward compatibility — use priceUtils.ts formatPrice for INR
export function formatPrice(price: number): string {
  const inr = price * 83;
  return `₹${inr.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
