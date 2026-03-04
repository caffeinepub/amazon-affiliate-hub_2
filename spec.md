# Amazon Affiliate Hub

## Current State
Fresh project with no application code. Only base scaffolding exists (frontend shell, no backend Motoko files, no UI components beyond base shadcn setup).

## Requested Changes (Diff)

### Add
- **Product data model**: id, title, description, imageUrl, price, category, affiliateLink, rating (0-5), featured (bool), dealOfDay (bool), brand, vendor (amazon | aliexpress | alibaba)
- **Brand data model**: id, name, logoUrl, category, affiliateLink
- **Backend CRUD**: addProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getFeaturedProducts, getDealOfDay, addBrand, getBrands, deleteBrand
- **Home page**: hero banner, Deal of the Day section, Top Picks / Featured Products grid, Top Brands section
- **Product listing page**: grid of product cards with category filter sidebar and search bar
- **Product detail view**: image, title, description, price, rating stars, "Buy on Amazon/AliExpress/Alibaba" CTA button
- **Category navigation**: Electronics, Home & Kitchen, Books, Clothing, Sports, Beauty, Toys, Chinese Products (AliExpress/Alibaba)
- **Admin panel** (password-protected): add/edit/delete products; add/delete brands; toggle featured and dealOfDay flags
- **Social media links section**: Facebook, Twitter, Threads, Instagram, Telegram, WhatsApp links (configurable from admin)
- **Responsive layout** for mobile and desktop
- **Sample seed data** with representative products and brands across categories

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Generate Motoko backend with Product and Brand data models plus all CRUD operations; include social links config storage
2. Select authorization component for admin panel protection
3. Build frontend: navigation bar, home page, product listing page, product detail modal, admin panel, footer with social links
4. Seed sample products and brands in the frontend layer
5. Deploy
