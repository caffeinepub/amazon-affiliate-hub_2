import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Store,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterSellerProfile } from "../hooks/useQueries";

const AGREEMENT_CLAUSES = [
  "I will manage my own inventory and ensure product availability.",
  "I am responsible for proper product packaging before shipment.",
  "I will handle all shipping logistics and carrier selection.",
  "I am responsible for on-time delivery to the customer.",
  "I will manage all returns and refund requests from buyers.",
  "I will provide direct customer support for my products.",
];

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Smart Gadgets",
  "Kitchen Tools",
  "Kids Corner",
  "Fitness & Lifestyle",
  "Home & Kitchen",
  "Clothing",
  "Sports",
  "Beauty",
  "Books",
];

export default function SellerRegistrationPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const registerMutation = useRegisterSellerProfile();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    storeName: "",
    contactEmail: "",
    phone: "",
    location: "",
    categories: [] as string[],
    description: "",
    logoUrl: "",
    contactWhatsApp: "",
  });

  const [agreedClauses, setAgreedClauses] = useState<boolean[]>(
    AGREEMENT_CLAUSES.map(() => false),
  );
  const allAgreed = agreedClauses.every(Boolean);

  const toggleCategory = (cat: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.storeName || !form.contactEmail) {
      toast.error("Please fill required fields");
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAgreed) {
      toast.error("Please agree to all seller responsibilities");
      return;
    }
    setStep(3);
  };

  const handleFinish = async () => {
    try {
      const description = [
        form.description,
        form.location ? `Location: ${form.location}` : "",
        form.phone ? `Phone: ${form.phone}` : "",
        form.categories.length > 0
          ? `Categories: ${form.categories.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");

      await registerMutation.mutateAsync({
        storeName: form.storeName,
        description,
        contactEmail: form.contactEmail,
        contactWhatsApp: form.contactWhatsApp || form.phone,
        logoUrl: form.logoUrl,
      });
      setSubmitted(true);
      toast.success("Seller registration successful!");
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center container mx-auto px-4 py-16">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">
            Registration Complete!
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your seller account is active. Head to the Seller Dashboard to start
            listing products.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/seller-dashboard">
              <Button className="gap-2 bg-primary text-primary-foreground">
                <Store className="w-4 h-4" />
                Seller Dashboard
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline">View Marketplace</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!identity) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center container mx-auto px-4 py-16">
        <div className="max-w-sm w-full text-center bg-card border border-border/50 rounded-2xl p-8 shadow-card">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.38 0.18 250) 0%, oklch(0.30 0.15 260) 100%)",
            }}
          >
            <Store className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">
            Become a Seller
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to register as a seller on DealFusion Market.
          </p>
          <Button
            onClick={() => void login()}
            disabled={isLoggingIn}
            className="w-full gap-2 bg-primary text-primary-foreground"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Sign In to Register
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-2xl">
            Seller Registration
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Step {step} of 3 —{" "}
          {step === 1
            ? "Business Details"
            : step === 2
              ? "Seller Agreement"
              : "Confirmation"}
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Business Details */}
      {step === 1 && (
        <form
          onSubmit={handleStep1}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-card space-y-4"
        >
          <div>
            <Label htmlFor="storeName">Business / Store Name *</Label>
            <Input
              id="storeName"
              data-ocid="seller_reg.store_name_input"
              value={form.storeName}
              onChange={(e) =>
                setForm((f) => ({ ...f, storeName: e.target.value }))
              }
              required
              placeholder="My Online Store"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              data-ocid="seller_reg.email_input"
              value={form.contactEmail}
              onChange={(e) =>
                setForm((f) => ({ ...f, contactEmail: e.target.value }))
              }
              required
              placeholder="store@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="wa">WhatsApp</Label>
              <Input
                id="wa"
                value={form.contactWhatsApp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactWhatsApp: e.target.value }))
                }
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Shipping Origin Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              placeholder="e.g. Mumbai, India"
            />
          </div>
          <div>
            <Label className="mb-2 block">Product Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={form.categories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <Label
                    htmlFor={`cat-${cat}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="desc">Store Description</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              placeholder="Tell buyers about your store…"
            />
          </div>

          <Button
            type="submit"
            data-ocid="seller_reg.next_button"
            className="w-full gap-2 bg-primary text-primary-foreground"
          >
            Continue to Agreement
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* Step 2: Seller Agreement */}
      {step === 2 && (
        <form
          onSubmit={handleStep2}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-card space-y-5"
        >
          <div>
            <h2 className="font-display font-bold text-lg mb-1">
              Seller Agreement
            </h2>
            <p className="text-sm text-muted-foreground">
              By registering as a seller, you confirm responsibility for:
            </p>
          </div>

          <div className="space-y-3">
            {AGREEMENT_CLAUSES.map((clause, i) => (
              <div
                key={clause.slice(0, 30)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  agreedClauses[i]
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-muted/30"
                }`}
              >
                <Checkbox
                  id={`clause-${i}`}
                  data-ocid={`seller_reg.agreement.checkbox.${i + 1}`}
                  checked={agreedClauses[i]}
                  onCheckedChange={(v) => {
                    setAgreedClauses((prev) => {
                      const next = [...prev];
                      next[i] = v === true;
                      return next;
                    });
                  }}
                  className="mt-0.5 shrink-0"
                />
                <Label
                  htmlFor={`clause-${i}`}
                  className="text-sm font-normal cursor-pointer leading-relaxed"
                >
                  {clause}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              data-ocid="seller_reg.agree_button"
              disabled={!allAgreed}
              className="flex-1 gap-2 bg-primary text-primary-foreground"
            >
              I Agree — Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display font-bold text-xl mb-1">
              Ready to Register!
            </h2>
            <p className="text-muted-foreground text-sm">
              Review your details before submitting.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { label: "Store Name", value: form.storeName },
              { label: "Email", value: form.contactEmail },
              { label: "Phone", value: form.phone || "—" },
              { label: "Location", value: form.location || "—" },
              {
                label: "Categories",
                value:
                  form.categories.length > 0 ? form.categories.join(", ") : "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between text-sm py-2 border-b border-border/30"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-right max-w-[60%] truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              data-ocid="seller_reg.submit_button"
              disabled={registerMutation.isPending}
              onClick={() => void handleFinish()}
              className="flex-1 gap-2 bg-primary text-primary-foreground"
            >
              {registerMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Store className="w-4 h-4" />
              )}
              Complete Registration
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
