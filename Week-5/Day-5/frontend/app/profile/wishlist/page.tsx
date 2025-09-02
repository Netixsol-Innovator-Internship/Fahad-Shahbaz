"use client";

import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileCarCard } from "@/components/profile/profile-car-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useGetUserWishlistQuery } from "@/lib/api/wishlistApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

export default function WishlistPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  console.log("Wishlist Debug - User:", user);
  console.log("Wishlist Debug - isAuthenticated:", isAuthenticated);

  const {
    data: userWishlist,
    isLoading,
    error,
  } = useGetUserWishlistQuery(user?._id || "", {
    skip: !user?._id || !isAuthenticated,
  });

  console.log("Wishlist Debug - Query result:", {
    userWishlist,
    isLoading,
    error,
  });

  // Show login message if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <ProtectedRoute>
        <ProfileLayout>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-8 text-gray-600">
              Please log in to view your wishlist.
            </div>
          </div>
        </ProfileLayout>
      </ProtectedRoute>
    );
  }

  // Extract cars from wishlist array
  const wishlistToShow = Array.isArray(userWishlist)
    ? userWishlist.map((item) => ({
        id: (item.car as any)?._id || "",
        name: (item.car as any)?.title || "",
        image: (item.car as any)?.images?.[0] || "/placeholder.jpg",
        price: `$${Number((item.car as any)?.price || 0).toLocaleString()}`,
        rating: 5,
        timeLeft: "--",
        bids: 0,
        status: "trending" as const,
        wishlistId: item._id, // Store wishlist ID for removal
      }))
    : [];

  return (
    <ProtectedRoute>
      <ProfileLayout>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">
            Wishlist ({wishlistToShow.length})
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading wishlist</div>
              <div className="text-sm text-gray-500">
                {JSON.stringify(error)}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          ) : wishlistToShow.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No items in your wishlist.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistToShow.map((car: any) => (
                <ProfileCarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </ProfileLayout>
    </ProtectedRoute>
  );
}
