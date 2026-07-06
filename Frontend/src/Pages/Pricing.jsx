import { useState } from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";


function Pricing() {
    const [billing, setBilling] = useState("yearly");
    const navigate = useNavigate();

    return (
        <div
            className="pricing-modal-overlay"
        >
            <div
                className="pricing-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="pricing-close"
                    onClick={() => navigate(-1)}
                >
                    ✕
                </button>

                <h1 className="pricing-title">
                    Choose Your <span>Creative</span> Plan
                </h1>

                {/* Toggle */}
                <div className="billing-toggle">
                    <button
                        className={billing === "yearly" ? "active" : ""}
                        onClick={() => setBilling("yearly")}
                    >
                        Yearly
                        <span className="save-badge">SAVE UP TO 20%</span>
                    </button>

                    <button
                        className={billing === "monthly" ? "active" : ""}
                        onClick={() => setBilling("monthly")}
                    >
                        Monthly
                    </button>
                </div>

                <div className="plans-container">

                    {/* FREE */}
                    <div className="plan-card">
                        <h3>Free</h3>
                        <h2>
                            ₹0 <span>/month</span>
                        </h2>
                        <p className="sub-text">Start for free</p>

                        <button className="plan-btn disabled">Current Plan</button>

                        <div className="features">
                            <p>✓ Limited templates</p>
                            <p>✓ 1GB storage</p>
                            <p>✓ Export PNG & JPG</p>
                            <p>✓ Max 5 projects</p>
                        </div>
                    </div>

                    {/* PROFESSIONAL */}
                    <div className="plan-card featured">
                        <h3>Professional</h3>
                        <h2>
                            {billing === "yearly" ? "₹799" : "₹999"}
                            <span>/month</span>
                        </h2>
                        <p className="sub-text">
                            {billing === "yearly" ? "Billed annually" : "Billed monthly"}
                        </p>

                        <button className="plan-btn primary">Upgrade</button>

                        <div className="features">
                            <p>✓ Full template library</p>
                            <p>✓ Premium assets</p>
                            <p>✓ 50GB storage</p>
                            <p>✓ PDF export</p>
                            <p>✓ Version history</p>
                        </div>
                    </div>

                    {/* ENTERPRISE */}
                    <div className="plan-card">
                        <h3>Enterprise</h3>
                        <h2>
                            {billing === "yearly" ? "₹2799" : "₹3499"}
                            <span>/month</span>
                        </h2>
                        <p className="sub-text">
                            {billing === "yearly" ? "Billed annually" : "Billed monthly"}
                        </p>

                        <button className="plan-btn">Request a Trial</button>

                        <div className="features">
                            <p>✓ Unlimited storage</p>
                            <p>✓ Advanced version control</p>
                            <p>✓ Team collaboration</p>
                            <p>✓ Priority support</p>
                        </div>
                    </div>

                </div>

                <p className="pricing-footer">
                    No contracts. Cancel anytime. 100% secure payments.
                </p>

            </div>
        </div>
    );
}

export default Pricing;