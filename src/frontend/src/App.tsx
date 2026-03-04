import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import AdminPage from "./pages/AdminPage";
import AffiliateAmazonGlobalPage from "./pages/AffiliateAmazonGlobalPage";
import AffiliateAmazonIndiaPage from "./pages/AffiliateAmazonIndiaPage";
import HomePage from "./pages/HomePage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import SellerPortalPage from "./pages/SellerPortalPage";

// Re-export router primitives for use in child components
export { Link, useNavigate, useParams, useSearch };

// ── Root layout ───────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

// ── Routes ────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: ProductDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: MarketplacePage,
});

const marketplaceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace/$id",
  component: MarketplaceDetailPage,
});

const sellerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller",
  component: SellerPortalPage,
});

const affiliateAmazonIndiaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/affiliate/amazon-india",
  component: AffiliateAmazonIndiaPage,
});

const affiliateAmazonGlobalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/affiliate/amazon-global",
  component: AffiliateAmazonGlobalPage,
});

// ── Router ────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  adminRoute,
  marketplaceRoute,
  marketplaceDetailRoute,
  sellerRoute,
  affiliateAmazonIndiaRoute,
  affiliateAmazonGlobalRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
