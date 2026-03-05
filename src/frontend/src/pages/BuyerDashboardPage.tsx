import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  Loader2,
  LogIn,
  PackageSearch,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyOrders, useProducts } from "../hooks/useQueries";
import { formatPrice } from "../utils/vendorUtils";

const WISHLIST_KEY = "dealfusion_wishlist";

function getWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

// ── Orders Tab ────────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    delivered:
      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[status as string] ?? styles.pending}`}
    >
      {status}
    </span>
  );
}

function OrdersTab() {
  const { data: orders = [], isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div
        data-ocid="buyer_dashboard.orders.loading_state"
        className="flex items-center justify-center py-16 text-muted-foreground"
      >
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        data-ocid="buyer_dashboard.orders.empty_state"
        className="py-16 text-center text-muted-foreground"
      >
        <PackageSearch className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="font-semibold mb-1">No orders yet</p>
        <p className="text-sm mb-4">
          Start exploring deals and place your first order.
        </p>
        <Link to="/products">
          <Button className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, idx) => (
            <TableRow
              key={order.id.toString()}
              data-ocid={`buyer_dashboard.orders.item.${idx + 1}`}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{order.id.toString().slice(-6).padStart(6, "0")}
              </TableCell>
              <TableCell className="font-medium text-sm max-w-[200px]">
                <p className="line-clamp-2">{order.productTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {order.orderType as string}
                </p>
              </TableCell>
              <TableCell className="font-bold text-primary">
                {formatPrice(order.sellingPrice)}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status as string} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(
                  Number(order.createdAt) / 1_000_000,
                ).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Wishlist Tab ──────────────────────────────────────────────────────────────

function WishlistCard({
  product,
  onRemove,
  index,
}: {
  product: Product;
  onRemove: (id: string) => void;
  index: number;
}) {
  return (
    <div
      data-ocid={`buyer_dashboard.wishlist.item.${index}`}
      className="bg-card rounded-xl border border-border/50 overflow-hidden group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
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
        <button
          type="button"
          onClick={() => onRemove(product.id.toString())}
          data-ocid={`buyer_dashboard.wishlist.delete_button.${index}`}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-3">
        <p className="font-semibold text-xs line-clamp-2 mb-1">
          {product.title}
        </p>
        <p className="font-bold text-primary text-sm mb-2">
          {formatPrice(product.price)}
        </p>
        <Link to="/products/$id" params={{ id: product.id.toString() }}>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-7 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Product
          </Button>
        </Link>
      </div>
    </div>
  );
}

function WishlistTab() {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => getWishlist());
  const { data: allProducts = [] } = useProducts();

  const wishlistProducts = useMemo(
    () => allProducts.filter((p) => wishlistIds.includes(p.id.toString())),
    [allProducts, wishlistIds],
  );

  const handleRemove = (id: string) => {
    const updated = wishlistIds.filter((wid) => wid !== id);
    setWishlistIds(updated);
    saveWishlist(updated);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div
        data-ocid="buyer_dashboard.wishlist.empty_state"
        className="py-16 text-center text-muted-foreground"
      >
        <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="font-semibold mb-1">Your wishlist is empty</p>
        <p className="text-sm mb-4">
          Save products you love and come back to them anytime.
        </p>
        <Link to="/products">
          <Button className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            Discover Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {wishlistProducts.length} saved item
        {wishlistProducts.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {wishlistProducts.map((product, idx) => (
          <WishlistCard
            key={product.id.toString()}
            product={product}
            onRemove={handleRemove}
            index={idx + 1}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BuyerDashboardPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();

  if (isInitializing) {
    return (
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading…</p>
        </div>
      </main>
    );
  }

  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-card border text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">
            Buyer Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to view your orders, track shipments, and manage your
            wishlist.
          </p>
          <Button
            data-ocid="buyer_dashboard.login_button"
            onClick={() => void login()}
            disabled={isLoggingIn}
            className="w-full gap-2"
            size="lg"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </main>
    );
  }

  const principal = identity.getPrincipal().toString();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">My Dashboard</h1>
            <p className="text-xs text-muted-foreground font-mono">
              {principal.slice(0, 20)}…
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="orders"
            data-ocid="buyer_dashboard.orders_tab"
            className="gap-2"
          >
            <PackageSearch className="w-3.5 h-3.5" />
            My Orders
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            data-ocid="buyer_dashboard.wishlist_tab"
            className="gap-2"
          >
            <Heart className="w-3.5 h-3.5" />
            Wishlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
        <TabsContent value="wishlist">
          <WishlistTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
