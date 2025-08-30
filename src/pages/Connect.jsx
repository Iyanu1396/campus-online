import { MessageSquare, Users, Video, Calendar, MapPin } from "lucide-react";

const Connect = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Connect
          </h1>
          <p className="text-lg text-gray-600">
            Build your network and connect with campus community
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-purple-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get ready to expand your campus network! Soon you'll be able to
            connect with fellow students, find study partners, and discover
            amazing opportunities.
          </p>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Find People</h3>
              <p className="text-sm text-gray-600">
                Discover students with similar interests
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Direct Messaging
              </h3>
              <p className="text-sm text-gray-600">
                Chat privately with connections
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Calls</h3>
              <p className="text-sm text-gray-600">
                Connect face-to-face virtually
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Event Planning
              </h3>
              <p className="text-sm text-gray-600">
                Organize study groups and meetups
              </p>
            </div>
          </div>

          {/* Connection Types Preview */}
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connection Types Coming Soon
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  type: "Study Partners",
                  icon: "📚",
                  desc: "Find classmates for group study",
                },
                {
                  type: "Project Teams",
                  icon: "👥",
                  desc: "Collaborate on assignments",
                },
                {
                  type: "Mentorship",
                  icon: "🎓",
                  desc: "Connect with experienced students",
                },
              ].map((item) => (
                <div
                  key={item.type}
                  className="bg-white rounded-lg p-4 text-center"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {item.type}
                  </h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Map Preview */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Campus Meetup Spots
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Soon you'll be able to see popular meeting locations and organize
              in-person study sessions with your campus connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
