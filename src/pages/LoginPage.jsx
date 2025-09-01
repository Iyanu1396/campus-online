import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Send, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  // Countdown timer for 30 seconds
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address to continue");
      return;
    }

    if (countdown > 0) {
      toast.error(
        `Please wait ${countdown} seconds before requesting another link`
      );
      return;
    }

    setIsLoading(true);

    try {
      await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      setIsSuccess(true);
      setCountdown(30);

      // Success message
      toast.success("Magic link sent successfully! Check your email inbox.");
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

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

      <div className="relative z-10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6"
            >
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                Campus Online
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto"
            >
              Sign in to access your polytechnic marketplace and connect with
              the AAPOLY community
            </motion.p>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mb-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={handleBackToHome}
              className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </motion.button>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden max-w-md mx-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 sm:px-8 py-6 sm:py-8 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome Back
              </h2>
              <p className="text-orange-100 text-base sm:text-lg">
                Sign in to your Campus Online account
              </p>
            </div>

            {/* Form Content */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              {!isSuccess ? (
                <div className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your university email"
                        className="block w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || countdown > 0}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center items-center py-3 sm:py-4 px-6 rounded-xl text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3" />
                        Sending...
                      </>
                    ) : countdown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                        Wait {countdown}s
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                        Send Magic Link
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                /* Success State */
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Check Your Email!
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    We've sent a secure magic link to <strong>{email}</strong>
                  </p>

                  {countdown > 0 && (
                    <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                      <div className="flex items-center justify-center text-blue-700">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base font-medium">
                          You can request a new link in {countdown} seconds
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Use a different email
                  </button>
                </div>
              )}

              {/* Info Text */}
              {!isSuccess && (
                <>
                  <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-xs sm:text-sm text-gray-500">
                      We'll send you a secure link to sign in without a password
                    </p>
                  </div>

                  {/* New User Info */}
                  <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs sm:text-sm">
                            i
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                          New to Campus Online?
                        </h4>
                        <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                          After signing in, you'll set up your username and
                          complete your profile to start trading.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mt-12 sm:mt-16"
          >
            <p className="text-xs sm:text-sm text-white/60">
              Made with ❤️ for Abraham Adesanya Polytechnic students and staffs
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
