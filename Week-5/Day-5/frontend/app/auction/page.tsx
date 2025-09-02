"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { FilterSidebar } from "@/components/auction/filter-sidebar";
import { AuctionCard } from "@/components/auction/auction-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAuctionsQuery } from "@/lib/api/auctionsApiSlice";
import { Loader2 } from "lucide-react";
import { Auction } from "@/lib/types";

export default function AuctionPage() {
  const {
    data: auctions,
    isLoading: auctionsLoading,
    error: auctionsError,
  } = useGetAuctionsQuery();

  const auctionItems: (Auction | any)[] = auctions || [];

  return (
    <div className="min-h-screen">
      <Header />
      <PageHeader
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction", href: "/auction" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-blue-900 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
              <span>
                Showing 1-{auctionItems.length} of {auctionItems.length} Results
              </span>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error state */}
            {auctionsError ? (
              <div className="text-center text-red-600 py-4">
                Failed to load auctions.
              </div>
            ) : null}

            {/* Car Grid */}
            {auctionsLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
              </div>
            ) : auctionItems.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No auctions found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {auctionItems.map((auction) => (
                  <AuctionCard
                    key={auction._id}
                    id={auction._id}
                    carId={auction?.car?._id || auction?.car || ""}
                    name={auction?.car?.title || "Untitled Car"}
                    image={auction?.car?.images?.[0] || "/placeholder.jpg"}
                    price={`$${Number(
                      auction?.car?.price || 0
                    ).toLocaleString()}`}
                    currentBid={`$${Number(
                      auction.currentPrice || 0
                    ).toLocaleString()}`}
                    rating={5}
                    bids={Array.isArray(auction.bids) ? auction.bids.length : 0}
                    endTime={
                      auction.endTime
                        ? new Date(auction.endTime).toLocaleString()
                        : "--"
                    }
                    endDate={"End Time"}
                    status={auction.status}
                    endAtISO={auction.endTime}
                    lastBid={
                      Array.isArray(auction.bids) && auction.bids.length > 0
                        ? `$${Number(
                            auction.bids[auction.bids.length - 1]?.amount || 0
                          ).toLocaleString()}`
                        : undefined
                    }
                    lastBidAt={
                      Array.isArray(auction.bids) && auction.bids.length > 0
                        ? new Date(
                            auction.bids[auction.bids.length - 1]?.createdAt
                          ).toLocaleString()
                        : undefined
                    }
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              <button className="px-3 py-2 text-gray-500">‹</button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded">
                2
              </button>
              <button className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded">
                3
              </button>
              <button className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded">
                4
              </button>
              <button className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded">
                5
              </button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded">
                10
              </button>
              <button className="px-3 py-2 text-gray-500">›</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <FilterSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
