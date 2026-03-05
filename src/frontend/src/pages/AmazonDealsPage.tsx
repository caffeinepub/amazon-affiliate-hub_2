import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useQueries";
import { formatPrice } from "../utils/priceUtils";

export default function AmazonDealsPage() {
  const { data: allProducts, isLoading } = useProducts();
  const [search, setSearch] = useState("");

  const amazonProducts = useMemo(() => {
    let products = (allProducts ?? []).filter((p) => p.vendor === "amazon");
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return products;
  }, [allProducts, search]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF9900 0%, #FF6600 100%)",
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
              <span className="text-3xl">🛒</span>
              <h1 className="font-display font-extrabold text-3xl text-white">
                Amazon Deals
              </h1>
            </div>
            <p className="text-white/80 text-sm">
              Curated Amazon affiliate deals. Click "Buy on Amazon" to purchase.
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            <Input
              data-ocid="amazon.search_input"
              placeholder="Search Amazon deals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {amazonProducts.length} Amazon deal
          {amazonProducts.length !== 1 ? "s" : ""} found
        </p>
        <a
          href="https://affiliate-program.amazon.in/home"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Amazon India Affiliate
          <ExternalLink className="w-3 h-3" />
        </a>
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
      ) : amazonProducts.length === 0 ? (
        <div
          data-ocid="amazon.empty_state"
          className="py-20 text-center text-muted-foreground"
        >
          <span className="text-5xl block mb-4">🛒</span>
          <p className="font-semibold mb-1">No Amazon deals found</p>
          <p className="text-sm">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {amazonProducts.map((product, idx) => (
            <div
              key={product.id.toString()}
              data-ocid={`amazon.product.item.${idx + 1}`}
              className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
            >
              <Link
                to="/products/$id"
                params={{ id: product.id.toString() }}
                className="block"
              >
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
                <div className="flex items-center gap-1 mb-2">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "#FF9900", color: "white" }}
                  >
                    AMAZON
                  </span>
                  {product.featured && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      TOP PICK
                    </span>
                  )}
                </div>
                <Link to="/products/$id" params={{ id: product.id.toString() }}>
                  <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-2">
                    {product.title}
                  </p>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= Math.round(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-0.5">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <div className="font-bold text-lg text-primary mb-3">
                  {formatPrice(product.price)}
                </div>
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-ocid={`amazon.product.buy_button.${idx + 1}`}
                >
                  <Button
                    className="w-full gap-2 font-semibold"
                    style={{ backgroundColor: "#FF9900", color: "white" }}
                  >
                    Buy on Amazon
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
