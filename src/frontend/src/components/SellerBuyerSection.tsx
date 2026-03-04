import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  LogIn,
  Package,
  ShoppingCart,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSellerListings, useSubmitSellerListing } from "../hooks/useQueries";

// ── Price formatter (INR) ─────────────────────────────────────────────────────
function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// ── Seller Form ───────────────────────────────────────────────────────────────
function SellerTab() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const submit = useSubmitSellerListing();

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    category: "",
    shippingInfo: "",
    contactEmail: "",
    contactWhatsApp: "",
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCategoryChange = (value: string) =>
    setForm((prev) => ({ ...prev, category: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    submit.mutate({
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      price: Number.parseFloat(form.price) || 0,
      category: form.category,
      shippingInfo: form.shippingInfo,
      contactEmail: form.contactEmail,
      contactWhatsApp: form.contactWhatsApp,
    });
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submit.isSuccess) {
    return (
      <div
        data-ocid="seller.success_state"
        className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="font-display font-bold text-2xl text-foreground mb-3">
          Listing Submitted!
        </h3>
        <p className="text-muted-foreground max-w-sm leading-relaxed mb-6">
          Your product has been submitted for review. We'll notify you once it's
          live on the marketplace.
        </p>
        <Button
          variant="outline"
          onClick={() => submit.reset()}
          className="gap-2"
        >
          <Package className="w-4 h-4" />
          List Another Product
        </Button>
      </div>
    );
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Store className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          Sign in to list your product
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
          Create your free seller account to start listing products and reaching
          buyers on our marketplace.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {isLoggingIn ? "Signing in…" : "Sign In to List"}
        </Button>
      </div>
    );
  }

  // ── Listing form ───────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Product Title */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="sel-title" className="text-sm font-medium">
            Product Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sel-title"
            data-ocid="seller.title_input"
            placeholder="e.g. Premium Stainless Steel Water Bottle"
            value={form.title}
            onChange={set("title")}
            required
            className="bg-background/80 h-11"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="sel-desc" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="sel-desc"
            data-ocid="seller.description_textarea"
            placeholder="Describe your product — material, size, features, condition…"
            value={form.description}
            onChange={set("description")}
            required
            rows={3}
            className="bg-background/80 resize-none"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <Label htmlFor="sel-img" className="text-sm font-medium">
            Image URL
          </Label>
          <Input
            id="sel-img"
            data-ocid="seller.imageurl_input"
            placeholder="https://example.com/product.jpg"
            value={form.imageUrl}
            onChange={set("imageUrl")}
            className="bg-background/80 h-11"
          />
        </div>

        {/* Your Price */}
        <div className="space-y-1.5">
          <Label htmlFor="sel-price" className="text-sm font-medium">
            Your Price (₹) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              ₹
            </span>
            <Input
              id="sel-price"
              data-ocid="seller.price_input"
              type="number"
              min="1"
              step="0.01"
              placeholder="300"
              value={form.price}
              onChange={set("price")}
              required
              className="bg-background/80 h-11 pl-7"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="sel-cat" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.category}
            onValueChange={handleCategoryChange}
            required
          >
            <SelectTrigger
              id="sel-cat"
              data-ocid="seller.category_select"
              className="bg-background/80 h-11"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shipping Info */}
        <div className="space-y-1.5">
          <Label htmlFor="sel-ship" className="text-sm font-medium">
            Shipping Info
          </Label>
          <Textarea
            id="sel-ship"
            data-ocid="seller.shipping_textarea"
            placeholder="e.g. Ships within 7-10 days via standard courier. Packaging included."
            value={form.shippingInfo}
            onChange={set("shippingInfo")}
            rows={2}
            className="bg-background/80 resize-none text-sm"
          />
        </div>

        {/* Contact Email */}
        <div className="space-y-1.5">
          <Label htmlFor="sel-email" className="text-sm font-medium">
            Contact Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sel-email"
            data-ocid="seller.email_input"
            type="email"
            placeholder="seller@example.com"
            value={form.contactEmail}
            onChange={set("contactEmail")}
            required
            className="bg-background/80 h-11"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <Label htmlFor="sel-wa" className="text-sm font-medium">
            WhatsApp Number
          </Label>
          <Input
            id="sel-wa"
            data-ocid="seller.whatsapp_input"
            placeholder="+91 98765 43210"
            value={form.contactWhatsApp}
            onChange={set("contactWhatsApp")}
            className="bg-background/80 h-11"
          />
          <p className="text-[11px] text-muted-foreground">
            Include country code (e.g. +91 for India)
          </p>
        </div>
      </div>

      {submit.isError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">
          Submission failed. Please try again.
        </p>
      )}

      <div className="pt-1">
        <Button
          type="submit"
          data-ocid="seller.submit_button"
          disabled={submit.isPending}
          className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          {submit.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <BadgeCheck className="w-4 h-4" />
              Submit for Review
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Your listing will be reviewed within 24–48 hours before going live.
        </p>
      </div>
    </form>
  );
}

