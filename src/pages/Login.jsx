import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import webseederLogo from "figma:asset/dbec6477395e40f9a594682daf5e89e877d326cc.png";
import { slideshowImages } from "../assets/images";
import { supabase } from "../lib/auth.js";
import { toast } from "sonner";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info.jsx"; 
import {
  loginUser,
  isEmailRegistered,
  resetUserPassword,
} from "../lib/auth.js";
  

// Import your CSS file
import "../styles/login.css";

const slidesData = [
  {
    image: slideshowImages[0],
    title: "Welcome Back",
    subtitle: "Sign in to access your dashboard",
    features: [
      {
        icon: "🛡️",
        heading: "Secure Access",
        description:
          "Your data is protected with enterprise-grade security",
      },
      {
        icon: "📊",
        heading: "Real-time Analytics",
        description:
          "Monitor your performance with live data insights",
      },
    ],
  },
  {
    image: slideshowImages[1],
    title: "Modern Interface",
    subtitle: "Experience our redesigned, intuitive platform",
    features: [
      {
        icon: "🎨",
        heading: "Intuitive Design",
        description:
          "Navigate effortlessly with a user-friendly layout",
      },
      {
        icon: "🚀",
        heading: "Boost Productivity",
        description:
          "Streamline your workflows and achieve more",
      },
    ],
  },
  {
    image: slideshowImages[2],
    title: "Seamless Integration",
    subtitle: "Connect with your favorite tools effortlessly",
    features: [
      {
        icon: "🔗",
        heading: "Easy Connectivity",
        description:
          "Integrate with third-party services seamlessly",
      },
      {
        icon: "☁️",
        heading: "Cloud-Powered",
        description:
          "Access your data anytime, anywhere with cloud support",
      },
    ],
  },
];

