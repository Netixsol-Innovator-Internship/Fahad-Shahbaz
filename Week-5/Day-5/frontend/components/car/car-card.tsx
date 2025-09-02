"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

interface CarCardProps {
  id: string;
  name: string;
  image: string;
  currentBid: string;
  timeLeft: string;
  status: string;
  isWaitingForBid?: boolean;
}

export function CarCard({
  id,
  name,
  image,
  currentBid,
  timeLeft,
  status,
  isWaitingForBid,
}: CarCardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleBidClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // Handle bid submission logic here
    console.log(`Submitting bid for car ${id}`);
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // Handle wishlist logic here
    console.log(`Adding car ${id} to wishlist`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
            {status}
          </span>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white"
          onClick={handleWishlistClick}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Car Image */}
        <div className="aspect-video w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={400}
            height={250}
            className="object-cover"
          />
        </div>
      </div>

      <CardContent>
        <h3 className="font-semibold text-lg mb-3">{name}</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Current Bid</p>
            <p className="font-bold text-lg">{currentBid}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {isWaitingForBid ? "Waiting for Bid" : "Current Bid"}
            </p>
          </div>
        </div>

        <Button
          className="w-full bg-[#2E3D83] hover:bg-blue-800 rounded-md cursor-pointer"
          onClick={handleBidClick}
        >
          {isAuthenticated ? "Submit A Bid" : "Login to Bid"}
        </Button>
      </CardContent>
    </Card>
  );
}
