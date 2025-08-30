import { User, ShoppingBag, MessageSquare, Settings } from "lucide-react";

const Dashboard = () => {
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
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Browse Items
              </h3>
            </div>
            <p className="text-gray-600">
              Discover textbooks, electronics, furniture, and more from fellow
              students.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Connect</h3>
            </div>
            <p className="text-gray-600">
              Find students offering services like tutoring, design, and
              programming.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Profile Setup
              </h3>
            </div>
            <p className="text-gray-600">
              Complete your profile to start buying, selling, and offering
              services.
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            🚀 More Features Coming Soon
          </h3>
          <p className="text-gray-600">
            We're working on adding product listings, messaging, and payment
            features. Stay tuned!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
