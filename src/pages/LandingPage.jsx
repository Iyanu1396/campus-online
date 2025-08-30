import {
  ArrowRight,
  Users,
  ShoppingBag,
  BookOpen,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const stats = [
    { number: "25K+", label: "Active Students" },
    { number: "500+", label: "Daily Trades" },
    { number: "50+", label: "Universities" },
  ];

  const features = [
    {
      icon: <ShoppingBag className="w-7 h-7" />,
      title: "Marketplace",
      description:
        "Buy and sell textbooks, electronics, furniture, and everything you need for campus life",
      highlight: "Most Popular",
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Services",
      description:
        "Connect with tutors, get design help, coding assistance, and other student services",
      highlight: "Trusted",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Community",
      description:
        "Build your network with verified students, faculty, and staff in your campus",
      highlight: "Verified",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Security",
      description:
        "Safe and secure transactions within your verified campus community",
      highlight: "Protected",
    },
  ];

  const benefits = [
    "Verified student and staff profiles",
    "In-campus meetup locations",
    "Integrated messaging system",
    "Price comparison tools",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                Trusted by 50+ universities nationwide
              </span>
              <span className="sm:hidden">50+ universities nationwide</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-[0.9] px-2"
            >
              Campus
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Online
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
            >
              The complete campus marketplace where students and staff buy,
              sell, and connect safely within their university community
            </motion.p>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex justify-center mb-8 sm:mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/50 w-full max-w-md sm:max-w-lg"
            >
              <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetStarted}
            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center mx-auto gap-2 sm:gap-3 mb-12 sm:mb-16"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
              Everything you need for campus life
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Built specifically for university communities with safety and
              convenience in mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group relative"
              >
                <motion.div
                  whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    borderColor: "rgba(59, 130, 246, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 h-full"
                >
                  {/* Highlight Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="absolute -top-3 left-4 sm:left-6"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                      {feature.highlight}
                    </div>
                  </motion.div>

                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-blue-600"
                    >
                      {feature.icon}
                    </motion.div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 md:p-12 text-white"
          >
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="px-2 sm:px-0"
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                  Why students choose Campus Online
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 sm:gap-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 flex-shrink-0" />
                      </motion.div>
                      <span className="text-base sm:text-lg text-blue-50">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20"
              >
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.2, y: -2 }}
                    >
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-white/90 font-medium text-sm sm:text-base">
                    4.9/5 rating
                  </span>
                </div>
                <blockquote className="text-white/90 text-base sm:text-lg italic mb-3 sm:mb-4">
                  "Campus Online made my college experience so much better.
                  Found my textbooks, connected with study partners, and even
                  got help with my coding projects."
                </blockquote>
                <cite className="text-blue-200 text-xs sm:text-sm not-italic">
                  — Maya Chen, Computer Science Major
                </cite>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center px-4"
        >
          <p className="text-sm sm:text-base text-gray-500">
            Join thousands of students and faculty already using Campus Online
            to enhance their university experience
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
