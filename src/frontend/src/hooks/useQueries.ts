import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Brand, Product, SocialLinks } from "../backend";
import {
  SEED_BRANDS,
  SEED_PRODUCTS,
  SEED_SOCIAL_LINKS,
} from "../data/seedData";
import { useActor } from "./useActor";

// ── Products ─────────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return SEED_PRODUCTS;
      try {
        const products = await actor.getProducts();
        return products.length > 0 ? products : SEED_PRODUCTS;
      } catch {
        return SEED_PRODUCTS;
      }
    },
    enabled: !isFetching,
    placeholderData: SEED_PRODUCTS,
  });
}

export function useProductById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!id) return null;
      if (!actor) return SEED_PRODUCTS.find((p) => p.id === id) ?? null;
      try {
        return await actor.getProductById(id);
      } catch {
        return SEED_PRODUCTS.find((p) => p.id === id) ?? null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) {
        if (category === "All") return SEED_PRODUCTS;
        return SEED_PRODUCTS.filter((p) => p.category === category);
      }
      try {
        if (category === "All") {
          const products = await actor.getProducts();
          return products.length > 0 ? products : SEED_PRODUCTS;
        }
        const products = await actor.getProductsByCategory(category);
        if (products.length > 0) return products;
        return SEED_PRODUCTS.filter((p) => p.category === category);
      } catch {
        if (category === "All") return SEED_PRODUCTS;
        return SEED_PRODUCTS.filter((p) => p.category === category);
      }
    },
    enabled: !isFetching,
    placeholderData:
      category === "All"
        ? SEED_PRODUCTS
        : SEED_PRODUCTS.filter((p) => p.category === category),
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      if (!actor) return SEED_PRODUCTS.filter((p) => p.featured);
      try {
        const products = await actor.getFeaturedProducts();
        return products.length > 0
          ? products
          : SEED_PRODUCTS.filter((p) => p.featured);
      } catch {
        return SEED_PRODUCTS.filter((p) => p.featured);
      }
    },
    enabled: !isFetching,
    placeholderData: SEED_PRODUCTS.filter((p) => p.featured),
  });
}

export function useDealOfDay() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "dealOfDay"],
    queryFn: async () => {
      if (!actor) return SEED_PRODUCTS.filter((p) => p.dealOfDay);
      try {
        const products = await actor.getDealOfDay();
        return products.length > 0
          ? products
          : SEED_PRODUCTS.filter((p) => p.dealOfDay);
      } catch {
        return SEED_PRODUCTS.filter((p) => p.dealOfDay);
      }
    },
    enabled: !isFetching,
    placeholderData: SEED_PRODUCTS.filter((p) => p.dealOfDay),
  });
}

// ── Brands ────────────────────────────────────────────────────────────────────

export function useBrands() {
  const { actor, isFetching } = useActor();
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      if (!actor) return SEED_BRANDS;
      try {
        const brands = await actor.getBrands();
        return brands.length > 0 ? brands : SEED_BRANDS;
      } catch {
        return SEED_BRANDS;
      }
    },
    enabled: !isFetching,
    placeholderData: SEED_BRANDS,
  });
}

// ── Social Links ──────────────────────────────────────────────────────────────

export function useSocialLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialLinks>({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor) return SEED_SOCIAL_LINKS;
      try {
        return await actor.getSocialLinks();
      } catch {
        return SEED_SOCIAL_LINKS;
      }
    },
    enabled: !isFetching,
    placeholderData: SEED_SOCIAL_LINKS,
  });
}

