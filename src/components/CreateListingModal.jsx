import { useState } from "react";
import {
  X,
  Upload,
  Package,
  Tag,
  DollarSign,
  FileText,
  Image as ImageIcon,
  ImagesIcon,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const CreateListingModal = ({ isOpen, onClose, profileId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const queryClient = useQueryClient();

  // Updated categories to include skills/services
  const categories = [
    "Textbooks & Course Materials",
    "Electronics",
    "Furniture & Dorm Essentials",
    "Clothing & Apparel",
    "Sports Equipment",
    "Tickets & Events",
    "Roommates & Housing",
    "Skills & Services",
    "Tutoring & Academic Help",
    "Creative Services",
    "Tech Support",
    "Delivery & Errands",
    "Other",
  ];

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: async (listingData) => {
      try {
        let imageUrls = [];

        // Upload images if any (max 3)
        if (imageFiles.length > 0) {
          for (const file of imageFiles) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${profileId}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${fileExt}`;

            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("listing_img")
                .upload(fileName, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

            if (uploadError) {
              throw new Error(`Image upload failed: ${uploadError.message}`);
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from("listing_img").getPublicUrl(fileName);

            imageUrls.push(publicUrl);
          }
        }

        // Prepare listing data for database
        const listingPayload = {
          profile_id: profileId,
          title: listingData.title,
          description: listingData.description,
          price: parseFloat(listingData.price),
          category: listingData.category,
          images: imageUrls.length > 0 ? imageUrls : null,
        };

        // Insert listing into database
        const { data: insertData, error: insertError } = await supabase
          .from("listings")
          .insert([listingPayload])
          .select()
          .single();

        if (insertError) {
          throw new Error(`Listing creation failed: ${insertError.message}`);
        }

        return insertData;
      } catch (error) {
        console.error("Listing creation error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Listing created successfully!");

      // Invalidate and refetch listings
      queryClient.invalidateQueries({ queryKey: ["listings", profileId] });

      // Reset form
      resetForm();

      // Close modal
      onClose();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create listing: ${error.message}`);
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Validate file count (max 3 images)
    if (imageFiles.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      images: [],
    });
    setErrors({});
    setImageFiles([]);
    setImagePreviewUrls((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createListingMutation.mutate(formData);
  };

  const handleClose = () => {
    if (createListingMutation.isPending) return; // Prevent closing while submitting

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const isLoading = createListingMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 sm:px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Create New Listing
                </h2>
                <p className="text-sm text-gray-600">
                  Sell items or offer services to the campus community
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="e.g., MacBook Pro 2021, Calculus Tutoring, Graphic Design Services"
                disabled={isLoading}
                maxLength={100}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                placeholder="Describe your item or service in detail. Include features, experience, availability, etc."
                disabled={isLoading}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <p className="text-xs text-gray-400 ml-auto">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-semibold">₦</span>
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="0"
                    step="1"
                    min="0"
                    disabled={isLoading}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
                  disabled={isLoading}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Images (Optional)
                <span className="text-gray-500 font-normal ml-1">
                  - Max 3 images, 5MB each
                </span>
              </label>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isLoading || imageFiles.length >= 3}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${
                    isLoading || imageFiles.length >= 3
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          disabled={isLoading}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {imageFiles.length}/3 images selected
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Create Listing
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;
