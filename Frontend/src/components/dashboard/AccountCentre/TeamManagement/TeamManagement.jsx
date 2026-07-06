import React, { useEffect, useState } from "react";
import "./TeamManagement.css";
import { Search, ChevronDown, Plus } from "lucide-react";
import axios from "axios"
import Sidebar from "../Sidebar/Sidebar";
import DashboardSidebar from "../../DashboardLayout/DashboardSidebar";

export default function TeamManagementContent() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5050/api/team/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeams(res.data);
      } catch (err) {
        // setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
  const filteredTeams = teams.filter((team) =>
  team.team_name.toLowerCase().includes(search.toLowerCase())
);

  return (

    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">
          <div className="container-inner-page">
            <Sidebar />
            <div className="right-container">
              <div className="tmc-container">
      <h2 className="tmc-title">Team Management</h2>
      <p className="tmc-subtitle">
        View and manage all projects you’re part of. Select a project to see
        members and roles.
      </p>
 
      <div className="tmc-topbar">
        <div className="tmc-search">
          <Search size={20} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search projects"
            className="tmc-search-input"
             onChange={(e) => setSearch(e.target.value)}
          />
        </div>
 
        <div className="tmc-actions">
          <button className="tmc-filter-btn">
            Newest <ChevronDown size={18} />
          </button>
          <button className="tmc-filter-btn">
            All Roles <ChevronDown size={18} />
          </button>
          <button className="tmc-new-btn">
            <Plus size={18} /> New Team
          </button>
        </div>
      </div>
 
      {loading ? (
        <p className="text-center loading">Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
       
        <table className="Team-management-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Owner</th>
              <th>Your Role</th>
              <th>Created on</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length === 0 ? (
  <tr>
    <td colSpan="4" style={{ textAlign: "center" }}>
      No teams found
    </td>
  </tr>
) : (filteredTeams.map((team) => (
              <tr key={team.team_id}>
                <td>{team.team_name}</td>
                <td>{team.owner_name}</td>
                <td>{team.role}</td>
               
               <td>{team.created_at}</td>
 
              </tr>
            )))}
 
            {/*  REMOVE BELOW STATIC DATA */}
          </tbody>
        </table>
      )}
    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}