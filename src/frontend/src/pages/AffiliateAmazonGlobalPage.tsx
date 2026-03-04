import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart2,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Globe,
  Link2,
  ShoppingBag,
  Star,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const highlights = [
  {
    icon: DollarSign,
    title: "Up to 10% Commission",
    description:
      "Earn competitive commissions across hundreds of Amazon product categories worldwide.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: ShoppingBag,
    title: "200M+ Products",
    description:
      "Promote from Amazon's enormous global catalog — virtually any product your audience might want.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Globe,
    title: "Trusted Worldwide",
    description:
      "Amazon is the world's most trusted online retailer. High conversion rates from established brand trust.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: BarChart2,
    title: "Real-Time Reports",
    description:
      "Comprehensive analytics dashboard with clicks, conversion rates, revenue reports, and performance insights.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Zap,
    title: "Bounty Events",
    description:
      "Earn fixed bounties for Prime sign-ups, Kindle downloads, Audible trials, and other Amazon service referrals.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Star,
    title: "Performance Bonuses",
    description:
      "Unlock higher commission tiers as your referral volume grows — reward yourself for driving more sales.",
    color: "text-primary",
    bg: "bg-accent",
  },
];

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up for Free",
    description:
      "Register your Amazon Associates account. Approval is fast and the program is completely free to join.",
  },
  {
    icon: Link2,
    step: "02",
    title: "Get Affiliate Links",
    description:
      "Use the Amazon Associates SiteStripe to generate links for any product or page on Amazon.com instantly.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Earn Globally",
    description:
      "Share links across your platforms. Earn commissions on purchases made within 24 hours of clicking your links.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AffiliateAmazonGlobalPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden py-20 md:py-28">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-primary/8 blur-2xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, oklch(0.98 0 0) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              Global Affiliate Program
            </Badge>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">🌍</span>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-secondary-foreground leading-tight">
                Amazon Associates
                <br />
                <span className="text-primary">Global Program</span>
              </h1>
            </div>
            <p className="text-lg text-secondary-foreground/70 mb-8 leading-relaxed max-w-xl">
              Join the world's largest affiliate program and earn commissions
              globally. Monetize your content, social media, or website by
              recommending products millions of people already love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="https://affiliate-program.amazon.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="affiliate.amazon_global.primary_button"
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold shadow-orange px-8"
                >
                  Join Amazon Associates
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
            <p className="mt-3 text-xs text-secondary-foreground/45">
              You'll be redirected to Amazon's official affiliate program
              website
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          >
            {[
              { value: "Up to 10%", label: "Commission Rate" },
              { value: "200M+", label: "Products Available" },
              { value: "150+", label: "Countries Served" },
              { value: "24hr", label: "Cookie Window" },
            ].map((stat) => (
              <div key={stat.label} className="text-primary-foreground">
                <div className="font-display font-bold text-2xl md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70 text-sm mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Why Join Amazon Associates?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The world's most established affiliate program with proven earning
              potential for creators of all sizes.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {highlights.map((item) => (
              <motion.div key={item.title} variants={itemVariants}>
                <Card className="h-full border-border/60 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div
                      className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to start monetizing your content globally.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative"
              >
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-5 mx-auto">
                      <step.icon className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-display">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Commission Table */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">
              Commission Rates by Category
            </h2>
            <p className="text-muted-foreground">
              Commission rates vary by product category on Amazon.com.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary text-secondary-foreground">
                      <th className="text-left px-5 py-3 font-semibold">
                        Category
                      </th>
                      <th className="text-right px-5 py-3 font-semibold">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Luxury Beauty", "Up to 10%"],
                      ["Amazon Games", "Up to 20%"],
                      ["Fashion & Clothing", "Up to 9%"],
                      ["Home & Garden", "Up to 8%"],
                      ["Pet Products", "Up to 8%"],
                      ["Electronics", "Up to 4%"],
                      ["Books", "Up to 4.5%"],
                      ["Grocery", "Up to 5%"],
                    ].map(([cat, rate], i) => (
                      <tr
                        key={cat}
                        className={
                          i % 2 === 0 ? "bg-background" : "bg-muted/40"
                        }
                      >
                        <td className="px-5 py-3 text-foreground">{cat}</td>
                        <td className="px-5 py-3 text-right font-semibold text-primary">
                          {rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">
              Also Available: Amazon India
            </h2>
            <p className="text-muted-foreground">
              Targeting Indian customers? The Amazon India Associates program
              may offer better conversion rates for the Indian market.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center"
          >
            <a
              href="/affiliate/amazon-india"
              data-ocid="affiliate.amazon_global.india_link"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-primary/40 text-primary hover:bg-primary/5 gap-2"
              >
                <span className="text-xl">🇮🇳</span>
                View Amazon India Program
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-2">
                {["a", "b", "c", "d", "e"].map((k) => (
                  <div
                    key={k}
                    className="w-10 h-10 rounded-full bg-primary/20 border-2 border-secondary flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                ))}
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-secondary-foreground mb-4">
              Start Earning Globally Today
            </h2>
            <p className="text-secondary-foreground/60 mb-8 max-w-md mx-auto">
              Join millions of content creators, bloggers, and website owners
              who earn with Amazon Associates worldwide.
            </p>
            <a
              href="https://affiliate-program.amazon.com/"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="affiliate.amazon_global.cta_button"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold shadow-orange px-10 py-6 text-base"
              >
                Join Amazon Associates
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <p className="mt-4 text-xs text-secondary-foreground/40">
              You'll be redirected to Amazon's official affiliate program
              website. Free to join.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
