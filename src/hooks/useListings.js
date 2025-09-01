import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const fetchListings = async (profileId) => {
  if (!profileId) return [];

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const useListings = (profileId) => {
  return useQuery({
    queryKey: ["listings", profileId],
    queryFn: () => fetchListings(profileId),
    enabled: !!profileId,
  });
};
