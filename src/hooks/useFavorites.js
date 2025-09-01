import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useFavorites = (profileId) => {
  const queryClient = useQueryClient();

  // Fetch user's favorites
  const {
    data: favorites,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites", profileId],
    queryFn: async () => {
      if (!profileId) return [];

      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          *,
          listings:listing_id (
            *,
            profiles:profile_id (
              id,
              full_name,
              email,
              role,
              matric_number,
              department,
              created_at,
              is_non_teaching_staff,
              skills,
              bio,
              avatar_url,
              phone_number
            )
          )
        `
        )
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to favorites
  const addToFavorites = useMutation({
    mutationFn: async ({ profileId, listingId }) => {
      try {
        const { error } = await supabase.from("favorites").insert({
          profile_id: profileId,
          listing_id: listingId,
        });

        if (error) {
          console.error("Error adding to favorites:", error);
          throw error;
        }
        return { profileId, listingId };
      } catch (error) {
        console.error("Failed to add to favorites:", {
          profileId,
          listingId,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites", profileId]);
    },
    onError: (error) => {
      console.error("Add to favorites mutation failed:", error);
    },
  });

  // Remove from favorites
  const removeFromFavorites = useMutation({
    mutationFn: async ({ profileId, listingId }) => {
      try {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("profile_id", profileId)
          .eq("listing_id", listingId);

        if (error) {
          console.error("Error removing from favorites:", error);
          throw error;
        }
        return { profileId, listingId };
      } catch (error) {
        console.error("Failed to remove from favorites:", {
          profileId,
          listingId,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites", profileId]);
    },
    onError: (error) => {
      console.error("Remove from favorites mutation failed:", error);
    },
  });

  // Check if a listing is favorited
  const isFavorited = (listingId) => {
    return favorites?.some((fav) => fav.listing_id === listingId) || false;
  };

  return {
    favorites,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
  };
};