// ── Buyer Tab ─────────────────────────────────────────────────────────────────
const BUYER_STEPS = [
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    step: "1",
    title: "Browse Products",
    desc: "Explore curated listings from verified sellers",
  },
  {
    icon: <Package className="w-5 h-5" />,
    step: "2",
    title: "Place Your Order",
    desc: "Select your item and confirm your order details",
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    step: "3",
    title: "Pay via UPI",
    desc: "Secure, instant payment through any UPI app",
  },
  {
    icon: <Truck className="w-5 h-5" />,
    step: "4",
    title: "Get Delivered",
    desc: "Product ships directly to your doorstep",
  },
];

function BuyerTab() {
  const { data: listings, isLoading } = useSellerListings();

  return (
    <div className="space-y-8">
      {/* Workflow steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BUYER_STEPS.map((s) => (
          <div
            key={s.step}
            className="relative flex flex-col items-center text-center p-4 rounded-2xl bg-background border border-border/70 shadow-xs group hover:border-primary/40 hover:shadow-card transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              {s.icon}
            </div>
            <span className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground/60 font-bold">
              0{s.step}
            </span>
            <p className="font-heading font-semibold text-sm text-foreground mb-1">
              {s.title}
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Listings grid */}
      {isLoading ? (
        <div
          data-ocid="buyer.loading_state"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border bg-card overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div
          data-ocid="buyer.listings_list"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {listings.slice(0, 8).map((listing, idx) => (
            <div
              key={listing.id.toString()}
              data-ocid={`buyer.listing.item.${idx + 1}`}
              className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-44 bg-muted shrink-0">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${listing.id}/400/300`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Package className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                )}
                {listing.category && (
                  <Badge className="absolute top-2 left-2 text-[10px] px-2 py-0.5 bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">
                    {listing.category}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="font-heading font-semibold text-sm leading-snug line-clamp-2 text-foreground">
                  {listing.title}
                </p>
                <div className="mt-auto space-y-2">
                  <div className="font-display font-bold text-lg text-primary">
                    {formatINR(listing.price * 1.5)}
                  </div>
                  <Link
                    to="/marketplace/$id"
                    params={{ id: listing.id.toString() }}
                    className="block"
                  >
                    <Button
                      size="sm"
                      className="w-full text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          data-ocid="buyer.empty_state"
          className="flex flex-col items-center justify-center py-14 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">
            No listings yet
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Seller products will appear here once approved. Check back soon!
          </p>
        </div>
      )}

      {/* Browse all */}
      <div className="flex justify-center">
        <Link to="/marketplace">
          <Button
            data-ocid="buyer.browse_button"
            size="lg"
            variant="outline"
            className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            Browse All Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function SellerBuyerSection() {
  return (
    <section
      data-ocid="home.seller_buyer_section"
      className="relative py-14 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.96 0.01 240) 0%, oklch(0.98 0.005 50) 50%, oklch(0.96 0.01 240) 100%)",
      }}
    >
      {/* Decorative accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 50%, oklch(0.68 0.18 48 / 0.07) 0%, transparent 50%), radial-gradient(circle at 85% 50%, oklch(0.45 0.15 240 / 0.07) 0%, transparent 50%)",
        }}
      />
      {/* Top + bottom border lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.68 0.18 48 / 0.3), transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.45 0.15 240 / 0.3), transparent)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-semibold mb-4">
            <Store className="w-3.5 h-3.5" />
            Sellers & Buyers Portal
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground leading-tight">
            Buy or Sell on{" "}
            <span className="text-primary">Morgensegen Products</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-base max-w-lg mx-auto">
            List your products for review or browse marketplace listings from
            verified sellers.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="buyer" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8 h-14 rounded-2xl bg-background border border-border/60 shadow-card p-1.5 gap-1">
            <TabsTrigger
              value="seller"
              data-ocid="home.seller_tab"
              className="rounded-xl h-full text-base font-semibold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-orange transition-all duration-200"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">For Sellers</span>
              <span className="sm:hidden">Sell</span>
            </TabsTrigger>
            <TabsTrigger
              value="buyer"
              data-ocid="home.buyer_tab"
              className="rounded-xl h-full text-base font-semibold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-orange transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">For Buyers</span>
              <span className="sm:hidden">Buy</span>
            </TabsTrigger>
          </TabsList>

          {/* Seller tab content */}
          <TabsContent value="seller">
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    List a Product
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your product for marketplace review
                  </p>
                </div>
              </div>
              <SellerTab />
            </div>
          </TabsContent>

          {/* Buyer tab content */}
          <TabsContent value="buyer">
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Marketplace Listings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse products from verified sellers with direct delivery
                  </p>
                </div>
              </div>
              <BuyerTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
