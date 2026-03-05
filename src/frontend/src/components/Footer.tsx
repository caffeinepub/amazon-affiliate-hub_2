import { Link } from "@tanstack/react-router";
import { Heart, Mail, MessageCircle, Send } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiWhatsapp,
  SiX,
} from "react-icons/si";
import { useSocialLinks } from "../hooks/useQueries";

export default function Footer() {
  const { data: socialLinks } = useSocialLinks();
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeinUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.20 60) 0%, oklch(0.65 0.22 55) 100%)",
                }}
              >
                <span className="text-white text-sm font-bold">⚡</span>
              </div>
              <span className="font-display font-extrabold text-lg">
                <span className="text-accent">Deal</span>
                <span className="text-white">Fusion</span>
                <span className="text-white/60 text-sm font-medium ml-1">
                  Market
                </span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4 max-w-xs">
              Morgen Segen Technologies – AI Product Discovery Marketplace
              powered by DealFusion.
            </p>
            {/* Social icons */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  href: socialLinks?.whatsapp || "#",
                  icon: SiWhatsapp,
                  color: "hover:bg-[#25D366]",
                  label: "WhatsApp",
                },
                {
                  href: socialLinks?.telegram || "#",
                  icon: SiTelegram,
                  color: "hover:bg-[#0088cc]",
                  label: "Telegram",
                },
                {
                  href: socialLinks?.facebook || "#",
                  icon: SiFacebook,
                  color: "hover:bg-[#1877F2]",
                  label: "Facebook",
                },
                {
                  href: socialLinks?.instagram || "#",
                  icon: SiInstagram,
                  color: "hover:bg-[#E1306C]",
                  label: "Instagram",
                },
                {
                  href: socialLinks?.twitter || "#",
                  icon: SiX,
                  color: "hover:bg-black",
                  label: "X",
                },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center ${s.color} transition-colors`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-sm text-white/50">
              {[
                { label: "Home", path: "/" },
                { label: "Deals", path: "/deals" },
                { label: "Trending", path: "/trending" },
                { label: "Amazon Deals", path: "/amazon-deals" },
                { label: "Global Deals", path: "/global-deals" },
                { label: "Buyer Dashboard", path: "/buyer-dashboard" },
                { label: "Blog", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path as "/"}
                    className="hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller + Buyer */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">
              For Sellers
            </h4>
            <ul className="space-y-1.5 text-sm text-white/50">
              {[
                { label: "Sell With Us", path: "/seller-register" },
                { label: "Seller Dashboard", path: "/seller-dashboard" },
                { label: "Marketplace", path: "/marketplace" },
              ].map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path as "/"}
                    className="hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-sm mb-3 mt-5 text-white/80">
              For Buyers
            </h4>
            <ul className="space-y-1.5 text-sm text-white/50">
              {[
                { label: "Buyer Registration", path: "/buyer-register" },
                { label: "Browse Products", path: "/products" },
                { label: "Payment", path: "/payment" },
              ].map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path as "/"}
                    className="hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:nishantshandilya060@gmail.com"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="break-all">
                    nishantshandilya060@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/JDPnQgxp6Nj5CVo8plCtFy?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-accent transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-[#25D366]" />
                  WhatsApp Community
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+GMRRNBZRDz4yNzJl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-accent transition-colors"
                >
                  <Send className="w-4 h-4 shrink-0 text-[#0088cc]" />
                  Telegram Channel
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>
            © {year} Morgen Segen Technologies | DealFusion Market. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-accent fill-accent inline" /> using{" "}
            <a
              href={caffeinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
