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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Plus,
  Shield,
  Store,
  ThumbsUp,
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
  useMyOrders,
  useMySellerListings,
  useMySellerProfile,
  useRegisterSellerProfile,
  useSubmitSellerListing,
} from "../hooks/useQueries";
import { formatPrice, getDisplayPrice } from "../utils/priceUtils";

const LISTING_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

function statusBadge(status: SellerListingStatus) {
  const map: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending Review",
      className: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    },
    approved: {
      label: "Approved",
      className: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/20 text-red-600 border-red-500/30",
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

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 max-w-lg"
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
        <Label>Store Name *</Label>
        <Input
          data-ocid="seller.store_name_input"
          value={form.storeName}
          onChange={(e) =>
            setForm((f) => ({ ...f, storeName: e.target.value }))
          }
          required
          placeholder="My Online Store"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={2}
          placeholder="Describe your store…"
          className="resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Contact Email *</Label>
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactEmail: e.target.value }))
            }
            required
            placeholder="seller@example.com"
          />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input
            value={form.contactWhatsApp}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactWhatsApp: e.target.value }))
            }
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={registerMutation.isPending}
        data-ocid="seller.submit_button"
        className="gap-2 bg-primary text-primary-foreground"
      >
        {registerMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Store className="w-4 h-4" />
        )}
        Register Store
      </Button>
    </form>
  );
}

function SubmitProductForm() {
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    try {
      await submitMutation.mutateAsync({ ...form, price });
      toast.success("Product submitted for review!");
      setSubmitted(true);
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

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 max-w-xl">
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Product submitted! Our team will review it shortly.
        </div>
      )}

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
        <div className="font-semibold text-primary mb-1">
          📋 How listings work
        </div>
        <p className="text-muted-foreground text-xs">
          Enter your price in the "Your Price" field. Once approved, your
          listing will be visible to buyers on the marketplace.
        </p>
      </div>

      <div>
        <Label>Product Title *</Label>
        <Input
          data-ocid="seller.listing_title_input"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          placeholder="Product name"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={3}
          placeholder="Describe your product…"
          className="resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Your Price (USD) *</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            data-ocid="seller.price_input"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
            placeholder="19.99"
          />
        </div>
        <div>
          <Label>Category *</Label>
          <select
            data-ocid="seller.listing_category_select"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="w-full h-10 px-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label>Image URL</Label>
        <Input
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          placeholder="https://…"
        />
      </div>
      <div>
        <Label>Shipping Information</Label>
        <Textarea
          value={form.shippingInfo}
          onChange={(e) =>
            setForm((f) => ({ ...f, shippingInfo: e.target.value }))
          }
          rows={2}
          placeholder="e.g. Ships within 7-14 days from China via EMS."
          className="resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Contact Email *</Label>
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactEmail: e.target.value }))
            }
            required
            placeholder="seller@example.com"
          />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input
            value={form.contactWhatsApp}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactWhatsApp: e.target.value }))
            }
            placeholder="+86 123 456 7890"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={submitMutation.isPending}
        data-ocid="seller.listing_submit_button"
        className="gap-2 bg-primary text-primary-foreground"
      >
        {submitMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Submit for Review
      </Button>
    </form>
  );
}

function MyListingsTab() {
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

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => (l.status as string) === "pending").length,
    approved: listings.filter((l) => (l.status as string) === "approved")
      .length,
    rejected: listings.filter((l) => (l.status as string) === "rejected")
      .length,
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: Package,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600 bg-amber-500/10",
          },
          {
            label: "Approved",
            value: stats.approved,
            icon: ThumbsUp,
            color: "text-emerald-600 bg-emerald-500/10",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-600 bg-red-500/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-xl leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div
          data-ocid="seller.listings.loading_state"
          className="py-8 flex items-center gap-2 text-muted-foreground text-sm"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading listings…
        </div>
      ) : listings.length === 0 ? (
        <div
          data-ocid="seller.listings.empty_state"
          className="py-16 text-center text-muted-foreground"
        >
          <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-semibold text-sm mb-1">No listings yet</p>
          <p className="text-xs">
            Use the "Submit Product" tab to add listings.
          </p>
        </div>
      ) : (
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
                  <p className="font-semibold text-sm line-clamp-1">
                    {listing.title}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid={`seller.listing.delete_button.${idx + 1}`}
                    className="text-destructive hover:text-destructive shrink-0 -mt-1 -mr-2 h-7 w-7 p-0"
                    onClick={() => setDeleteConfirm(listing.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {statusBadge(listing.status)}
                  <Badge variant="secondary" className="text-[10px]">
                    {listing.category}
                  </Badge>
                </div>
                <div className="mt-1 text-sm font-bold text-primary">
                  {formatPrice(getDisplayPrice(listing.price))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="seller.listing.cancel_button"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="seller.listing.confirm_button"
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

function MyOrdersTab() {
  const { data: orders = [], isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="py-8 flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        data-ocid="seller.orders.empty_state"
        className="py-16 text-center text-muted-foreground"
      >
        <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p className="font-semibold text-sm">No orders yet</p>
        <p className="text-xs mt-1">
          Orders will appear here once buyers place them.
        </p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    forwarded: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-3">
      {orders.map((order, idx) => (
        <div
          key={order.id.toString()}
          data-ocid={`seller.order.item.${idx + 1}`}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-semibold text-sm">{order.productTitle}</p>
              <p className="text-xs text-muted-foreground">
                {order.customerName} · {order.customerEmail}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[order.status as string] ?? "bg-muted text-muted-foreground"}`}
            >
              {(order.status as string).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Qty: {order.quantity.toString()}</span>
            <span className="font-bold text-primary text-sm">
              {formatPrice(order.sellingPrice)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SellerDashboardPage() {
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
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-card border text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">
            Seller Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to manage your listings and orders.
          </p>
          <Button
            onClick={() => void login()}
            disabled={isLoggingIn}
            className="w-full gap-2 bg-primary text-primary-foreground"
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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-2xl">Seller Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your store, listings, and orders.
        </p>
      </div>

      {/* Store profile card */}
      {!loadingProfile && (
        <div className="mb-6">
          {sellerProfile ? (
            <div className="bg-card rounded-xl border border-border/50 p-5 flex gap-4 max-w-lg">
              {sellerProfile.logoUrl && (
                <img
                  src={sellerProfile.logoUrl}
                  alt={sellerProfile.storeName}
                  className="w-14 h-14 rounded-xl object-contain bg-muted border shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div>
                <h3 className="font-display font-bold text-lg">
                  {sellerProfile.storeName}
                </h3>
                {sellerProfile.description && (
                  <p className="text-muted-foreground text-sm mt-0.5 line-clamp-1">
                    {sellerProfile.description}
                  </p>
                )}
                <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Store Active
                </Badge>
              </div>
            </div>
          ) : (
            <RegisterStoreForm />
          )}
        </div>
      )}

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="listings" data-ocid="seller.my_listings_tab">
            My Listings
          </TabsTrigger>
          <TabsTrigger value="submit" data-ocid="seller.new_listing_tab">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Submit Product
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="seller.orders_tab">
            My Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <MyListingsTab />
        </TabsContent>

        <TabsContent value="submit">
          {sellerProfile ? (
            <SubmitProductForm />
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <p>Please register your store first to submit products.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <MyOrdersTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
