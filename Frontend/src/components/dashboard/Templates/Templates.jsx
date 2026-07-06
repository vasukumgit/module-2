import React, { use } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { Layers, CreditCard, Presentation, Plus } from "lucide-react";
import "./Templates.css";
import axios from "axios";
// import TemplatesInnerPage from './TemplatesInnerPage';
import { useState, useEffect } from "react";
 
import DashboardSidebar from "../DashboardLayout/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import recommend1 from "../../../assets/Templates-Page-Image/Recommend1.png";
import recommend2 from "../../../assets/Templates-Page-Image/Recommend2.png";
import recommend3 from "../../../assets/Templates-Page-Image/Recommend3.png";
import recommend4 from "../../../assets/Templates-Page-Image/Recommend4.png";
import recommend5 from "../../../assets/Templates-Page-Image/Recommend5.png";
import trending1 from "../../../assets/Templates-Page-Image/Trending1.png";
import trending2 from "../../../assets/Templates-Page-Image/Trending2.png";
import trending3 from "../../../assets/Templates-Page-Image/Trending3.png";
import trending4 from "../../../assets/Templates-Page-Image/Trending4.png";
import trending5 from "../../../assets/Templates-Page-Image/Trending5.png";
//icons
import frame1 from "../../../assets/Frames/frame1.png";
import frame2 from "../../../assets/Frames/frame2.png";
import frame3 from "../../../assets/Frames/frame3.png";
 
// function Templates({
//   showProjectSearch,
//   setShowProjectSearch,
//   handleClick,
//   clickedBtn,
// }) {
//   const [activeTab, setActiveTab] = useState("All");
//   const [templates, setTemplates] = useState([]);
 
