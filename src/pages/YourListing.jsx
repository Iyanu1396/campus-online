import {
  MessageSquare,
  Plus,
  Package,
  Tag,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useListings } from "../hooks/useListings";

const YourListing = ({ profile }) => {
  const { data: listings, isLoading, error } = useListings(profile?.id);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>Error loading listings: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Your Listings
            </h1>
            <p className="text-lg text-gray-600">
              Manage your marketplace listings and track your sales
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            Create Listing
          </button>
        </div>

        {/* Listings Grid */}
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {listing.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {listing.price}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Tag className="w-4 h-4" />
                      {listing.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-3">
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Listings Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't created any listings yet. Start selling your items to
              the campus community!
            </p>
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto">
              <Plus className="w-6 h-6" />
              Create Your First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourListing;
