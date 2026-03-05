export interface TrendSignals {
  reviewGrowth: number; // 0-100
  salesRankMovement: number; // 0-100
  socialEngagement: number; // 0-100
  searchTrend: number; // 0-100
  discountPct: number;
}

/**
 * TrendScore = (reviewGrowth × 0.35) + (salesRankMovement × 0.25)
 *            + (socialEngagement × 0.25) + (searchTrend × 0.15)
 */
export function computeTrendScore(signals: TrendSignals): number {
  return (
    signals.reviewGrowth * 0.35 +
    signals.salesRankMovement * 0.25 +
    signals.socialEngagement * 0.25 +
    signals.searchTrend * 0.15
  );
}

/**
 * Generate deterministic pseudo-random trend signals for a product
 * using its id as seed. The same product always gets the same signals.
 */
export function getProductTrendSignals(productId: bigint): TrendSignals {
  const seed = Number(productId % BigInt(1000));
  const hash = (offset: number) => ((seed * 1234567 + offset * 98765) % 97) + 3; // 3-99

  return {
    reviewGrowth: hash(1),
    salesRankMovement: hash(2),
    socialEngagement: hash(3),
    searchTrend: hash(4),
    discountPct: hash(5) % 60, // 0-59%
  };
}

/**
 * Returns badge label based on trendScore and product flags.
 * Priority: Flash Deal (dealOfDay) > Trending Now (score>=80) > Hot Deal (score>=60) > Best Seller (featured)
 */
export function getProductBadge(
  trendScore: number,
  dealOfDay: boolean,
  featured: boolean,
): string {
  if (dealOfDay) return "Flash Deal";
  if (trendScore >= 80) return "Trending Now";
  if (trendScore >= 60) return "Hot Deal";
  if (featured) return "Best Seller";
  return "";
}
