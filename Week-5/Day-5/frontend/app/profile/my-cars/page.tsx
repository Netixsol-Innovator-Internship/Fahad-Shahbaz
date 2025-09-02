"use client";

import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileCarCard } from "@/components/profile/profile-car-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useGetCarsQuery } from "@/lib/api/carsApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

// No static fallback; show empty state if none

export default function MyCarsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: userCars, isLoading, error } = useGetCarsQuery(undefined);

  // Filter cars owned by current user (this would ideally be done on backend)
  const userOwnedCars =
    userCars?.filter((car: any) => {
      const ownerId =
        typeof car.uploadedBy === "string"
          ? car.uploadedBy
          : car.uploadedBy?._id;
      return ownerId === user?._id;
    }) || [];

  // Map API cars to ProfileCarCard props expected shape
  const mappedCars = userOwnedCars.map((car: any) => ({
    id: car._id,
    name: car.title,
    image: car.images?.[0] || "/placeholder.jpg",
    price: `$${Number(car.price || 0).toLocaleString()}`,
    currentBid: undefined,
    winningBid: undefined,
    yourBid: undefined,
    rating: 5,
    timeLeft: "--",
    bids: 0,
    status: "trending" as const,
    bidStatus: undefined,
    actionType: "sold" as const,
  }));

  const carsToShow = mappedCars;

  return (
    <ProtectedRoute>
      <ProfileLayout>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">My Cars</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading cars
            </div>
          ) : carsToShow.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No cars found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carsToShow.map((car: any) => (
                <ProfileCarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </ProfileLayout>
    </ProtectedRoute>
  );
}
