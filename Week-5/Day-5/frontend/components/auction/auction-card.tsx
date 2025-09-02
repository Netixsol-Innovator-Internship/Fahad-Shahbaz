import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/wishlist/wishlist-button";

interface AuctionCardProps {
  id: string;
  carId: string;
  name: string;
  image: string;
  price: string;
  currentBid: string;
  rating: number;
  bids: number;
  endTime: string;
  endDate: string;
  status?: string;
  lastBid?: string;
  lastBidAt?: string;
  endAtISO?: string;
}

function getRemainingTime(endAtISO?: string): string | null {
  if (!endAtISO) return null;

  const endTime = new Date(endAtISO);
  const now = new Date();

  if (now >= endTime) {
    return "Ended";
  }

  const diff = endTime.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function AuctionCard({
  id,
  carId,
  name,
  image,
  price,
  currentBid,
  rating,
  bids,
  endTime,
  endDate,
  status,
  lastBid,
  lastBidAt,
  endAtISO,
}: AuctionCardProps) {
  const statusLower = (status || "").toLowerCase();
  const statusBadgeClass =
    statusLower === "live"
      ? "bg-green-600"
      : statusLower === "ended"
      ? "bg-red-600"
      : "bg-blue-600";

  const remaining = getRemainingTime(endAtISO);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {status && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white z-10 ${statusBadgeClass}`}
          >
            {status}
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton carId={carId} />
        </div>
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={300}
          height={200}
          className="w-full h-48 object-contain"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {lastBid ? (
            <span>
              Last bid: <span className="font-medium">{lastBid}</span>
              {lastBidAt ? ` • ${lastBidAt}` : ""}
            </span>
          ) : (
            <span>Be the first to bid</span>
          )}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-bold">{price}</div>
            <div className="text-sm text-gray-500">
              Current bid: {currentBid}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{bids}</div>
            <div className="text-sm text-gray-500">
              {bids === 1 ? "Bid" : "Bids"}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📅</span>
            <span>📞</span>
            <span>⭐</span>
            <span>📍</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {remaining
                ? remaining === "Ended"
                  ? "Ended"
                  : `Ends in ${remaining}`
                : endTime}
            </div>
            <div className="text-sm text-gray-500">{endDate}</div>
          </div>
        </div>

        <Link href={`/auction/${id}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Submit A Bid
          </Button>
        </Link>
      </div>
    </div>
  );
}
