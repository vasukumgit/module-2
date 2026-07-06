import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "./Auth.css";
import BackArrow from "../../assets/Svg/BackArrow.svg";

function SignupEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromLogin = location.state?.email || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [nameError, setNameError] = useState("");

  const nameRegex = /^[A-Za-z ]+$/;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !phone || !role) {
      return alert("Please fill all fields");
    }

    if (!nameRegex.test(name)) {
      setNameError("Name should contain only alphabets");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: emailFromLogin,
          phone,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }

      // Save for OTP
      localStorage.setItem(
        "authData",
        JSON.stringify({ email: emailFromLogin }),
      );

      navigate("/otp");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };
  return (
    <AuthLayout>
      <form onSubmit={handleSignup}>
        <div className="header-container">
          {/* 🔙 Back Button */}
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <img src={BackArrow} alt="BackArrow" />
          </button>

          <div className="header-title-contai">
            <h2>Create an account</h2>
            <p className="auth-subtitle">
              {" "}
              Create your account and start designing stunning visuals with
              ease{" "}
            </p>
          </div>
        </div>

        {/* 👇 User entered email display */}
        <div className="signup-email-display">{emailFromLogin}</div>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError("");
          }}
        />
        {nameError && <p className="input-error">{nameError}</p>}

        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="auth-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select your role</option>
          <option>Designer</option>
          <option>Business</option>
          <option>Student</option>
        </select>

        <button type="submit" className="auth-button-login">
          Continue with Email
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignupEmail;
