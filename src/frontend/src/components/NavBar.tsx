import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  Search,
  Shield,
  Tag,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const { data: isAdmin } = useIsAdmin();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      void navigate({ to: "/products", search: { q: search } });
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    { label: "Smart Gadgets", path: "/smart-gadgets", emoji: "⚡" },
    { label: "Kids Corner", path: "/kids-corner", emoji: "🧸" },
    { label: "Kitchen Tools", path: "/kitchen-tools", emoji: "🍳" },
    { label: "Fitness & Lifestyle", path: "/fitness", emoji: "💪" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Main navbar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            {/* Logo */}
            <Link
              to="/"
              data-ocid="nav.home_link"
              className="flex items-center gap-2 shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.20 60) 0%, oklch(0.65 0.22 55) 100%)",
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg leading-none">
                <span className="text-accent">Deal</span>
                <span className="text-white">Fusion</span>
                <span className="text-white/70 text-sm font-medium ml-1">
                  Market
                </span>
              </span>
            </Link>

            {/* Search — desktop */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <Input
                data-ocid="nav.search_input"
                placeholder="Search trending deals, gadgets, brands…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:bg-white/15 focus-visible:ring-accent h-9"
              />
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              <Link to="/deals" data-ocid="nav.deals_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 gap-1 text-xs"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Deals
                </Button>
              </Link>
              <Link to="/trending" data-ocid="nav.trending_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 gap-1 text-xs"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending
                </Button>
              </Link>
              <Link to="/amazon-deals" data-ocid="nav.amazon_deals_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 text-xs"
                >
                  Amazon Deals
                </Button>
              </Link>
              <Link to="/global-deals" data-ocid="nav.global_deals_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 text-xs"
                >
                  Global Deals
                </Button>
              </Link>

              {/* Categories dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.category.tab"
                  className="text-white/80 hover:text-accent hover:bg-white/10 gap-1 text-xs"
                  onClick={() => setCategoriesOpen((v) => !v)}
                >
                  Categories
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-xl shadow-card-hover w-52 py-1.5 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path as "/smart-gadgets"}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        <span>{cat.emoji}</span>
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/blog" data-ocid="nav.blog_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 text-xs"
                >
                  Blog
                </Button>
              </Link>
              <Link to="/contact" data-ocid="nav.contact_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 text-xs"
                >
                  Contact
                </Button>
              </Link>
              <Link to="/payment" data-ocid="nav.payment_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10 gap-1 text-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay
                </Button>
              </Link>
              <Link to="/seller-register" data-ocid="nav.seller_link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-accent hover:text-accent hover:bg-accent/10 border border-accent/30 text-xs"
                >
                  Sell
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin" data-ocid="nav.admin_link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-accent hover:bg-white/10 gap-1 text-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Button>
                </Link>
              )}
              {identity ? (
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.login_button"
                  onClick={() => clear()}
                  className="text-white/80 hover:text-accent hover:bg-white/10 gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.login_button"
                  onClick={() => void login()}
                  disabled={isLoggingIn}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1 text-xs font-semibold"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Button>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-white/80 hover:bg-white/10 transition-colors"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10 pb-4">
          <div className="container mx-auto px-4 pt-3">
            {/* Mobile search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <Input
                placeholder="Search deals…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:bg-white/15"
              />
            </div>

            <div className="grid grid-cols-2 gap-1">
              {[
                { label: "Deals", path: "/deals", ocid: "nav.deals_link" },
                {
                  label: "Trending",
                  path: "/trending",
                  ocid: "nav.trending_link",
                },
                {
                  label: "Amazon Deals",
                  path: "/amazon-deals",
                  ocid: "nav.amazon_deals_link",
                },
                {
                  label: "Global Deals",
                  path: "/global-deals",
                  ocid: "nav.global_deals_link",
                },
                { label: "Blog", path: "/blog", ocid: "nav.blog_link" },
                {
                  label: "Contact",
                  path: "/contact",
                  ocid: "nav.contact_link",
                },
                {
                  label: "Payment",
                  path: "/payment",
                  ocid: "nav.payment_link",
                },
                {
                  label: "Sell With Us",
                  path: "/seller-register",
                  ocid: "nav.seller_link",
                },
                {
                  label: "My Dashboard",
                  path: "/buyer-dashboard",
                  ocid: "nav.buyer_dashboard_link",
                },
                ...(isAdmin
                  ? [{ label: "Admin", path: "/admin", ocid: "nav.admin_link" }]
                  : []),
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path as "/"}
                  data-ocid={item.ocid}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-white/10 pt-3 space-y-1">
              <p className="text-xs text-white/40 px-3 mb-2">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path as "/smart-gadgets"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:text-accent hover:bg-white/10 transition-colors"
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              {identity ? (
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.login_button"
                  onClick={() => {
                    clear();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white/80 hover:text-accent hover:bg-white/10 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  size="sm"
                  data-ocid="nav.login_button"
                  onClick={() => {
                    void login();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
