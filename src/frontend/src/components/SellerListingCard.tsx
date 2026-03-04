import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Package, Store } from "lucide-react";
import type { SellerListing, SellerProfile } from "../backend";
import { formatPrice } from "../utils/vendorUtils";

interface SellerListingCardProps {
  listing: SellerListing;
  sellerProfile?: SellerProfile;
  index: number;
}

export default function SellerListingCard({
  listing,
  sellerProfile,
  index,
}: SellerListingCardProps) {
  const retailPrice = listing.price * 1.5;

  return (
    <div
      data-ocid={`marketplace.listing.card.${index}`}
      className="group bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border/50 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-[4/3]">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://picsum.photos/seed/${listing.id}/400/300`;
          }}
        />
        {/* Marketplace badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm bg-rose-600">
          Marketplace
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start gap-2">
          <h3 className="font-heading font-semibold text-sm leading-snug line-clamp-2 text-card-foreground flex-1">
            {listing.title}
          </h3>
        </div>

        <Badge variant="secondary" className="self-start text-[10px]">
          {listing.category}
        </Badge>

        {/* Seller */}
        {sellerProfile && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Store className="w-3 h-3 shrink-0" />
            <span className="truncate">{sellerProfile.storeName}</span>
          </div>
        )}

        {/* Shipping info */}
        {listing.shippingInfo && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            📦 {listing.shippingInfo}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="font-display font-bold text-xl text-primary">
            {formatPrice(retailPrice)}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Platform price · seller ships directly
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <Link
            to="/marketplace/$id"
            params={{ id: listing.id.toString() }}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              data-ocid={`marketplace.listing.view_button.${index}`}
              className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View Details
            </Button>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                data-ocid={`marketplace.listing.contact_button.${index}`}
                className="flex-1 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <MessageCircle className="w-3 h-3" />
                Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-display">
                  Contact Seller
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <p className="text-sm text-muted-foreground">
                  Reach out directly to the seller for{" "}
                  <span className="font-semibold text-foreground">
                    {listing.title}
                  </span>
                  . Shipping is arranged directly with them.
                </p>

                {listing.contactEmail && (
                  <a
                    href={`mailto:${listing.contactEmail}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group/email"
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-800/30 transition-colors group/wa"
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

                {!listing.contactEmail && !listing.contactWhatsApp && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    No contact info provided by seller.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
