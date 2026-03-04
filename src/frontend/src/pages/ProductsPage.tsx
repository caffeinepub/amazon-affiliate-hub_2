import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Package, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { CATEGORIES } from "../data/seedData";
import { useProducts } from "../hooks/useQueries";

export default function ProductsPage() {
  const navigate = useNavigate();

  // Read search params from URL directly (avoids TanStack Router strict type issues)
  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const urlCategory = urlParams.get("category") || "All";
  const urlQ = urlParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [localSearch, setLocalSearch] = useState(urlQ);

  const { data: allProducts, isLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let list = allProducts;
    if (activeCategory !== "All") {
      if (activeCategory === "Chinese Products") {
        list = list.filter((p) =>
          ["aliexpress", "alibaba"].includes(p.vendor.toLowerCase()),
        );
      } else {
        list = list.filter((p) => p.category === activeCategory);
      }
    }
    const q = localSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allProducts, activeCategory, localSearch]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const search: Record<string, string> = {};
    if (cat !== "All") search.category = cat;
    if (localSearch) search.q = localSearch;
    void navigate({ to: "/products", search });
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    const search: Record<string, string> = {};
    if (activeCategory !== "All") search.category = activeCategory;
    if (value) search.q = value;
    void navigate({ to: "/products", search });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-1">
          {activeCategory === "All" ? "All Products" : activeCategory}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isLoading
            ? "Loading products…"
            : `${filteredProducts.length} products found`}
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="products.search_input"
            placeholder="Search products, brands…"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1 shrink-0" />
          <span className="text-sm text-muted-foreground mr-2 whitespace-nowrap">
            Filter:
          </span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid="products.category.tab"
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          data-ocid="products.list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <ProductCardSkeleton key={k} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          data-ocid="products.empty_state"
          className="flex flex-col items-center justify-center py-24 gap-4 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-1">
              No products found
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {localSearch
                ? `No results for "${localSearch}" in ${activeCategory === "All" ? "any category" : activeCategory}.`
                : `No products in ${activeCategory} yet.`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setLocalSearch("");
              setActiveCategory("All");
              void navigate({ to: "/products" });
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div
          data-ocid="products.list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id.toString()}
              product={product}
              index={idx + 1}
            />
          ))}
        </div>
      )}
    </main>
  );
}
