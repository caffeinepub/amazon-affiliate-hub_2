import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function BuyerRegistrationPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      if (actor && form.name.trim()) {
        await actor.saveCallerUserProfile({ name: form.name.trim() });
      }
      setSubmitted(true);
      toast.success("Account created successfully!");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
            Welcome to DealFusion Market!
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your account has been created. Start discovering trending deals.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/products">
              <Button className="gap-2 bg-primary text-primary-foreground">
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Button>
            </Link>
            <Link to="/trending">
              <Button variant="outline">Trending Now</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-16">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.38 0.18 250) 0%, oklch(0.30 0.15 260) 100%)",
            }}
          >
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl mb-2">
            Create Buyer Account
          </h1>
          <p className="text-muted-foreground text-sm">
            Join thousands of deal hunters on DealFusion Market.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
          {/* Internet Identity option */}
          {!identity && (
            <div className="mb-5">
              <Button
                onClick={() => void login()}
                disabled={isLoggingIn}
                className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-3"
                variant="outline"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>🔐</span>
                )}
                Sign in with Internet Identity
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 border-t border-border" />
                or continue with email
                <div className="flex-1 border-t border-border" />
              </div>
            </div>
          )}

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">
                Full Name *
              </Label>
              <Input
                id="name"
                data-ocid="buyer.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                data-ocid="buyer.email_input"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  data-ocid="buyer.password_input"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm" className="text-sm">
                Confirm Password *
              </Label>
              <Input
                id="confirm"
                type="password"
                data-ocid="buyer.confirm_input"
                value={form.confirm}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirm: e.target.value }))
                }
                required
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              data-ocid="buyer.submit_button"
              disabled={loading}
              className="w-full gap-2 bg-primary text-primary-foreground font-semibold mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create Account
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline">
              Browse products
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
