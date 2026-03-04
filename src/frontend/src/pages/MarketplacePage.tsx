import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Globe, Package, Search, Store } from "lucide-react";
import { useMemo, useState } from "react";
import SellerListingCard from "../components/SellerListingCard";
import { CATEGORIES } from "../data/seedData";
import { useSellerListings } from "../hooks/useQueries";

const ALL_TAB = "All";
const MARKETPLACE_CATEGORIES = [
  ALL_TAB,
  ...CATEGORIES.filter((c) => c !== "All"),
];

export default function MarketplacePage() {
  const { data: listings = [], isLoading } = useSellerListings();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_TAB);

  const filtered = useMemo(() => {
    let result = listings;
    if (activeCategory !== ALL_TAB) {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [listings, activeCategory, search]);

  return (
    <main data-ocid="marketplace.page" className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-rose-400" />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl">
              Marketplace
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg">
            Direct from Chinese sellers. All prices include a{" "}
            <span className="text-primary font-semibold">
              50% platform margin
            </span>
            . Contact sellers directly to arrange shipping.
          </p>
        </div>
        <Link to="/seller">
          <Button
            data-ocid="marketplace.become_seller_button"
            className="gap-2 bg-rose-600 hover:bg-rose-700 text-white shrink-0"
          >
            <Store className="w-4 h-4" />
            Become a Seller
          </Button>
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="marketplace.search_input"
            placeholder="Search marketplace listings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="marketplace.category.tab"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          data-ocid="marketplace.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-card rounded-xl border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-5 w-24 mt-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="marketplace.empty_state"
          className="py-24 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-1">
              {search || activeCategory !== ALL_TAB
                ? "No listings match your filters"
                : "No marketplace listings yet"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {search || activeCategory !== ALL_TAB
                ? "Try adjusting your search or category filter."
                : "Be the first to list your products on our marketplace."}
            </p>
          </div>
          {!search && activeCategory === ALL_TAB && (
            <Link to="/seller">
              <Button className="gap-2 bg-rose-600 hover:bg-rose-700 text-white mt-2">
                <Store className="w-4 h-4" />
                Start Selling
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
              {activeCategory !== ALL_TAB && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeCategory}
                </Badge>
              )}
            </p>
          </div>
          <div
            data-ocid="marketplace.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filtered.map((listing, idx) => (
              <SellerListingCard
                key={listing.id.toString()}
                listing={listing}
                index={idx + 1}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
