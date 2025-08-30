import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus("success");
          setMessage("Successfully signed in! Redirecting to dashboard...");
          toast.success("Welcome to Campus Online!");

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          // Check if there's a hash in the URL (magic link)
          const hash = window.location.hash;
          if (hash) {
            const { data: authData, error: authError } =
              await supabase.auth.getUser();

            if (authError) {
              throw authError;
            }

            if (authData.user) {
              setStatus("success");
              setMessage("Successfully signed in! Redirecting to dashboard...");
              toast.success("Welcome to Campus Online!");

              setTimeout(() => {
                navigate("/dashboard");
              }, 2000);
            } else {
              throw new Error("Authentication failed");
            }
          } else {
            throw new Error("No authentication data found");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        toast.error("Authentication failed. Please try again.");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your authentication.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign In Successful!
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign In Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthCallback;
