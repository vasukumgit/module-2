import { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import BackArrow from "../../assets/Svg/BackArrow.svg";

function Otp() {
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("authData"));
  const email = authData?.email;
  const phone = authData?.phone;

  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // 1. Handle the Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelectorAll(".otp-input")[index + 1];
      nextInput?.focus();
    }
  };

  // 2. Handle Resend OTP Logic
  const handleResend = async () => {
    if (!canResend) return;

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      if (res.ok) {
        alert("A new OTP has been sent!");
        setOtpInputs(["", "", "", "", "", ""]); // Clear inputs for new OTP
        setTimer(30); // Reset timer
        setCanResend(false); // Disable resend again
      } else {
        const data = await res.json();
        alert(data.msg || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error resending OTP");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otpInputs.join("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, otp: enteredOtp }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg);
        return;
      }

      localStorage.setItem("token", data.token);
      alert(data.msg || "Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Check if all 6 boxes are filled
  const isOtpComplete = otpInputs.every((digit) => digit !== "");

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // If current box has a value, clear it
      if (otpInputs[index]) {
        const newOtp = [...otpInputs];
        newOtp[index] = "";
        setOtpInputs(newOtp);
        return;
      }

      // If current box is empty, move to previous box
      if (index > 0) {
        const prevInput = document.querySelectorAll(".otp-input")[index - 1];

        const newOtp = [...otpInputs];
        newOtp[index - 1] = "";
        setOtpInputs(newOtp);

        prevInput?.focus();
      }
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleVerify}>
        <div className="header-container">
          {/* 🔙 Back Button */}
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <img src={BackArrow} alt="BackArrow" />
          </button>
          <div className="header-title-container">
            <h2>We sent you a code</h2>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to <b>{email ? email : phone}</b>
            </p>
          </div>
        </div>

        <div className="otp-container">
          <div className="otp-boxes">
            {otpInputs.map((digit, i) => (
              <input
                key={i}
                value={digit}
                maxLength="1"
                className="otp-input"
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="auth-button-login"
          disabled={!isOtpComplete} // Disable if OTP is not 6 digits
          style={{
            opacity: isOtpComplete ? 1 : 0.5,
            cursor: isOtpComplete ? "pointer" : "not-allowed",
          }}
        >
          Verify OTP
        </button>

        <p className="auth-terms-Otp">
          Didn’t get the code?{" "}
          {canResend ? (
            <span>
              <b
                onClick={handleResend}
                style={{ color: "#2563eb", cursor: "pointer" }}
              >
                Resend Code
              </b>
            </span>
          ) : (
            <span>Resend in {timer} seconds</span>
          )}
        </p>
      </form>
    </AuthLayout>
  );
}

export default Otp;
