import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useAllListings = (currentProfileId, page = 1, pageSize = 12) => {
  return useQuery({
    queryKey: ["all-listings", currentProfileId, page, pageSize],
    queryFn: async () => {
      try {
        // If no profile ID is provided, return empty array
        if (!currentProfileId) {
          return { data: [], total: 0, page: 1, pageSize };
        }

        // Calculate offset for pagination
        const offset = (page - 1) * pageSize;

        // Get total count first
        const { count, error: countError } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .neq("profile_id", currentProfileId);

        if (countError) {
          throw countError;
        }

        // Get paginated data
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
          .order("created_at", { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (error) {
          throw error;
        }

        return {
          data: data || [],
          total: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize),
        };
      } catch (error) {
        console.error("Error fetching all listings:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
