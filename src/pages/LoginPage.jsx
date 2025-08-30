import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Send, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm sm:max-w-md w-full">
          {/* Back to Home */}
          <div className="text-center mb-8">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-6 sm:py-8 text-center text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome Back
              </h1>
              <p className="text-blue-100 text-base sm:text-lg">
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
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || countdown > 0}
                    className="w-full flex justify-center items-center py-3 sm:py-4 px-6 rounded-xl text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
                  </button>
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
          </div>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500">
              Secure authentication • No passwords needed • University verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
