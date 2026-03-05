import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  Brain,
  ChevronRight,
  ExternalLink,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useQueries";
import { formatPrice, getDisplayPrice } from "../utils/priceUtils";
import { computeTrendScore, getProductTrendSignals } from "../utils/trendUtils";

function ProductGrid({
  products,
}: { products: ReturnType<typeof useProducts>["data"] }) {
  const [visibleCount, setVisibleCount] = useState(20);

  if (!products || products.length === 0) {
    return (
      <div
        data-ocid="trending.empty_state"
        className="py-16 text-center text-muted-foreground"
      >
        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>No products found.</p>
      </div>
    );
  }

  const visible = products.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {visible.map((product, idx) => (
          <Link
            key={product.id.toString()}
            to="/products/$id"
            params={{ id: product.id.toString() }}
            data-ocid={`trending.product.item.${idx + 1}`}
            className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://picsum.photos/seed/${product.id}/400/300`;
                }}
              />
              {product.dealOfDay && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  🔥 DEAL
                </div>
              )}
              {product.featured && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  ⭐
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1.5">
                {product.title}
              </p>
              <div className="flex items-center gap-0.5 mb-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 ${i <= Math.round(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground ml-0.5">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <div className="font-bold text-primary text-sm mb-2">
                {product.vendor === "amazon"
                  ? formatPrice(product.price)
                  : formatPrice(getDisplayPrice(product.price))}
              </div>
              {product.vendor === "amazon" ? (
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    className="w-full h-7 text-xs gap-1"
                    style={{ backgroundColor: "#FF9900", color: "white" }}
                  >
                    Amazon
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Button>
                </a>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7 text-xs border-primary/30 text-primary"
                >
                  View <ChevronRight className="w-3 h-3 ml-auto" />
                </Button>
              )}
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < products.length && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white"
            onClick={() => setVisibleCount((v) => v + 20)}
          >
            Load More ({products.length - visibleCount} remaining)
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
}

export default function TrendingProductsPage() {
  const { data: allProducts, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Smart Gadgets",
    "Kitchen Tools",
    "Kids Corner",
    "Fitness & Lifestyle",
    "Home & Kitchen",
  ];

  const base = useMemo(() => {
    let products = allProducts ?? [];
    if (activeCategory !== "All") {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return products;
  }, [allProducts, activeCategory, search]);

  // Sort trending by trendScore instead of raw rating
  const trending = useMemo(
    () =>
      [...base].sort((a, b) => {
        const scoreA = computeTrendScore(getProductTrendSignals(a.id));
        const scoreB = computeTrendScore(getProductTrendSignals(b.id));
        return scoreB - scoreA;
      }),
    [base],
  );
  const flashDeals = useMemo(() => base.filter((p) => p.dealOfDay), [base]);
  const mostViewed = useMemo(
    () => [...base].sort((a, b) => b.price - a.price),
    [base],
  );
  const bestRated = useMemo(
    () => [...base].filter((p) => p.rating >= 4.5),
    [base],
  );

  // Top 3 products by trendScore for the radar card
  const top3Trending = useMemo(() => {
    return [...(allProducts ?? [])]
      .map((p) => ({
        product: p,
        score: computeTrendScore(getProductTrendSignals(p.id)),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [allProducts]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.12 255) 0%, oklch(0.30 0.16 250) 100%)",
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
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h1 className="font-display font-extrabold text-3xl text-white">
                Trending Products
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              AI-curated trending deals from 5 global sources. Updated daily.
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <Input
              data-ocid="trending.search_input"
              placeholder="Search trending products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/15 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* ── AI Winning Product Radar ──────────────────────────────── */}
      <div className="bg-card border border-border/50 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base">
              AI Winning Product Radar
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time trend scoring — products auto-ranked by AI signals
            </p>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-muted/60 rounded-lg px-4 py-3 font-mono text-xs text-foreground/80 mb-4 overflow-x-auto whitespace-nowrap">
          TrendScore = (reviewGrowth × 0.35) + (salesRankMovement × 0.25) +
          (socialEngagement × 0.25) + (searchTrend × 0.15)
        </div>

        {/* Signal pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            {
              label: "Review Growth",
              color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
              weight: "35%",
            },
            {
              label: "Sales Rank",
              color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
              weight: "25%",
            },
            {
              label: "Social Engagement",
              color: "bg-pink-500/15 text-pink-400 border-pink-500/30",
              weight: "25%",
            },
            {
              label: "Search Trend",
              color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
              weight: "15%",
            },
          ].map((s) => (
            <span
              key={s.label}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${s.color}`}
            >
              {s.label}
              <span className="opacity-60 text-[10px]">{s.weight}</span>
            </span>
          ))}
        </div>

        {/* Top Trend Signals Today */}
        {top3Trending.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Top Trend Signals Today
            </p>
            <div className="space-y-2.5">
              {top3Trending.map(({ product, score }, i) => (
                <div
                  key={product.id.toString()}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                    #{i + 1}
                  </span>
                  <p className="text-xs font-medium truncate flex-1 min-w-0">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-primary w-8 text-right">
                      {Math.round(score)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="trending.tab"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[
            "s1",
            "s2",
            "s3",
            "s4",
            "s5",
            "s6",
            "s7",
            "s8",
            "s9",
            "s10",
            "s11",
            "s12",
            "s13",
            "s14",
            "s15",
            "s16",
            "s17",
            "s18",
            "s19",
            "s20",
          ].map((k) => (
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
      ) : (
        <Tabs defaultValue="trending">
          <TabsList className="mb-6 bg-muted flex-wrap h-auto">
            <TabsTrigger value="trending" data-ocid="trending.tab">
              🔥 Trending Today
            </TabsTrigger>
            <TabsTrigger value="flash" data-ocid="trending.tab">
              ⚡ Flash Deals
            </TabsTrigger>
            <TabsTrigger value="viewed" data-ocid="trending.tab">
              👁 Most Viewed
            </TabsTrigger>
            <TabsTrigger value="rated" data-ocid="trending.tab">
              ⭐ Best Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <p className="text-sm text-muted-foreground mb-4">
              {trending.length} products sorted by rating
            </p>
            <ProductGrid products={trending} />
          </TabsContent>

          <TabsContent value="flash">
            <p className="text-sm text-muted-foreground mb-4">
              {flashDeals.length} flash deals available today
            </p>
            <ProductGrid products={flashDeals} />
          </TabsContent>

          <TabsContent value="viewed">
            <p className="text-sm text-muted-foreground mb-4">
              {mostViewed.length} trending products
            </p>
            <ProductGrid products={mostViewed} />
          </TabsContent>

          <TabsContent value="rated">
            <p className="text-sm text-muted-foreground mb-4">
              {bestRated.length} products rated 4.5+ stars
            </p>
            <ProductGrid products={bestRated} />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
