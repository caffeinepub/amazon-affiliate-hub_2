import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Star } from "lucide-react";
import type { Product } from "../backend";
import {
  computeTrendScore,
  getProductBadge,
  getProductTrendSignals,
} from "../utils/trendUtils";
import { formatPrice, getVendorConfig } from "../utils/vendorUtils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? "fill-[#FF9900] text-[#FF9900]"
              : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function TrendBadgeOverlay({
  trendScore,
  dealOfDay,
  featured,
}: {
  trendScore: number;
  dealOfDay: boolean;
  featured: boolean;
}) {
  const badge = getProductBadge(trendScore, dealOfDay, featured);
  if (!badge) return null;

  const styles: Record<string, string> = {
    "Trending Now": "bg-purple-600 text-white",
    "Hot Deal": "bg-amber-500 text-white",
    "Flash Deal": "bg-red-600 text-white animate-pulse",
    "Best Seller": "bg-blue-600 text-white",
  };

  const icons: Record<string, string> = {
    "Trending Now": "🔥",
    "Hot Deal": "⚡",
    "Flash Deal": "⚡",
    "Best Seller": "⭐",
  };

  return (
    <div
      className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold shadow-sm flex items-center gap-0.5 ${styles[badge] ?? "bg-gray-600 text-white"}`}
    >
      <span>{icons[badge]}</span>
      <span>{badge}</span>
    </div>
  );
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const vendor = getVendorConfig(product.vendor);
  const signals = getProductTrendSignals(product.id);
  const trendScore = computeTrendScore(signals);

  return (
    <div
      data-ocid={`products.item.${index}`}
      className="group bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border/50 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-[4/3]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://picsum.photos/seed/${product.id}/400/300`;
          }}
        />
        {/* Vendor badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
          style={{ backgroundColor: vendor.color }}
        >
          {vendor.label}
        </div>
        {/* Trend badge overlay (top-right) */}
        <TrendBadgeOverlay
          trendScore={trendScore}
          dealOfDay={product.dealOfDay}
          featured={product.featured}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-sm leading-snug line-clamp-2 text-card-foreground flex-1">
            {product.title}
          </h3>
        </div>

        {product.brand && (
          <p className="text-xs text-muted-foreground">by {product.brand}</p>
        )}

        <StarRating rating={product.rating} />

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="text-lg font-display font-bold text-primary">
            {formatPrice(product.price)}
          </span>
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
              className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View Details
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
              className="w-full text-xs gap-1"
              style={{ backgroundColor: vendor.color, color: "white" }}
              data-ocid="product.buy_button"
            >
              Buy <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// Badge helper export
export { Badge };
export function VendorBadge({ vendor }: { vendor: string }) {
  const config = getVendorConfig(vendor);
  return (
    <Badge
      className="text-white text-[10px] font-bold"
      style={{ backgroundColor: config.color }}
    >
      {config.label}
    </Badge>
  );
}
