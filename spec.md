# Morgensegen Products

## Current State
- Full marketplace app with homepage, product catalog, marketplace, seller portal, admin panel, payment page, and two affiliate pages (Amazon India /affiliate/amazon-india, Amazon Global /affiliate/amazon-global).
- NavBar has an "Affiliate" dropdown linking to both affiliate pages (desktop + mobile).
- Footer has Quick Links including both affiliate pages.
- Admin panel has tabs: Products, Brands, Social Links, Affiliate Code, Marketplace (seller listing approval).
- Marketplace Admin tab already has approve/reject functionality for seller listings (pending, approved, rejected).
- Seller portal (/seller) allows sellers to register a store and submit product listings with: title, description, image URL, price, category, shipping info, contact email, WhatsApp.

## Requested Changes (Diff)

### Add
- **Admin "Sellers" tab**: A dedicated tab in AdminPage to approve/manage seller registrations (seller profiles), not just their listings. Show seller store name, email, WhatsApp, description, registration date; with Approve/Reject/Remove buttons. (Note: existing MarketplaceAdminTab already handles listing approval — keep that, rename it to "Listings" for clarity. New "Sellers" tab manages seller store profiles.)
- **www.morgensegentechnologies.com external link** in the NavBar (desktop + mobile) as a prominent button/link labelled "Visit Our Store" or "Shop at Morgensegen" that opens https://www.morgensegentechnologies.com in a new tab. Also add to footer.
- **Seller product listing page improvements**: The seller's listing form at /seller should be more prominent and comprehensive — add fields for product dimensions/weight, quantity available, delivery timeline, and a richer description area. Add a "Seller Dashboard" overview showing stats (total listings, pending, approved, rejected counts).

### Modify
- **Remove affiliate pages**: Delete /affiliate/amazon-india and /affiliate/amazon-global routes from App.tsx. Remove those page files (AffiliateAmazonIndiaPage.tsx, AffiliateAmazonGlobalPage.tsx).
- **NavBar**: Remove the "Affiliate" dropdown (both desktop and mobile). Add "Visit Our Store" external link button pointing to https://www.morgensegentechnologies.com (new tab).
- **Footer**: Remove affiliate page links from Quick Links. Add a "Visit Our Store" link to https://www.morgensegentechnologies.com.
- **AdminPage**: Add a "Sellers" tab for seller account/profile management. Rename existing "Marketplace" tab to "Listings" for clarity.
- **SellerPortalPage**: Expand the New Listing form with additional fields (quantity, dimensions/weight, delivery timeline). Add a stats dashboard overview at the top when seller is logged in.

### Remove
- AffiliateAmazonIndiaPage.tsx
- AffiliateAmazonGlobalPage.tsx
- Affiliate dropdown from NavBar (desktop + mobile)
- Affiliate links from Footer Quick Links
- /affiliate/amazon-india and /affiliate/amazon-global routes from App.tsx

## Implementation Plan
1. Delete AffiliateAmazonIndiaPage.tsx and AffiliateAmazonGlobalPage.tsx.
2. Update App.tsx: remove affiliate route imports and route tree entries.
3. Update NavBar.tsx: remove Affiliate dropdown (desktop + mobile); add "Visit Our Store" external link button (https://www.morgensegentechnologies.com, target _blank) in desktop nav and mobile menu.
4. Update Footer.tsx: remove affiliate Quick Links; add "Visit Our Store" external link.
5. Update AdminPage.tsx: add "Sellers" tab that renders a SellerProfilesAdminTab component showing seller store profiles with approve/reject/remove actions. Rename "Marketplace" tab trigger label to "Listings".
6. Update SellerPortalPage.tsx: expand SubmitListingForm with quantity, dimensions/weight, delivery timeline fields. Add a small stats dashboard at top of page (total, pending, approved, rejected counts derived from mySellerListings data).
