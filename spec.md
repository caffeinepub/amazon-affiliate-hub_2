# Morgensegen Products — Seller/Buyer Tabs on Homepage + Seller Add Item Flow

## Current State
- Full affiliate + marketplace site with products, brands, seller portal, admin panel
- HomePage has hero, Deal of Day, Featured Products, Sell With Us CTA, Top Brands, banner strip
- Seller listing submission exists at /seller (SellerPortalPage)
- 50% margin is applied on MarketplaceDetailPage when displaying retail price to buyers (listing.price * 1.5)
- No dedicated Seller/Buyer tab section on the homepage

## Requested Changes (Diff)

### Add
- **Seller/Buyer tab section on HomePage**: A prominent two-tab UI ("For Sellers" | "For Buyers") placed below the hero, above the Deal of Day section
  - "For Sellers" tab: Show an inline "Add Your Product" form (title, description, image URL, price in ₹ [their base price], category, shipping info, contact email, contact WhatsApp). On submit, call `submitSellerListing`. The 50% platform margin is silently applied — sellers enter their base price and buyers always see base price × 1.5. Do NOT mention the margin or markup to sellers anywhere in this UI. Show a success state after submission.
  - "For Buyers" tab: Show the marketplace product grid (approved seller listings) with the retail price (base × 1.5) displayed. Link each card to /marketplace/:id. Show a "Browse All" button to /marketplace. Also show a short "How It Works for Buyers" (4 steps: Browse → Order → Pay → Delivered).

### Modify
- **HomePage.tsx**: Insert the Seller/Buyer tab section between the Hero section and the Deal of Day section

### Remove
- Nothing removed

## Implementation Plan
1. In HomePage.tsx, add a `SellerBuyerTabs` component (inline or separate file):
   - Tab "For Sellers": form with fields title, description, imageUrl, price (labeled "Your Price"), category (Select), shippingInfo, contactEmail, contactWhatsApp. On submit call `useSubmitSellerListing`. Show success message. NO mention of margin/commission.
   - Tab "For Buyers": use `useSellerListings` hook to load approved listings, display as a responsive card grid showing retail price (price * 1.5), link to /marketplace/:id. Show 4-step buyer workflow visually.
2. Add the new section to HomePage between Hero and Deal of Day.
3. Ensure the 50% margin calculation only lives on the display side — price stored in backend is always the seller's base price.
