import { useState, useEffect } from "react";
import {
  User,
  Edit3,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Star,
  Award,
  Settings,
  Camera,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import ProfileSetupModal from "../components/ProfileSetupModal";

// Loading skeleton components
const LoadingSkeleton = () => (
  <div className="py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4 mx-auto sm:mx-0"></div>
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2 mx-auto sm:mx-0"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-28"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-40 mx-auto sm:mx-0"></div>
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Profile = ({ user, isLoading, error, profile }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const queryClient = useQueryClient();

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (profileData) => {
      try {
        let avatarUrl = profileData.avatarUrl;

        // Handle avatar upload if it's a new file (base64 data)
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

        // Prepare profile data for database update
        const profilePayload = {
          full_name: profileData.fullName,
          phone_number: profileData.phoneNumber,
          role: profileData.role,
          department: profileData.department || null,
          is_non_teaching_staff: profileData.isNonTeachingStaff || false,
          bio: profileData.bio || null,
          skills: profileData.skills,
          matric_number:
            profileData.role === "STUDENT" ? profileData.matricNumber : null,
          avatar_url: avatarUrl,
        };

        // Update profile in database
        const { data: updateData, error: updateError } = await supabase
          .from("profiles")
          .update(profilePayload)
          .eq("user_id", user.id)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Profile update failed: ${updateError.message}`);
        }

        return updateData;
      } catch (error) {
        console.error("Profile update error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");

      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", user?.email] });

      // Close edit modal
      setShowEditModal(false);
    },
    onError: (error) => {
      toast.error(`Profile update failed: ${error.message}`);
    },
  });

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleProfileSubmit = async (profileData) => {
    await profileUpdateMutation.mutateAsync(profileData);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to load your profile information. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-100">
                {profile?.avatarDisplay ? (
                  <img
                    src={profile.avatarDisplay}
                    alt={profile.displayName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center">
                    <User className="w-14 h-14 sm:w-18 sm:h-18 text-white" />
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {profile?.displayName && profile.displayName.length > 25
                      ? `${profile.displayName.substring(0, 25)}...`
                      : profile?.displayName}
                  </h1>

                  {/* Verified Badge */}
                  {profile?.isVerified && (
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-green-200">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{profile?.roleDisplay}</span>
                  </div>

                  {profile?.departmentDisplay && (
                    <div className="inline-flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-sm">
                        {profile?.departmentDisplay}
                      </span>
                    </div>
                  )}

                  {profile?.matricDisplay && (
                    <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-full">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span className="font-medium">
                        {profile?.matricDisplay}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100/50">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">
                      Phone Number
                    </p>
                    <p className="font-semibold text-gray-900">
                      {profile?.phoneDisplay || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-purple-50 hover:to-indigo-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">
                      Email Address
                    </p>
                    <p className="font-semibold text-gray-900">
                      {profile?.email}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">
                      Member Since
                    </p>
                    <p className="font-semibold text-gray-900">
                      {profile?.joinDate || "Recently joined"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {profile?.bioDisplay &&
              profile.bioDisplay !== "No bio provided" && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100/50">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    About Me
                  </h2>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {profile.bioDisplay}
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills & Expertise */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100/50">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                Skills & Expertise
              </h2>

              {profile?.skillsDisplay && profile.skillsDisplay.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsDisplay.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="text-center pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">
                        {profile.skillsDisplay.length}
                      </span>{" "}
                      skills listed
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No skills added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add skills to showcase your expertise
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileSetupModal
          user={user}
          isOpen={showEditModal}
          onSubmit={handleProfileSubmit}
          onCancel={handleCloseModal}
          isEditing={true}
          existingProfile={profile}
          loading={profileUpdateMutation.isPending}
        />
      )}
    </div>
  );
};

export default Profile;
