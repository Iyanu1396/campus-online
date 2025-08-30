import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navigation from "./Navigation";
import ProfileSetupModal from "./ProfileSetupModal";
import { useProfile } from "../hooks/useProfile";
import toast from "react-hot-toast";

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

  const handleProfileSetup = async (profileData) => {
    console.log(profileData);
    toast.success("Profile setup completed successfully!");
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
      <Navigation user={user} onSignOut={handleSignOut} />
      <Outlet />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        user={user}
        isOpen={showProfileSetup}
        onSubmit={handleProfileSetup}
      />
    </div>
  );
};

export default DashboardLayout;
