import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Tag } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "top-10-trending-gadgets-today",
    title: "Top 10 Trending Gadgets Today",
    excerpt:
      "Our AI has scanned thousands of listings and found the hottest gadgets dominating search trends this week. From smart home devices to viral TikTok finds.",
    category: "Smart Gadgets",
    image: "https://picsum.photos/seed/blog-gadgets/800/450",
    tags: ["gadgets", "trending", "tech"],
    readTime: "5 min",
    date: "Mar 4, 2026",
    featured: true,
  },
  {
    slug: "best-amazon-deals-this-week",
    title: "Best Amazon Deals This Week",
    excerpt:
      "Curated Amazon affiliate deals with the highest discounts and best reviews this week. Don't miss these limited-time offers.",
    category: "Amazon Deals",
    image: "https://picsum.photos/seed/blog-amazon/800/450",
    tags: ["amazon", "deals", "savings"],
    readTime: "4 min",
    date: "Mar 3, 2026",
    featured: false,
  },
  {
    slug: "viral-tiktok-gadgets-2025",
    title: "Viral TikTok Gadgets You Need in 2025",
    excerpt:
      "These products went viral on TikTok for a reason. From the posture corrector to the magnetic phone wallet, here's what everyone is buying.",
    category: "Trending",
    image: "https://picsum.photos/seed/blog-tiktok/800/450",
    tags: ["tiktok", "viral", "gadgets"],
    readTime: "6 min",
    date: "Mar 2, 2026",
    featured: false,
  },
  {
    slug: "budget-gadgets-under-1000",
    title: "Budget Gadgets Under ₹1000",
    excerpt:
      "You don't need to break the bank for quality tech. Here are the best budget gadgets under ₹1000 that are flying off the shelves.",
    category: "Budget Picks",
    image: "https://picsum.photos/seed/blog-budget/800/450",
    tags: ["budget", "value", "deals"],
    readTime: "4 min",
    date: "Mar 1, 2026",
    featured: false,
  },
  {
    slug: "kitchen-tools-that-will-change-your-life",
    title: "Kitchen Tools That Will Change Your Life",
    excerpt:
      "From air fryers to instant pots, these kitchen gadgets will revolutionize how you cook. Trending right now on Amazon and AliExpress.",
    category: "Kitchen",
    image: "https://picsum.photos/seed/blog-kitchen/800/450",
    tags: ["kitchen", "cooking", "tools"],
    readTime: "5 min",
    date: "Feb 28, 2026",
    featured: false,
  },
  {
    slug: "fitness-gear-trending-social-media",
    title: "Fitness Gear Trending on Social Media",
    excerpt:
      "Home gym equipment, resistance bands, and smart fitness trackers that are trending on Instagram and TikTok. Build your best body without the gym membership.",
    category: "Fitness",
    image: "https://picsum.photos/seed/blog-fitness/800/450",
    tags: ["fitness", "gym", "wellness"],
    readTime: "5 min",
    date: "Feb 27, 2026",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "Smart Gadgets": "bg-blue-100 text-blue-700",
  "Amazon Deals": "bg-orange-100 text-orange-700",
  Trending: "bg-red-100 text-red-700",
  "Budget Picks": "bg-green-100 text-green-700",
  Kitchen: "bg-yellow-100 text-yellow-700",
  Fitness: "bg-purple-100 text-purple-700",
};

export default function BlogPage() {
  const featured = BLOG_POSTS.find((p) => p.featured);
  const rest = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📝</span>
          <h1 className="font-display font-extrabold text-3xl">
            DealFusion Blog
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Trending products, deal guides, and discovery insights powered by AI.
        </p>
      </div>

      {/* Featured post */}
      {featured && (
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-4">
            ⭐ Featured Article
          </div>
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            data-ocid="blog.featured.card"
            className="group block bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-card-hover transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-[16/9] lg:aspect-auto overflow-hidden bg-muted">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[featured.category] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {featured.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {featured.readTime} read
                  </div>
                </div>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-snug mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {featured.date}
                  </span>
                  <Button
                    size="sm"
                    className="gap-2 bg-primary text-primary-foreground ml-auto"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((post, idx) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            data-ocid={`blog.post.item.${idx + 1}`}
            className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? "bg-muted text-muted-foreground"}`}
                >
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </div>
              </div>
              <h3 className="font-display font-bold text-base leading-snug group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {post.date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
