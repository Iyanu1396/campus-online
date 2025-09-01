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

    // Format and enhance profile data
    const formattedProfile = {
      ...data,
      // Format display name
      displayName: data.full_name || "Unknown User",
      // Format role for display
      roleDisplay: data.role === "STUDENT" ? "Student" : "Staff",
      // Format department (handle null for non-teaching staff)
      departmentDisplay: data.is_non_teaching_staff
        ? "Non-Teaching Staff"
        : data.department || "Not specified",
      // Format matric number for students
      matricDisplay:
        data.role === "STUDENT" && data.matric_number
          ? data.matric_number
          : null,
      // Format skills array
      skillsDisplay: data.skills && data.skills.length > 0 ? data.skills : [],
      // Format bio
      bioDisplay: data.bio || "No bio provided",
      // Format avatar
      avatarDisplay: data.avatar_url || null,
      // Format phone number
      phoneDisplay: data.phone_number || "Not provided",

      // Add verification status (all profiles are verified by default)
      isVerified: true,
      // Add join date (using created_at if available, otherwise current date)
      joinDate: data.created_at
        ? new Date(data.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
    };

    return formattedProfile;
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