function Templates() {
  const navigate = useNavigate();
  //  const openEditor = (template) => {
  //   navigate(`/editor/${template.id}`);
  // };
//   const openEditor = (template) => {  //change 1
//   navigate("/editor/22", {
//     state: {
//       selectedTemplate: template,
//     },
//   });
// };
//
 
const openEditor = async (template) => {
 
  try {
 
    const token = localStorage.getItem("token");
 
    const recentTemplates =
 
      JSON.parse(localStorage.getItem("recentTemplates")) || [];
 
    const updatedTemplates = [
 
      template,
 
      ...recentTemplates.filter((item) => item.id !== template.id),
 
    ];
 
    localStorage.setItem(
 
      "recentTemplates",
 
      JSON.stringify(updatedTemplates.slice(0, 10))
 
    );
 
    const response = await axios.post(
 
      "http://localhost:5050/api/cloud-status",
 
      {
 
        title: template.title,
 
        template_id: template.id,
 
        width: template.width || 212,
 
        height: template.height || 242,
 
        type: "custom",
 
        design_data: [],
 
      },
 
      {
 
        headers: {
 
          Authorization: `Bearer ${token}`,
 
        },
 
      }
 
    );
 
    // await axios.post(
 
    //   `http://localhost:5050/api/editor_templates/recent`,
    //   {
    //     item_id: template.id,
    //     source:"templates"
    //   }
 
    // );
    await axios.post(
  `http://localhost:5050/api/templates/${template.id}/use`
);
 
    const designId = response.data.data.design_id;
 
    navigate(`/editor/${designId}`, {
 
      state: {
 
        selectedTemplate: template,
 
      },
 
    });
 
  } catch (error) {
 
    console.error("Template create error:", error);
 
  }
 
};
 // still here
  const [showProjectSearch, setShowProjectSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [templates, setTemplates] = useState([]);
 
  const suggestions = ["Instagram post", "Resume", "YouTube thumbnail", "Logo"];
  const tabs = [
    "All",
    "Instagram Story",
    "Instagram Post",
    "YouTube Thumbnail",
    "Business Card",
    "Presentation",
  ];
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5050/api/templates",
        );
        setTemplates(res.data.templates || []);
        console.log(res.data.data)
      } catch (err) {
        // setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
 
 
  //  useEffect(() => {
  //   fetchTemplates();
  // }, []);
 
  // useEffect(() => {
  //   axios.get("http://localhost:5050/api/templates").then((res)=>{
  //     setTemplates(res.data);
  //     console.log(res.data);
 
  //   })
  //   .catch((e)=>{
  //     console.error("Api not loading", e);
 
  //   })
  // }, [])
 
  // const fetchTemplates = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5050/api/templates");
 
  //     console.log("API RESPONSE:", res.data); // 👈 ADD THIS
 
  //     setTemplates(res.data.data);
 
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
 
  //  SEARCH FUNCTION
  const handleSearch = async (query) => {
    try {
      if (!query) return fetchTemplates();
 
      const res = await axios.get(
        `http://localhost:5050/api/templates/search?search=${query}`
      );
 
      setTemplates(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };
 
  //  FILTER FUNCTION
 
  const handleFilter = async (category) => {
 
    try {
 
      setActiveTab(category);
 
      if (category === "All") return fetchTemplates();
 
      const res = await axios.get(
 
        `http://localhost:5050/api/templates/filter?category=${category}`
 
      );
 
      setTemplates(res.data.data || res.data);
 
    } catch (err) {
 
      console.log(err);
 
    }
 
  };
 
  const recommended = [
    { id: 1, img: recommend2 },
    { id: 2, img: recommend2 },
    { id: 3, img: recommend3 },
    { id: 4, img: recommend4 },
    { id: 5, img: recommend5 },
  ];
  const trending = [
    { id: 1, img: trending1 },
    { id: 2, img: trending2 },
    { id: 3, img: trending3 },
    { id: 4, img: trending4 },
    { id: 5, img: trending5 },
  ];
//   const handleDoubleClick = (template) => {
//   navigate("/editor", {
//     state: {
//       selectedTemplate: template,
//     },
//   });
// };
 
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-body">
          <DashboardSidebar />
          <div className="dashboard-wrapper">
            <div className="templates-page">
              <div className="background-frame">
                {/* Floating Images */}
                <img src={frame1} className="background-img img-left" />
                <img src={frame2} className="bacground-img img-right-top" />
                <img src={frame3} className="background-img img-right-bottom" />
                <h1 className="templates-title">
                  Explore <span>Templates</span>
                </h1>
                {/* Search */}
                <div
                  className={`search-wrapper  `}
                >
                  <div
                    className="search-box"
                    onClick={() => setShowProjectSearch(true)}
                  >
                    <FiSearch className="search-icon" />
 
                    {/* {showProjectSearch && (
                    <span className="search-tag">In Templates</span>
                  )} */}
 
                    <input
                      type="text"
                      placeholder="Search Templates..."
                      onFocus={() => setShowProjectSearch(true)}
                      onBlur={() => setShowProjectSearch(false)}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                {/* Suggestions */}
                <div className="suggestions-inline">
                  <p>Suggestions:</p>
                  {suggestions.map((item, i) => (
                    //<button key={i}>{item}</button>
                    <button key={i} onClick={() => handleSearch(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
 
               {loading && <p>Loading...</p>}
 
              {error && <p style={{ color: "red" }}>{error}</p>}
 
              {!loading && !error && (
                <div className="flex justify-start w-[100%] top-[352px]">
                  <div className="tabs-container">
                    {/* {templates.map((template) => (
                      <button
                        key={template.id}
                        className={`tab template-btn ${activeTab === template.title ? "tab-active" : ""}`}
                        onClick={() => setActiveTab(template.title)}
                      >
                        {template.title}
                      </button>
                    ))} */}
               {templates?.map((template) => ( //this line add//
    <div key={template.id} style={{ width: "200px" }}>
      <img
        src={template.img}
        alt={template.title}
        onClick={() => openEditor(template)}
      />
      <p>{template.title}</p>
    </div>
  ))}
 
                  </div>
                </div>
              )}
 
              {/* <div className="flex justify-start w-[100%] top-[352px]">
                <div className="tabs-container">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`tab template-btn ${activeTab === tab ? "tab-active" : ""}`}
                      //onClick={() => setActiveTab(tab)}
                      onClick={() => handleFilter(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div> */}
              {/* Main Layout */}
 
              {/* <TemplatesFilter /> */}
              <div className="templates-container">
 
 
 
                <div className="section-Header-T">
                  <h3>Recommended for You</h3>
                  {/* <span>See all</span> */}
                </div>
                <div className="template-image-row">
                  <div className="flex flex-wrap ">
                    {recommended.map((t) => (
                      <div key={t.id} className="w-1/5 relative">
                        <span className="relative inline-block">
                          <img
                            src={t.img}
                            alt=""
                            onDoubleClick={() => openEditor(t)}
                            style={{ cursor: "pointer" }}/>
                          <button className="premium-btn absolute  ">
                            {<svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="9"
                              viewBox="0 0 10 9"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5.10534 0.216571C5.06396 0.150303 5.0064 0.095654 4.93808 0.0577666C4.86976 0.0198792 4.79292 0 4.7148 0C4.63667 0 4.55983 0.0198792 4.49151 0.0577666C4.42319 0.095654 4.36563 0.150303 4.32425 0.216571L3.24742 1.9407L0.731922 0.110946C0.394463 -0.134429 -0.069745 0.159696 0.00879664 0.569196L0.982172 5.68253C1.02353 5.89929 1.13922 6.09483 1.30929 6.23543C1.47937 6.37604 1.69317 6.45291 1.91384 6.45278L7.51738 6.45278C7.73803 6.45276 7.95177 6.37576 8.12174 6.23505C8.29171 6.09435 8.40727 5.89875 8.44851 5.68199L9.42188 0.569196C9.50042 0.159696 9.03676 -0.134971 8.6993 0.110946L6.18326 1.9407L5.10534 0.216571ZM1.46534 7.26528C1.35759 7.26528 1.25426 7.30808 1.17808 7.38427C1.10189 7.46045 1.05909 7.56378 1.05909 7.67153C1.05909 7.77927 1.10189 7.8826 1.17808 7.95879C1.25426 8.03498 1.35759 8.07778 1.46534 8.07778L7.96534 8.07778C8.07308 8.07778 8.17641 8.03498 8.2526 7.95879C8.32879 7.8826 8.37159 7.77927 8.37159 7.67153C8.37159 7.56378 8.32879 7.46045 8.2526 7.38427C8.17641 7.30808 8.07308 7.26528 7.96534 7.26528L1.46534 7.26528Z"
                                fill="url(#paint0_linear_10985_4405)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_10985_4405"
                                  x1="-0.285156"
                                  y1="0.0390625"
                                  x2="4.00532"
                                  y2="9.45681"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop
                                    offset="0.0561081"
                                    stop-color="#FFED9D"
                                  />
                                  <stop
                                    offset="0.587114"
                                    stop-color="#FFD100"
                                  />
                                  <stop offset="1" stop-color="#C29E00" />
                                </linearGradient>
                              </defs>
                            </svg>}
                            Premium
                          </button>
                          {/* <p className="text-white">{t.img}</p> */}
                        </span>
                      </div>
                    ))}
                  </div>
 
                  <Link
                    // className={`menu-item ${activeMenu === "template" ? "active" : ""}`}
                    className="see-all-btn"
                    to="/templates-inner"
                  >
                    See All
                  </Link>
                  <div className="card-before"></div>
                </div>
 
 
 
 
                <div className="section-Header-T">
                  <h3>Trending Templates</h3>
 
                  {/* <span>See all</span> */}
                </div>
                <div className="template-image-row ">
                  <div className="flex flex-wrap">
                    {trending.map((t) => (
                      <div key={t.id} className="w-1/5 relative">
                        <span className="relative inline-block">
                         <img
                            src={t.img}
                            alt=""
                            onDoubleClick={() => openEditor(t)}
                            style={{ cursor: "pointer" }}/>
                          <button className="premium-btn absolute bottom-[-3px]">
                            {<svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="9"
                              viewBox="0 0 10 9"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5.10534 0.216571C5.06396 0.150303 5.0064 0.095654 4.93808 0.0577666C4.86976 0.0198792 4.79292 0 4.7148 0C4.63667 0 4.55983 0.0198792 4.49151 0.0577666C4.42319 0.095654 4.36563 0.150303 4.32425 0.216571L3.24742 1.9407L0.731922 0.110946C0.394463 -0.134429 -0.069745 0.159696 0.00879664 0.569196L0.982172 5.68253C1.02353 5.89929 1.13922 6.09483 1.30929 6.23543C1.47937 6.37604 1.69317 6.45291 1.91384 6.45278L7.51738 6.45278C7.73803 6.45276 7.95177 6.37576 8.12174 6.23505C8.29171 6.09435 8.40727 5.89875 8.44851 5.68199L9.42188 0.569196C9.50042 0.159696 9.03676 -0.134971 8.6993 0.110946L6.18326 1.9407L5.10534 0.216571ZM1.46534 7.26528C1.35759 7.26528 1.25426 7.30808 1.17808 7.38427C1.10189 7.46045 1.05909 7.56378 1.05909 7.67153C1.05909 7.77927 1.10189 7.8826 1.17808 7.95879C1.25426 8.03498 1.35759 8.07778 1.46534 8.07778L7.96534 8.07778C8.07308 8.07778 8.17641 8.03498 8.2526 7.95879C8.32879 7.8826 8.37159 7.77927 8.37159 7.67153C8.37159 7.56378 8.32879 7.46045 8.2526 7.38427C8.17641 7.30808 8.07308 7.26528 7.96534 7.26528L1.46534 7.26528Z"
                                fill="url(#paint0_linear_10985_4405)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_10985_4405"
                                  x1="-0.285156"
                                  y1="0.0390625"
                                  x2="4.00532"
                                  y2="9.45681"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop
                                    offset="0.0561081"
                                    stop-color="#FFED9D"
                                  />
                                  <stop
                                    offset="0.587114"
                                    stop-color="#FFD100"
                                  />
                                  <stop offset="1" stop-color="#C29E00" />
                                </linearGradient>
                              </defs>
                            </svg>}
                            Premium
                          </button>
                          {/* <p className="text-white">{t.img}</p> */}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="see-all-btn">See All</button>
                  <div className="card-before"></div>
                </div>
                <div className="section-Header-T">
                  <h3>All Templates (API)</h3>
                </div>
 
                <div className="template-image-row">
                  <div className="flex flex-wrap">
                    {templates.map((t) => (
                      <div key={t.id} className="w-1/5">
                        <img src={t.image} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
 
 
                {/* Browse Button */}
                <div className="browse-container">
                  <button className="browse-button">
                    Browse all Templates
                  </button>
                </div>
              </div>
 
              {/* <TemplatesInnerPage/> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Templates;  