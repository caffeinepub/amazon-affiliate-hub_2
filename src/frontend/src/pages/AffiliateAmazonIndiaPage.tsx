import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart2,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Globe,
  IndianRupee,
  Link2,
  ShoppingBag,
  Star,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";

const highlights = [
  {
    icon: IndianRupee,
    title: "Competitive Commissions",
    description:
      "Earn up to 9% commission on qualifying purchases across hundreds of product categories on Amazon India.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: ShoppingBag,
    title: "Trusted Indian Brand",
    description:
      "Amazon India is one of the most trusted e-commerce platforms in India with millions of active customers.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Globe,
    title: "Wide Product Range",
    description:
      "Promote from millions of products — electronics, fashion, home goods, groceries, books, and much more.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: BarChart2,
    title: "Easy Tracking Dashboard",
    description:
      "Real-time reports, clicks, conversions, and earnings — all in one intuitive dashboard.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Star,
    title: "Prime Day Bonuses",
    description:
      "Earn extra commissions during special events like Prime Day, Diwali Sales, and Great Indian Festivals.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: TrendingUp,
    title: "Growing Market",
    description:
      "India's e-commerce is booming — tap into one of the world's fastest-growing online shopping markets.",
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
      "Create your Amazon India Associates account in minutes. No fees, no minimum traffic requirements to get started.",
  },
  {
    icon: Link2,
    step: "02",
    title: "Get Your Affiliate Links",
    description:
      "Use the SiteStripe toolbar or the link builder to generate affiliate links for any product on Amazon.in.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Earn Commissions",
    description:
      "Share links on your blog, social media, or website. Earn commissions on every qualifying sale within 24 hours.",
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

export default function AffiliateAmazonIndiaPage() {
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
              Affiliate Program
            </Badge>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">🇮🇳</span>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-secondary-foreground leading-tight">
                Amazon India
                <br />
                <span className="text-primary">Affiliate Program</span>
              </h1>
            </div>
            <p className="text-lg text-secondary-foreground/70 mb-8 leading-relaxed max-w-xl">
              Earn commissions promoting Amazon.in products to Indian customers.
              Join hundreds of thousands of Indian content creators and bloggers
              already earning with Amazon Associates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="https://affiliate-program.amazon.in/home"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="affiliate.amazon_india.primary_button"
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold shadow-orange px-8"
                >
                  Join Amazon India Associates
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
            <p className="mt-3 text-xs text-secondary-foreground/45">
              You'll be redirected to Amazon India's official affiliate program
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
              { value: "Up to 9%", label: "Commission Rate" },
              { value: "40Cr+", label: "Indian Customers" },
              { value: "150M+", label: "Products Listed" },
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
              Why Join Amazon India Associates?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              One of India's most rewarding affiliate programs with real earning
              potential.
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
              Start earning in three simple steps — no technical expertise
              required.
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
              Earn different rates depending on the product category.
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
                      ["Fashion & Clothing", "Up to 9%"],
                      ["Furniture", "Up to 8%"],
                      ["Amazon Fashion (Shoes)", "Up to 9%"],
                      ["Home & Kitchen", "Up to 6%"],
                      ["Electronics", "Up to 2.5%"],
                      ["Books", "Up to 5%"],
                      ["Sports & Outdoors", "Up to 5%"],
                      ["Grocery & Gourmet", "Up to 3%"],
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
              Ready to Start Earning?
            </h2>
            <p className="text-secondary-foreground/60 mb-8 max-w-md mx-auto">
              Join lakhs of Indian content creators already earning commissions
              with Amazon India Associates.
            </p>
            <a
              href="https://affiliate-program.amazon.in/home"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="affiliate.amazon_india.cta_button"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold shadow-orange px-10 py-6 text-base"
              >
                Join Amazon India Associates
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <p className="mt-4 text-xs text-secondary-foreground/40">
              You'll be redirected to Amazon India's official affiliate program
              website. Free to join.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
