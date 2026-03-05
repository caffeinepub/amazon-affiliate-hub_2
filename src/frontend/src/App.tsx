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
import AmazonDealsPage from "./pages/AmazonDealsPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
import BuyerRegistrationPage from "./pages/BuyerRegistrationPage";
import {
  FitnessPage,
  KidsCornerPage,
  KitchenToolsPage,
  SmartGadgetsPage,
} from "./pages/CategoryPages";
import ContactPage from "./pages/ContactPage";
import DealsPage from "./pages/DealsPage";
import GlobalDealsPage from "./pages/GlobalDealsPage";
import HomePage from "./pages/HomePage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import MarketplacePage from "./pages/MarketplacePage";
import PaymentPage from "./pages/PaymentPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerRegistrationPage from "./pages/SellerRegistrationPage";
import TrendingProductsPage from "./pages/TrendingProductsPage";

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

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trending",
  component: TrendingProductsPage,
});

const amazonDealsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/amazon-deals",
  component: AmazonDealsPage,
});

const globalDealsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/global-deals",
  component: GlobalDealsPage,
});

const smartGadgetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/smart-gadgets",
  component: SmartGadgetsPage,
});

const kidsCornerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kids-corner",
  component: KidsCornerPage,
});

const kitchenToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kitchen-tools",
  component: KitchenToolsPage,
});

const fitnessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fitness",
  component: FitnessPage,
});

const buyerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/buyer-register",
  component: BuyerRegistrationPage,
});

const sellerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller-register",
  component: SellerRegistrationPage,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller-dashboard",
  component: SellerDashboardPage,
});

// Legacy /seller route → redirect to /seller-register
const sellerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller",
  component: SellerRegistrationPage,
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

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: PaymentPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: BlogPostPage,
});

const dealsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deals",
  component: DealsPage,
});

const buyerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/buyer-dashboard",
  component: BuyerDashboardPage,
});

// ── Router ────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  trendingRoute,
  dealsRoute,
  amazonDealsRoute,
  globalDealsRoute,
  smartGadgetsRoute,
  kidsCornerRoute,
  kitchenToolsRoute,
  fitnessRoute,
  buyerRegisterRoute,
  buyerDashboardRoute,
  sellerRegisterRoute,
  sellerDashboardRoute,
  sellerRoute,
  adminRoute,
  marketplaceRoute,
  marketplaceDetailRoute,
  paymentRoute,
  contactRoute,
  blogRoute,
  blogPostRoute,
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
