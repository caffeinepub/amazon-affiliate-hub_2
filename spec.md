# Morgensegen Products — Payment Page

## Current State
The site has a full affiliate + marketplace setup with NavBar, Footer, and pages for Home, Products, Marketplace, Seller Portal, Admin, and Affiliate pages. There is no payment page or UPI payment display anywhere in the app.

## Requested Changes (Diff)

### Add
- New `/payment` route and `PaymentPage.tsx` component
  - Displays a dedicated "Payment & Checkout" page
  - Shows UPI ID: `chaudhary.nishant@okhdfcbank` prominently with a copy-to-clipboard button
  - Generates and displays a UPI QR code (scannable by any UPI app: GPay, PhonePe, Paytm, BHIM)
  - Shows step-by-step payment instructions for buyers
  - Includes a section for buyers to submit their order details after payment (name, order ID / transaction reference, amount paid, contact number, product/order description)
  - Confirmation message shown after order form submission
- "Payment" nav link in NavBar (desktop and mobile)
- "Payment" link in Footer Quick Links column

### Modify
- `App.tsx`: Add `/payment` route
- `NavBar.tsx`: Add "Payment" link in desktop nav and mobile menu
- `Footer.tsx`: Add "Payment" link in Quick Links

### Remove
- Nothing removed
