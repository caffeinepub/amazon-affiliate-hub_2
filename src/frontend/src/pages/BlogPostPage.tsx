import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, ExternalLink, Tag } from "lucide-react";
import { useEffect } from "react";
import { useProducts } from "../hooks/useQueries";
import { formatPrice } from "../utils/priceUtils";

const BLOG_POSTS: Record<
  string,
  {
    title: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    tags: string[];
    content: string;
    relatedCategories: string[];
  }
> = {
  "top-10-trending-gadgets-today": {
    title: "Top 10 Trending Gadgets Today",
    category: "Smart Gadgets",
    image: "https://picsum.photos/seed/blog-gadgets/1200/600",
    date: "March 4, 2026",
    readTime: "5 min",
    tags: ["gadgets", "trending", "tech"],
    content: `Our AI discovery engine scans thousands of product listings every day to identify trending products before they go viral. Here are the top 10 gadgets making waves right now.

## 1. AI-Powered Noise Canceling Earbuds
These budget earbuds are delivering Sony-level noise cancellation at a fraction of the price. Sales up 340% week-over-week on AliExpress.

## 2. Smart LED Strip Lights with Music Sync
The TikTok-famous LED strips are getting a 2026 upgrade with AI music sync technology. They literally dance to your music.

## 3. Portable Mini Projector 1080P
Pocket-sized projectors are trending hard. Movie nights in any room, any time.

## 4. Wireless Charging Pad 3-in-1
Charge your phone, earbuds, and smartwatch simultaneously. Trending on TikTok with 50M+ views.

## 5. Smart Home Security Camera
AI-powered motion detection with instant phone notifications. Plug-and-play setup in under 5 minutes.

These products represent the intersection of value and viral appeal. Our AI detects these trends early so you can capitalize on them before the mainstream.`,
    relatedCategories: ["Smart Gadgets", "Electronics"],
  },
  "best-amazon-deals-this-week": {
    title: "Best Amazon Deals This Week",
    category: "Amazon Deals",
    image: "https://picsum.photos/seed/blog-amazon/1200/600",
    date: "March 3, 2026",
    readTime: "4 min",
    tags: ["amazon", "deals", "savings"],
    content: `Amazon's affiliate program offers some of the best tracked deals online. Our system monitors price drops and commission rates to surface the best value.

## How We Find the Best Amazon Deals

Our AI monitors:
- Price history over 30 days
- Review velocity (growing = hot product)
- Commission rate optimization
- Category competition analysis

## This Week's Top Categories

### Electronics (Electronics deals up 45%)
Wireless earbuds, smart TVs, and laptop accessories are seeing major discounts this week.

### Kitchen & Home
Instant Pots and air fryers are in their seasonal sale period with 30-40% markdowns.

### Fitness Equipment
Home gym equipment is surging post-January as people commit to fitness goals.

## Affiliate Disclosure
All "Buy on Amazon" links use our affiliate tag. You pay the same price, and we earn a small commission that keeps this platform free.`,
    relatedCategories: ["Electronics", "Kitchen Tools", "Fitness & Lifestyle"],
  },
  "viral-tiktok-gadgets-2025": {
    title: "Viral TikTok Gadgets You Need in 2025",
    category: "Trending",
    image: "https://picsum.photos/seed/blog-tiktok/1200/600",
    date: "March 2, 2026",
    readTime: "6 min",
    tags: ["tiktok", "viral", "gadgets"],
    content: `TikTok has become the most powerful product discovery platform in the world. A single 30-second video can send a product from zero to sold-out in 48 hours.

## Why TikTok Trending Products Matter

When something goes viral on TikTok, it creates a buying frenzy that spans demographics. These aren't fads — they're products solving real problems in surprisingly satisfying ways.

## The Top Viral Products Right Now

### Smart Posture Corrector
The wearable that gently vibrates when you slouch. Over 100M views combined on TikTok.

### Magnetic Phone Wallet
Stick it to any MagSafe phone. Ultra-thin. Always have your cards.

### Reusable Silicone Food Bags
The eco-conscious alternative to Ziploc bags. Satisfying to close, easy to clean.

### Portable Blender Cup
Make smoothies anywhere — gym, office, car. USB rechargeable.

### LED Face Mask
Red light therapy at home. Celebrities and dermatologists approved.

Our AI tracks TikTok virality signals including hashtag velocity, duet counts, and purchase intent keywords.`,
    relatedCategories: ["Smart Gadgets", "Fitness & Lifestyle"],
  },
  "budget-gadgets-under-1000": {
    title: "Budget Gadgets Under ₹1000",
    category: "Budget Picks",
    image: "https://picsum.photos/seed/blog-budget/1200/600",
    date: "March 1, 2026",
    readTime: "4 min",
    tags: ["budget", "value", "deals"],
    content: `Great tech doesn't have to be expensive. Here are gadgets under ₹1000 that punch way above their weight.

## The Best Budget Tech of 2026

### Under ₹500
- USB-C 65W Fast Charger
- Magnetic Phone Mount
- LED Clip Reading Light
- USB Hub 4-Port

### Under ₹750
- Wireless Mouse
- Webcam 1080p
- Mini Bluetooth Speaker
- Phone Stand Adjustable

### Under ₹1000
- Smart LED Bulb (Voice Control)
- Portable Power Bank 10,000mAh
- Mechanical Keyboard (Mini)
- Gaming Headset Wired

## Finding Budget Deals on DealFusion

Our AI compares prices across AliExpress, Alibaba, CJ Dropshipping, and DHgate to find the absolute lowest prices. The displayed prices include our platform margin, so you're always seeing a competitive offer.`,
    relatedCategories: ["Smart Gadgets", "Electronics"],
  },
  "kitchen-tools-that-will-change-your-life": {
    title: "Kitchen Tools That Will Change Your Life",
    category: "Kitchen",
    image: "https://picsum.photos/seed/blog-kitchen/1200/600",
    date: "February 28, 2026",
    readTime: "5 min",
    tags: ["kitchen", "cooking", "tools"],
    content: `The right kitchen tools don't just make cooking easier — they change your relationship with food. Here are the gadgets transforming kitchens in 2026.

## The Game-Changers

### Air Fryer (The #1 Kitchen Revolution)
Crispy food with 80% less oil. If you don't have one, get one. It's not a trend — it's a lifestyle upgrade.

### Instant Pot Multi-Cooker
One appliance that replaces 7 others. Pressure cooker, slow cooker, rice cooker, steamer, and more.

### KitchenAid Stand Mixer
The investment that pays for itself in baked goods. A kitchen staple for home bakers.

### Chef's Knife Set (High Carbon Steel)
Your cooking is only as good as your knife. A quality set transforms meal prep time.

### Herb Stripper Tool (₹200)
Strip herb leaves in one motion. Sounds trivial, life-changing in practice.

## Finding Kitchen Deals

Our Kitchen Tools category is stocked with products from Amazon, AliExpress, and CJ Dropshipping. We curate only the highest-rated products with proven durability.`,
    relatedCategories: ["Kitchen Tools", "Home & Kitchen"],
  },
  "fitness-gear-trending-social-media": {
    title: "Fitness Gear Trending on Social Media",
    category: "Fitness",
    image: "https://picsum.photos/seed/blog-fitness/1200/600",
    date: "February 27, 2026",
    readTime: "5 min",
    tags: ["fitness", "gym", "wellness"],
    content: `The home fitness revolution is here. Gyms are competing with TikTok fitness influencers who show real results from home workouts.

## Trending Fitness Products in 2026

### Adjustable Resistance Bands Set
Replace an entire cable machine with 5 bands. Progressive overload, compact storage.

### Adjustable Dumbbells (5-52.5 lbs)
The Bowflex SelectTech remains the gold standard. One set, 15 weight options.

### Yoga Mat (Premium Extra Wide)
Manduka's 6mm mat has a cult following. Extra wide means more freedom of movement.

### Smart Fitness Tracker
Track steps, sleep, heart rate, SpO2, and 100+ workouts. Budget options from Xiaomi rival $300 Garmin models.

### Pull-Up Bar (Doorframe)
Zero installation. Infinite workouts. One of the best strength investments you can make.

## The DealFusion Fitness Collection

We source fitness gear from Amazon (for proven brands) and AliExpress/DHgate (for budget alternatives). Every listing shows the actual display price.`,
    relatedCategories: ["Fitness & Lifestyle", "Sports"],
  },
};

