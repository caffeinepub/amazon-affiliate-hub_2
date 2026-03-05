import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ExternalLink, Star } from "lucide-react";
import { useProducts } from "../hooks/useQueries";
import { formatPrice, getDisplayPrice } from "../utils/priceUtils";

interface CategoryPageProps {
  title: string;
  emoji: string;
  categories: string[];
  description: string;
  gradient: string;
}

function CategoryPageLayout({
  title,
  emoji,
  categories,
  description,
  gradient,
}: CategoryPageProps) {
  const { data: allProducts, isLoading } = useProducts();

  const products = (allProducts ?? []).filter((p) =>
    categories.some((c) => p.category.toLowerCase() === c.toLowerCase()),
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ background: gradient }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{emoji}</span>
            <h1 className="font-display font-extrabold text-3xl text-white">
              {title}
            </h1>
          </div>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <div key={k} className="bg-card rounded-xl border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <span className="text-5xl block mb-4">{emoji}</span>
          <p className="font-semibold mb-2">No {title} products yet</p>
          <p className="text-sm mb-4">
            Our AI is scanning for trending products in this category.
          </p>
          <Link to="/trending">
            <Button className="gap-2">
              Browse All Trending
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-5">
            {products.length} product{products.length !== 1 ? "s" : ""} in{" "}
            {title}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const displayPrice =
                product.vendor === "amazon"
                  ? product.price
                  : getDisplayPrice(product.price);
              return (
                <div
                  key={product.id.toString()}
                  className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
                >
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
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
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link
                      to="/products/$id"
                      params={{ id: product.id.toString() }}
                    >
                      <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-2">
                        {product.title}
                      </p>
                    </Link>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="font-bold text-primary mb-3">
                      {formatPrice(displayPrice)}
                    </div>
                    <div className="mt-auto">
                      {product.vendor === "amazon" ? (
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
                      ) : (
                        <Link
                          to="/products/$id"
                          params={{ id: product.id.toString() }}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            View Details
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

export function SmartGadgetsPage() {
  return (
    <CategoryPageLayout
      title="Smart Gadgets"
      emoji="⚡"
      categories={["Smart Gadgets", "Electronics"]}
      description="The latest AI-powered gadgets, smart home devices, and tech innovations trending right now."
      gradient="linear-gradient(135deg, oklch(0.30 0.15 250) 0%, oklch(0.24 0.12 260) 100%)"
    />
  );
}

export function KidsCornerPage() {
  return (
    <CategoryPageLayout
      title="Kids Corner"
      emoji="🧸"
      categories={["Kids Corner", "Toys"]}
      description="Educational toys, games, and fun products for kids of all ages."
      gradient="linear-gradient(135deg, oklch(0.60 0.15 330) 0%, oklch(0.50 0.12 340) 100%)"
    />
  );
}

export function KitchenToolsPage() {
  return (
    <CategoryPageLayout
      title="Kitchen Tools"
      emoji="🍳"
      categories={["Kitchen Tools", "Home & Kitchen"]}
      description="Transform your cooking with the latest kitchen gadgets, appliances, and tools."
      gradient="linear-gradient(135deg, oklch(0.60 0.15 50) 0%, oklch(0.50 0.12 40) 100%)"
    />
  );
}

export function FitnessPage() {
  return (
    <CategoryPageLayout
      title="Fitness & Lifestyle"
      emoji="💪"
      categories={["Fitness & Lifestyle", "Sports"]}
      description="Gear up with the best fitness equipment, activewear, and wellness products."
      gradient="linear-gradient(135deg, oklch(0.50 0.15 150) 0%, oklch(0.42 0.12 160) 100%)"
    />
  );
}
