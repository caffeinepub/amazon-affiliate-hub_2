import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Package,
  ShoppingCart,
  Star,
  Tag,
} from "lucide-react";
import { useProductById } from "../hooks/useQueries";
import { formatPrice, getVendorConfig } from "../utils/vendorUtils";

function StarRating({
  rating,
  size = "md",
}: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sz =
    size === "lg" ? "w-6 h-6" : size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sz} ${i <= Math.round(rating) ? "fill-[#FF9900] text-[#FF9900]" : "fill-muted text-muted-foreground"}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">
        {rating.toFixed(1)} / 5.0
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const id = (params as { id?: string }).id;
  const productId = id ? BigInt(id) : null;
  const { data: product, isLoading } = useProductById(productId);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display font-bold text-2xl mb-2">
          Product Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This product doesn't exist or has been removed.
        </p>
        <Button onClick={() => void navigate({ to: "/products" })}>
          Browse Products
        </Button>
      </main>
    );
  }

  const vendor = getVendorConfig(product.vendor);

  return (
    <main
      className="container mx-auto px-4 py-8"
      data-ocid="product.detail_card"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void navigate({ to: "/products" })}
          className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <span className="text-muted-foreground/50">/</span>
        <Link
          to="/products"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Products
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-sm text-foreground truncate max-w-xs">
          {product.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-card">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://picsum.photos/seed/${product.id}/600/600`;
              }}
            />
          </div>
          {product.dealOfDay && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
              🔥 Deal of the Day
            </div>
          )}
          {product.featured && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Top Pick
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          {/* Vendor + category badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: vendor.color }}
            >
              {vendor.label}
            </span>
            <Badge variant="secondary" className="gap-1">
              <Tag className="w-3 h-3" />
              {product.category}
            </Badge>
          </div>

          <h1 className="font-display font-bold text-2xl md:text-3xl leading-snug">
            {product.title}
          </h1>

          {product.brand && (
            <p className="text-muted-foreground">
              Sold by{" "}
              <span className="font-semibold text-foreground">
                {product.brand}
              </span>
            </p>
          )}

          <StarRating rating={product.rating} size="md" />

          {/* Price */}
          <div className="flex items-baseline gap-3 py-3 border-t border-b border-border/50">
            <span className="font-display font-extrabold text-4xl text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              via {vendor.label}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mt-4">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              data-ocid="product.buy_button"
            >
              <Button
                size="lg"
                className="w-full gap-2 text-base font-semibold shadow-orange"
                style={{ backgroundColor: vendor.color, color: "white" }}
              >
                <ShoppingCart className="w-5 h-5" />
                Buy on {vendor.label}
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: "🔒", label: "Secure Link" },
              { icon: "↩️", label: "Easy Returns" },
              { icon: "⚡", label: "Fast Delivery" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="bg-muted rounded-xl py-3 px-2 flex flex-col items-center gap-1 text-center"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
