import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Globe,
  Mail,
  MessageCircle,
  Package,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import { useSellerListingById } from "../hooks/useQueries";
import { formatPrice } from "../utils/vendorUtils";

export default function MarketplaceDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const id = (params as { id?: string }).id;
  const listingId = id ? BigInt(id) : null;
  const { data: listing, isLoading } = useSellerListingById(listingId);

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

  if (!listing) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display font-bold text-2xl mb-2">
          Listing Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This listing doesn't exist or has been removed.
        </p>
        <Button onClick={() => void navigate({ to: "/marketplace" })}>
          Browse Marketplace
        </Button>
      </main>
    );
  }

  const retailPrice = listing.price * 1.5;

  return (
    <main
      data-ocid="marketplace.detail_card"
      className="container mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void navigate({ to: "/marketplace" })}
          className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <span className="text-muted-foreground/50">/</span>
        <Link
          to="/marketplace"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Marketplace
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-sm text-foreground truncate max-w-xs">
          {listing.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Listing image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-card">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://picsum.photos/seed/${listing.id}/600/600`;
              }}
            />
          </div>
          <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Marketplace
          </div>
        </div>

        {/* Listing info */}
        <div className="flex flex-col gap-4">
          {/* Category badge */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Tag className="w-3 h-3" />
              {listing.category}
            </Badge>
          </div>

          <h1 className="font-display font-bold text-2xl md:text-3xl leading-snug">
            {listing.title}
          </h1>

          {/* Price block */}
          <div className="flex flex-col gap-1 py-4 border-t border-b border-border/50">
            <span className="font-display font-extrabold text-4xl text-primary">
              {formatPrice(retailPrice)}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                All prices include platform margin
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Shipping info */}
          {listing.shippingInfo && (
            <div className="bg-muted/50 rounded-xl p-4 flex gap-3">
              <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-heading font-semibold text-sm mb-1">
                  Shipping Information
                </div>
                <p className="text-sm text-muted-foreground">
                  {listing.shippingInfo}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Packaging and delivery are handled directly by the seller.
                </p>
              </div>
            </div>
          )}

          {/* Platform info */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="font-heading font-semibold text-sm mb-1 text-primary">
              How It Works
            </div>
            <p className="text-xs text-muted-foreground">
              This listing is sold through our marketplace. Contact the seller
              directly to arrange payment and shipping. Packaging and delivery
              are handled by the seller.
            </p>
          </div>

          {/* Seller section */}
          <div className="border border-border/50 rounded-xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border/30">
              <Store className="w-4 h-4 text-primary" />
              <span className="font-heading font-semibold text-sm">
                Contact Seller
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Reach out to the seller directly to arrange payment, packaging,
                and delivery.
              </p>

              {listing.contactEmail && (
                <a
                  href={`mailto:${listing.contactEmail}`}
                  data-ocid="marketplace.contact_email_button"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group/email w-full"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium group-hover/email:text-primary transition-colors">
                      {listing.contactEmail}
                    </div>
                  </div>
                </a>
              )}

              {listing.contactWhatsApp && (
                <a
                  href={`https://wa.me/${listing.contactWhatsApp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="marketplace.contact_whatsapp_button"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-800/30 transition-colors group/wa w-full"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-600/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      WhatsApp
                    </div>
                    <div className="text-sm font-medium text-emerald-400 group-hover/wa:text-emerald-300 transition-colors">
                      {listing.contactWhatsApp}
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
