import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "../backend";
import ProductCard from "../components/ProductCard";
import { useDealOfDay, useFeaturedProducts } from "../hooks/useQueries";

const CATEGORY_FILTERS = [
  "All",
  "Electronics",
  "Smart Gadgets",
  "Kitchen Tools",
  "Kids Corner",
  "Fitness & Lifestyle",
];

export default function DealsPage() {
  const { data: featured = [], isLoading: loadingFeatured } =
    useFeaturedProducts();
  const { data: dealOfDay = [], isLoading: loadingDeals } = useDealOfDay();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const isLoading = loadingFeatured || loadingDeals;

  // Merge and deduplicate by id
  const merged = useMemo<Product[]>(() => {
    const seen = new Set<string>();
    const all: Product[] = [];
    for (const p of [...dealOfDay, ...featured]) {
      const key = p.id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        all.push(p);
      }
    }
    return all;
  }, [featured, dealOfDay]);

  const filtered = useMemo(() => {
    let products = merged;
    if (activeCategory !== "All") {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }
    return products;
  }, [merged, activeCategory, search]);

  return (
    <main data-ocid="deals.page" className="container mx-auto px-4 py-8">
      {/* Hero banner */}
      <section
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.20 0.12 255) 0%, oklch(0.28 0.18 250) 50%, oklch(0.24 0.14 260) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Decorative blob */}
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.72 0.20 60 / 0.15)" }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-3 py-1 text-accent text-xs font-semibold mb-4">
              <Tag className="w-3 h-3" />
              Deals Hub · Updated Daily
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-2">
              Today's{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.72 0.20 60), oklch(0.80 0.18 50))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Best Deals
              </span>
            </h1>
            <p className="text-white/55 text-sm max-w-lg leading-relaxed">
              Morgen Segen Technologies – AI Product Discovery Marketplace
              powered by DealFusion.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <Input
              data-ocid="deals.search_input"
              placeholder="Search deals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/15 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground">
        <span>
          <span className="font-bold text-foreground">{filtered.length}</span>{" "}
          deals found
        </span>
        {activeCategory !== "All" && (
          <>
            <span>·</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              onClick={() => setActiveCategory("All")}
            >
              Clear filter
            </Button>
          </>
        )}
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }, (_, i) => `sk-${i}`).map((k) => (
            <div key={k} className="bg-card rounded-xl border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-5 w-16 mt-1" />
                <Skeleton className="h-7 w-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="deals.empty_state"
          className="py-20 text-center text-muted-foreground"
        >
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold mb-1">No deals found</p>
          <p className="text-sm">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filtered.map((product, idx) => (
            <ProductCard
              key={product.id.toString()}
              product={product}
              index={idx + 1}
            />
          ))}
        </div>
      )}
    </main>
  );
}
