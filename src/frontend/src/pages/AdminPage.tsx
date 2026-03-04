import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Save,
  Shield,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Brand,
  Product,
  SellerListingStatus,
  SocialLinks,
} from "../backend";
import { CATEGORIES } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddBrand,
  useAddProduct,
  useAffiliateCode,
  useAllSellerListingsAdmin,
  useAllSellerProfiles,
  useBrands,
  useDeleteBrand,
  useDeleteProduct,
  useIsAdmin,
  usePendingSellerListings,
  useProducts,
  useSetAffiliateCode,
  useSetDealOfDay,
  useSetFeatured,
  useSocialLinks,
  useUpdateProduct,
  useUpdateSellerListingStatus,
  useUpdateSocialLinks,
} from "../hooks/useQueries";
import { formatPrice, getVendorConfig } from "../utils/vendorUtils";

const VENDORS = ["amazon", "aliexpress", "alibaba"] as const;

interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  category: string;
  affiliateLink: string;
  rating: string;
  brand: string;
  vendor: string;
  featured: boolean;
  dealOfDay: boolean;
}

const EMPTY_PRODUCT_FORM: ProductFormData = {
  title: "",
  description: "",
  imageUrl: "",
  price: "",
  category: "Electronics",
  affiliateLink: "",
  rating: "4.5",
  brand: "",
  vendor: "amazon",
  featured: false,
  dealOfDay: false,
};

interface BrandFormData {
  name: string;
  logoUrl: string;
  category: string;
  affiliateLink: string;
}

const EMPTY_BRAND_FORM: BrandFormData = {
  name: "",
  logoUrl: "",
  category: "Electronics",
  affiliateLink: "",
};

// ── Sub-components ───────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? "fill-[#FF9900] text-[#FF9900]" : "fill-muted text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

