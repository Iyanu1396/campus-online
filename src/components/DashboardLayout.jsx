import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navigation from "./Navigation";
import ProfileSetupModal from "./ProfileSetupModal";
import { useProfile } from "../hooks/useProfile";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile(user?.email);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          navigate("/login");
          return;
        }

        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  // Show profile setup modal if profile not found
  useEffect(() => {
    if (user && !profileLoading && profileError) {
      setShowProfileSetup(true);
    }
  }, [user, profileLoading, profileError]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const queryClient = useQueryClient();

  // Profile setup mutation
  const profileSetupMutation = useMutation({
    mutationFn: async (profileData) => {
      try {
        let avatarUrl = null;

        // Handle avatar upload if provided
        if (
          profileData.avatarUrl &&
          profileData.avatarUrl.startsWith("data:")
        ) {
          // Convert base64 to blob
          const response = await fetch(profileData.avatarUrl);
          const blob = await response.blob();

          // Generate unique filename
          const fileExt = blob.type.split("/")[1];
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;

          // Upload to avatars bucket
          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("avatars").upload(fileName, blob, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Avatar upload failed: ${uploadError.message}`);
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(fileName);

          avatarUrl = publicUrl;
        }

        // Prepare profile data for database
        const profilePayload = {
          user_id: user.id,
          full_name: profileData.fullName,
          phone_number: profileData.phoneNumber,
          email: user.email,
          role: profileData.role,
          department: profileData.department || null,
          is_non_teaching_staff: profileData.isNonTeachingStaff || false,
          bio: profileData.bio || null,
          skills: profileData.skills,
          matric_number:
            profileData.role === "STUDENT" ? profileData.matricNumber : null,
          avatar_url: avatarUrl,
        };

        // Insert profile into database
        const { data: insertData, error: insertError } = await supabase
          .from("profiles")
          .insert([profilePayload])
          .select()
          .single();

        if (insertError) {
          throw new Error(`Profile creation failed: ${insertError.message}`);
        }

        return insertData;
      } catch (error) {
        console.error("Profile setup error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Profile setup completed successfully!");

      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", user?.email] });

      // Close profile setup modal
      setShowProfileSetup(false);

      // Navigate to profile page
      navigate("/dashboard/profile");
    },
    onError: (error) => {
      toast.error(`Profile setup failed: ${error.message}`);
    },
  });

  const handleProfileSetup = async (profileData) => {
    profileSetupMutation.mutate(profileData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation profile={profile} user={user} onSignOut={handleSignOut} />
      <Outlet />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        user={user}
        isOpen={showProfileSetup}
        onSubmit={handleProfileSetup}
        isSubmitting={profileSetupMutation.isPending}
      />
    </div>
  );
};

export default DashboardLayout;
