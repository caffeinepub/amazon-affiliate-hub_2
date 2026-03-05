import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Package,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBrands,
  useDealOfDay,
  useFeaturedProducts,
  useProducts,
  useSellerListings,
  useSubmitSellerListing,
} from "../hooks/useQueries";
import { formatPrice, getDisplayPrice } from "../utils/priceUtils";

// Countdown timer
function DealCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 86400));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Clock className="w-4 h-4 text-accent" />
      <span className="text-white/60 text-xs">Ends in:</span>
      {[
        { k: "h", v: pad(h) },
        { k: "m", v: pad(m) },
        { k: "s", v: pad(s) },
      ].map((item, i) => (
        <span key={item.k} className="flex items-center gap-0.5">
          <span className="font-mono font-bold text-accent bg-accent/20 px-1.5 py-0.5 rounded text-sm">
            {item.v}
          </span>
          {i < 2 && <span className="text-white/50 font-bold text-xs">:</span>}
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
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "fill-accent text-accent" : "fill-muted text-muted-foreground"}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

// Category shortcuts
const CATEGORY_SHORTCUTS = [
  {
    icon: "⚡",
    label: "Smart Gadgets",
    path: "/smart-gadgets",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: "🧸",
    label: "Kids Corner",
    path: "/kids-corner",
    color: "from-pink-500/20 to-pink-600/10",
  },
  {
    icon: "🍳",
    label: "Kitchen Tools",
    path: "/kitchen-tools",
    color: "from-orange-500/20 to-orange-600/10",
  },
  {
    icon: "💪",
    label: "Fitness",
    path: "/fitness",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    icon: "🛒",
    label: "Amazon Deals",
    path: "/amazon-deals",
    color: "from-yellow-500/20 to-yellow-600/10",
  },
  {
    icon: "🌍",
    label: "Global Deals",
    path: "/global-deals",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    icon: "🔥",
    label: "Trending Today",
    path: "/trending",
    color: "from-red-500/20 to-red-600/10",
  },
  {
    icon: "⚡",
    label: "Flash Deals",
    path: "/trending",
    color: "from-cyan-500/20 to-cyan-600/10",
  },
];

// Seller Submit Form (price is seller's base price — buyer sees 1.5x)
function SellerSubmitForm() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const submitMutation = useSubmitSellerListing();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    category: "Electronics",
    shippingInfo: "",
    contactEmail: "",
    contactWhatsApp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    try {
      await submitMutation.mutateAsync({ ...form, price });
      setSubmitted(true);
      toast.success("Product submitted for review!");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  if (!identity) {
    return (
      <div className="py-8 text-center">
        <Store className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-sm mb-4">
          Sign in to list your products on DealFusion Market
        </p>
        <Button
          onClick={() => void login()}
          disabled={isLoggingIn}
          className="gap-2 bg-primary text-primary-foreground"
        >
          {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Sign In to List Products
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="font-display font-bold text-lg mb-2">
          Product Submitted!
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Your listing is under review. We'll notify you once approved.
        </p>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="gap-2"
        >
          Submit Another Product
        </Button>
      </div>
    );
  }

  const listingCategories = CATEGORIES.filter((c) => c !== "All");

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3 max-w-lg">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-title" className="text-xs">
            Product Title *
          </Label>
          <Input
            id="s-title"
            data-ocid="seller.listing_title_input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            placeholder="Product name"
            className="h-9 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="s-price" className="text-xs">
            Your Price (USD) *
          </Label>
          <Input
            id="s-price"
            type="number"
            step="0.01"
            min="0.01"
            data-ocid="seller.price_input"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
            placeholder="19.99"
            className="h-9 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Category *</Label>
          <select
            data-ocid="seller.listing_category_select"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {listingCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="s-email" className="text-xs">
            Contact Email *
          </Label>
          <Input
            id="s-email"
            type="email"
            value={form.contactEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactEmail: e.target.value }))
            }
            required
            placeholder="seller@email.com"
            className="h-9 text-sm"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="s-desc" className="text-xs">
          Description
        </Label>
        <Textarea
          id="s-desc"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={2}
          placeholder="Describe your product…"
          className="text-sm resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-wa" className="text-xs">
            WhatsApp
          </Label>
          <Input
            id="s-wa"
            value={form.contactWhatsApp}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactWhatsApp: e.target.value }))
            }
            placeholder="+91 98765 43210"
            className="h-9 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="s-ship" className="text-xs">
            Shipping Info
          </Label>
          <Input
            id="s-ship"
            value={form.shippingInfo}
            onChange={(e) =>
              setForm((f) => ({ ...f, shippingInfo: e.target.value }))
            }
            placeholder="e.g. Ships in 7-14 days"
            className="h-9 text-sm"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={submitMutation.isPending}
        data-ocid="seller.listing_submit_button"
        className="w-full gap-2 bg-primary text-primary-foreground"
      >
        {submitMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Package className="w-4 h-4" />
        )}
        Submit Product for Review
      </Button>
    </form>
  );
}

