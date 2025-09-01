import {
  ShoppingBag,
  Search,
  Filter,
  Tag,
  Calendar,
  User,
  X,
  ChevronDown,
  MapPin,
  Shield,
  Clock,
  Package,
  Star,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>WhatsApp icon</title>
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      fill="currentColor"
    />
  </svg>
);
import { useAllListings } from "../hooks/useAllListings";
import { useFavorites } from "../hooks/useFavorites";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

const Marketplace = ({ profile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Items per page

  const {
    data: listingsData,
    isLoading,
    error,
  } = useAllListings(profile?.id, currentPage, pageSize);
  const { favorites, addToFavorites, removeFromFavorites, isFavorited } =
    useFavorites(profile?.id);

  // Extract data from the new structure
  const allListings = listingsData?.data || [];
  const totalListings = listingsData?.total || 0;
  const totalPages = listingsData?.totalPages || 0;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Image viewer states
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewerImages, setViewerImages] = useState([]);

  const categories = [
    "All Categories",
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

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    if (!allListings) return [];

    return allListings.filter((listing) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "All Categories" ||
        listing.category === selectedCategory;

      // Price range filter
      const matchesPrice =
        (!priceRange.min || listing.price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || listing.price <= parseFloat(priceRange.max));

      // Only show active listings
      const isActive = listing.status === "ACTIVE";

      return matchesSearch && matchesCategory && matchesPrice && isActive;
    });
  }, [allListings, searchQuery, selectedCategory, priceRange]);

  const openDetailModal = (listing) => {
    setSelectedListing(listing);
    setIsDetailModalOpen(true);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeOnPlatform = (joinDate) => {
    const now = new Date();
    const joined = new Date(joinDate);
    const diffTime = Math.abs(now - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""}`;
    }
  };

  const handleContactSeller = (listing) => {
    const message = `Hi! I'm interested in your listing: "${
      listing.title
    }" (₦${listing.price?.toLocaleString()})`;
    const phoneNumber = listing.profiles?.phone_number;

    if (phoneNumber) {
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(
        /[^0-9]/g,
        ""
      )}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      // Fallback if no phone number
      navigator.clipboard.writeText(message);
      alert(
        "Contact message copied to clipboard! Please reach out to the seller directly."
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange.min, priceRange.max]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>Error loading marketplace: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Campus Marketplace
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Discover amazing deals from your campus community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for items, books, electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category === "All Categories" ? "" : category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="1000000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredListings.length} listing
            {filteredListings.length !== 1 ? "s" : ""} found
          </p>
          {(searchQuery ||
            selectedCategory ||
            priceRange.min ||
            priceRange.max) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings && filteredListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredListings.map((listing) => (
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

                    {/* Quick Action */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactSeller(listing);
                        }}
                        className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                        title="Contact Seller via WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3 group-hover:text-green-600 transition-colors">
                        {listing.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                        <span>₦</span>
                        {listing.price?.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Tag className="w-4 h-4" />
                        <span className="truncate max-w-20">
                          {listing.category}
                        </span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      {listing.profiles?.avatar_url ? (
                        <img
                          src={listing.profiles.avatar_url}
                          alt={listing.profiles?.full_name || "Seller"}
                          className="w-5 h-5 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="truncate">
                        {listing.profiles?.full_name}
                      </span>
                      {listing.profiles?.role === "VERIFIED_STUDENT" && (
                        <Shield
                          className="w-4 h-4 text-blue-500"
                          title="Verified Student"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {/* Previous Page */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center text-sm text-gray-600 mt-4">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalListings)} of{" "}
              {totalListings} listings
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              {searchQuery ||
              selectedCategory ||
              priceRange.min ||
              priceRange.max
                ? "No listings found"
                : "No listings available"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery ||
              selectedCategory ||
              priceRange.min ||
              priceRange.max
                ? "Try adjusting your search criteria or filters to find more items."
                : "No listings to show right now — check back soon!"}
            </p>
            {(searchQuery ||
              selectedCategory ||
              priceRange.min ||
              priceRange.max) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Product Details
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Complete information about this listing
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
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Product Info - Left Side */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* Images */}
                      {selectedListing.images &&
                        selectedListing.images.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Product Images
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                              {selectedListing.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <div
                                    className="relative w-full h-24 sm:h-32 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                                    onClick={() =>
                                      openImageViewer(
                                        selectedListing.images,
                                        index
                                      )
                                    }
                                  >
                                    <img
                                      src={image}
                                      alt={`${selectedListing.title} - Image ${
                                        index + 1
                                      }`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Product Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Product Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                              {selectedListing.title}
                            </h4>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl sm:text-3xl font-bold text-green-600">
                                ₦{selectedListing.price?.toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {selectedListing.status}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">
                              Description
                            </label>
                            <p className="text-gray-900 leading-relaxed">
                              {selectedListing.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 mb-1 block">
                                Category
                              </label>
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">
                                  {selectedListing.category}
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 mb-1 block">
                                Posted
                              </label>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">
                                  {formatDate(selectedListing.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seller Info - Right Side */}
                    <div className="lg:col-span-2">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Seller Information
                        </h3>

                        {/* Seller Profile */}
                        <div className="flex items-center gap-3 mb-4">
                          {selectedListing.profiles?.avatar_url ? (
                            <img
                              src={selectedListing.profiles.avatar_url}
                              alt={
                                selectedListing.profiles?.full_name || "Seller"
                              }
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {selectedListing.profiles?.full_name?.charAt(
                                  0
                                ) || "U"}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {selectedListing.profiles?.full_name}
                              </h4>
                              {selectedListing.profiles?.role ===
                                "VERIFIED_STUDENT" && (
                                <Shield
                                  className="w-4 h-4 text-blue-500"
                                  title="Verified Student"
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {selectedListing.profiles?.department}
                            </p>
                          </div>
                        </div>

                        {/* Seller Stats */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Member since
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(selectedListing.profiles?.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Time on platform
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {getTimeOnPlatform(
                                selectedListing.profiles?.created_at
                              )}
                            </span>
                          </div>
                          {selectedListing.profiles?.matric_number && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Matric Number
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {selectedListing.profiles.matric_number}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {/* Contact Button */}
                          <button
                            onClick={() => handleContactSeller(selectedListing)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <WhatsAppIcon className="w-5 h-5" />
                            Contact Seller via WhatsApp
                          </button>

                          {/* Favorite Button */}
                          <button
                            onClick={() => {
                              if (isFavorited(selectedListing.id)) {
                                removeFromFavorites.mutate(
                                  {
                                    profileId: profile?.id,
                                    listingId: selectedListing.id,
                                  },
                                  {
                                    onSuccess: () => {
                                      toast.success("Removed from favorites!");
                                    },
                                    onError: (error) => {
                                      console.error(
                                        "Failed to remove from favorites:",
                                        error
                                      );
                                      toast.error(
                                        "Failed to remove from favorites. Please try again."
                                      );
                                    },
                                  }
                                );
                              } else {
                                addToFavorites.mutate(
                                  {
                                    profileId: profile?.id,
                                    listingId: selectedListing.id,
                                  },
                                  {
                                    onSuccess: () => {
                                      toast.success("Added to favorites!");
                                    },
                                    onError: (error) => {
                                      console.error(
                                        "Failed to add to favorites:",
                                        error
                                      );
                                      toast.error(
                                        "Failed to add to favorites. Please try again."
                                      );
                                    },
                                  }
                                );
                              }
                            }}
                            disabled={
                              addToFavorites.isPending ||
                              removeFromFavorites.isPending
                            }
                            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                              isFavorited(selectedListing.id)
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {addToFavorites.isPending ||
                            removeFromFavorites.isPending ? (
                              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                {isFavorited(selectedListing.id) ? (
                                  <>
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Remove from Favorites
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                      />
                                    </svg>
                                    Add to Favorites
                                  </>
                                )}
                              </>
                            )}
                          </button>
                        </div>

                        {/* Safety Notice */}
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Always meet in safe, public places on campus
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
