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
