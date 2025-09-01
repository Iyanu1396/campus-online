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
import { useCounter } from "../hooks/useCounter";
import React, { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const stats = [
    { number: "5K+", label: "Active Students" },
    { number: "200+", label: "Daily Trades" },
    { number: "15+", label: "Departments" },
  ];

  // Initialize animated counters
  const studentCounter = useCounter("5K+", 2500, 800);
  const tradeCounter = useCounter("200+", 2000, 900);
  const deptCounter = useCounter("15+", 1500, 1000);

  const features = [
    {
      icon: <ShoppingBag className="w-7 h-7" />,
      title: "Marketplace",
      description:
        "Buy and sell textbooks, electronics, project materials, and everything you need for polytechnic life",
      highlight: "Most Popular",
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Academic Services",
      description:
        "Connect with tutors, get project help, coding assistance, and technical support from fellow students",
      highlight: "Academic",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Poly Community",
      description:
        "Build your network with verified students, lecturers, and staff within Abraham Adesanya Polytechnic",
      highlight: "Verified",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Campus Security",
      description:
        "Safe and secure transactions within your verified polytechnic community",
      highlight: "Protected",
    },
  ];

  const benefits = [
    "Verified student and staff profiles",
    "On-campus meetup locations",
    "Integrated messaging system",
    "Department-specific categories",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('campus-gate.jpg')`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-indigo-900/80 to-purple-900/85"></div>

      {/* Additional subtle overlays for depth */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl"></div>

      {/* Header with Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.img
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
            src="/campus-logo.png"
            alt="Abraham Adesanya Polytechnic Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-white/30"
          />
          <div className="text-white">
            <h1 className="font-bold text-sm sm:text-base lg:text-lg">
              Campus Online
            </h1>
            <p className="text-xs sm:text-sm text-white/80">
              Abraham Adesanya Polytechnic
            </p>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6 border border-white/30"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                Official student marketplace for AAPOLY
              </span>
              <span className="sm:hidden">Official AAPOLY marketplace</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-4 sm:mb-6 leading-[0.9] px-2"
            >
              Your Poly
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                Marketplace
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
            >
              Connect, trade, and thrive within the Abraham Adesanya Polytechnic
              community. Your one-stop platform for books, materials, services,
              and campus connections.
            </motion.p>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            onViewportEnter={() => {
              // Start counters when stats come into view
              setTimeout(() => {
                studentCounter.startAnimation();
                tradeCounter.startAnimation();
                deptCounter.startAnimation();
              }, 200);
            }}
            className="flex justify-center mb-8 sm:mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 w-full max-w-md sm:max-w-lg"
            >
              <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    animate={
                      studentCounter.isVisible ? { scale: [1, 1.05, 1] } : {}
                    }
                    transition={{ duration: 0.6, repeat: 1 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                  >
                    {studentCounter.count}
                  </motion.div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">
                    Active Students
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="text-center"
                >
                  <motion.div
                    animate={
                      tradeCounter.isVisible ? { scale: [1, 1.05, 1] } : {}
                    }
                    transition={{ duration: 0.6, repeat: 1 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                  >
                    {tradeCounter.count}
                  </motion.div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">
                    Daily Trades
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="text-center"
                >
                  <motion.div
                    animate={
                      deptCounter.isVisible ? { scale: [1, 1.05, 1] } : {}
                    }
                    transition={{ duration: 0.6, repeat: 1 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                  >
                    {deptCounter.count}
                  </motion.div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">
                    Departments
                  </div>
                </motion.div>
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
            className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center mx-auto gap-2 sm:gap-3 mb-12 sm:mb-16"
          >
            <span>Join Your Poly Community</span>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 px-4">
              Everything for polytechnic success
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto px-4">
              Designed specifically for Abraham Adesanya Polytechnic students,
              by students who understand your needs
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
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div
                  whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                    borderColor: "rgba(251, 191, 36, 0.5)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 h-full"
                >
                  {/* Highlight Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="absolute -top-3 left-4 sm:left-6"
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                      {feature.highlight}
                    </div>
                  </motion.div>

                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-orange-600"
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
            className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl"
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
                  Why AAPOLY students choose us
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
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                      </motion.div>
                      <span className="text-base sm:text-lg text-white/95">
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
                    4.8/5 rating
                  </span>
                </div>
                <blockquote className="text-white/90 text-base sm:text-lg italic mb-3 sm:mb-4">
                  "Campus Online helped me find affordable textbooks for my
                  Engineering course and connect with seniors who guided me
                  through tough projects. Game changer!"
                </blockquote>
                <cite className="text-yellow-200 text-xs sm:text-sm not-italic">
                  — Adebayo Olumide, Computer Engineering (ND2)
                </cite>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 max-w-2xl mx-auto"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Ready to join your polytechnic community?
            </h3>
            <p className="text-white/80 text-sm sm:text-base mb-6">
              Join thousands of AAPOLY students and staff already using Campus
              Online to enhance their polytechnic experience
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetStarted}
              className="bg-white text-orange-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center px-4 mt-16 sm:mt-20"
        >
          <p className="text-sm sm:text-base text-white/60">
            Made with ❤️ for Abraham Adesanya Polytechnic students and staffs
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
