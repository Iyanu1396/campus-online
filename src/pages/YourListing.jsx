import {
  MessageSquare,
  Plus,
  Package,
  Tag,
  Calendar,
  Trash2,
  Edit3,
  Eye,
  X,
  Save,
  Upload,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useListings } from "../hooks/useListings";
import { useState } from "react";
import CreateListingModal from "../components/CreateListingModal";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const YourListing = ({ profile }) => {
  const {
    data: listings,
    isLoading,
    error,
    refetch,
  } = useListings(profile?.id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviewUrls, setNewImagePreviewUrls] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  // Image viewer states
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewerImages, setViewerImages] = useState([]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openDetailModal = (listing) => {
    setSelectedListing(listing);
    setEditFormData({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
    });
    setNewImageFiles([]);
    setNewImagePreviewUrls([]);
    setImagesToRemove([]);
    setIsEditing(false);
    setIsDetailModalOpen(true);
  };

  const openDeleteModal = (listing) => {
    setListingToDelete(listing);
    setIsDeleteModalOpen(true);
  };

  const openImageViewer = (images, startIndex = 0) => {
    setViewerImages(images);
    setCurrentImageIndex(startIndex);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setViewerImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % viewerImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + viewerImages.length) % viewerImages.length
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      title: selectedListing.title,
      description: selectedListing.description,
      price: selectedListing.price,
      category: selectedListing.category,
    });
    setNewImageFiles([]);
    setNewImagePreviewUrls([]);
    setImagesToRemove([]);
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Check total image count (existing - removed + new)
    const currentImageCount =
      (selectedListing.images?.length || 0) - imagesToRemove.length;
    const totalAfterUpload =
      currentImageCount + newImageFiles.length + files.length;

    if (totalAfterUpload > 5) {
      const allowedCount = 5 - currentImageCount - newImageFiles.length;
      if (allowedCount <= 0) {
        toast.error("Maximum 5 images allowed. Remove some images first.");
        return;
      }
      toast.error(
        `You can only add ${allowedCount} more image(s). Maximum 5 images allowed.`
      );
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setNewImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const removeExistingImage = (imageUrl) => {
    setImagesToRemove((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((url) => url !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedListing) return;

    setIsSaving(true);
    try {
      let updatedImageUrls = [];

      // Handle new image uploads
      if (newImageFiles.length > 0) {
        for (const file of newImageFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${profile?.id}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("listing_img").upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("listing_img").getPublicUrl(fileName);

          updatedImageUrls.push(publicUrl);
        }
      }

      // Add existing images that weren't removed
      const existingImages =
        selectedListing.images?.filter(
          (img) => !imagesToRemove.includes(img)
        ) || [];
      updatedImageUrls = [...existingImages, ...updatedImageUrls];

      // Update listing in database
      const { error } = await supabase
        .from("listings")
        .update({
          title: editFormData.title,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          category: editFormData.category,
          images: updatedImageUrls.length > 0 ? updatedImageUrls : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedListing.id);

      if (error) {
        throw error;
      }

      toast.success("Listing updated successfully!");
      setIsEditing(false);

      // Clean up preview URLs
      newImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setNewImageFiles([]);
      setNewImagePreviewUrls([]);
      setImagesToRemove([]);

      refetch();

      // Update the selected listing with new data
      setSelectedListing((prev) => ({
        ...prev,
        ...editFormData,
        images: updatedImageUrls,
        updated_at: new Date().toISOString(),
      }));
    } catch (error) {
      toast.error(`Failed to update listing: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingToDelete.id);

      if (error) {
        throw error;
      }

      toast.success("Listing deleted successfully!");
      setIsDeleteModalOpen(false);
      setListingToDelete(null);
      refetch();
      setIsDetailModalOpen(false);
    } catch (error) {
      toast.error(`Failed to delete listing: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Your Listings
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Manage your marketplace listings and track your sales
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Listing</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

        {/* Listings Grid */}
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-gray-100"
                onClick={() => openDetailModal(listing)}
              >
                {/* Image */}
                <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {listing.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          +{listing.images.length - 1} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <Package className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(listing);
                      }}
                      className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(listing);
                      }}
                      className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        listing.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : listing.status === "SOLD"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                      <span className="text-green-600">₦</span>
                      {listing.price?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Tag className="w-4 h-4" />
                      <span className="truncate max-w-20">
                        {listing.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              No Listings Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
              You haven't created any listings yet. Start selling your items to
              the campus community!
            </p>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
            >
              <Plus className="w-5 sm:w-6 h-5 sm:h-6" />
              Create Your First Listing
            </button>
          </div>
        )}

        {/* Create Listing Modal */}
        <CreateListingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          profileId={profile?.id}
          onSuccess={handleCreateSuccess}
        />

        {/* Image Viewer Modal */}
        {isImageViewerOpen && viewerImages.length > 0 && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeImageViewer}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              {viewerImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={viewerImages[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Image Counter */}
              {viewerImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} of {viewerImages.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Listing Detail Modal */}
        {isDetailModalOpen && selectedListing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <Package className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Listing Details
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        View and edit your listing information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                  {/* Images */}
                  {((selectedListing.images &&
                    selectedListing.images.length > 0) ||
                    newImagePreviewUrls.length > 0) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Images (
                          {(
                            selectedListing.images?.filter(
                              (img) => !imagesToRemove.includes(img)
                            ) || []
                          ).length + newImagePreviewUrls.length}
                          /5)
                        </h3>
                        {isEditing && (
                          <span className="text-sm text-gray-500">
                            Click images to remove • {imagesToRemove.length}{" "}
                            marked for removal
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Existing Images */}
                        {selectedListing.images?.map((image, index) => (
                          <div key={index} className="relative group">
                            <div
                              className={`relative w-full h-24 sm:h-32 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                imagesToRemove.includes(image)
                                  ? "opacity-50 ring-2 ring-red-500"
                                  : "hover:shadow-lg"
                              } ${isEditing ? "hover:scale-105" : ""}`}
                              onClick={() => {
                                if (isEditing) {
                                  removeExistingImage(image);
                                } else {
                                  openImageViewer(
                                    selectedListing.images,
                                    index
                                  );
                                }
                              }}
                            >
                              <img
                                src={image}
                                alt={`${selectedListing.title} - Image ${
                                  index + 1
                                }`}
                                className="w-full h-full object-cover"
                              />
                              {!isEditing && (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              )}
                              {isEditing && (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center">
                                  <Trash2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              )}
                              {imagesToRemove.includes(image) && (
                                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                                  <X className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* New Image Previews */}
                        {newImagePreviewUrls.map((url, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <div className="relative w-full h-24 sm:h-32 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 ring-2 ring-blue-500">
                              <img
                                src={url}
                                alt={`New Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                NEW
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNewImage(index);
                                }}
                                disabled={isSaving}
                                className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center"
                              >
                                <Trash2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Image Upload (Edit Mode) */}
                  {isEditing && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Add New Images
                      </h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="edit-image-upload"
                          disabled={isSaving}
                        />
                        <label
                          htmlFor="edit-image-upload"
                          className={`cursor-pointer ${
                            isSaving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload new images
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB each • Maximum 5 images
                            total
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Basic Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Title
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) =>
                                  handleInputChange("title", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                maxLength={100}
                                placeholder="Enter listing title"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">
                                {selectedListing.title}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Description
                            </label>
                            {isEditing ? (
                              <textarea
                                value={editFormData.description}
                                onChange={(e) =>
                                  handleInputChange(
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                                maxLength={500}
                                placeholder="Describe your item"
                              />
                            ) : (
                              <p className="text-gray-900">
                                {selectedListing.description}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Category
                            </label>
                            {isEditing ? (
                              <select
                                value={editFormData.category}
                                onChange={(e) =>
                                  handleInputChange("category", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                              >
                                {categories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <p className="text-gray-900 font-medium">
                                {selectedListing.category}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Price
                            </label>
                            {isEditing ? (
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                                  ₦
                                </span>
                                <input
                                  type="number"
                                  value={editFormData.price}
                                  onChange={(e) =>
                                    handleInputChange("price", e.target.value)
                                  }
                                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  step="1"
                                  min="0"
                                  placeholder="0"
                                />
                              </div>
                            ) : (
                              <p className="text-green-600 font-bold text-xl">
                                ₦{selectedListing.price?.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Timestamps */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Status & Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Status
                            </label>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                selectedListing.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : selectedListing.status === "SOLD"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {selectedListing.status}
                            </span>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Created
                            </label>
                            <p className="text-gray-900">
                              {formatDate(selectedListing.created_at)}
                            </p>
                          </div>
                          {selectedListing.updated_at && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 mb-1 block">
                                Last Updated
                              </label>
                              <p className="text-gray-900">
                                {formatDate(selectedListing.updated_at)}
                              </p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Listing ID
                            </label>
                            <p className="text-gray-900 font-mono text-sm">
                              #{selectedListing.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 hover:shadow-lg"
                        >
                          {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          <Edit3 className="w-5 h-5" />
                          Edit Listing
                        </button>
                        <button
                          onClick={() => openDeleteModal(selectedListing)}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                        <button
                          onClick={() => setIsDetailModalOpen(false)}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                        >
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && listingToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform scale-95 animate-pulse">
              <div className="text-center mb-6">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 sm:w-10 h-8 sm:h-10 text-red-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Delete Listing
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Are you sure you want to delete "
                  <span className="font-medium">{listingToDelete.title}</span>"?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteListing}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete Permanently"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourListing;
