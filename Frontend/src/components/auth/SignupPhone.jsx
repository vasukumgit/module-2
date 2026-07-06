import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "./Auth.css";
import BackArrow from "../../assets/Svg/BackArrow.svg";

function SignupPhone() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // 👇 Login page nundi vachina phone
  const phoneFromLogin = location.state?.phone || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const nameRegex = /^[A-Za-z\s]{2,50}$/;

  const emailRegex = /^[a-z][a-z0-9._]*@gmail\.com$/;

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      return alert("Please fill all fields");
    }

    if (!nameRegex.test(name)) {
      setNameError("Name should contain only alphabets");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid Gmail address.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phoneFromLogin,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }

      localStorage.setItem(
        "authData",
        JSON.stringify({ phone: phoneFromLogin }),
      );

      navigate("/otp");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleContinue}>
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
            <h2>Create an account</h2>
            <p className="auth-subtitle">
              Create your account and start designing stunning visuals with ease
            </p>
          </div>
        </div>

        {/* 👇 Blue pill phone display */}
        <div className="signup-primary-display">{phoneFromLogin}</div>

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
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value.toLowerCase());
            setEmailError("");
          }}
        />

        {emailError && <p className="input-error">{emailError}</p>}

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
          Continue with Phone Number
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignupPhone;
