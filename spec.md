# Morgensegen Products — Affiliate Program Pages

## Current State
- Multi-page affiliate + marketplace site with NavBar, Footer, Home, Products, Marketplace, Seller Portal, and Admin pages.
- Footer has Quick Links and Contact sections.
- NavBar has Products, Marketplace, and Admin nav links.

## Requested Changes (Diff)

### Add
- **AmazonAffiliateIndiaPage** (`/affiliate/amazon-india`): A dedicated page for Amazon India Affiliate Program linking out to https://affiliate-program.amazon.in/home. Should include program highlights, benefits, how-to-join steps, and a prominent CTA button that opens the link in a new tab.
- **AmazonAffiliateGlobalPage** (`/affiliate/amazon-global`): A dedicated page for Amazon Associates (Global / US) linking out to https://affiliate-program.amazon.com/. Same structure — program highlights, benefits, how-to-join steps, and a prominent CTA button that opens the link in a new tab.
- **Affiliate nav link** in NavBar (desktop + mobile) with a dropdown or dedicated link labelled "Affiliate" that links to both pages.
- **Affiliate section in Footer** Quick Links column with links to both pages.

### Modify
- `App.tsx`: Add two new routes (`/affiliate/amazon-india` and `/affiliate/amazon-global`).
- `NavBar.tsx`: Add "Affiliate" nav entry with links to both affiliate pages (desktop nav and mobile menu).
- `Footer.tsx`: Add links to both affiliate pages in the Quick Links section.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/pages/AffiliateAmazonIndiaPage.tsx` — page for Amazon.in affiliate program.
2. Create `src/pages/AffiliateAmazonGlobalPage.tsx` — page for Amazon.com affiliate program.
3. Update `App.tsx` to import and register both new routes.
4. Update `NavBar.tsx` to add "Affiliate" links in desktop nav and mobile menu.
5. Update `Footer.tsx` to add both affiliate pages in Quick Links.
