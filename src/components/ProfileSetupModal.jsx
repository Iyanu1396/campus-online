import { useState, useEffect } from "react";
import { User, Upload, Check, Search, X, Trash2 } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

// Custom styles for phone input to match our design
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
  }
  
  .PhoneInputCountry {
    margin-right: 0.5rem;
  }
  
  .PhoneInputInput {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    padding: 0;
    margin: 0;
  }
  
  .PhoneInputInput::placeholder {
    color: #9CA3AF;
  }
`;

const ProfileSetupModal = ({
  user,
  isOpen,
  onCancel,
  onSubmit,
  isEditing = false,
  existingProfile = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    role: "STUDENT",
    department: "",
    isNonTeachingStaff: false,
    bio: "",
    skills: [],
    matricNumber: "",
    avatarUrl: null,
  });
  const [errors, setErrors] = useState({});
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  const queryClient = useQueryClient();

  // Avatar upload mutation
  const avatarUploadMutation = useMutation({
    mutationFn: async (file) => {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return publicUrl;
    },
    onError: (error) => {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    },
  });

  // Avatar delete mutation
  const avatarDeleteMutation = useMutation({
    mutationFn: async (avatarUrl) => {
      if (avatarUrl && avatarUrl.includes("supabase")) {
        const fileName = avatarUrl.split("/").pop();
        const { error } = await supabase.storage
          .from("avatars")
          .remove([fileName]);

        if (error) throw error;
      }
    },
    onError: (error) => {
      console.error("Error deleting avatar:", error);
      toast.error("Failed to delete avatar");
    },
  });

  // Populate form with existing profile data when editing
  useEffect(() => {
    if (isEditing && existingProfile) {
      setFormData({
        fullName: existingProfile.displayName || "",
        phoneNumber: existingProfile.phoneDisplay || "",
        role: existingProfile.role || "STUDENT",
        department: existingProfile.departmentDisplay || "",
        isNonTeachingStaff: existingProfile.isNonTeachingStaff || false,
        bio:
          existingProfile.bioDisplay === "No bio provided"
            ? ""
            : existingProfile.bioDisplay || "",
        skills: existingProfile.skillsDisplay || [],
        matricNumber: existingProfile.matricDisplay || "",
        avatarUrl: existingProfile.avatarDisplay || null,
      });
    }
  }, [isEditing, existingProfile]);

  // Generic skills for broader appeal
  const availableSkills = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "Graphic Design",
    "UI/UX Design",
    "Data Analysis",
    "Project Management",
    "Digital Marketing",
    "Content Writing",
    "Tutoring",
    "Mathematics",
    "Research",
    "Technical Writing",
    "Video Editing",
    "Photography",
    "3D Modeling",
    "Animation",
    "Music Production",
    "Language Translation",
    "Public Speaking",
    "Event Planning",
    "Social Media Management",
    "SEO/SEM",
    "E-commerce",
    "Customer Service",
    "Sales",
    "Accounting",
    "Business Analysis",
    "Consulting",
    "Training & Development",
    "Quality Assurance",
    "Technical Support",
    "Network Administration",
    "Database Management",
    "Cybersecurity",
    "Machine Learning",
    "Artificial Intelligence",
    "Blockchain",
    "Game Development",
    "Virtual Reality",
    "Cloud Computing",
  ];

  // All departments (formatted properly)
  const allDepartments = [
    "Department of Computer Science",
    "Department of Information Technology",
    "Department of Software Engineering",
    "Department of Data Science",
    "Department of Cybersecurity",
    "Department of Computer Engineering",
    "Department of Information Systems",
    "Department of Digital Arts",
    "Department of Game Development",
    "Department of Web Technologies",
    "Department of Mathematics",
    "Department of Physics",
    "Department of Chemistry",
    "Department of Biology",
    "Department of English",
    "Department of Business Administration",
    "Department of Economics",
    "Department of Psychology",
    "Department of Sociology",
    "Department of Political Science",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Handle non-teaching staff logic
      if (field === "isNonTeachingStaff" && value === true) {
        newData.department = "";
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, avatarUrl: e.target.result }));
      };
      reader.readAsDataURL(file);

      // Upload to storage
      try {
        const publicUrl = await avatarUploadMutation.mutateAsync(file);
        if (publicUrl) {
          setFormData((prev) => ({ ...prev, avatarUrl: publicUrl }));
        }
      } catch (error) {
        // Error is handled in the mutation
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      if (formData.avatarUrl) {
        await avatarDeleteMutation.mutateAsync(formData.avatarUrl);
      }
      setFormData((prev) => ({ ...prev, avatarUrl: null }));
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  // Format matric number as user types (e.g., 2301040208 -> 23-01-04-0208)
  const formatMatricNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as XX-XX-XX-XXXX
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 6)
      return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
    if (digits.length <= 10)
      return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(
        4,
        6
      )}-${digits.slice(6)}`;

    // Limit to 10 digits
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(
      4,
      6
    )}-${digits.slice(6, 10)}`;
  };

  // Filter skills based on search query
  const filteredSkills = availableSkills.filter((skill) =>
    skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!formData.phoneNumber.startsWith("+")) {
      newErrors.phoneNumber = "Please enter a valid international phone number";
    }

    if (
      !formData.department &&
      !(formData.role === "STAFF" && formData.isNonTeachingStaff)
    ) {
      newErrors.department = "Department is required";
    }

    if (formData.role === "STUDENT" && !formData.matricNumber) {
      newErrors.matricNumber = "Matric number is required for students";
    }

    if (formData.skills.length < 2) {
      newErrors.skills = "Please select at least 2 skills";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Call the onSubmit prop instead of using local mutation
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const isLoading =
    loading || avatarUploadMutation.isPending || avatarDeleteMutation.isPending;

  return (
    <>
      <style>{phoneInputStyles}</style>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 px-6 sm:px-8 py-6 border-b border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {isEditing ? "Edit Your Profile" : "Complete Your Profile"}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isEditing
                  ? "Update your profile information"
                  : "Set up your profile to get started with Campus Online"}
              </p>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
            <form
              onSubmit={handleSubmit}
              className="px-6 sm:px-8 py-6 space-y-6"
            >
              {/* Profile Image Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    {isLoading ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>

                  {/* Delete Button */}
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      disabled={isLoading}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                      title="Remove photo"
                    >
                      {isLoading ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <X className="w-3 h-3 text-white" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click the + icon to upload a profile photo
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  countryCallingCodeEditable={false}
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phoneNumber ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  I am a *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["STUDENT", "STAFF"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleInputChange("role", role)}
                      disabled={isLoading}
                      className={`px-4 py-3 rounded-xl border-2 transition-all font-medium disabled:opacity-50 ${
                        formData.role === role
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {role === "STUDENT" ? "Student" : "Staff"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department */}
              {!(formData.role === "STAFF" && formData.isNonTeachingStaff) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.department ? "border-red-300" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:opacity-50`}
                  >
                    <option value="">Select your department</option>
                    {allDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
              )}

              {/* Non-Teaching Staff Checkbox (for staff only) */}
              {formData.role === "STAFF" && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNonTeachingStaff}
                      onChange={(e) =>
                        handleInputChange(
                          "isNonTeachingStaff",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        I am non-teaching staff
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Select this if you work in administration, IT support,
                        maintenance, etc.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Matric Number (for students) */}
              {formData.role === "STUDENT" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Matric Number *
                  </label>
                  <input
                    type="text"
                    value={formData.matricNumber}
                    onChange={(e) => {
                      const formatted = formatMatricNumber(e.target.value);
                      handleInputChange("matricNumber", formatted);
                    }}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.matricNumber ? "border-red-300" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50`}
                    placeholder="23-01-04-0208"
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: XX-XX-XX-XXXX (e.g., 23-01-04-0208)
                  </p>
                  {errors.matricNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.matricNumber}
                    </p>
                  )}
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Bio
                  <span className="text-gray-500 font-normal ml-1">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    maxLength={300}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
                    placeholder="Tell us a bit about yourself, your interests, or what you're passionate about..."
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {formData.bio.length}/300
                  </div>
                </div>
              </div>

              {/* Skills Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills & Expertise * (Select at least 2)
                </label>

                {/* Skills Search */}
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
                    placeholder="Search for skills..."
                  />
                  {skillSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSkillSearchQuery("")}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Selected Skills Display */}
                {formData.skills.length > 0 && (
                  <div className="mb-3 p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Skills ({formData.skills.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleInputChange("skills", [])}
                        disabled={isLoading}
                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-lg"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            disabled={isLoading}
                            className="hover:bg-blue-600 rounded-full p-0.5 disabled:opacity-50"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Grid */}
                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                  {filteredSkills.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          disabled={isLoading}
                          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all text-left disabled:opacity-50 ${
                            formData.skills.includes(skill)
                              ? "bg-blue-500 text-white shadow-md transform scale-105"
                              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {formData.skills.includes(skill) && (
                              <Check className="w-3 h-3 flex-shrink-0" />
                            )}
                            <span className="truncate">{skill}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">
                        No skills found for "{skillSearchQuery}"
                      </p>
                      <p className="text-xs mt-1">
                        Try a different search term
                      </p>
                    </div>
                  )}
                </div>

                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isEditing ? "Updating..." : "Setting up..."}
                    </>
                  ) : avatarUploadMutation.isPending ||
                    avatarDeleteMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : isEditing ? (
                    "Update Profile"
                  ) : (
                    "Complete Profile Setup"
                  )}
                </button>

                {/* Cancel Button (only show when editing) */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSetupModal;
