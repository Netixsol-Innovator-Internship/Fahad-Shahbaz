"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { ImageGallery } from "@/components/auction/image-gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, User, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetAuctionQuery } from "@/lib/api/auctionsApiSlice";
import { useCreateBidMutation } from "@/lib/api/bidsApiSlice";
import { useGetUserQuery } from "@/lib/api/usersApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuctionDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const {
    data: auction,
    isLoading,
    refetch,
  } = useGetAuctionQuery(id, { skip: !id });
  const [createBid, { isLoading: bidLoading }] = useCreateBidMutation();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState<number | null>(null);

  const carImages = auction?.car?.images?.length
    ? auction.car.images
    : [
        "/range-rover-white-suv-main-view.png",
        "/range-rover-red-suv-front-view.png",
        "/range-rover-red-suv-side-view.png",
        "/range-rover-red-suv-rear-view.png",
        "/range-rover-interior-dashboard.png",
      ];

  // Debug logging - clean output
  useEffect(() => {
    if (auction?.bids) {
      console.log("Auction has", auction.bids.length, "bids");
      if (auction.bids.length > 0) {
        console.log("Sample bid:", JSON.stringify(auction.bids[0], null, 2));
      }
    }
  }, [auction]);

  // Sort bids descending by amount and derive helpers
  const sortedBids = (auction?.bids || [])
    .slice()
    .sort((a, b) => Number(b.amount) - Number(a.amount));

  const bidders = sortedBids.map((b, index) => {
    const bidderObj =
      (typeof b.bidder === "object" && b.bidder ? (b.bidder as any) : null) ||
      null;
    const result = {
      id: (b as any)._id || `bid-${index}`,
      bidderId:
        (typeof b.bidder === "string" && b.bidder
          ? (b.bidder as string)
          : bidderObj?._id) || undefined,
      name: bidderObj?.name || "Anonymous",
      email: bidderObj?.email || undefined,
      phone: bidderObj?.phone || undefined,
      amountNumber: Number(b.amount),
      amount: `$${Number(b.amount).toLocaleString()}`,
      createdAt: b?.createdAt
        ? new Date(b.createdAt).toLocaleString()
        : undefined,
    };
    return result;
  });
  const topBid = sortedBids[0];
  const topBidderObj =
    (topBid && typeof topBid.bidder === "object"
      ? (topBid.bidder as any)
      : null) || null;
  const topBidderId: string | undefined =
    (topBid && typeof topBid.bidder === "string"
      ? (topBid.bidder as string)
      : topBidderObj?._id) || undefined;
  const { data: topUser } = useGetUserQuery(topBidderId as string, {
    skip: !topBidderId || !isAuthenticated,
  });

  const minNextBid = Number(auction?.currentPrice || 0) + 1;
  // Initialize bid amount to min next bid when auction loads/updates
  // so user can submit immediately without typing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setBidAmount(minNextBid);
  }, [minNextBid]);
  const nowTs = Date.now();
  const hasTimes = auction?.startTime && auction?.endTime;
  const notStarted = hasTimes
    ? nowTs < new Date(auction!.startTime).getTime()
    : false;
  const ended = hasTimes
    ? nowTs >= new Date(auction!.endTime).getTime()
    : false;
  // If backend marks it live, allow bidding even if startTime is in the future
  const notStartedEffective = notStarted && auction?.status !== "live";

  const handleSubmitBid = async () => {
    if (!isAuthenticated || !user?._id) {
      toast({
        title: "Login required",
        description: "Please log in to place a bid.",
        variant: "destructive",
      });
      return;
    }
    if (!auction?._id) return;
    const effectiveAmount = bidAmount ?? minNextBid;
    if (!effectiveAmount || effectiveAmount < minNextBid) {
      toast({
        title: "Invalid amount",
        description: `Bid must be at least $${minNextBid.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }
    try {
      await createBid({
        auction: auction._id,
        bidder: user._id,
        amount: effectiveAmount,
      }).unwrap();
      toast({
        title: "Bid placed",
        description: "Your bid has been submitted.",
      });
      setBidAmount(minNextBid + 1);
      refetch();
    } catch (err: any) {
      toast({
        title: "Bid failed",
        description: err?.data?.message || err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Child component to resolve user display by ID
  const BidderName: React.FC<{ bidderId?: string; fallback?: string }> = ({
    bidderId,
    fallback,
  }) => {
    const { data } = useGetUserQuery(bidderId as string, {
      skip: !bidderId || !isAuthenticated,
    });
    return <span>{data?.name || fallback || "Anonymous"}</span>;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <PageHeader
        title={auction?.car?.title || "Auction Detail"}
        description="Browse auction details and place your bid."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction", href: "/auction" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Description */}
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery
                images={carImages}
                alt={auction?.car?.title || "Car"}
              />

              {/* Auction Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-2xl font-bold">
                    {auction?.status || "--"}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-2xl font-bold">
                    {auction?.currentPrice?.toLocaleString?.() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Current Price</div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-2xl font-bold">
                    {auction?.bids?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Bids</div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-2xl font-bold">
                    {auction?.car?.year || "--"}
                  </div>
                  <div className="text-sm text-gray-600">Year</div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-2xl font-bold">
                    {auction?.car?.make || "--"}
                  </div>
                  <div className="text-sm text-gray-600">Make</div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-2xl font-bold">
                    {auction?.car?.model || "--"}
                  </div>
                  <div className="text-sm text-gray-600">Model</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600 mb-4">
                  {auction?.car?.description || "No description provided."}
                </p>
              </div>

              {/* Top Bidder - dynamic */}
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Top Bidder</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                    <div>
                      <div className="text-sm text-gray-300">Full Name</div>
                      <div className="font-medium">
                        {topUser?.name ||
                          topBidderObj?.name ||
                          bidders?.[0]?.name ||
                          "--"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Email</div>
                      <div className="font-medium">
                        {topUser?.email || topBidderObj?.email || "--"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Mobile Number</div>
                      <div className="font-medium">
                        {topUser?.phone || topBidderObj?.phone || "--"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Nationality</div>
                      <div className="font-medium">--</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Bidding */}
            <div className="space-y-6">
              {/* Current Bid Display */}
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {auction?.currentPrice
                    ? `$${Number(auction.currentPrice).toLocaleString()}`
                    : "--"}
                </div>
                <div className="text-gray-600">Current Bid</div>
              </div>

              {/* Bid Input */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold">
                    {auction?.bids?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Bid Placed</div>
                </div>

                {notStartedEffective && (
                  <div className="mb-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded">
                    Auction hasn’t started yet.
                  </div>
                )}
                {ended && (
                  <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
                    Auction has ended.
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setBidAmount((b) =>
                        Math.max(minNextBid, (b ?? minNextBid) - 1)
                      )
                    }
                    disabled={bidLoading}
                  >
                    -
                  </Button>
                  <Input
                    value={bidAmount ?? minNextBid}
                    onChange={(e) =>
                      setBidAmount(Number(e.target.value) || minNextBid)
                    }
                    className="text-center"
                    type="number"
                    min={minNextBid}
                    disabled={bidLoading || notStartedEffective || ended}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBidAmount((b) => (b ?? minNextBid) + 1)}
                    disabled={bidLoading}
                  >
                    +
                  </Button>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitBid}
                  disabled={bidLoading || notStartedEffective || ended}
                >
                  {bidLoading ? "Submitting..." : "Submit A Bid"}
                </Button>
              </div>

              {/* Bidders List */}
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Bidders List</h3>
                {bidders.length === 0 ? (
                  <div className="text-sm text-blue-100">No bids yet.</div>
                ) : (
                  <div className="space-y-3">
                    {bidders.map((bidder, index) => (
                      <div
                        key={bidder.id || index}
                        className={`p-3 rounded bg-blue-800/40 border border-blue-700 flex items-start justify-between gap-4 ${
                          index === 0 ? "ring-1 ring-green-400/60" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-700">
                              #{index + 1}
                            </span>
                            <span className="font-medium truncate">
                              <BidderName
                                bidderId={bidder.bidderId}
                                fallback={bidder.name}
                              />
                            </span>
                            {index === 0 && (
                              <span className="text-xs text-green-300">
                                Top
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-blue-200 mt-1">
                            {bidder.createdAt || "--"}
                          </div>
                        </div>
                        <div className="shrink-0 font-semibold">
                          {bidder.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Bidders */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Top Bidders</h3>
                {bidders.length === 0 ? (
                  <div className="text-sm text-gray-500">No bidders yet.</div>
                ) : (
                  <div className="space-y-2">
                    {bidders.slice(0, 3).map((b, i) => (
                      <div
                        key={b.id || i}
                        className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div className="truncate">
                            <div className="font-medium truncate">
                              <BidderName
                                bidderId={b.bidderId}
                                fallback={b.name}
                              />
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {b.createdAt || "--"}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">{b.amount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
