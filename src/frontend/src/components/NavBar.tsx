import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Globe,
  Menu,
  Search,
  Shield,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "../data/seedData";
import { useIsAdmin } from "../hooks/useQueries";

interface NavBarProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export default function NavBar({ onSearch, searchValue = "" }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const navigate = useNavigate();
  const { data: isAdmin } = useIsAdmin();

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localSearch.trim()) {
      void navigate({ to: "/products", search: { q: localSearch } });
    }
  };

  const handleCategoryClick = (cat: string) => {
    setMobileMenuOpen(false);
    if (cat === "All") {
      void navigate({ to: "/products" });
    } else {
      void navigate({ to: "/products", search: { category: cat } });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary shadow-md border-b border-border/20">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              data-ocid="nav.home_link"
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-primary leading-none">
                Morgensegen Products
              </span>
            </Link>

            {/* Search — desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="nav.search_input"
                placeholder="Search products, brands, categories…"
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 bg-white/10 border-white/20 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:bg-white/20 focus-visible:ring-primary"
              />
            </div>

            {/* Nav actions */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/products" data-ocid="nav.products_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary-foreground hover:text-primary hover:bg-white/10"
                >
                  Products
                </Button>
              </Link>
              <Link to="/marketplace" data-ocid="nav.marketplace_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary-foreground hover:text-primary hover:bg-white/10 gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Marketplace
                </Button>
              </Link>
              {/* Affiliate dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.affiliate_link"
                    className="text-secondary-foreground hover:text-primary hover:bg-white/10 gap-1"
                  >
                    Affiliate
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/affiliate/amazon-india"
                      data-ocid="nav.affiliate.amazon_india_link"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-base">🇮🇳</span>
                      Amazon India
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/affiliate/amazon-global"
                      data-ocid="nav.affiliate.amazon_global_link"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-base">🌍</span>
                      Amazon Global
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isAdmin && (
                <Link to="/admin" data-ocid="nav.admin_link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-secondary-foreground hover:text-primary hover:bg-white/10 gap-1"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-secondary-foreground hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category strip — desktop */}
      <div className="hidden md:block bg-secondary/95 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0.5 h-9 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                data-ocid="nav.category.tab"
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-1 rounded text-xs font-medium text-secondary-foreground/80 hover:text-primary hover:bg-white/10 whitespace-nowrap transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10 pb-4 animate-fade-in">
          <div className="container mx-auto px-4 pt-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="nav.search_input"
                placeholder="Search products…"
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 bg-white/10 border-white/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  data-ocid="nav.category.tab"
                  onClick={() => handleCategoryClick(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-secondary-foreground hover:text-primary hover:bg-white/20 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-secondary-foreground hover:text-primary"
                >
                  All Products
                </Button>
              </Link>
              <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-secondary-foreground hover:text-primary gap-2"
                  data-ocid="nav.marketplace_link"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Marketplace
                </Button>
              </Link>
              <Link
                to="/affiliate/amazon-india"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.affiliate.amazon_india_link"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-secondary-foreground hover:text-primary gap-2"
                >
                  <span className="text-base leading-none">🇮🇳</span>
                  Amazon India Affiliate
                </Button>
              </Link>
              <Link
                to="/affiliate/amazon-global"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.affiliate.amazon_global_link"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-secondary-foreground hover:text-primary gap-2"
                >
                  <span className="text-base leading-none">🌍</span>
                  Amazon Global Affiliate
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-secondary-foreground hover:text-primary gap-2"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
