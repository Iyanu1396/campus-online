import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

// Fetch user profile from Supabase
const fetchUserProfile = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned (profile not found)
        throw new Error("Profile not found");
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const useProfile = (userEmail) => {
  return useQuery({
    queryKey: ["profile", userEmail],
    queryFn: () => fetchUserProfile(userEmail),
    enabled: !!userEmail, // Only run query if userEmail exists
    retry: false, // Don't retry if profile not found
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