function ProductFormModal({
  open,
  onClose,
  editProduct,
}: {
  open: boolean;
  onClose: () => void;
  editProduct: Product | null;
}) {
  const [form, setForm] = useState<ProductFormData>(() => {
    if (editProduct) {
      return {
        title: editProduct.title,
        description: editProduct.description,
        imageUrl: editProduct.imageUrl,
        price: editProduct.price.toString(),
        category: editProduct.category,
        affiliateLink: editProduct.affiliateLink,
        rating: editProduct.rating.toString(),
        brand: editProduct.brand,
        vendor: editProduct.vendor,
        featured: editProduct.featured,
        dealOfDay: editProduct.dealOfDay,
      };
    }
    return EMPTY_PRODUCT_FORM;
  });

  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const setFeaturedMutation = useSetFeatured();
  const setDealMutation = useSetDealOfDay();

  const isPending = addMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(form.price);
    const rating = Number.parseFloat(form.rating);
    if (Number.isNaN(price) || Number.isNaN(rating)) {
      toast.error("Price and rating must be valid numbers");
      return;
    }

    try {
      if (editProduct) {
        await updateMutation.mutateAsync({
          id: editProduct.id,
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          price,
          category: form.category,
          affiliateLink: form.affiliateLink,
          rating,
          brand: form.brand,
          vendor: form.vendor,
        });
        // Handle featured / dealOfDay toggles
        if (form.featured !== editProduct.featured) {
          await setFeaturedMutation.mutateAsync({
            id: editProduct.id,
            value: form.featured,
          });
        }
        if (form.dealOfDay !== editProduct.dealOfDay) {
          await setDealMutation.mutateAsync({
            id: editProduct.id,
            value: form.dealOfDay,
          });
        }
        toast.success("Product updated!");
      } else {
        const newId = await addMutation.mutateAsync({
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          price,
          category: form.category,
          affiliateLink: form.affiliateLink,
          rating,
          brand: form.brand,
          vendor: form.vendor,
        });
        if (form.featured)
          await setFeaturedMutation.mutateAsync({ id: newId, value: true });
        if (form.dealOfDay)
          await setDealMutation.mutateAsync({ id: newId, value: true });
        toast.success("Product added!");
      }
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save product",
      );
    }
  };

  const set = (key: keyof ProductFormData, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogDescription>
            {editProduct
              ? "Update product details."
              : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <Label htmlFor="pf-title">Title *</Label>
            <Input
              id="pf-title"
              data-ocid="product_form.title_input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="Product title"
            />
          </div>
          <div>
            <Label htmlFor="pf-desc">Description</Label>
            <Textarea
              id="pf-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Product description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pf-price">Price ($) *</Label>
              <Input
                id="pf-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                required
                placeholder="29.99"
              />
            </div>
            <div>
              <Label htmlFor="pf-rating">Rating (0-5)</Label>
              <Input
                id="pf-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
                placeholder="4.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(
                    (c) => c !== "All" && c !== "Chinese Products",
                  ).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vendor *</Label>
              <Select
                value={form.vendor}
                onValueChange={(v) => set("vendor", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VENDORS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {getVendorConfig(v).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="pf-brand">Brand</Label>
            <Input
              id="pf-brand"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Apple, Samsung…"
            />
          </div>
          <div>
            <Label htmlFor="pf-imageUrl">Image URL</Label>
            <Input
              id="pf-imageUrl"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div>
            <Label htmlFor="pf-affLink">Affiliate Link *</Label>
            <Input
              id="pf-affLink"
              value={form.affiliateLink}
              onChange={(e) => set("affiliateLink", e.target.value)}
              required
              placeholder="https://amzn.to/…"
            />
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="pf-featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
              <Label htmlFor="pf-featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pf-deal"
                checked={form.dealOfDay}
                onCheckedChange={(v) => set("dealOfDay", v)}
              />
              <Label htmlFor="pf-deal">Deal of the Day</Label>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="product_form.cancel_button"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="product_form.submit_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              {editProduct ? "Update" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();
  const [productModal, setProductModal] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const handleDelete = async (product: Product) => {
    try {
      await deleteMutation.mutateAsync(product.id);
      toast.success("Product deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products?.length ?? 0} products total
        </p>
        <Button
          data-ocid="admin.add_product_button"
          onClick={() => setProductModal({ open: true, product: null })}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Loading products…
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No products yet. Add your first product.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product, idx) => {
                const vendor = getVendorConfig(product.vendor);
                return (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://picsum.photos/seed/${product.id}/80/80`;
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm line-clamp-1 max-w-[160px]">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <StarDisplay rating={product.rating} />
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: vendor.color }}
                      >
                        {vendor.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.featured && (
                          <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-medium">
                            ★ Featured
                          </span>
                        )}
                        {product.dealOfDay && (
                          <span className="bg-destructive/10 text-destructive text-[10px] px-1.5 py-0.5 rounded font-medium">
                            🔥 Deal
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`admin.product.edit_button.${idx + 1}`}
                          onClick={() =>
                            setProductModal({ open: true, product })
                          }
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          data-ocid={`admin.product.delete_button.${idx + 1}`}
                          onClick={() => setDeleteConfirm(product)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Product form modal */}
      <ProductFormModal
        open={productModal.open}
        onClose={() => setProductModal({ open: false, product: null })}
        editProduct={productModal.product}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirm && void handleDelete(deleteConfirm)}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Brands Tab ────────────────────────────────────────────────────────────────

function BrandsTab() {
  const { data: brands, isLoading } = useBrands();
  const addBrandMutation = useAddBrand();
  const deleteBrandMutation = useDeleteBrand();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BrandFormData>(EMPTY_BRAND_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<Brand | null>(null);

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBrandMutation.mutateAsync(form);
      toast.success("Brand added!");
      setForm(EMPTY_BRAND_FORM);
      setShowForm(false);
    } catch {
      toast.error("Failed to add brand");
    }
  };

  const handleDelete = async (brand: Brand) => {
    try {
      await deleteBrandMutation.mutateAsync(brand.id);
      toast.success("Brand deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete brand");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {brands?.length ?? 0} brands total
        </p>
        <Button
          data-ocid="admin.add_brand_button"
          onClick={() => setShowForm(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => void handleAddBrand(e)}
          className="bg-muted/50 rounded-xl p-4 border space-y-3"
        >
          <h3 className="font-heading font-semibold text-sm">Add New Brand</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Brand Name *</Label>
              <Input
                data-ocid="brand_form.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                placeholder="Apple"
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={form.logoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, logoUrl: e.target.value }))
                }
                placeholder="https://logo.clearbit.com/apple.com"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(
                    (c) => c !== "All" && c !== "Chinese Products",
                  ).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Affiliate Link</Label>
              <Input
                value={form.affiliateLink}
                onChange={(e) =>
                  setForm((f) => ({ ...f, affiliateLink: e.target.value }))
                }
                placeholder="https://…"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={addBrandMutation.isPending}
              data-ocid="brand_form.submit_button"
            >
              {addBrandMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : null}
              Add Brand
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Logo URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Loading…
                </TableCell>
              </TableRow>
            ) : brands?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No brands yet.
                </TableCell>
              </TableRow>
            ) : (
              brands?.map((brand, idx) => (
                <TableRow key={brand.id.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                      <span className="font-medium text-sm">{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{brand.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {brand.logoUrl}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      data-ocid={`admin.brand.delete_button.${idx + 1}`}
                      onClick={() => setDeleteConfirm(brand)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteBrandMutation.isPending}
              onClick={() => deleteConfirm && void handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Social Links Tab ──────────────────────────────────────────────────────────

function SocialLinksTab() {
  const { data: socialLinks } = useSocialLinks();
  const updateMutation = useUpdateSocialLinks();
  const [form, setForm] = useState<SocialLinks>({
    facebook: "",
    twitter: "",
    threads: "",
    instagram: "",
    telegram: "",
    whatsapp: "",
  });

  // Sync from fetched data on first load
  useEffect(() => {
    if (socialLinks) {
      setForm(socialLinks);
    }
  }, [socialLinks]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      toast.success("Social links saved!");
    } catch {
      toast.error("Failed to save social links");
    }
  };

  const fields: {
    key: keyof SocialLinks;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/yourpage",
    },
    {
      key: "twitter",
      label: "Twitter / X",
      placeholder: "https://twitter.com/yourhandle",
    },
    {
      key: "threads",
      label: "Threads",
      placeholder: "https://threads.net/@yourhandle",
    },
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/yourhandle",
    },
    {
      key: "telegram",
      label: "Telegram",
      placeholder: "https://t.me/yourchannel",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      placeholder: "https://wa.me/yourphonenumber",
    },
  ];

  return (
    <form onSubmit={(e) => void handleSave(e)} className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Update your social media links. These will appear in the footer and on
        the home page.
      </p>
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <Label htmlFor={`sl-${key}`}>{label}</Label>
          <Input
            id={`sl-${key}`}
            type="url"
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
          />
        </div>
      ))}
      <Button
        type="submit"
        disabled={updateMutation.isPending}
        data-ocid="admin.social_links_save_button"
        className="gap-2"
      >
        {updateMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Save Social Links
      </Button>
    </form>
  );
}

// ── Affiliate Code Tab ────────────────────────────────────────────────────────

function AffiliateCodeTab() {
  const { data: currentCode = "" } = useAffiliateCode();
  const setCodeMutation = useSetAffiliateCode();
  const [code, setCode] = useState("");

  // Sync from backend once loaded
  useEffect(() => {
    if (currentCode !== undefined) {
      setCode(currentCode);
    }
  }, [currentCode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setCodeMutation.mutateAsync(code);
      toast.success("Affiliate code saved!");
    } catch {
      toast.error("Failed to save affiliate code");
    }
  };

  return (
    <form onSubmit={(e) => void handleSave(e)} className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground">
        This code is appended to Amazon affiliate links as{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
          ?tag=&lt;code&gt;
        </code>
        . Leave blank to disable.
      </p>
      <div>
        <Label htmlFor="aff-code">Affiliate Tag</Label>
        <Input
          id="aff-code"
          data-ocid="admin.affiliate_code_input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="mysite-20"
          className="max-w-xs"
        />
      </div>
      <Button
        type="submit"
        disabled={setCodeMutation.isPending}
        data-ocid="admin.affiliate_code_save_button"
        className="gap-2"
      >
        {setCodeMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Save Code
      </Button>
    </form>
  );
}

// ── Marketplace Admin Tab ──────────────────────────────────────────────────────

function listingStatusBadge(status: SellerListingStatus) {
  const map: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    approved: {
      label: "Approved",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/20 text-red-400 border-red-500/30",
    },
  };
  const cfg = map[status as string] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function MarketplaceAdminTab() {
  const { data: pendingListings = [], isLoading: loadingPending } =
    usePendingSellerListings();
  const { data: allListings = [], isLoading: loadingAll } =
    useAllSellerListingsAdmin();
  const updateStatusMutation = useUpdateSellerListingStatus();

  const handleStatus = async (id: bigint, status: SellerListingStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success(
        `Listing ${status === "approved" ? "approved" : "rejected"}`,
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending */}
      <div>
        <h3 className="font-heading font-semibold text-base mb-3 flex items-center gap-2">
          Pending Review
          {pendingListings.length > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              {pendingListings.length}
            </Badge>
          )}
        </h3>
        <div className="rounded-lg border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Seller ID</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingPending ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Loading…
                  </TableCell>
                </TableRow>
              ) : pendingListings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No pending listings. All caught up! ✓
                  </TableCell>
                </TableRow>
              ) : (
                pendingListings.map((listing, idx) => (
                  <TableRow key={listing.id.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-9 h-9 rounded object-cover bg-muted border shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://picsum.photos/seed/${listing.id}/60/60`;
                          }}
                        />
                        <p className="text-sm font-medium line-clamp-1 max-w-[140px]">
                          {listing.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {listing.category}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-primary">
                      {formatPrice(listing.price * 1.5)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {listing.sellerId.toString().slice(0, 12)}…
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(
                        Number(listing.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          data-ocid={`admin.listing.approve_button.${idx + 1}`}
                          className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 gap-1 text-xs"
                          disabled={updateStatusMutation.isPending}
                          onClick={() =>
                            void handleStatus(
                              listing.id,
                              "approved" as SellerListingStatus,
                            )
                          }
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          data-ocid={`admin.listing.reject_button.${idx + 1}`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs"
                          disabled={updateStatusMutation.isPending}
                          onClick={() =>
                            void handleStatus(
                              listing.id,
                              "rejected" as SellerListingStatus,
                            )
                          }
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* All listings */}
      <div>
        <h3 className="font-heading font-semibold text-base mb-3">
          All Listings ({allListings.length})
        </h3>
        <div className="rounded-lg border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAll ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Loading…
                  </TableCell>
                </TableRow>
              ) : allListings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No listings yet.
                  </TableCell>
                </TableRow>
              ) : (
                allListings.map((listing) => (
                  <TableRow key={listing.id.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-9 h-9 rounded object-cover bg-muted border shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://picsum.photos/seed/${listing.id}/60/60`;
                          }}
                        />
                        <p className="text-sm font-medium line-clamp-1 max-w-[140px]">
                          {listing.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {listing.category}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-primary">
                      {formatPrice(listing.price * 1.5)}
                    </TableCell>
                    <TableCell>{listingStatusBadge(listing.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(
                        Number(listing.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ── Seller Profiles Admin Tab ─────────────────────────────────────────────────

function SellerProfilesAdminTab() {
  const { data: profiles = [], isLoading } = useAllSellerProfiles();

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Note:</span> These are
        registered seller accounts. Approve their product listings in the
        Listings tab.
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {profiles.length} registered seller{profiles.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Seller ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.sellers.loading_state"
                >
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Loading sellers…
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.sellers.empty_state"
                >
                  No sellers registered yet.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile, idx) => (
                <TableRow
                  key={profile.sellerId.toString()}
                  data-ocid={`admin.sellers.item.${idx + 1}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {profile.logoUrl && (
                        <img
                          src={profile.logoUrl}
                          alt={profile.storeName}
                          className="w-8 h-8 rounded-full object-contain bg-muted border shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <span className="font-medium text-sm">
                        {profile.storeName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {profile.contactEmail || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {profile.contactWhatsApp || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                    <span className="line-clamp-2">
                      {profile.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(
                      Number(profile.createdAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {profile.sellerId.toString().slice(0, 12)}…
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();

  if (isInitializing || checkingAdmin) {
    return (
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Checking credentials…</p>
        </div>
      </main>
    );
  }

  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-card border text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with your Internet Identity to access the admin panel.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full gap-2"
            size="lg"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            {isLoggingIn ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </main>
    );
  }

  if (isAdmin === false) {
    return (
      <main className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-card border text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            Your account does not have admin privileges. Contact the site
            administrator.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-2xl">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage products, brands, and social links for AffiliateHub.
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="bg-muted flex-wrap h-auto gap-1">
          <TabsTrigger value="products" data-ocid="admin.products_tab">
            Products
          </TabsTrigger>
          <TabsTrigger value="brands" data-ocid="admin.brands_tab">
            Brands
          </TabsTrigger>
          <TabsTrigger value="social" data-ocid="admin.social_links_tab">
            Social Links
          </TabsTrigger>
          <TabsTrigger value="affiliate" data-ocid="admin.affiliate_code_tab">
            Affiliate Code
          </TabsTrigger>
          <TabsTrigger value="sellers" data-ocid="admin.sellers_tab">
            Sellers
          </TabsTrigger>
          <TabsTrigger value="marketplace" data-ocid="admin.marketplace_tab">
            Listings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="brands">
          <BrandsTab />
        </TabsContent>
        <TabsContent value="social">
          <SocialLinksTab />
        </TabsContent>
        <TabsContent value="affiliate">
          <AffiliateCodeTab />
        </TabsContent>
        <TabsContent value="sellers">
          <SellerProfilesAdminTab />
        </TabsContent>
        <TabsContent value="marketplace">
          <MarketplaceAdminTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
