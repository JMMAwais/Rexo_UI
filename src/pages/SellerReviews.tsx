import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reviewStats = { average: 4.3, total: 247, fiveStar: 45, fourStar: 30, threeStar: 15, twoStar: 7, oneStar: 3 };
const distribution = [
  { stars: 5, pct: reviewStats.fiveStar },
  { stars: 4, pct: reviewStats.fourStar },
  { stars: 3, pct: reviewStats.threeStar },
  { stars: 2, pct: reviewStats.twoStar },
  { stars: 1, pct: reviewStats.oneStar },
];

const reviews = [
  { id: 1, customer: "Ahmed Khan", product: "Wireless Earbuds Pro", rating: 5, date: "2024-01-15", comment: "Excellent sound quality and battery life. Best purchase this month!", replied: true },
  { id: 2, customer: "Sara Ali", product: "Smart Watch Ultra", rating: 4, date: "2024-01-14", comment: "Great watch, but the strap could be better quality. Overall satisfied.", replied: false },
  { id: 3, customer: "Usman Malik", product: "Cotton T-Shirt Pack", rating: 3, date: "2024-01-13", comment: "Average quality. Expected better fabric for the price.", replied: true },
  { id: 4, customer: "Ayesha Noor", product: "Running Shoes", rating: 5, date: "2024-01-12", comment: "Perfect fit and very comfortable for daily running. Highly recommend!", replied: false },
  { id: 5, customer: "Bilal Ahmed", product: "Laptop Stand", rating: 2, date: "2024-01-11", comment: "Wobbles a lot. Not sturdy enough for heavy laptops.", replied: false },
  { id: 6, customer: "Fatima Zahra", product: "Wireless Earbuds Pro", rating: 4, date: "2024-01-10", comment: "Good earbuds, noise cancellation works well. Charging case feels cheap though.", replied: true },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < count ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const SellerReviews = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <SellerSidebar active="Reviews" />
        <main className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold text-foreground font-display">Reviews</h1>

          {/* Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Rating Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">{reviewStats.average}</p>
                  <Stars count={Math.round(reviewStats.average)} />
                  <p className="text-xs text-muted-foreground mt-1">{reviewStats.total} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {distribution.map(({ stars, pct }) => (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-muted-foreground">{stars}</span>
                      <Star className="w-3 h-3 fill-warning text-warning" />
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-xs text-muted-foreground text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <ThumbsUp className="w-5 h-5 mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold text-foreground">75%</p>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-foreground">68%</p>
                  <p className="text-xs text-muted-foreground">Replied</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">All Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{r.customer}</span>
                        <Stars count={r.rating} />
                        {r.replied && <Badge variant="outline" className="text-xs">Replied</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{r.product} · {r.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                  {!r.replied && (
                    <Button variant="outline" size="sm" className="mt-2 text-xs">
                      <MessageSquare className="w-3 h-3 mr-1" /> Reply
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    <Footer />
  </div>
);

export default SellerReviews;
