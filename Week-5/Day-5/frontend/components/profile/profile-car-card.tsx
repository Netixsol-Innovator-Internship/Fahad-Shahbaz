import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Heart, Clock } from "lucide-react"

interface ProfileCarCardProps {
  car: {
    id: string
    name: string
    image: string
    price: string
    currentBid?: string
    winningBid?: string
    yourBid?: string
    rating: number
    timeLeft: string
    bids: number
    status?: "trending" | "ending"
    bidStatus?: "winning" | "current" | "outbid"
    actionType?: "bid" | "end" | "sold"
  }
}

export function ProfileCarCard({ car }: ProfileCarCardProps) {
  const getBidStatusColor = (status?: string) => {
    switch (status) {
      case "winning":
        return "text-green-600"
      case "current":
        return "text-red-600"
      case "outbid":
        return "text-gray-600"
      default:
        return "text-gray-900"
    }
  }

  const getActionButton = () => {
    switch (car.actionType) {
      case "end":
        return <Button className="w-full bg-blue-600 hover:bg-blue-700">End Bid</Button>
      case "sold":
        return (
          <Button variant="outline" className="w-full bg-transparent" disabled>
            Sold
          </Button>
        )
      default:
        return <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit A Bid</Button>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Status Badge */}
      {car.status && (
        <div className="relative">
          <div className="absolute top-2 left-2 z-10">
            <span
              className={cn(
                "px-2 py-1 text-xs font-medium rounded",
                car.status === "trending" ? "bg-red-500 text-white" : "bg-orange-500 text-white",
              )}
            >
              {car.status === "trending" ? "Trending" : "Ending"}
            </span>
          </div>
        </div>
      )}

      {/* Car Image */}
      <div className="relative h-48">
        <Image src={car.image || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
        <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Car Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{car.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn("h-4 w-4", i < car.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
            />
          ))}
        </div>

        {/* Pricing */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">{car.price}</span>
            <span className="text-sm text-gray-500">{car.bids} Total Bids</span>
          </div>

          {car.currentBid && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Current Bid</span>
              <span className={getBidStatusColor(car.bidStatus)}>{car.currentBid}</span>
            </div>
          )}

          {car.winningBid && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Winning Bid</span>
              <span className="text-green-600">{car.winningBid}</span>
            </div>
          )}

          {car.yourBid && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Your Current Bid</span>
              <span className={getBidStatusColor(car.bidStatus)}>{car.yourBid}</span>
            </div>
          )}
        </div>

        {/* Time and Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span>31</span>
            <span>20</span>
            <span>46</span>
            <span>23</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{car.timeLeft}</span>
          </div>
        </div>

        {/* Action Button */}
        {getActionButton()}
      </div>
    </div>
  )
}
