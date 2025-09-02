"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserWishlistQuery,
} from "@/lib/api/wishlistApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";

interface WishlistButtonProps {
  carId: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function WishlistButton({
  carId,
  className = "",
  size = "sm",
}: WishlistButtonProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const { data: userWishlist = [] } = useGetUserWishlistQuery(user?._id || "", {
    skip: !user?._id || !isAuthenticated,
  });

  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  // Check if this car is in the user's wishlist
  const wishlistItem = useMemo(() => {
    return userWishlist.find((item) => {
      const itemCarId =
        typeof item.car === "string" ? item.car : (item.car as any)?._id;
      return itemCarId === carId;
    });
  }, [userWishlist, carId]);

  const isInWishlist = !!wishlistItem;
  const isLoading = isAdding || isRemoving;

  const handleToggleWishlist = async () => {
    if (!isAuthenticated || !user?._id) {
      toast({
        title: "Login required",
        description: "Please log in to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem._id).unwrap();
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        });
      } else {
        await addToWishlist({
          user: user._id,
          car: carId,
        }).unwrap();
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`p-2 ${className}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Star
        className={`h-4 w-4 ${
          isInWishlist ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }`}
      />
    </Button>
  );
}
