import {
  User,
  ShoppingBag,
  MessageSquare,
  Settings,
  Plus,
  Heart,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { useListings } from "../hooks/useListings";

const Dashboard = ({ profile }) => {
  const navigate = useNavigate();
  const { favorites, isLoading: favoritesLoading } = useFavorites(profile?.id);
  const { data: userListings } = useListings(profile?.id);
  return (
    <div className="py-8">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back!
              </h2>
              <p className="text-gray-600">
                Ready to explore the campus marketplace?
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => navigate("/dashboard/marketplace")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Browse Marketplace
              </h3>
            </div>
            <p className="text-gray-600">
              Discover textbooks, electronics, furniture, and more from fellow
              students.
            </p>
          </div>

          <div
            onClick={() => navigate("/dashboard/your-listing")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Plus className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Create New Listing
              </h3>
            </div>
            <p className="text-gray-600">
              Sell your items, offer services, or create new marketplace
              listings.
            </p>
          </div>

          <div
            onClick={() => navigate("/dashboard/profile")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                View Profile
              </h3>
            </div>
            <p className="text-gray-600">
              Manage your profile, update information, and view your activity.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Your Listings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userListings?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites && favorites.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Your Favorites
              </h3>
              <button
                onClick={() => navigate("/dashboard/marketplace")}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.slice(0, 6).map((favorite) => (
                <div
                  key={favorite.id}
                  onClick={() => navigate("/dashboard/marketplace")}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  {/* Item Image */}
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {favorite.listings?.images &&
                    favorite.listings.images.length > 0 ? (
                      <img
                        src={favorite.listings.images[0]}
                        alt={favorite.listings.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {favorite.listings?.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {favorite.listings?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      ₦{favorite.listings?.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {favorite.listings?.profiles?.full_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
