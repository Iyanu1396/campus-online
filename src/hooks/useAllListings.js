import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useAllListings = (currentProfileId) => {
  return useQuery({
    queryKey: ["all-listings", currentProfileId],
    queryFn: async () => {
      try {
        // If no profile ID is provided, return empty array
        if (!currentProfileId) {
          return [];
        }

        const { data, error } = await supabase
          .from("listings")
          .select(
            `
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
           `
          )
          .neq("profile_id", currentProfileId)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching all listings:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