// ── Admin role ────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !isFetching,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      imageUrl: string;
      price: number;
      category: string;
      affiliateLink: string;
      rating: number;
      brand: string;
      vendor: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(
        data.title,
        data.description,
        data.imageUrl,
        data.price,
        data.category,
        data.affiliateLink,
        data.rating,
        data.brand,
        data.vendor,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      imageUrl: string;
      price: number;
      category: string;
      affiliateLink: string;
      rating: number;
      brand: string;
      vendor: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        data.id,
        data.title,
        data.description,
        data.imageUrl,
        data.price,
        data.category,
        data.affiliateLink,
        data.rating,
        data.brand,
        data.vendor,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSetFeatured() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: bigint; value: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setFeatured(id, value);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSetDealOfDay() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: bigint; value: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setDealOfDay(id, value);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useAddBrand() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      logoUrl: string;
      category: string;
      affiliateLink: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBrand(
        data.name,
        data.logoUrl,
        data.category,
        data.affiliateLink,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useDeleteBrand() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBrand(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useUpdateSocialLinks() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (links: SocialLinks) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSocialLinks(links);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["socialLinks"] });
    },
  });
}

// ── Seller Listings ───────────────────────────────────────────────────────────

export function useSellerListings() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerListing[]>({
    queryKey: ["sellerListings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSellerListings();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    placeholderData: [],
  });
}

export function useMySellerListings() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerListing[]>({
    queryKey: ["mySellerListings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMySellerListings();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSellerListingsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerListing[]>({
    queryKey: ["allSellerListings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSellerListingsAdmin();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingSellerListings() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerListing[]>({
    queryKey: ["pendingSellerListings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPendingSellerListings();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSellerListingById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerListing | null>({
    queryKey: ["sellerListing", id?.toString()],
    queryFn: async () => {
      if (!id || !actor) return null;
      try {
        return await actor.getSellerListingById(id);
      } catch {
        return null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useMySellerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerProfile | null>({
    queryKey: ["mySellerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMySellerProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSellerProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").SellerProfile[]>({
    queryKey: ["allSellerProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSellerProfiles();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAffiliateCode() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["affiliateCode"],
    queryFn: async () => {
      if (!actor) return "";
      try {
        return await actor.getAffiliateCode();
      } catch {
        return "";
      }
    },
    enabled: !isFetching,
    placeholderData: "",
  });
}

export function useSubmitSellerListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      imageUrl: string;
      price: number;
      category: string;
      shippingInfo: string;
      contactEmail: string;
      contactWhatsApp: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitSellerListing(
        data.title,
        data.description,
        data.imageUrl,
        data.price,
        data.category,
        data.shippingInfo,
        data.contactEmail,
        data.contactWhatsApp,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sellerListings"] });
      void qc.invalidateQueries({ queryKey: ["mySellerListings"] });
    },
  });
}

export function useUpdateSellerListingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: import("../backend").SellerListingStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSellerListingStatus(id, status);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sellerListings"] });
      void qc.invalidateQueries({ queryKey: ["allSellerListings"] });
      void qc.invalidateQueries({ queryKey: ["pendingSellerListings"] });
    },
  });
}

export function useDeleteSellerListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSellerListing(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sellerListings"] });
      void qc.invalidateQueries({ queryKey: ["mySellerListings"] });
      void qc.invalidateQueries({ queryKey: ["allSellerListings"] });
      void qc.invalidateQueries({ queryKey: ["pendingSellerListings"] });
    },
  });
}

export function useRegisterSellerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      storeName: string;
      description: string;
      contactEmail: string;
      contactWhatsApp: string;
      logoUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerSellerProfile(
        data.storeName,
        data.description,
        data.contactEmail,
        data.contactWhatsApp,
        data.logoUrl,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["mySellerProfile"] });
    },
  });
}

export function useSetAffiliateCode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setAffiliateCode(code);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["affiliateCode"] });
    },
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function useMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllOrdersAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<import("../backend").Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllOrdersAdmin();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: import("../backend").OrderStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["allOrders"] });
      void qc.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      customerAddress: string;
      productId: bigint;
      productTitle: string;
      orderType: import("../backend").OrderType;
      sellerListingId: bigint | null;
      quantity: bigint;
      sellingPrice: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.customerAddress,
        data.productId,
        data.productTitle,
        data.orderType,
        data.sellerListingId,
        data.quantity,
        data.sellingPrice,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}
