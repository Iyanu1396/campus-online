import { ShoppingBag, Search, Tag, TrendingUp, Package } from "lucide-react";

const Marketplace = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Buy and sell items within your campus community
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get ready for the ultimate campus marketplace experience! Soon
            you'll be able to browse, buy, and sell everything from textbooks to
            electronics with fellow students.
          </p>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-sm text-gray-600">
                Find exactly what you need with advanced filters
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Listing</h3>
              <p className="text-sm text-gray-600">
                Create listings with photos and descriptions
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Price Tracking
              </h3>
              <p className="text-sm text-gray-600">
                Monitor prices and get the best deals
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Safe Transactions
              </h3>
              <p className="text-sm text-gray-600">
                Secure payments and verified sellers
              </p>
            </div>
          </div>

          {/* Categories Preview */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Categories Coming Soon
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Textbooks", "Electronics", "Furniture", "Clothing"].map(
                (category) => (
                  <div
                    key={category}
                    className="bg-white rounded-lg p-3 text-center"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {category}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
