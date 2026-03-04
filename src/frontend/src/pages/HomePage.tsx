import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import {
  useBrands,
  useDealOfDay,
  useFeaturedProducts,
} from "../hooks/useQueries";
import { formatPrice } from "../utils/vendorUtils";

// Countdown timer — visual only, resets daily
function DealCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 text-sm">
      <Clock className="w-4 h-4 text-primary" />
      <span className="text-muted-foreground text-xs">Ends in:</span>
      {[
        { k: "h", v: pad(h) },
        { k: "m", v: pad(m) },
        { k: "s", v: pad(s) },
      ].map((item, i) => (
        <span key={item.k} className="flex items-center gap-0.5">
          <span className="font-mono font-bold text-foreground bg-accent px-1.5 py-0.5 rounded text-sm">
            {item.v}
          </span>
          {i < 2 && <span className="text-muted-foreground font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-[#FF9900] text-[#FF9900]" : "fill-muted text-muted-foreground"}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: featuredProducts, isLoading: loadingFeatured } =
    useFeaturedProducts();
  const { data: dealOfDayProducts, isLoading: loadingDeals } = useDealOfDay();
  const { data: brands, isLoading: loadingBrands } = useBrands();

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────── */}
      <section
        data-ocid="home.hero_section"
        className="relative overflow-hidden min-h-[520px] flex items-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.01 260) 0%, oklch(0.24 0.04 260) 60%, oklch(0.22 0.06 48) 100%)",
        }}
      >
        {/* Bg image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(/assets/generated/hero-banner.dim_1600x600.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/10 blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-primary text-xs font-medium mb-6 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              Best Deals from Amazon, AliExpress & Alibaba
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[1.1] mb-4 animate-fade-in">
              Shop Smarter, <span className="text-primary">Save More</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed animate-fade-in-delay">
              Discover thousands of curated products with the best affiliate
              deals from top vendors worldwide. Your savings start here.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-delay">
              <Button
                data-ocid="home.browse_button"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-orange gap-2 font-semibold"
                onClick={() => void navigate({ to: "/products" })}
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 gap-2"
                onClick={() =>
                  void navigate({
                    to: "/products",
                    search: { category: "Electronics" },
                  })
                }
              >
                <TrendingUp className="w-5 h-5" />
                Trending Now
              </Button>
            </div>

            {/* Stats strip */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { label: "Products", value: "500+" },
                { label: "Brands", value: "50+" },
                { label: "Vendors", value: "3" },
                { label: "Categories", value: "9" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-bold text-2xl text-primary">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* ── Deal of the Day ────────────────────────── */}
        <section data-ocid="home.deal_section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🔥</span>
                <h2 className="font-display font-bold text-2xl md:text-3xl">
                  Deal of the Day
                </h2>
              </div>
              <DealCountdown />
            </div>
            <Link to="/products">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loadingDeals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl p-4 border shadow-card flex gap-4"
                >
                  <Skeleton className="w-36 h-36 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : dealOfDayProducts && dealOfDayProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dealOfDayProducts.map((product) => (
                <div
                  key={product.id.toString()}
                  className="bg-card rounded-2xl border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex gap-0 group"
                >
                  <div className="relative w-44 shrink-0 overflow-hidden">
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
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        🔥 DEAL
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-base leading-snug line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      by {product.brand}
                    </p>
                    <StarRating rating={product.rating} />
                    <div className="mt-auto">
                      <div className="font-display font-bold text-2xl text-primary mb-3">
                        {formatPrice(product.price)}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to="/products/$id"
                          params={{ id: product.id.toString() }}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-white"
                          >
                            Details
                          </Button>
                        </Link>
                        <a
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            className="w-full text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Buy Now <ExternalLink className="w-3 h-3" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No deals available today. Check back tomorrow!
            </p>
          )}
        </section>

        {/* ── Featured Products ──────────────────────── */}
        <section data-ocid="home.featured_section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-2xl md:text-3xl">
                  Top Picks
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Hand-curated products our team loves
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map((product, idx) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={idx + 1}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No featured products yet.
            </p>
          )}
        </section>

        {/* ── Sell With Us CTA ──────────────────────── */}
        <section
          data-ocid="home.sell_cta_section"
          className="rounded-2xl overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.05 15) 0%, oklch(0.26 0.08 20) 60%, oklch(0.22 0.04 260) 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-600/20 border border-rose-500/30 rounded-full px-3 py-1 text-rose-300 text-xs font-medium mb-4">
                  <Globe className="w-3.5 h-3.5" />
                  Chinese Sellers Welcome
                </div>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-snug mb-4">
                  Start Selling{" "}
                  <span className="text-rose-400">Your Products</span> Here
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-6">
                  List your products directly on our marketplace and reach
                  buyers worldwide. No upfront fees — we add a platform margin
                  and handle the marketing.
                </p>
                <Link to="/seller">
                  <Button
                    data-ocid="home.sell_cta_button"
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700 text-white gap-2 shadow-lg font-semibold"
                  >
                    Start Selling
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Right: Feature grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <Package className="w-5 h-5 text-rose-400" />,
                    title: "List Your Products",
                    desc: "Submit Chinese products directly to our marketplace for review.",
                  },
                  {
                    icon: <Globe className="w-5 h-5 text-primary" />,
                    title: "We Handle Marketing",
                    desc: "Your products get visibility across our global platform.",
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                    title: "50% Platform Margin",
                    desc: "We add margin to your base price — you keep your full amount.",
                  },
                  {
                    icon: <ShoppingBag className="w-5 h-5 text-amber-400" />,
                    title: "Direct Contact",
                    desc: "Buyers contact you directly for shipping and payment.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="mb-2">{item.icon}</div>
                    <h4 className="font-heading font-semibold text-sm text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Top Brands ─────────────────────────────── */}
        <section data-ocid="home.brands_section" className="overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <h2 className="font-display font-bold text-2xl md:text-3xl">
              Top Brands
            </h2>
          </div>

          {loadingBrands ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="shrink-0 w-32 bg-card rounded-xl p-4 border shadow-card flex flex-col items-center gap-2"
                >
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : brands && brands.length > 0 ? (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {brands.map((brand) => (
                  <a
                    key={brand.id.toString()}
                    href={brand.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-36 bg-card rounded-xl p-4 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span className="font-heading font-semibold text-xs text-card-foreground group-hover:text-primary transition-colors">
                      {brand.name}
                    </span>
                    {brand.category && (
                      <span className="text-[10px] text-muted-foreground">
                        {brand.category}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* ── Banner strip ─────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🛒",
              title: "Free Affiliate Deals",
              desc: "Earn while you shop. Every purchase supports us.",
              color: "from-[#FF9900]/20 to-[#FF9900]/5",
            },
            {
              icon: "🌏",
              title: "Global Vendors",
              desc: "Amazon, AliExpress & Alibaba all in one place.",
              color: "from-primary/20 to-primary/5",
            },
            {
              icon: "⚡",
              title: "Daily Deals",
              desc: "Fresh deals updated every 24 hours.",
              color: "from-destructive/20 to-destructive/5",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-xl p-6 bg-gradient-to-br ${item.color} border border-border/50 flex gap-4 items-start`}
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-heading font-bold text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
