"use client";

import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileCarCard } from "@/components/profile/profile-car-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useGetBidsQuery } from "@/lib/api/bidsApiSlice";
import { useGetAuctionsQuery } from "@/lib/api/auctionsApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

// No static fallback; show empty state if none

export default function MyBidsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: allBids,
    isLoading: bidsLoading,
    error: bidsError,
  } = useGetBidsQuery();
  const { data: auctions, isLoading: auctionsLoading } = useGetAuctionsQuery();

  // Filter bids by current user
  const userBids = (allBids || []).filter((bid: any) => {
    const bidderId =
      typeof bid.bidder === "string" ? bid.bidder : bid.bidder?._id;
    return bidderId === user?._id;
  });

  // Map to ProfileCarCard props by joining with auctions (to get car details)
  const mapped = userBids.map((bid: any) => {
    const auctionId =
      typeof bid.auction === "string" ? bid.auction : bid.auction?._id;
    const auction = (auctions || []).find((a: any) => a._id === auctionId);
    const car = auction?.car;
    return {
      id: bid._id,
      name: car?.title || "Auction Item",
      image: car?.images?.[0] || "/placeholder.jpg",
      price: car?.price ? `$${Number(car.price).toLocaleString()}` : "--",
      currentBid: bid.amount ? `$${Number(bid.amount).toLocaleString()}` : "--",
      winningBid: undefined,
      yourBid: undefined,
      rating: 5,
      timeLeft: auction?.endTime
        ? new Date(auction.endTime).toLocaleString()
        : "--",
      bids: Array.isArray(auction?.bids) ? auction.bids.length : 0,
      status: auction?.status || undefined,
      bidStatus: undefined,
      actionType: "bid" as const,
    };
  });

  const isLoading = bidsLoading || auctionsLoading;
  const error = bidsError;
  const bidsToShow = mapped;

  return (
    <ProtectedRoute>
      <ProfileLayout>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">My Bids</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading bids
            </div>
          ) : bidsToShow.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No bids found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bidsToShow.map((car: any) => (
                <ProfileCarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </ProfileLayout>
    </ProtectedRoute>
  );
}
