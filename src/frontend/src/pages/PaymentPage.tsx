import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ClipboardCopy,
  CreditCard,
  IndianRupee,
  Lock,
  Phone,
  Smartphone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const UPI_ID = "chaudhary.nishant@okhdfcbank";
const QR_URL = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=upi://pay?pa=${encodeURIComponent(UPI_ID)}%26pn=${encodeURIComponent("Morgensegen Products")}&choe=UTF-8`;

const UPI_APPS = [
  { name: "GPay", emoji: "🟢", color: "bg-green-100 text-green-800" },
  { name: "PhonePe", emoji: "🟣", color: "bg-purple-100 text-purple-800" },
  { name: "Paytm", emoji: "🔵", color: "bg-blue-100 text-blue-800" },
  { name: "BHIM", emoji: "🔷", color: "bg-sky-100 text-sky-800" },
  { name: "Amazon Pay", emoji: "🟠", color: "bg-orange-100 text-orange-800" },
  { name: "Any UPI", emoji: "✅", color: "bg-gray-100 text-gray-800" },
];

const STEPS = [
  { num: 1, text: "Add the items you want to order" },
  { num: 2, text: "Note the total amount to pay" },
  { num: 3, text: "Open your UPI app (GPay, PhonePe, Paytm, etc.)" },
  { num: 4, text: "Scan the QR code or enter UPI ID manually" },
  { num: 5, text: "Complete the payment in your UPI app" },
  {
    num: 6,
    text: "Fill in the order confirmation form below with your transaction ID",
  },
];

interface OrderForm {
  fullName: string;
  phone: string;
  transactionId: string;
  amountPaid: string;
  productsOrdered: string;
}

const EMPTY_FORM: OrderForm = {
  fullName: "",
  phone: "",
  transactionId: "",
  amountPaid: "",
  productsOrdered: "",
};

export default function PaymentPage() {
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(UPI_ID).then(() => {
      toast.success("UPI ID copied to clipboard!", {
        description: "Paste it in your UPI app to pay.",
      });
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.transactionId.trim()) {
      toast.error("Please enter your Transaction / Reference ID.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Order confirmed! 🎉", {
        description:
          "Thank you for your order. It will be processed within 24 hours.",
        duration: 6000,
      });
      setForm(EMPTY_FORM);
    }, 1200);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-background">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 pb-16 pt-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5" />
              Secure UPI Payment
            </div>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
              Payment &amp; Checkout
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-blue-200">
              Pay via UPI, then submit your order details below so we can
              process and dispatch your order within 24&nbsp;hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto -mt-8 max-w-5xl px-4 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* ── LEFT: UPI Payment Card ──────────────────────────── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            {/* UPI ID card */}
            <Card
              data-ocid="payment.card"
              className="overflow-hidden border-2 border-blue-200 shadow-xl"
            >
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 pb-4 pt-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5" />
                    Pay via UPI
                  </CardTitle>
                  <Badge className="border-white/30 bg-white/20 text-white hover:bg-white/30">
                    <Lock className="mr-1 h-3 w-3" />
                    Secure
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* QR Code */}
                <div className="mb-6 flex flex-col items-center">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">
                    Scan with any UPI app
                  </p>
                  <div className="rounded-2xl border-4 border-blue-100 bg-white p-3 shadow-md">
                    <img
                      src={QR_URL}
                      alt="UPI QR Code for Morgensegen Products"
                      width={220}
                      height={220}
                      className="block"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    QR valid for all UPI apps
                  </p>
                </div>

                <Separator className="my-4" />

                {/* UPI ID */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    Or enter UPI ID manually:
                  </p>
                  <div className="flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3">
                    <span className="flex-1 font-mono text-base font-bold tracking-wide text-blue-800 select-none blur-sm pointer-events-none">
                      {UPI_ID}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      data-ocid="payment.primary_button"
                      onClick={handleCopy}
                      className="shrink-0 gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <ClipboardCopy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Click "Copy" to copy the UPI ID to your clipboard.
                  </p>
                </div>

                {/* Accepted apps */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Accepted UPI Apps
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {UPI_APPS.map((app) => (
                      <span
                        key={app.name}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${app.color}`}
                      >
                        {app.emoji} {app.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Steps card */}
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">
                  How to Pay — Step by Step
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ol className="space-y-3">
                  {STEPS.map((step) => (
                    <li key={step.num} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {step.num}
                      </span>
                      <span className="text-sm leading-snug text-foreground">
                        {step.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── RIGHT: Order Confirmation Form ─────────────────── */}
          <motion.div variants={itemVariants}>
            <Card
              data-ocid="payment.panel"
              className="border-2 border-orange-200 shadow-xl"
            >
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 pb-4 pt-5">
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                  Order Confirmation
                </CardTitle>
                <p className="mt-1 text-sm text-orange-100">
                  After paying via UPI, fill this form to confirm your order.
                </p>
              </CardHeader>

              <CardContent className="pt-6">
                <form
                  onSubmit={handleSubmit}
                  data-ocid="payment.modal"
                  className="space-y-5"
                >
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      data-ocid="payment.input"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="focus-visible:ring-orange-400"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      data-ocid="payment.input"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      autoComplete="tel"
                      className="focus-visible:ring-orange-400"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="transactionId"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                      Transaction / Reference ID
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="transactionId"
                      name="transactionId"
                      data-ocid="payment.input"
                      placeholder="e.g. 123456789012"
                      value={form.transactionId}
                      onChange={handleChange}
                      required
                      className="font-mono focus-visible:ring-orange-400"
                    />
                    <p className="text-xs text-muted-foreground">
                      Find this in your UPI app's transaction history
                    </p>
                  </div>

                  {/* Amount Paid */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="amountPaid"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                      Amount Paid (₹)
                    </Label>
                    <Input
                      id="amountPaid"
                      name="amountPaid"
                      data-ocid="payment.input"
                      placeholder="e.g. 1200"
                      value={form.amountPaid}
                      onChange={handleChange}
                      required
                      type="number"
                      min="1"
                      className="focus-visible:ring-orange-400"
                    />
                  </div>

                  {/* Products Ordered */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="productsOrdered"
                      className="text-sm font-medium"
                    >
                      Products Ordered
                    </Label>
                    <Textarea
                      id="productsOrdered"
                      name="productsOrdered"
                      data-ocid="payment.textarea"
                      placeholder="Describe what you ordered, e.g. Sony WH-1000XM5 Headphones (Black) × 1"
                      value={form.productsOrdered}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="resize-none focus-visible:ring-orange-400"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    data-ocid="payment.submit_button"
                    disabled={submitting}
                    className="h-11 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-base font-semibold text-white shadow-orange hover:from-orange-600 hover:to-amber-600"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm My Order
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Your order will be processed within{" "}
                    <strong>24 hours</strong> after confirmation.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                {
                  icon: "🔒",
                  label: "Secure",
                  sub: "UPI encrypted",
                },
                {
                  icon: "⚡",
                  label: "Fast",
                  sub: "24h dispatch",
                },
                {
                  icon: "📦",
                  label: "Tracked",
                  sub: "Order updates",
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="rounded-xl border border-border bg-card p-3 text-center shadow-card"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    {badge.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
