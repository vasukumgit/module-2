import React from "react";
import "./ManageSubscriptions.css";
import crown from "../../../../assets/AccountCentre/Crown.svg";
import Upgrade from "../../../../assets/AccountCentre/Upgrade.svg";
import FailedTick from "../../../../assets/AccountCentre/Failedtick.svg";
import ProcessingTick from "../../../../assets/AccountCentre/Processingtick.svg";
import PaidTick from "../../../../assets/AccountCentre/Paidtick.svg";
import Sidebar from "../Sidebar/Sidebar";
import DashboardSidebar from "../../DashboardLayout/DashboardSidebar";
export default function ManageSubscriptions() {
  const paymentHistory = [
    {
      id: "STK-1000089",
      plan: "Professional",
      amount: "₹999",
      date: "12-02-2026",
      status: "failed",
      icon: FailedTick,
      label: "Failed",
    },
    {
      id: "STK-1000088",
      plan: "Professional",
      amount: "₹999",
      date: "12-01-2026",
      status: "processing",
      icon: ProcessingTick,
      label: "Processing",
    },
    {
      id: "STK-1000087",
      plan: "Professional",
      amount: "₹999",
      date: "12-12-2025",
      status: "paid",
      icon: PaidTick,
      label: "Paid",
    },
    {
      id: "STK-1000086",
      plan: "Professional",
      amount: "₹999",
      date: "12-11-2025",
      status: "paid",
      icon: PaidTick,
      label: "Paid",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="container-inner-page">
            <Sidebar />
            <div className="right-container">
              <div className="billing-container">
                <div className="billing-header">
                  <h1>Billing & Subscription</h1>
                  <p>Manage your plan, payment methods, and invoices.</p>
                </div>

                <div className="manage-current-plan">
                  <h2>Current Plan</h2>
                  <p>
                    Link external accounts for faster sign-in and integrations.
                  </p>
                </div>

                <div className="manage-plan-card">
                  <div className="plan-left">
                    <div className="plan-icon">
                      <img src={crown} alt="" />
                    </div>
                    <div>
                      <h2>Professional</h2>
                      <p>Designed for growing creators and small teams.</p>
                    </div>
                  </div>

                  <div className="plan-right">
                    <div className="payment-manage">
                      <p className="price">₹999/mo</p>
                      <span className="next-date">
                        Next payment on April 05, 2026
                      </span>
                    </div>
                    <button className="plan-btn">
                      <img
                        src={Upgrade}
                        alt="logo"
                        className="side-button-menuicon-profile"
                      />
                      Upgrade
                    </button>
                  </div>
                </div>

                <div className="section">
                  <h3>Payment Method</h3>
                  <p>
                    Link external accounts for faster sign-in and integrations.
                  </p>

                  <div className="payment-card">
                    <div className="card-info">
                      <div className="visa">VISA</div>
                      <div className="card-details">
                        <p className="card-number">
                          •••• •••• <span className="last-four">3266</span>
                        </p>
                        <span className="card-exp">Exp. 08/28</span>
                      </div>
                    </div>

                    <button className="manage-btn">
                      <img
                        src={Upgrade}
                        alt="logo"
                        className="side-button-menuicon-profile"
                      />
                      Manage
                    </button>
                  </div>
                </div>

                <div className="section">
                  <h3>Payment History</h3>
                  <p className="history-manage">
                    Link external accounts for faster sign-in and integrations.
                  </p>

                  <table className="payment-history-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Download</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paymentHistory.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.plan}</td>
                          <td>{item.amount}</td>
                          <td>{item.date}</td>
                          <td>
                            <span className={`status ${item.status}`}>
                              <img
                                src={item.icon}
                                alt={item.label}
                                className="side-button-menuicon-profile"
                              />
                              {item.label}
                            </span>
                          </td>
                          <td>
                            <button className="download">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