export default function BlogPostPage() {
  const params = useParams({ strict: false });
  const slug = (params as { slug?: string }).slug ?? "";
  const post = BLOG_POSTS[slug];

  const { data: allProducts } = useProducts();

  const relatedProducts = allProducts
    ?.filter((p) =>
      post?.relatedCategories.some(
        (c) => p.category.toLowerCase() === c.toLowerCase(),
      ),
    )
    .slice(0, 4);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | DealFusion Market Blog`;
    }
  }, [post]);

  if (!post) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="font-display font-bold text-2xl mb-2">
          Article Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This article doesn't exist or has been removed.
        </p>
        <Link to="/blog">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </main>
    );
  }

  const paragraphs = post.content.split("\n\n");

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime} read
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {post.date}
          </span>
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
          {/* Pinterest share */}
          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors"
          >
            📌 Save to Pinterest
          </a>
        </div>
      </div>

      {/* Featured image */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-muted">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article content */}
      <div className="prose prose-sm max-w-none mb-12">
        {paragraphs.map((para) => {
          const key = para.slice(0, 40);
          if (para.startsWith("## ")) {
            return (
              <h2
                key={key}
                className="font-display font-bold text-xl mt-8 mb-4 text-foreground"
              >
                {para.replace("## ", "")}
              </h2>
            );
          }
          if (para.startsWith("### ")) {
            return (
              <h3
                key={key}
                className="font-display font-semibold text-lg mt-6 mb-3 text-foreground"
              >
                {para.replace("### ", "")}
              </h3>
            );
          }
          if (para.startsWith("- ")) {
            const items = para.split("\n").filter((l) => l.startsWith("- "));
            return (
              <ul
                key={key}
                className="list-disc list-inside space-y-1 mb-4 text-foreground/80"
              >
                {items.map((item) => (
                  <li key={item.slice(0, 40)} className="text-sm">
                    {item.replace("- ", "")}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p
              key={key}
              className="text-foreground/80 leading-relaxed mb-4 text-sm md:text-base"
            >
              {para}
            </p>
          );
        })}
      </div>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-xl mb-5">
            Recommended Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <Link
                key={product.id.toString()}
                to="/products/$id"
                params={{ id: product.id.toString() }}
                className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${product.id}/400/300`;
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </p>
                  <div className="font-bold text-primary text-sm mt-1">
                    {formatPrice(product.price)}
                  </div>
                  {product.vendor === "amazon" && (
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        className="w-full h-7 text-xs gap-1"
                        style={{
                          backgroundColor: "#FF9900",
                          color: "white",
                        }}
                      >
                        Amazon
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
