import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Copy, QrCode, Smartphone, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const UPI_ID = "chaudhary.nishant-4@oksbi";
const UPI_DEEP_LINK = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("Nishant Shandilya")}`;

interface ConfirmForm {
  name: string;
  email: string;
  productName: string;
  transactionId: string;
  screenshot: File | null;
}

const EMPTY_FORM: ConfirmForm = {
  name: "",
  email: "",
  productName: "",
  transactionId: "",
  screenshot: null,
};

export default function UpiPaymentPage() {
  const [form, setForm] = useState<ConfirmForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, screenshot: file }));
  };

  const handleCopyUPI = () => {
    void navigator.clipboard.writeText(UPI_ID).then(() => {
      toast.success("UPI ID copied!", {
        description: "Paste it in your UPI app to complete payment.",
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.transactionId.trim()) {
      toast.error("Please enter your UPI Transaction ID.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Payment confirmation submitted!", {
        description: "We will verify and process your order within 24 hours.",
        duration: 6000,
      });
    }, 1400);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-background">
      {/* Page header */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 pb-14 pt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
            <QrCode className="h-3.5 w-3.5" />
            UPI Payment
          </div>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Pay Using UPI
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-blue-200 text-sm">
            Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm,
            BHIM) to complete your payment.
          </p>
        </div>
      </div>

      <div className="container mx-auto -mt-8 max-w-4xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── LEFT: QR + UPI ID ── */}
          <div className="flex flex-col gap-6">
            <Card
              data-ocid="upi_payment.card"
              className="overflow-hidden border-2 border-blue-200 shadow-xl"
            >
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 pb-4 pt-5">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <QrCode className="h-5 w-5" />
                  Scan &amp; Pay
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                {/* QR Code image — centered under heading */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="rounded-2xl border-4 border-blue-100 bg-white p-3 shadow-md">
                    <img
                      src="/assets/generated/upi-qr-code.png"
                      alt="UPI Payment QR Code"
                      width={240}
                      height={240}
                      className="block"
                    />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Point your UPI app camera at this QR code
                  </p>
                </div>

                {/* UPI ID below QR with copy button */}
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    UPI ID
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 font-mono text-sm font-bold text-blue-900 break-all">
                      {UPI_ID}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      data-ocid="upi_payment.primary_button"
                      onClick={handleCopyUPI}
                      className="shrink-0 gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Instruction message */}
                <p className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 leading-relaxed">
                  Scan the QR code using any UPI app (Google Pay, PhonePe,
                  Paytm, BHIM) to complete your payment.
                </p>

                {/* Supported apps */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    {
                      name: "Google Pay",
                      emoji: "🟢",
                      cls: "bg-green-100 text-green-800",
                    },
                    {
                      name: "PhonePe",
                      emoji: "🟣",
                      cls: "bg-purple-100 text-purple-800",
                    },
                    {
                      name: "Paytm",
                      emoji: "🔵",
                      cls: "bg-blue-100 text-blue-800",
                    },
                    {
                      name: "BHIM",
                      emoji: "🔷",
                      cls: "bg-sky-100 text-sky-800",
                    },
                  ].map((app) => (
                    <span
                      key={app.name}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${app.cls}`}
                    >
                      {app.emoji} {app.name}
                    </span>
                  ))}
                </div>

                {/* Mobile Pay via UPI button */}
                <div className="mt-5">
                  <a
                    href={UPI_DEEP_LINK}
                    data-ocid="upi_payment.secondary_button"
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600 transition-all"
                  >
                    <Smartphone className="h-4 w-4" />
                    Pay via UPI
                  </a>
                  <p className="mt-1.5 text-center text-xs text-muted-foreground">
                    Tap to open your UPI app directly (mobile only)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT: Payment Confirmation Form ── */}
          <div>
            {submitted ? (
              <Card
                data-ocid="upi_payment.success_state"
                className="border-2 border-green-200 shadow-xl text-center"
              >
                <CardContent className="pt-10 pb-10">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-green-500 mb-4" />
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Confirmation Received!
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Thank you. We will verify your payment and process your
                    order within 24 hours.
                  </p>
                  <Button
                    type="button"
                    className="mt-6"
                    variant="outline"
                    onClick={() => {
                      setForm(EMPTY_FORM);
                      setSubmitted(false);
                    }}
                  >
                    Submit Another
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card
                data-ocid="upi_payment.panel"
                className="border-2 border-orange-200 shadow-xl"
              >
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 pb-4 pt-5">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                    Payment Confirmation
                  </CardTitle>
                  <p className="mt-1 text-sm text-orange-100">
                    After paying, fill this form to confirm your order.
                  </p>
                </CardHeader>

                <CardContent className="pt-6">
                  <form
                    onSubmit={handleSubmit}
                    data-ocid="upi_payment.modal"
                    className="space-y-4"
                  >
                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        data-ocid="upi_payment.input"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className="focus-visible:ring-orange-400"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        data-ocid="upi_payment.input"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="focus-visible:ring-orange-400"
                      />
                    </div>

                    {/* Product Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="productName"
                        className="text-sm font-medium"
                      >
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="productName"
                        name="productName"
                        data-ocid="upi_payment.input"
                        placeholder="e.g. Sony Headphones WH-1000XM5"
                        value={form.productName}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-orange-400"
                      />
                    </div>

                    {/* UPI Transaction ID */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="transactionId"
                        className="text-sm font-medium"
                      >
                        UPI Transaction ID{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="transactionId"
                        name="transactionId"
                        data-ocid="upi_payment.input"
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

                    {/* Upload Screenshot */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">
                        Upload Payment Screenshot
                      </Label>
                      <button
                        type="button"
                        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-4 py-5 cursor-pointer hover:bg-orange-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        data-ocid="upi_payment.dropzone"
                      >
                        <Upload className="h-6 w-6 text-orange-400 mb-2" />
                        {form.screenshot ? (
                          <p className="text-sm font-medium text-orange-700">
                            {form.screenshot.name}
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">
                              Click to upload screenshot
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              PNG, JPG up to 10 MB
                            </p>
                          </>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        data-ocid="upi_payment.upload_button"
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      data-ocid="upi_payment.submit_button"
                      disabled={submitting}
                      className="h-11 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-base font-semibold text-white hover:from-orange-600 hover:to-amber-600"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Submit Confirmation
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Your order will be processed within{" "}
                      <strong>24 hours</strong> after verification.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
