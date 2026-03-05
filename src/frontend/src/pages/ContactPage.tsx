import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiTelegram, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

const CONTACT_OPTIONS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "nishantshandilya060@gmail.com",
    href: "mailto:nishantshandilya060@gmail.com",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconColor: "text-blue-600 bg-blue-100",
    description: "Send us an email anytime",
  },
  {
    icon: SiWhatsapp,
    label: "WhatsApp Community",
    value: "Join our group",
    href: "https://chat.whatsapp.com/JDPnQgxp6Nj5CVo8plCtFy?mode=gi_t",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    iconColor: "text-green-600 bg-green-100",
    description: "Join 1000+ members",
  },
  {
    icon: SiTelegram,
    label: "Telegram Channel",
    value: "Join channel",
    href: "https://t.me/+GMRRNBZRDz4yNzJl",
    color: "bg-sky-50 border-sky-200 hover:border-sky-400",
    iconColor: "text-sky-600 bg-sky-100",
    description: "Get daily deals & updates",
  },
  {
    icon: SiFacebook,
    label: "Facebook Page",
    value: "Morgensegen Facebook",
    href: "#",
    color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
    iconColor: "text-indigo-600 bg-indigo-100",
    description: "Follow our page",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does DealFusion Market work?",
    answer:
      "DealFusion Market uses AI to scan 5 global platforms daily (Amazon, AliExpress, CJ Dropshipping, DHgate, TikTok) to find trending products. We aggregate the best deals and make them discoverable in one place.",
  },
  {
    question: "How do I become a seller?",
    answer:
      "Click 'Sell With Us' in the navigation bar or go to /seller-register. You'll need to create a seller profile and agree to our seller terms. Once registered, you can submit product listings for review.",
  },
  {
    question: "How do I pay for products?",
    answer:
      "We accept UPI payments (Google Pay, PhonePe, Paytm, BHIM, etc.) and card payments. Visit the Payment page for step-by-step instructions.",
  },
  {
    question: "Who handles shipping and delivery?",
    answer:
      "Sellers are responsible for all shipping, packaging, and delivery. When you contact a seller after purchasing, they will coordinate delivery directly with you.",
  },
  {
    question: "How do I get my Amazon affiliate commission?",
    answer:
      "When you click 'Buy on Amazon' links and make a purchase, we earn a small affiliate commission at no extra cost to you. This helps keep the platform free.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent! We'll get back to you within 24 hours.", {
        duration: 5000,
      });
      setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.12 255) 0%, oklch(0.30 0.16 250) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <div className="text-5xl mb-3">👋</div>
          <h1 className="font-display font-extrabold text-3xl text-white mb-2">
            Get in Touch
          </h1>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Have questions about deals, selling, or payments? We're here to
            help.
          </p>
        </div>
      </div>

      {/* Contact options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {CONTACT_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <a
              key={option.label}
              href={option.href}
              target={option.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer text-center group ${option.color}`}
              data-ocid={`contact.${option.label.toLowerCase().replace(/\s+/g, "_")}_button`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.iconColor} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-foreground">
                  {option.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </p>
                <p className="text-xs font-medium text-primary mt-1">
                  {option.value}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact form */}
        <div>
          <h2 className="font-display font-bold text-xl mb-5">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Your Name *</Label>
              <Input
                id="contact-name"
                data-ocid="contact.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email Address *</Label>
              <Input
                id="contact-email"
                type="email"
                data-ocid="contact.email_input"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="contact-message">Message *</Label>
              <Textarea
                id="contact-message"
                data-ocid="contact.textarea"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                required
                rows={5}
                placeholder="Your question or message…"
                className="resize-none"
              />
            </div>
            <Button
              type="submit"
              data-ocid="contact.submit_button"
              disabled={submitting}
              className="w-full gap-2 bg-primary text-primary-foreground font-semibold"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>

          {/* Quick links */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
            <p className="font-semibold text-sm mb-3">Quick Links</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://chat.whatsapp.com/JDPnQgxp6Nj5CVo8plCtFy?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-xs border-green-200 text-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Group
                </Button>
              </a>
              <a
                href="https://t.me/+GMRRNBZRDz4yNzJl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-xs border-sky-200 text-sky-700 hover:bg-sky-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram Channel
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display font-bold text-xl mb-5">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.question.slice(0, 30)}
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border/50 px-4 overflow-hidden"
              >
                <AccordionTrigger className="text-sm font-semibold py-4 hover:no-underline text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
}
