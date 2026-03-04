import { Heart } from "lucide-react";
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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-lg text-primary mb-2">
              Morgensegen Products
            </h3>
            <p className="text-sm text-secondary-foreground/60 leading-relaxed">
              Your trusted source for top deals from Amazon, AliExpress, and
              Alibaba. Shop smarter, save more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-secondary-foreground/80">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Electronics"
                  className="hover:text-primary transition-colors"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Home+%26+Kitchen"
                  className="hover:text-primary transition-colors"
                >
                  Home & Kitchen
                </a>
              </li>
              <li>
                <a
                  href="/affiliate/amazon-india"
                  className="hover:text-primary transition-colors"
                >
                  Amazon India Affiliate
                </a>
              </li>
              <li>
                <a
                  href="/affiliate/amazon-global"
                  className="hover:text-primary transition-colors"
                >
                  Amazon Global Affiliate
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-secondary-foreground/80">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li>
                <a
                  href="/products?category=Books"
                  className="hover:text-primary transition-colors"
                >
                  Books
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Clothing"
                  className="hover:text-primary transition-colors"
                >
                  Clothing
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Sports"
                  className="hover:text-primary transition-colors"
                >
                  Sports
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Beauty"
                  className="hover:text-primary transition-colors"
                >
                  Beauty
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-secondary-foreground/80">
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li>
                <a
                  href="mailto:nishantshandilya060@gmail.com"
                  className="hover:text-primary transition-colors break-all"
                >
                  nishantshandilya060@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/JDPnQgxp6Nj5CVo8plCtFy?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Group
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+GMRRNBZRDz4yNzJl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Telegram Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-secondary-foreground/80">
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks?.facebook && socialLinks.facebook !== "#" ? (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors cursor-pointer">
                  <SiFacebook className="w-4 h-4" />
                </div>
              )}
              {socialLinks?.twitter ? (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-black transition-colors"
                  aria-label="X / Twitter"
                >
                  <SiX className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                  <SiX className="w-4 h-4" />
                </div>
              )}
              {socialLinks?.instagram ? (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E1306C] transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                  <SiInstagram className="w-4 h-4" />
                </div>
              )}
              {socialLinks?.telegram ? (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0088cc] transition-colors"
                  aria-label="Telegram"
                >
                  <SiTelegram className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                  <SiTelegram className="w-4 h-4" />
                </div>
              )}
              {socialLinks?.whatsapp ? (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors"
                  aria-label="WhatsApp"
                >
                  <SiWhatsapp className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                  <SiWhatsapp className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-secondary-foreground/50">
          <p>© {year} Morgensegen Products. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" />{" "}
            using{" "}
            <a
              href={caffeinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