export function Login({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(
    "email"
  );
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  console.log("Current forgotEmail state:", forgotEmail);

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7c75f461`;

  // 👇 ADD THIS LINE BACK
  const TEST_MODE = false;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex(
        (prevIndex) => (prevIndex + 1) % slidesData.length,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const user = loginUser(formData.email, formData.password);

      if (user) {
        onLogin(user);
      } else {
        setError(
          "Invalid email or password. Please try again.",
        );
      }
      setLoading(false);
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();

    if (!forgotEmail || forgotEmail.trim() === "") {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    const trimmedEmail = forgotEmail.trim();
    if (!isEmailRegistered(trimmedEmail)) {
      toast.error("This email is not registered.");
      return;
    }

    setOtpSending(true);

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }
      
      toast.success("OTP sent successfully!", {
        description: `Please check your email (${trimmedEmail}) for the OTP code.`,
      });
      setForgotPasswordStep("otp");
      setResendCooldown(60);

    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP", { description: error.message });
    } finally {
      setOtpSending(false);
    }
};

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setOtpVerifying(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed.");
      }
      
      toast.success("OTP verified successfully!");
      setForgotPasswordStep("reset");

    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("OTP Verification Failed", { description: error.message });
    } finally {
      setOtpVerifying(false);
    }
};

  const handleResendOTP = () => {
    if (resendCooldown > 0) {
      toast.error(
        `Please wait ${resendCooldown} seconds before resending`,
      );
      return;
    }

    setOtp("");
    handleSendOTP();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset successfully!");
        setShowForgotPassword(false);
        setForgotPasswordStep("email");
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setResendCooldown(0);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep("email");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResendCooldown(0);
  };

  const currentSlide = slidesData[currentSlideIndex];

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="illustrationSection">
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className={`slide-background ${index === currentSlideIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
          ))}
          <div className="slideshow-content">
            <div className="logo">
              <h1>Dynasty Premium</h1>
            </div>
            <div className="welcomeMessage">
              <h2 className="slide-title">
                {currentSlide.title}
              </h2>
              <p className="slide-subtitle">
                {currentSlide.subtitle}
              </p>
            </div>
            <div className="features">
              {currentSlide.features.map((feature, index) => (
                <div className="feature" key={index}>
                  <div className="featureIcon">
                    {feature.icon}
                  </div>
                  <div className="featureContent">
                    <h4>{feature.heading}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="formSection">
          <div className="formContent">
            {!showForgotPassword ? (
              <>
                <div className="header">
                  <img
                    src={webseederLogo}
                    alt="WebSeeder Logo"
                    className="login-logo"
                  />
                  <h1>Welcome Back</h1>
                  <p>Sign in to your account to continue</p>
                </div>

                {error && (
                  <div className="errorMessage">{error}</div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="inputGroup">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="inputGroup">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="formOptions">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setShowForgotPassword(true)
                      }
                      className="forgotPassword"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="loginButton"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="signupRedirect">
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => onNavigate("signup")}
                      className="link"
                    >
                      Create Account
                    </button>
                  </p>
                </div>

                <div className="securityFooter">
                  <p>Secured by Dynasty Premium</p>
                </div>
              </>
            ) : (
              <>
                <div className="header">
                  <img
                    src={webseederLogo}
                    alt="WebSeeder Logo"
                    className="login-logo"
                  />
                  <h1>
                    {forgotPasswordStep === "email" &&
                      "Forgot Password"}
                    {forgotPasswordStep === "otp" &&
                      "Verify OTP"}
                    {forgotPasswordStep === "reset" &&
                      "Reset Password"}
                  </h1>
                  <p>
                    {forgotPasswordStep === "email" &&
                      "Enter your registered email to receive an OTP"}
                    {forgotPasswordStep === "otp" &&
                      "Enter the 6-digit OTP sent to your email"}
                    {forgotPasswordStep === "reset" &&
                      "Create a new strong password"}
                  </p>

                  {TEST_MODE && (
                    <div
                      style={{
                        background: "#FFF4E6",
                        border: "1px solid #FFB84D",
                        borderRadius: "8px",
                        padding: "12px",
                        marginTop: "12px",
                        fontSize: "0.85rem",
                        color: "#663C00",
                      }}
                    >
                      <strong>🧪 Test Mode Active</strong>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "0.8rem",
                        }}
                      >
                        ✅ Feature is fully working!
                        <br />
                        📱 OTP will be shown in a notification
                        (no server needed)
                        <br />
                        📧 Real emails: Optional - See
                        README_FORGOT_PASSWORD.md
                      </p>
                    </div>
                  )}
                </div>

                {forgotPasswordStep === "email" && (
                  <form
                    onSubmit={handleSendOTP}
                    style={{ marginTop: "20px" }}
                  >
                    <div className="inputGroup">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) =>
                          setForgotEmail(e.target.value)
                        }
                        placeholder="Enter your registered email"
                        required
                        autoFocus
                      />
                      <small
                        style={{
                          display: "block",
                          marginTop: "0.5rem",
                          color: "#666",
                          fontSize: "0.85rem",
                        }}
                      >
                        Only registered email addresses can
                        reset their password
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="loginButton"
                      disabled={otpSending || !forgotEmail}
                      style={{
                        opacity:
                          otpSending || !forgotEmail ? 0.7 : 1,
                        cursor:
                          otpSending || !forgotEmail
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {otpSending ? (
                        <>
                          <div className="spinner"></div>
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </form>
                )}

                {forgotPasswordStep === "otp" && (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="inputGroup">
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6),
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                        style={{
                          letterSpacing: "0.5em",
                          textAlign: "center",
                          fontSize: "1.2em",
                        }}
                      />
                      <small
                        style={{
                          display: "block",
                          marginTop: "0.5rem",
                          color: "#666",
                        }}
                      >
                        OTP sent to {forgotEmail}
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="loginButton"
                      disabled={otpVerifying}
                    >
                      {otpVerifying ? (
                        <>
                          <div className="spinner"></div>
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>

                    <div
                      style={{
                        marginTop: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendCooldown > 0}
                        className="link"
                        style={{
                          background: "none",
                          border: "none",
                          cursor:
                            resendCooldown > 0
                              ? "not-allowed"
                              : "pointer",
                          opacity: resendCooldown > 0 ? 0.5 : 1,
                        }}
                      >
                        {resendCooldown > 0
                          ? `Resend OTP in ${resendCooldown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {forgotPasswordStep === "reset" && (
                  <form onSubmit={handleResetPassword}>
                    <div className="inputGroup">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="loginButton"
                    >
                      Reset Password
                    </button>
                  </form>
                )}

                <div
                  className="signupRedirect"
                  style={{ marginTop: "1.5rem" }}
                >
                  <p>
                    Remember your password?{" "}
                    <button
                      onClick={handleCloseForgotPassword}
                      className="link"
                    >
                      Back to Login
                    </button>
                  </p>
                </div>

                <div className="securityFooter">
                  <p>Secured by Dynasty Premium</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// PropTypes for runtime type checking in JavaScript
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};