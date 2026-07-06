import React, { useState } from "react";

import "./ProfileSetting.css";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Phone from "../../../../assets/AccountCentre/Phone.svg";
import people from "../../../../assets/AccountCentre/idpeople.svg";
import Email from "../../../../assets/AccountCentre/Email.svg";
import OTP from "../../../../assets/AccountCentre/otp.svg";
import darkOTP from "../../../../assets/AccountCentre/darkotp.svg";
import Darkphone from "../../../../assets/AccountCentre/darkPhone.svg";
import Darkpeople from "../../../../assets/AccountCentre/darkidPeople.svg";
import DarkEmail from "../../../../assets/AccountCentre/darkEmail.svg";
import DarkIdPeople from "../../../../assets/AccountCentre/darkidPeople.svg";
import DarkPencil from "../../../../assets/AccountCentre/darkpencil.svg";
import Alert from "../../../../assets/AccountCentre/alertdisconnect.svg";
import AppSetting from "../AppSetting/AppSetting";
import AboutApp from "../AboutApp/AboutApp";
import ManageSubscriptions from "../ManageSubscriptions/ManageSubscriptions";
import TeamManagement from "../TeamManagement/TeamManagement";
import Innerprofile from "../../../../assets/AccountCentre/Profile.svg";
import TeamManage from "../../../../assets/AccountCentre/Team management.svg";
import AppSettings from "../../../../assets/AccountCentre/App settings.svg";
import About from "../../../../assets/AccountCentre/About.svg";
import ManageSubscription from "../../../../assets/AccountCentre/Manage subscriptions.svg";
import Pencil from "../../../../assets/AccountCentre/Pencil.svg";
import Google from "../../../../assets/AccountCentre/google.svg";
import Trash from "../../../../assets/AccountCentre/trash.svg";
import Vector from "../../../../assets/AccountCentre/Vector.svg";
import Disconnect from "../../../../assets/AccountCentre/Disconnect.svg";
import DeleteTrash from "../../../../assets/AccountCentre/deleteaccount_trash.svg";
import Star from "../../../../assets/AccountCentre/Star.svg";
import Darktrash from "../../../../assets/AccountCentre/darktrash.svg";
import DashboardSidebar from "../../DashboardLayout/DashboardSidebar";
const ProfileSetting = () => {
  const [active, setActive] = useState("Profile");
  const [activeContainerMenu, setActiveContainerMenu] =
    useState("profilesetting");
  const [identityPhone, setidentityPhone] = useState(false);
  const [identityEmail, setidentityEmail] = useState(false);
  const [profileemail, setprofileemail] = useState(false);
  const [profilephonenumber, setprofilephonenumber] = useState(false);
  const [googledisconnect, setgoogledisconnect] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [otp, setOtp] = useState("");
  const [newemail, setNewemail] = useState("");
  const [newphone, setNewphone] = useState("");
  const isDarkMode = document.documentElement.classList.contains("dark");

  const [showOtpPhone, setShowOtpPhone] = useState(false);
  const [showOtpEmail, setShowOtpEmail] = useState(false);
  const [showOtpidentityEmail, setShowOtpidentityEmail] = useState(false);
  const [showOtpidentityphone, setShowOtpidentityphone] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isPhonePrimary, setIsPhonePrimary] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);

  //API INTEGRATION

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5050/api/profile-settings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = res.data;

      setName(data.name);
      setPhone(data.phone);
      setEmail(data.email);
      setRole(data.role);
      setTimeZone(data.time_zone);
      setIsPhonePrimary(data.primary_login === "phone");
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // updating name
  const updateName = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5050/api/profile-settings",
        { name, role, time_zone: timeZone },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(res.data);
      alert("Name updated successfully");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Error Updating");
    }
  };

  // updating email and phn
  const sendOldPhoneOtp = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/send-otp",
        { phone }, // OLD phone
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setidentityPhone(false);
      setShowOtpidentityphone(true);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };
  const verifyOldPhoneOtp = async () => {
    const otpValue = otpDigits.join("");

    try {
      await axios.post(
        "http://localhost:5050/api/profile-settings/verify-old-phone",
        { otp: otpValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      await fetchProfile();
      setShowOtpidentityphone(false);
      setprofilephonenumber(true);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (err) {
      alert("Invalid OTP");
    }
  };
  const sendOldEmailOtp = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/send-otp",
        { email }, // OLD email
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setidentityEmail(false);
      setShowOtpidentityEmail(true);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };
  const verifyOldEmailOtp = async () => {
    const otpValue = otpDigits.join("");

    try {
      await axios.post(
        "http://localhost:5050/api/profile-settings/verify-old-email",
        { otp: otpValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setShowOtpidentityEmail(false);
      setprofileemail(true);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  const sendOtp = async (type) => {
    try {
      const payload =
        type === "email" ? { email: newemail } : { phone: newphone };

      const res = await axios.post(
        "http://localhost:5050/api/profile-settings/request-update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(res.data);

      if (type === "email") {
        setShowOtpEmail(true);
      } else {
        setShowOtpPhone(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };
  const verifyOtp = async () => {
    const otpValue = otpDigits.join("");

    if (otpValue.length !== 6) {
      alert("Enter valid 6 digit OTP");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5050/api/profile-settings/verify-update",
        { otp: otpValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (showOtpEmail) {
        setEmail(newemail);
        setIsPhonePrimary(false);
        setShowOtpEmail(false);
      }

      if (showOtpPhone) {
        setPhone(newphone);
        setIsPhonePrimary(true);
        setShowOtpPhone(false);
      }

      setOtpDigits(["", "", "", "", "", ""]);
      alert("Updated successfully");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  // Disconnect google
  const disconnectGoogle = async () => {
    try {
      await axios.delete("http://localhost:5050/api/profile-settings");
      alert("Disconnected Successfully");
      setgoogledisconnect(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!role || !timeZone) return;

    const updateProfile = async () => {
      try {
        await axios.put(
          "http://localhost:5050/api/profile-settings",
          {
            name,
            role,
            time_zone: timeZone,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        console.log("Role updated");
      } catch (err) {
        console.error("Role update failed", err);
      }
    };

    updateProfile();
  }, [role, timeZone]);

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="container-inner-page">
            <Sidebar />
            <div className="right-container">
              <div>
                <div className="right-container-profile">
                  <h1 className="profile-heading">Profile Settings</h1>
                  <div className="profile-inner-header">
                    <img
                      src="https://i.pravatar.cc/64?img=5"
                      alt="profile"
                      className="avatar"
                    />
                    <div>
                      <button className="profile-inner-button">
                        {/* <img src={Pencil} alt="logo" className="side-button-menuicon" /> */}
                        <span className="side-button-menuicon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M13.9323 7.42854L16.2511 9.74743M12.3863 18.25H18.57M6.20265 15.1582L5.42969 18.25L8.52153 17.477L17.4771 8.52151C17.7669 8.23161 17.9297 7.83846 17.9297 7.42854C17.9297 7.01862 17.7669 6.62548 17.4771 6.33557L17.3441 6.20263C17.0542 5.91281 16.6611 5.75 16.2511 5.75C15.8412 5.75 15.4481 5.91281 15.1582 6.20263L6.20265 15.1582Z"
                              stroke="#D4D4D8"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <p className="profileChangeBtn">Change Photo</p>
                      </button>
                      <p className="hint">
                        The photo must be at least or larger than 96×96 pixels.
                        <br />
                        Supported formats:PNG.JPG,SVG and AVIF
                      </p>
                    </div>
                  </div>

                  {/* PERSONAL INFO */}
                  <h2>Personal Information</h2>
                  <p className="sub-text-profile">
                    Manage your personal details used across projects and
                    collaborations.
                  </p>
                  <div className="field">
                    <div className="field-left">
                      <h4>Full Name</h4>
                      <p className="sub-text">
                        Your display name across projects and collaborations.
                      </p>
                    </div>
                    <div className="name-form-row">
                      <div className="input-image-icon">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          readOnly={!isEditingName}
                        />
                        {!isEditingName && (
                          <span
                            className="side-button-menuicon-profile"
                            onClick={() => setIsEditingName(true)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M13.9323 7.42854L16.2511 9.74743M12.3863 18.25H18.57M6.20265 15.1582L5.42969 18.25L8.52153 17.477L17.4771 8.52151C17.7669 8.23161 17.9297 7.83846 17.9297 7.42854C17.9297 7.01862 17.7669 6.62548 17.4771 6.33557L17.3441 6.20263C17.0542 5.91281 16.6611 5.75 16.2511 5.75C15.8412 5.75 15.4481 5.91281 15.1582 6.20263L6.20265 15.1582Z"
                                stroke="#D4D4D8"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          // <img src={isDarkMode ? DarkPencil : Pencil} alt="logo" />
                        )}
                        {/* SHOW BUTTONS */}
                        {isEditingName && (
                          <div className="name-icon-btn-profile">
                            <button
                              className="profile-name-tick-btn"
                              onClick={() => {
                                updateName(); // save
                                setIsEditingName(false);
                              }}
                            >
                              ✓
                            </button>

                            <button
                              className="profile-name-closebtn"
                              onClick={() => {
                                fetchProfile(); // reset value
                                setIsEditingName(false);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {identityPhone && (
                    <div className="modal-overlay">
                      <div className="modal-box">
                        <button
                          className="profile-phone-close-btn"
                          onClick={() => setidentityPhone(false)}
                        >
                          X
                        </button>
                        <img
                          src={isDarkMode ? DarkIdPeople : people}
                          alt="logo"
                          className="Profile-Phone-Icon"
                        />
                        <h2 className="verify-title-inner">
                          Verify Your Identity
                        </h2>
                        <p className="verify-subtitle-inner">
                          We've sent a verification code to your Phone number.
                          <br></br>Enter it below tocontinue.
                        </p>
                        <p>Verify through</p>
                        <div className="verify-identity-box">
                          <input
                            type="text"
                            value={phone}
                            readOnly
                            className="verify-code-input-identity"
                          />
                        </div>
                        <button
                          className="profile-phone-code-button-identity"
                          // disabled={!newphone.trim()}
                          onClick={() => {
                            // if (!newphone.trim()) return;
                            sendOldPhoneOtp();
                            // setidentityPhone(false); // close phone modal
                            // setShowOtpidentityphone(true); // open otp modal
                          }}
                        >
                          Send Code
                        </button>
                      </div>
                    </div>
                  )}
                  {identityEmail && (
                    <div className="modal-overlay">
                      <div className="modal-box">
                        <button
                          className="profile-phone-close-btn"
                          onClick={() => setidentityEmail(false)}
                        >
                          X
                        </button>
                        <img
                          src={isDarkMode ? DarkIdPeople : people}
                          alt="logo"
                          className="Profile-Phone-Icon"
                        />
                        <h2 className="verify-title-inner">
                          Verify Your Identity
                        </h2>
                        <p className="verify-subtitle-inner">
                          We've sent a verification code to your email.<br></br>
                          Enter it below tocontinue.
                        </p>
                        <p>Verify through</p>
                        <div className="verify-identity-box">
                          <input
                            type="email"
                            value={email}
                            readOnly
                            className="verify-code-input-identity"
                            // value={Email}
                            // onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <button
                          className="profile-phone-code-button-identity"
                          // disabled={!newphone.trim()}
                          onClick={
                            // if (!newphone.trim()) return;
                            sendOldEmailOtp
                            // setidentityEmail(false); // close phone modal
                            // setShowOtpidentityEmail(true); // open otp modal
                          }
                        >
                          Send Code
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="field">
                    <div className="field-left">
                      <div className="profile-phone-number">
                        <h4>Phone number</h4>
                        <button className="profile-button-star">
                          {" "}
                          <img src={Star} alt="logo" className="star-icon" />
                          <span>Primary login</span>
                        </button>
                      </div>
                      <p className="sub-text">
                        Used for login and security verification
                      </p>
                    </div>

                    <div className="name-form-row">
                      <div className="input-image-icon">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                        {/* <img src={Pencil} alt="logo" className="side-button-menuicon-profile" onClick={()=> setidentityPhone(true)}/>  */}

                        {/* <img src={isDarkMode ? DarkPencil : Pencil} alt="logo" className="side-button-menuicon-profile" onClick={() =>
                          isPhonePrimary
                            ? setidentityPhone(true)
                            : setprofilephonenumber(true)
                        } /> */}
                        <span
                          className="side-button-menuicon-profile"
                          onClick={() =>
                            isPhonePrimary
                              ? setidentityPhone(true)
                              : setprofilephonenumber(true)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M13.9323 7.42854L16.2511 9.74743M12.3863 18.25H18.57M6.20265 15.1582L5.42969 18.25L8.52153 17.477L17.4771 8.52151C17.7669 8.23161 17.9297 7.83846 17.9297 7.42854C17.9297 7.01862 17.7669 6.62548 17.4771 6.33557L17.3441 6.20263C17.0542 5.91281 16.6611 5.75 16.2511 5.75C15.8412 5.75 15.4481 5.91281 15.1582 6.20263L6.20265 15.1582Z"
                              stroke="#D4D4D8"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {profilephonenumber && (
                    <div className="modal-overlay">
                      <div className="modal-box">
                        <button
                          className="profile-phone-close-btn"
                          onClick={() => setprofilephonenumber(false)}
                        >
                          X
                        </button>
                        <img
                          src={isDarkMode ? Darkphone : Phone}
                          alt="logo"
                          className="Profile-Phone-Icon"
                        />
                        <h2 className="verify-title-inner">
                          Update Phone Number
                        </h2>
                        <p className="verify-subtitle-inner">
                          Enter your new phone number.
                          <br />
                          We'll send a verification code (OTP) to confirm the
                          change.
                        </p>
                        <div className="verify-email-box">
                          <div className="phone-profile-code">
                            <select>
                              <option>(+91) India</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            placeholder="New phone number"
                            className="verify-code-input"
                            value={newphone}
                            onChange={(e) => setNewphone(e.target.value)}
                          />
                        </div>
                        <button
                          className="profile-phone-code-button"
                          // disabled={!newphone.trim()}
                          onClick={() => {
                            // if (!newphone.trim()) return;
                            sendOtp("phone");
                            setprofilephonenumber(false); // close phone modal
                            // setShowOtpPhone(true); // open otp modal
                          }}
                        >
                          Send Code
                        </button>
                      </div>
                    </div>
                  )}
                  {showOtpPhone && (
                    <div className="modal-overlay">
                      <div className="otp-modal-box">
                        <button
                          className="otp-close-btn"
                          onClick={() => setShowOtpPhone(false)}
                        >
                          ×
                        </button>

                        <img
                          src={isDarkMode ? darkOTP : OTP}
                          alt="otp"
                          className="otp-icon"
                        />

                        <h3 className="otp-title">Verify Phone Number</h3>

                        <p className="otp-subtitle">
                          Enter the 6-digit code sent to
                          <br />
                          {newphone}
                        </p>

                        <div className="otp-input-container">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={digit}
                              className="otp-digit-box"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!/^\d?$/.test(value)) return;

                                const updatedOtp = [...otpDigits];
                                updatedOtp[index] = value;
                                setOtpDigits(updatedOtp);

                                if (value && e.target.nextSibling) {
                                  e.target.nextSibling.focus();
                                }
                              }}
                            />
                          ))}
                        </div>

                        <p className="otp-resend-text">
                          Didn’t receive the code? <span>Resend</span>
                        </p>

                        <button className="otp-verify-btn" onClick={verifyOtp}>
                          Verify & Update
                        </button>
                      </div>
                    </div>
                  )}

                  {showOtpidentityphone && (
                    <div className="modal-overlay">
                      <div className="otp-modal-box">
                        <button
                          className="otp-close-btn"
                          onClick={() => setShowOtpidentityphone(false)}
                        >
                          X
                        </button>

                        <img
                          src={isDarkMode ? darkOTP : OTP}
                          alt="otp"
                          className="otp-icon"
                        />

                        <h3 className="otp-title">Verify Phone Number</h3>

                        <p className="otp-subtitle">
                          Enter the 6-digit code sent to
                          <br />
                          {phone}
                        </p>

                        <div className="otp-input-container">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={digit}
                              className="otp-digit-box"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!/^\d?$/.test(value)) return;

                                const updatedOtp = [...otpDigits];
                                updatedOtp[index] = value;
                                setOtpDigits(updatedOtp);

                                if (value && e.target.nextSibling) {
                                  e.target.nextSibling.focus();
                                }
                              }}
                            />
                          ))}
                        </div>

                        <p className="otp-resend-text">
                          Didn’t receive the code? <span>Resend</span>
                        </p>

                        <button
                          className="otp-verify-btn"
                          onClick={verifyOldPhoneOtp}
                        >
                          Verify & Update
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="field-email">
                    <div className="field-left">
                      <h4>Email Address</h4>
                      <p className="sub-text">
                        Used for account access and important updates
                      </p>
                    </div>

                    <div className="name-form-row">
                      <div className="input-image-icon">
                        <input type="email" value={email} readOnly />
                        {/* <img src={Pencil} alt="logo" className="side-button-menuicon-profile" onClick={() => setidentityEmail(true)}/> */}
                        {/* <img src={isDarkMode ? DarkPencil : Pencil} alt="logo" className="side-button-menuicon-profile" onClick={() =>
                          isPhonePrimary
                            ? setprofileemail(true)
                            : setidentityEmail(true)
                        } /> */}

                        <span
                          className="side-button-menuicon-profile"
                          onClick={() =>
                            isPhonePrimary
                              ? setprofileemail(true)
                              : setidentityEmail(true)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M13.9323 7.42854L16.2511 9.74743M12.3863 18.25H18.57M6.20265 15.1582L5.42969 18.25L8.52153 17.477L17.4771 8.52151C17.7669 8.23161 17.9297 7.83846 17.9297 7.42854C17.9297 7.01862 17.7669 6.62548 17.4771 6.33557L17.3441 6.20263C17.0542 5.91281 16.6611 5.75 16.2511 5.75C15.8412 5.75 15.4481 5.91281 15.1582 6.20263L6.20265 15.1582Z"
                              stroke="#D4D4D8"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {profileemail && (
                    <div className="modal-overlay">
                      <div className="modal-box">
                        <button
                          className="profile-phone-close-btn"
                          onClick={() => setprofileemail(false)}
                        >
                          X
                        </button>
                        <img
                          src={isDarkMode ? DarkEmail : Email}
                          alt="logo"
                          className="Profile-Phone-Icon"
                        />
                        <h2 className="verify-title-inner">
                          Update Email Address
                        </h2>
                        <p className="verify-subtitle-inner">
                          Enter a new email address.<br></br>We'll send a
                          verification code (OTP) to <br />
                          confirm the change.
                        </p>
                        <div className="verify-identity-box">
                          <input
                            type="text"
                            placeholder="New email address"
                            className="verify-code-input-identity"
                            value={newemail}
                            onChange={(e) => setNewemail(e.target.value)}
                          />
                        </div>
                        <button
                          className="profile-phone-code-button-identity"
                          //  disabled={!newemail.trim()}
                          onClick={() => {
                            // if (!newemail.trim()) return;
                            sendOtp("email");
                            setprofileemail(false);
                            // setprofileemail(false); // close email modal
                            // setShowOtpEmail(true); // open otp modal
                          }}
                        >
                          Send Code
                        </button>
                      </div>
                    </div>
                  )}

                  {showOtpEmail && (
                    <div className="modal-overlay">
                      <div className="otp-modal-box">
                        <button
                          className="otp-close-btn"
                          onClick={() => setShowOtpEmail(false)}
                        >
                          ×
                        </button>

                        <img
                          src={isDarkMode ? darkOTP : OTP}
                          alt="otp"
                          className="otp-icon"
                        />

                        <h3 className="otp-title">Verify Email ID</h3>

                        <p className="otp-subtitle">
                          Enter the 6-digit code sent to
                          <br />
                          {newemail}
                        </p>

                        <div className="otp-input-container">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={digit}
                              className="otp-digit-box"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!/^\d?$/.test(value)) return;

                                const updatedOtp = [...otpDigits];
                                updatedOtp[index] = value;
                                setOtpDigits(updatedOtp);

                                if (value && e.target.nextSibling) {
                                  e.target.nextSibling.focus();
                                }
                              }}
                            />
                          ))}
                        </div>

                        <p className="otp-resend-text">
                          Didn’t receive the code? <span>Resend</span>
                        </p>

                        <button className="otp-verify-btn" onClick={verifyOtp}>
                          Verify & Update
                        </button>
                      </div>
                    </div>
                  )}

                  {showOtpidentityEmail && (
                    <div className="modal-overlay">
                      <div className="otp-modal-box">
                        <button
                          className="otp-close-btn"
                          onClick={() => setShowOtpidentityEmail(false)}
                        >
                          ×
                        </button>

                        <img
                          src={isDarkMode ? darkOTP : OTP}
                          alt="otp"
                          className="otp-icon"
                        />

                        <h3 className="otp-title">Verify Email ID</h3>

                        <p className="otp-subtitle">
                          Enter the 6-digit code sent to
                          <br />
                          {email}
                        </p>

                        <div className="otp-input-container">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={digit}
                              className="otp-digit-box"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!/^\d?$/.test(value)) return;

                                const updatedOtp = [...otpDigits];
                                updatedOtp[index] = value;
                                setOtpDigits(updatedOtp);

                                if (value && e.target.nextSibling) {
                                  e.target.nextSibling.focus();
                                }
                              }}
                            />
                          ))}
                        </div>

                        <p className="otp-resend-text">
                          Didn’t receive the code? <span>Resend</span>
                        </p>

                        <button
                          className="otp-verify-btn"
                          onClick={verifyOldEmailOtp}
                        >
                          Verify & Update
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="field-role">
                    <div className="field-left">
                      <h4>Role</h4>
                      <p className="sub-text">
                        Helps us personalize your workspace experience
                      </p>
                    </div>
                    <div className="profile-dropdown-account">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="Designer">Designer</option>
                        <option value="Developer">Developer</option>
                        <option value="Student">Student</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="field-timezone">
                    <div className="field-left">
                      <h4>Time Zone</h4>
                      <p className="sub-text">
                        Used for scheduling, collaboration, and activity
                        history.
                      </p>
                    </div>
                    <div className="profile-dropdown-account">
                      <select
                        value={timeZone}
                        onChange={(e) => {
                          console.log("Selected:", e.target.value);
                          setTimeZone(e.target.value);
                        }}
                      >
                        <option value="India (GMT+5:30)">
                          India (GMT+5:30)
                        </option>
                        <option value="USA">USA</option>
                      </select>
                    </div>
                  </div>

                  {/* CONNECTED ACCOUNTS */}
                  <div className="profile-inner-connect">
                    <h4>Connected Accounts</h4>
                  </div>
                  <div className="connect-account-para">
                    <p className="sub-text">
                      Link external accounts for faster sign-in and
                      integrations.
                    </p>
                  </div>

                  <div className="card-menu-item">
                    <div className="svg-profile-setting">
                      <img src={Google} alt="logo" className="card-svg" />

                      <div className="google-connect-card">
                        <p>Google Account</p>
                        <span>{email}</span>
                      </div>
                    </div>
                    <div className="status">
                      <button className="connect-profile-setting">
                        <p className="profileConBtn"> ● Connected</p>
                      </button>
                      {/* <span className="dot-profile-setting">● Connected</span> */}
                      <button
                        className="btn-outline"
                        onClick={() => setgoogledisconnect(true)}
                      >
                        <img src={Disconnect} alt="logo" />
                        <p className="profileDisConBtn">Disconnect</p>
                      </button>
                    </div>
                  </div>

                  {googledisconnect && (
                    <div className="google-disconnect-overlay">
                      <div className="google-container">
                        {/* <div className="google-icon-box">
                          <div className="google-warning-icon"></div>
                        </div> */}
                        <img
                          src={Alert}
                          alt="logo"
                          className="Profile-Phone-Icon"
                        />
                        <h2 className="google-disconnect-title">
                          Disconnect Google Account?
                        </h2>
                        <p className="google-disconnect-message">
                          Are you sure you want to disconnect your{" "}
                          <b>{email}</b>? You won’t be able to use it for sign
                          in and backup after this action
                        </p>
                        <div className="google-disconnect-actions">
                          <button
                            className="disconnect-cancel-btn"
                            onClick={() => setgoogledisconnect(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="disconnect-btn"
                            onClick={disconnectGoogle}
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DELETE ACCOUNT */}
                  <div className="inner-page-action">
                    <h4>Account Actions</h4>
                  </div>
                  <div className="card-menu-item">
                    <div className="svg-profile-setting">
                      <img
                        src={isDarkMode ? Vector : Trash}
                        alt="logo"
                        className="card-svg"
                      />

                      <div className="google-connect-card">
                        <p>Delete Account</p>
                        <span>Permanently delete your account.</span>
                      </div>
                    </div>
                    <button className="btn-danger">
                      {" "}
                      <img
                        src={isDarkMode ? Darktrash : DeleteTrash}
                        alt="logo"
                        className="card-svg-profile"
                      />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
