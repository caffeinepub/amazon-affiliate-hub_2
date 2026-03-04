import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SellerProfile {
    createdAt: bigint;
    description: string;
    logoUrl: string;
    storeName: string;
    contactEmail: string;
    sellerId: Principal;
    contactWhatsApp: string;
}
export interface SellerListing {
    id: bigint;
    status: SellerListingStatus;
    title: string;
    createdAt: bigint;
    description: string;
    imageUrl: string;
    shippingInfo: string;
    contactEmail: string;
    category: string;
    commissionRate: number;
    sellerId: Principal;
    contactWhatsApp: string;
    price: number;
}
export interface SocialLinks {
    twitter: string;
    instagram: string;
    threads: string;
    whatsapp: string;
    facebook: string;
    telegram: string;
}
export interface Brand {
    id: bigint;
    name: string;
    logoUrl: string;
    category: string;
    affiliateLink: string;
}
export interface Product {
    id: bigint;
    title: string;
    featured: boolean;
    createdAt: bigint;
    description: string;
    imageUrl: string;
    vendor: string;
    dealOfDay: boolean;
    category: string;
    brand: string;
    rating: number;
    affiliateLink: string;
    price: number;
}
export interface UserProfile {
    name: string;
}
export enum SellerListingStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBrand(name: string, logoUrl: string, category: string, affiliateLink: string): Promise<bigint>;
    addProduct(title: string, description: string, imageUrl: string, price: number, category: string, affiliateLink: string, rating: number, brand: string, vendor: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBrand(id: bigint): Promise<boolean>;
    deleteProduct(id: bigint): Promise<boolean>;
    deleteSellerListing(id: bigint): Promise<boolean>;
    getAffiliateCode(): Promise<string>;
    getAllSellerListingsAdmin(): Promise<Array<SellerListing>>;
    getAllSellerProfiles(): Promise<Array<SellerProfile>>;
    getBrands(): Promise<Array<Brand>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDealOfDay(): Promise<Array<Product>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getMySellerListings(): Promise<Array<SellerListing>>;
    getMySellerProfile(): Promise<SellerProfile | null>;
    getPendingSellerListings(): Promise<Array<SellerListing>>;
    getProductById(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getSellerListingById(id: bigint): Promise<SellerListing | null>;
    getSellerListings(): Promise<Array<SellerListing>>;
    getSellerProfile(seller: Principal): Promise<SellerProfile | null>;
    getSocialLinks(): Promise<SocialLinks>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerSellerProfile(storeName: string, description: string, contactEmail: string, contactWhatsApp: string, logoUrl: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAffiliateCode(code: string): Promise<boolean>;
    setDealOfDay(id: bigint, value: boolean): Promise<boolean>;
    setFeatured(id: bigint, value: boolean): Promise<boolean>;
    submitSellerListing(title: string, description: string, imageUrl: string, price: number, category: string, shippingInfo: string, contactEmail: string, contactWhatsApp: string): Promise<bigint>;
    updateProduct(id: bigint, title: string, description: string, imageUrl: string, price: number, category: string, affiliateLink: string, rating: number, brand: string, vendor: string): Promise<boolean>;
    updateSellerListingStatus(id: bigint, status: SellerListingStatus): Promise<boolean>;
    updateSocialLinks(links: SocialLinks): Promise<boolean>;
}