// Buyers workflow section
function BuyersTab() {
  const { data: listings = [], isLoading } = useSellerListings();

  const steps = [
    {
      num: "1",
      icon: "🛍️",
      label: "Browse",
      desc: "Discover trending products",
    },
    { num: "2", icon: "📦", label: "Order", desc: "Place your order easily" },
    { num: "3", icon: "💳", label: "Pay", desc: "Secure UPI payment" },
    { num: "4", icon: "🚚", label: "Delivered", desc: "Seller ships directly" },
  ];

  return (
    <div>
      {/* 4-step workflow */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="relative flex flex-col items-center text-center p-4 rounded-xl bg-muted/50 border border-border/50"
          >
            <div className="text-3xl mb-2">{step.icon}</div>
            <div className="font-display font-bold text-sm text-primary mb-0.5">
              {step.label}
            </div>
            <div className="text-xs text-muted-foreground">{step.desc}</div>
            {i < steps.length - 1 && (
              <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* Marketplace preview */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base">
          Latest Marketplace Listings
        </h3>
        <Link to="/marketplace">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary text-xs"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No marketplace listings yet.{" "}
          <Link to="/marketplace" className="text-primary hover:underline">
            Check back soon!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {listings.slice(0, 3).map((listing) => (
            <Link
              key={listing.id.toString()}
              to="/marketplace/$id"
              params={{ id: listing.id.toString() }}
              className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover transition-shadow group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${listing.id}/400/300`;
                  }}
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {listing.title}
                </p>
                <p className="font-bold text-primary text-sm mt-1">
                  {formatPrice(getDisplayPrice(listing.price))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Link to="/marketplace">
          <Button
            data-ocid="home.browse_button"
            className="gap-2 bg-primary text-primary-foreground"
          >
            <Globe className="w-4 h-4" />
            Browse All Marketplace
          </Button>
        </Link>
        <Link to="/payment">
          <Button
            variant="outline"
            className="gap-2 border-primary/30 text-primary"
          >
            Payment Guide
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: dealOfDayProducts, isLoading: loadingDeals } = useDealOfDay();
  const { data: brands, isLoading: loadingBrands } = useBrands();
  const { data: allProducts } = useProducts();

  const trendingProducts = allProducts?.slice(0, 8) ?? [];
  const amazonProducts =
    allProducts?.filter((p) => p.vendor === "amazon").slice(0, 4) ?? [];
  const globalProducts =
    allProducts?.filter((p) => p.vendor !== "amazon").slice(0, 4) ?? [];

  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("You're subscribed! 🎉", {
      description: "Get daily trending deals in your inbox.",
    });
    setEmail("");
  };

  return (
    <main>
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section
        data-ocid="home.hero_section"
        className="relative overflow-hidden min-h-[560px] flex items-center hero-gradient-animated"
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"
          style={{ background: "oklch(0.38 0.18 250 / 0.4)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"
          style={{ background: "oklch(0.72 0.20 60 / 0.15)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 text-accent text-xs font-semibold mb-6 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered · 100+ Daily Deals · 5 Global Sources
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 animate-fade-in">
              Discover{" "}
              <span
                className="inline-block"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.72 0.20 60), oklch(0.80 0.18 50))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Trending Deals
              </span>{" "}
              Daily
            </h1>
            <p className="text-white/60 text-lg md:text-xl mb-1 leading-relaxed animate-fade-in-delay max-w-2xl">
              Morgen Segen Technologies – AI Product Discovery Marketplace
              powered by DealFusion.
            </p>
            <p className="text-white/40 text-sm mb-8 leading-relaxed animate-fade-in-delay max-w-2xl">
              Our AI scans Amazon, AliExpress, CJ Dropshipping, DHgate & TikTok
              to surface the best trending products before they go viral.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-delay-2">
              <Button
                data-ocid="home.browse_button"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-orange gap-2 font-bold text-base"
                onClick={() => void navigate({ to: "/products" })}
              >
                <ShoppingBag className="w-5 h-5" />
                Explore Trending
              </Button>
              <Button
                data-ocid="home.trending_button"
                size="lg"
                className="trending-now-btn gap-2 font-bold text-base"
                onClick={() => void navigate({ to: "/trending" })}
              >
                <TrendingUp className="w-5 h-5" />
                Trending Now
              </Button>
            </div>

            {/* Stats strip */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl">
              {[
                { label: "Daily Deals", value: "100+" },
                { label: "Sources", value: "5" },
                { label: "AI-Powered", value: "✓" },
                { label: "Global Sellers", value: "50+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-extrabold text-2xl text-accent">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-xs mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Shortcuts ──────────────────────────────────── */}
      <section
        data-ocid="home.categories_section"
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
          {CATEGORY_SHORTCUTS.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path as "/trending"}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b ${cat.color} border border-border/50 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI Discovery Engine section ──────────────────────────── */}
      <section className="bg-gradient-to-br from-secondary to-secondary/90 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white mb-1">
                AI Discovery Engine
              </h2>
              <p className="text-white/50 text-sm">
                Automatically scans 5 sources daily for viral trending products
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: "🛒", label: "Amazon", color: "#FF9900" },
              { icon: "🏮", label: "AliExpress", color: "#e62e04" },
              { icon: "📦", label: "CJ Dropship", color: "#2980b9" },
              { icon: "🐉", label: "DHgate", color: "#c0392b" },
              { icon: "🎵", label: "TikTok", color: "#010101" },
            ].map((source) => (
              <div
                key={source.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3"
              >
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {source.label}
                  </p>
                  <p className="text-white/40 text-xs">Live tracking</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* ── Trending Products Carousel ─────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-2xl">
                Trending Products
              </h2>
            </div>
            <Link to="/trending">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-primary text-xs"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
            {trendingProducts.map((product) => (
              <Link
                key={product.id.toString()}
                to="/products/$id"
                params={{ id: product.id.toString() }}
                className="shrink-0 w-52 bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group"
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
                <div className="p-3">
                  <p className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${i <= Math.round(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="font-bold text-primary text-sm mt-1">
                    {formatPrice(product.price)}
                  </p>
                  {product.vendor === "amazon" && (
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        className="w-full h-7 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        Buy on Amazon
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Deal of the Day ────────────────────────────────────── */}
        <section data-ocid="home.deal_section">
          <div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.05 255) 0%, oklch(0.25 0.08 255) 100%)",
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
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🔥</span>
                    <h2 className="font-display font-bold text-2xl text-white">
                      Deal of the Day
                    </h2>
                  </div>
                  <DealCountdown />
                </div>
                <Link to="/trending">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-white/60 hover:text-accent text-xs"
                  >
                    All deals <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {loadingDeals ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-xl p-4 flex gap-4"
                    >
                      <Skeleton className="w-32 h-32 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-3 w-2/3 bg-white/10" />
                        <Skeleton className="h-8 w-28 bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dealOfDayProducts && dealOfDayProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dealOfDayProducts.slice(0, 2).map((product) => (
                    <div
                      key={product.id.toString()}
                      className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl overflow-hidden flex group transition-all"
                    >
                      <div className="w-36 shrink-0 overflow-hidden">
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
                      <div className="p-4 flex flex-col flex-1 gap-2">
                        <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                          🔥 LIMITED DEAL
                        </span>
                        <p className="font-semibold text-white text-sm line-clamp-2 leading-snug">
                          {product.title}
                        </p>
                        <p className="text-white/40 text-xs">
                          by {product.brand}
                        </p>
                        <StarRating rating={product.rating} />
                        <div className="mt-auto">
                          <div className="font-display font-extrabold text-xl text-accent mb-2">
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
                                className="w-full text-xs border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40"
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
                                className="w-full text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                              >
                                Buy Now
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-center py-8 text-sm">
                  No deals today. Check back tomorrow!
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Amazon Featured Deals ─────────────────────────────── */}
        <section data-ocid="home.featured_section">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <h2 className="font-display font-bold text-2xl">
                Amazon Featured Deals
              </h2>
            </div>
            <Link to="/amazon-deals">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-primary text-xs"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl border overflow-hidden"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : amazonProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {amazonProducts.map((product) => (
                <div
                  key={product.id.toString()}
                  className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group"
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
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="bg-[#FF9900]/20 text-[#FF9900] text-[9px] font-bold px-1.5 py-0.5 rounded">
                        AMAZON
                      </span>
                    </div>
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {product.title}
                    </p>
                    <StarRating rating={product.rating} />
                    <div className="font-bold text-primary mt-2 mb-3">
                      {formatPrice(product.price)}
                    </div>
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="w-full gap-1 text-xs"
                        style={{
                          backgroundColor: "#FF9900",
                          color: "white",
                        }}
                      >
                        Buy on Amazon
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Global Supplier Deals ──────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h2 className="font-display font-bold text-2xl">
                Global Supplier Deals
              </h2>
            </div>
            <Link to="/global-deals">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-primary text-xs"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {globalProducts.map((product) => (
              <div
                key={product.id.toString()}
                className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group"
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
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1 capitalize">
                    {product.vendor}
                  </p>
                  <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {product.title}
                  </p>
                  <div className="font-bold text-primary mb-3">
                    {formatPrice(getDisplayPrice(product.price))}
                  </div>
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-white"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Seller / Buyer Tabs ───────────────────────────────── */}
        <section className="bg-muted/30 rounded-2xl border border-border/50 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-1">
              Join DealFusion Market
            </h2>
            <p className="text-muted-foreground text-sm">
              Whether you're buying or selling, DealFusion Market has you
              covered.
            </p>
          </div>

          <Tabs defaultValue="buyers">
            <TabsList className="mb-6 bg-background">
              <TabsTrigger value="buyers" className="gap-2">
                🛍️ For Buyers
              </TabsTrigger>
              <TabsTrigger value="sellers" className="gap-2">
                <Store className="w-4 h-4" />
                For Sellers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="buyers">
              <BuyersTab />
            </TabsContent>
            <TabsContent value="sellers">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    List Your Products
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Enter your price and we'll handle the marketing. Buyers
                    contact you directly for shipping.
                  </p>
                  <SellerSubmitForm />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-4">
                    How It Works
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: "📋",
                        title: "Submit Your Products",
                        desc: "Fill out the simple listing form with product details and your price.",
                      },
                      {
                        icon: "✅",
                        title: "Get Approved",
                        desc: "Our team reviews and publishes your listing on the platform.",
                      },
                      {
                        icon: "📞",
                        title: "Buyer Contacts You",
                        desc: "Interested buyers reach out via email or WhatsApp directly.",
                      },
                      {
                        icon: "🚢",
                        title: "You Ship & Earn",
                        desc: "Handle packaging and shipping. Receive payment directly.",
                      },
                    ].map((step) => (
                      <div
                        key={step.title}
                        className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/50"
                      >
                        <span className="text-xl shrink-0">{step.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{step.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/seller-register" className="block mt-4">
                    <Button
                      data-ocid="home.sell_cta_button"
                      className="w-full gap-2 bg-primary text-primary-foreground"
                    >
                      <Store className="w-4 h-4" />
                      Register as a Seller
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ── How It Works (Dropship Workflow) ─────────────────── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl mb-2">
              How DealFusion Market Works
            </h2>
            <p className="text-muted-foreground text-sm">
              A seamless 5-step dropship workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                icon: "👀",
                title: "Customer Visits",
                desc: "Discovers trending products on DealFusion Market",
              },
              {
                num: "02",
                icon: "🛒",
                title: "Places Order",
                desc: "Pays securely via UPI or card",
              },
              {
                num: "03",
                icon: "📨",
                title: "Order Forwarded",
                desc: "Details sent directly to the supplier",
              },
              {
                num: "04",
                icon: "📦",
                title: "Supplier Ships",
                desc: "Product shipped directly to customer",
              },
              {
                num: "05",
                icon: "💰",
                title: "Margin Earned",
                desc: "Selling price minus supplier cost",
              },
            ].map((step, i) => (
              <div key={step.num} className="relative">
                <div className="bg-card rounded-xl border border-border/50 p-5 text-center hover:shadow-card-hover transition-shadow h-full">
                  <div className="font-mono text-xs text-primary/50 mb-2">
                    {step.num}
                  </div>
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="font-display font-bold text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Brands ────────────────────────────────────────── */}
        <section data-ocid="home.brands_section">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <h2 className="font-display font-bold text-2xl">Top Brands</h2>
          </div>

          {loadingBrands ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="shrink-0 w-28 bg-card rounded-xl p-4 border flex flex-col items-center gap-2"
                >
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))}
            </div>
          ) : brands && brands.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
              {brands.map((brand) => (
                <a
                  key={brand.id.toString()}
                  href={brand.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-32 bg-card rounded-xl p-4 border border-border/50 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-9 h-9 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="font-semibold text-xs text-center group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                </a>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Newsletter ────────────────────────────────────────── */}
        <section
          data-ocid="home.newsletter_section"
          className="rounded-2xl overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.38 0.18 250) 0%, oklch(0.28 0.16 260) 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white mb-3">
              Get Daily Trending Deals
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Join 10,000+ deal hunters. We scan 100+ products daily and send
              the best ones to your inbox.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-accent focus-visible:border-accent"
              />
              <Button
                type="submit"
                data-ocid="home.newsletter_submit_button"
                className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
