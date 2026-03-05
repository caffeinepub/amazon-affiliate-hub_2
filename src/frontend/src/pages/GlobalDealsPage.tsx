import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Globe, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useQueries";
import { formatPrice, getDisplayPrice } from "../utils/priceUtils";
import { getVendorConfig } from "../utils/vendorUtils";

const SUPPLIER_SOURCES = [
  "All",
  "aliexpress",
  "alibaba",
  "dhgate",
  "cjdropshipping",
  "tiktok",
];

export default function GlobalDealsPage() {
  const { data: allProducts, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [activeSource, setActiveSource] = useState("All");

  const globalProducts = useMemo(() => {
    let products = (allProducts ?? []).filter((p) => p.vendor !== "amazon");
    if (activeSource !== "All") {
      products = products.filter((p) => p.vendor === activeSource);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return products;
  }, [allProducts, search, activeSource]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.12 280) 0%, oklch(0.28 0.10 300) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-7 h-7 text-white" />
              <h1 className="font-display font-extrabold text-3xl text-white">
                Global Deals
              </h1>
            </div>
            <p className="text-white/70 text-sm">
              Products from AliExpress, Alibaba, CJ Dropshipping, DHgate &
              TikTok viral finds.
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            <Input
              data-ocid="global.search_input"
              placeholder="Search global deals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/15 border-white/25 text-white placeholder:text-white/50 focus-visible:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Source filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SUPPLIER_SOURCES.map((source) => {
          const vendor = source === "All" ? null : getVendorConfig(source);
          return (
            <button
              key={source}
              type="button"
              data-ocid="global.source.tab"
              onClick={() => setActiveSource(source)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeSource === source
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              style={
                activeSource === source && vendor
                  ? { backgroundColor: vendor.color }
                  : undefined
              }
            >
              {source === "All" ? "All Sources" : (vendor?.label ?? source)}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {globalProducts.length} global deal
          {globalProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <div key={k} className="bg-card rounded-xl border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : globalProducts.length === 0 ? (
        <div
          data-ocid="global.empty_state"
          className="py-20 text-center text-muted-foreground"
        >
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold mb-1">No global deals found</p>
          <p className="text-sm">Try a different source or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalProducts.map((product, idx) => {
            const vendor = getVendorConfig(product.vendor);
            const displayPrice = getDisplayPrice(product.price);
            return (
              <div
                key={product.id.toString()}
                data-ocid={`global.product.item.${idx + 1}`}
                className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
              >
                <Link to="/products/$id" params={{ id: product.id.toString() }}>
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://picsum.photos/seed/${product.id}/400/300`;
                      }}
                    />
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white w-fit mb-2"
                    style={{ backgroundColor: vendor.color }}
                  >
                    {vendor.label}
                  </span>
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
                  >
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-2">
                      {product.title}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {product.description}
                  </p>
                  <div className="font-bold text-lg text-primary mb-3">
                    {formatPrice(displayPrice)}
                  </div>
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
                    data-ocid={`global.product.buy_button.${idx + 1}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
