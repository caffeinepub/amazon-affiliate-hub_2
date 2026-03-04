import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Loader2,
  Package,
  Plus,
  Save,
  Shield,
  Store,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SellerListingStatus } from "../backend";
import { CATEGORIES } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteSellerListing,
  useMySellerListings,
  useMySellerProfile,
  useRegisterSellerProfile,
  useSubmitSellerListing,
} from "../hooks/useQueries";
import { formatPrice } from "../utils/vendorUtils";

const LISTING_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

function statusBadge(status: SellerListingStatus) {
  const map: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending Review",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    approved: {
      label: "Approved",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/20 text-red-400 border-red-500/30",
    },
  };
  const cfg = map[status as string] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Register Store Form ────────────────────────────────────────────────────────

function RegisterStoreForm() {
  const registerMutation = useRegisterSellerProfile();
  const [form, setForm] = useState({
    storeName: "",
    description: "",
    contactEmail: "",
    contactWhatsApp: "",
    logoUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(form);
      toast.success("Store registered successfully!");
    } catch {
      toast.error("Failed to register store");
    }
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      data-ocid="seller.register_form"
      onSubmit={(e) => void handleSubmit(e)}
      className="bg-muted/50 rounded-xl p-6 border space-y-4 max-w-lg"
    >
      <div>
        <h3 className="font-display font-semibold text-lg mb-1">
          Register Your Store
        </h3>
        <p className="text-sm text-muted-foreground">
          Set up your seller profile to start listing products.
        </p>
      </div>
      <div>
        <Label htmlFor="sp-storeName">Store Name *</Label>
        <Input
          id="sp-storeName"
          data-ocid="seller.store_name_input"
          value={form.storeName}
          onChange={(e) => set("storeName", e.target.value)}
          required
          placeholder="My Chinese Shop"
        />
      </div>
      <div>
        <Label htmlFor="sp-desc">Store Description</Label>
        <Textarea
          id="sp-desc"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Tell buyers about your store and products…"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sp-email">Contact Email *</Label>
          <Input
            id="sp-email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            required
            placeholder="seller@example.com"
          />
        </div>
        <div>
          <Label htmlFor="sp-wa">WhatsApp Number</Label>
          <Input
            id="sp-wa"
            value={form.contactWhatsApp}
            onChange={(e) => set("contactWhatsApp", e.target.value)}
            placeholder="+86 123 456 7890"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="sp-logo">Logo URL (optional)</Label>
        <Input
          id="sp-logo"
          value={form.logoUrl}
          onChange={(e) => set("logoUrl", e.target.value)}
          placeholder="https://…"
        />
      </div>
      <Button
        type="submit"
        disabled={registerMutation.isPending}
        data-ocid="seller.submit_button"
        className="gap-2"
      >
        {registerMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Register Store
      </Button>
    </form>
  );
}

// ── Submit Listing Form ────────────────────────────────────────────────────────

function SubmitListingForm() {
  const submitMutation = useSubmitSellerListing();
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
      toast.success("Listing submitted for review!");
      setForm({
        title: "",
        description: "",
        imageUrl: "",
        price: "",
        category: "Electronics",
        shippingInfo: "",
        contactEmail: "",
        contactWhatsApp: "",
      });
    } catch {
      toast.error("Failed to submit listing");
    }
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const previewPrice = Number.parseFloat(form.price) || 0;

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 max-w-xl">
      {/* Note */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <div className="font-semibold text-primary mb-1 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          How it works
        </div>
        <p className="text-muted-foreground">
          Your listing will be reviewed by our team. Once approved, it will
          appear on the marketplace. The retail price shown to buyers will be
          your price + 50% platform margin.
        </p>
        {previewPrice > 0 && (
          <p className="mt-2 text-foreground font-medium">
            Your price {formatPrice(previewPrice)} → Retail price{" "}
            <span className="text-primary">
              {formatPrice(previewPrice * 1.5)}
            </span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="lf-title">Title *</Label>
        <Input
          id="lf-title"
          data-ocid="seller.listing_title_input"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          placeholder="Product title"
        />
      </div>

      <div>
        <Label htmlFor="lf-desc">Description</Label>
        <Textarea
          id="lf-desc"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Describe your product…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="lf-price">Base Price (USD) *</Label>
          <Input
            id="lf-price"
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
            placeholder="19.99"
          />
        </div>
        <div>
          <Label>Category *</Label>
          <Select
            value={form.category}
            onValueChange={(v) => set("category", v)}
          >
            <SelectTrigger data-ocid="seller.listing_category_select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LISTING_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="lf-img">Image URL</Label>
        <Input
          id="lf-img"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div>
        <Label htmlFor="lf-ship">Shipping Information</Label>
        <Textarea
          id="lf-ship"
          value={form.shippingInfo}
          onChange={(e) => set("shippingInfo", e.target.value)}
          rows={2}
          placeholder="Estimated delivery time, shipping methods, countries covered…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="lf-email">Contact Email *</Label>
          <Input
            id="lf-email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            required
            placeholder="seller@example.com"
          />
        </div>
        <div>
          <Label htmlFor="lf-wa">WhatsApp</Label>
          <Input
            id="lf-wa"
            value={form.contactWhatsApp}
            onChange={(e) => set("contactWhatsApp", e.target.value)}
            placeholder="+86 123 456 7890"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitMutation.isPending}
        data-ocid="seller.listing_submit_button"
        className="gap-2"
      >
        {submitMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Submit Listing
      </Button>
    </form>
  );
}

// ── My Listings ────────────────────────────────────────────────────────────────

function MyListings() {
  const { data: listings = [], isLoading } = useMySellerListings();
  const deleteMutation = useDeleteSellerListing();
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Listing deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="seller.listings.loading_state"
        className="py-8 flex items-center gap-2 text-muted-foreground"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading your listings…
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div
        data-ocid="seller.listings.empty_state"
        className="py-16 flex flex-col items-center gap-3 text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
          <Package className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-heading font-semibold">No listings yet</h3>
          <p className="text-sm text-muted-foreground">
            Submit your first listing using the &ldquo;New Listing&rdquo; tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing, idx) => (
          <div
            key={listing.id.toString()}
            data-ocid={`seller.listing.item.${idx + 1}`}
            className="bg-card rounded-xl border border-border/50 p-4 flex gap-4"
          >
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-16 h-16 rounded-lg object-cover bg-muted shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://picsum.photos/seed/${listing.id}/100/100`;
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-heading font-semibold text-sm line-clamp-1">
                  {listing.title}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid={`seller.listing.delete_button.${idx + 1}`}
                  className="text-destructive hover:text-destructive shrink-0 -mt-1 -mr-2"
                  onClick={() => setDeleteConfirm(listing.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {statusBadge(listing.status)}
                <Badge variant="secondary" className="text-[10px]">
                  {listing.category}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-bold text-primary">
                  {formatPrice(listing.price * 1.5)}
                </span>
                <span className="text-xs text-muted-foreground">
                  retail (base: {formatPrice(listing.price)})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteConfirm !== null && void handleDelete(deleteConfirm)
              }
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Main Seller Portal ─────────────────────────────────────────────────────────

export default function SellerPortalPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: sellerProfile, isLoading: loadingProfile } =
    useMySellerProfile();

  if (isInitializing) {
    return (
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Initializing…</p>
        </div>
      </main>
    );
  }

  if (!identity) {
    return (
      <main
        data-ocid="seller.portal_page"
        className="container mx-auto px-4 py-24 flex items-center justify-center"
      >
        <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-card border text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Seller Portal</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to access your seller dashboard, manage listings, and
            register your store.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full gap-2 bg-rose-600 hover:bg-rose-700 text-white"
            size="lg"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            {isLoggingIn ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main
      data-ocid="seller.portal_page"
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-2xl">Seller Portal</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your store and listings on the AffiliateHub marketplace.
        </p>
      </div>

      {/* My Store Section */}
      <div className="mb-8">
        <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
          <Store className="w-4 h-4 text-primary" />
          My Store
        </h2>

        {loadingProfile ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading profile…
          </div>
        ) : sellerProfile ? (
          <div className="bg-card rounded-xl border border-border/50 p-6 max-w-lg flex gap-4">
            {sellerProfile.logoUrl && (
              <img
                src={sellerProfile.logoUrl}
                alt={sellerProfile.storeName}
                className="w-16 h-16 rounded-xl object-contain bg-muted border shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div>
              <h3 className="font-display font-bold text-xl">
                {sellerProfile.storeName}
              </h3>
              {sellerProfile.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {sellerProfile.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                {sellerProfile.contactEmail && (
                  <span>✉️ {sellerProfile.contactEmail}</span>
                )}
                {sellerProfile.contactWhatsApp && (
                  <span>💬 {sellerProfile.contactWhatsApp}</span>
                )}
              </div>
              <Badge className="mt-2 bg-emerald-600/20 text-emerald-400 border-emerald-600/30 text-[10px]">
                <CheckCircle className="w-3 h-3 mr-1" />
                Store Active
              </Badge>
            </div>
          </div>
        ) : (
          <RegisterStoreForm />
        )}
      </div>

      {/* Listings + New Listing tabs */}
      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="listings" data-ocid="seller.my_listings_tab">
            My Listings
          </TabsTrigger>
          <TabsTrigger value="new" data-ocid="seller.new_listing_tab">
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Listing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <MyListings />
        </TabsContent>

        <TabsContent value="new">
          {sellerProfile ? (
            <SubmitListingForm />
          ) : (
            <div className="py-8 flex flex-col items-center gap-3 text-center">
              <XCircle className="w-10 h-10 text-muted-foreground" />
              <div>
                <h3 className="font-heading font-semibold">
                  Register your store first
                </h3>
                <p className="text-sm text-muted-foreground">
                  You need to set up a store profile before submitting listings.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
