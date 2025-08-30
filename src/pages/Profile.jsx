import { User, Settings, Edit3, Shield } from "lucide-react";

const Profile = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and personal information
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-12 h-12 text-blue-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you a comprehensive profile management
            system. Soon you'll be able to update your information, manage
            preferences, and customize your experience.
          </p>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Edit3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Edit Profile</h3>
              <p className="text-sm text-gray-600">
                Update your personal information and bio
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Privacy Settings
              </h3>
              <p className="text-sm text-gray-600">
                Control who can see your information
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Account Management
              </h3>
              <p className="text-sm text-gray-600">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
