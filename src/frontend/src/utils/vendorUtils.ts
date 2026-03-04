export type VendorKey = "amazon" | "aliexpress" | "alibaba";

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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
