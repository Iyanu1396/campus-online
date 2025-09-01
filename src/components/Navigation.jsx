import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  ShoppingBag,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";

const Navigation = ({ user, onSignOut, profile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Marketplace", path: "/dashboard/marketplace", icon: ShoppingBag },
    {
      name: "Your Listing",
      path: "/dashboard/your-listing",
      icon: MessageSquare,
    },
  ];

  const handleLogout = async () => {
    try {
      await onSignOut();
      setShowLogoutModal(false);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/campus-logo.png"
                alt="Abraham Adesanya Polytechnic Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Campus
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Online
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Abraham Adesanya Polytechnic
                </p>
              </div>
            </div>

            {/* Desktop Navigation - Improved Layout */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center bg-gray-50/80 rounded-2xl p-2 shadow-inner h-12">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                        isActiveRoute(item.path)
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                          : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions - Improved Desktop Layout */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation - Only Sign Out Icon */}
              <div className="hidden lg:flex items-center">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50/80 hover:bg-red-100/80 text-red-600 hover:text-red-700 transition-all duration-200 shadow-sm border border-red-200/50 hover:shadow-md"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 transition-all duration-200 shadow-sm"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu - Enhanced Transitions */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
              isMenuOpen
                ? "max-h-[500px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-4"
            }`}
          >
            <div className="border-t border-gray-100 py-6">
              <div className="space-y-3">
                {/* Mobile User Info */}
                <div
                  className={`flex items-center gap-4 px-3 py-4 bg-gray-50/80 rounded-xl mb-4 transform transition-all duration-700 delay-100 ${
                    isMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile?.full_name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {profile?.full_name && profile.full_name.length > 20
                        ? `${profile.full_name.substring(0, 20)}...`
                        : profile?.full_name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {profile?.email || "user@email.com"}
                    </p>
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 transform ${
                        isActiveRoute(item.path)
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                      } ${
                        isMenuOpen
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: isMenuOpen
                          ? `${150 + index * 75}ms`
                          : "0ms",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}

                {/* Mobile Sign Out */}
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all duration-300 font-semibold mt-6 border-t border-gray-200 pt-6 transform ${
                    isMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen
                      ? `${150 + navigationItems.length * 75}ms`
                      : "0ms",
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Sign Out
              </h3>
              <p className="text-gray-600">
                Are you sure you want to sign out of your Campus Online account?
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
