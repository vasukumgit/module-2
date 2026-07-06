import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !role) {
      return alert("Please fill all fields");
    }

    const signupData = {
      type: "signup",
      name,
      email,
      phone,
      role,
    };

    try {
      const res = await fetch("http://localhost:5050/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save signup info temporarily
        localStorage.setItem("signupData", JSON.stringify(signupData));
        // Navigate to OTP page
        navigate("/otp");
      } else {
        alert(data.msg); // show error from backend
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSignup}>
        <h2>Create an account</h2>

        <p className="auth-subtitle">
          Create your account and start designing stunning visuals with ease
        </p>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Role */}
        <select
          className="auth-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select your role</option>
          <option value="Designer">Designer</option>
          <option value="Business">Business</option>
          <option value="Student">Student</option>
        </select>

        {/* Button */}
        <button type="submit" className="auth-button">
          Create Account
        </button>

        <p className="auth-terms-SignupEmail">
          By continuing, you agree to our
          <a href="#"> Terms & Conditions</a>,
          <a href="#"> Licensing Agreement</a> and
          <a href="#"> Privacy Policy</a>.
        </p>
      </form>
    </AuthLayout>
  );
}

export default Signup;
