import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { FiEdit, FiEdit2, FiEdit3 } from "react-icons/fi";
import "./TemplatesInner.css";
import DashboardSidebar from "../DashboardLayout/DashboardSidebar";
//import { useState} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; //changed 1
// import trending1 from "../../../assets/Templates-Page-Image/Trending1.png";
// import trending2 from "../../../assets/Templates-Page-Image/Trending2.png";
// import trending3 from "../../../assets/Templates-Page-Image/Trending3.png";
// import trending4 from "../../../assets/Templates-Page-Image/Trending4.png";
// import trending5 from "../../../assets/Templates-Page-Image/Trending5.png";
// import recommend1 from "../../../assets/Templates-Page-Image/Recommend1.png";
// import recommend2 from "../../../assets/Templates-Page-Image/Recommend2.png";
// import recommend3 from "../../../assets/Templates-Page-Image/Recommend3.png";
// import recommend4 from "../../../assets/Templates-Page-Image/Recommend4.png";
// import recommend5 from "../../../assets/Templates-Page-Image/Recommend5.png";
import templatesInnerPage1 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage1.png";
import templatesInnerPage2 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage2.png";
import templatesInnerPage3 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage3.png";
import templatesInnerPage4 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage4.png";
import templatesInnerPage5 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage5.png";
import templatesInnerPage6 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage6.png";
import templatesInnerPage7 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage7.png";
import templatesInnerPage8 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage8.png";
import templatesInnerPage9 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage9.png";
import templatesInnerPage10 from "../../../assets/Templates-Inner-Page-Image/TemplatesInnerPage10.png";

function TemplatesInner({
  showProjectSearch,
  setShowProjectSearch,
  handleClick,
  clickedBtn,
}) {
  const [checkedCount, setCheckedCount] = useState(0);
  const [filterSearch, setFilterSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [styleSearch, setStyleSearch] = useState("");
  const [sizeSearch, setSizeSearch] = useState("");
  const [accessSearch, setAccessSearch] = useState("");
  const [orientationSearch, setOrientationSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate(); //changed 2

  // const handleTemplateOpen = (template) => {
  //   navigate("/editor", {
  //     state: {
  //       templateId: template.id,
  //       templateData: template,
  //     },
  //   });
  // };
  // const handleTemplateOpen = (template) => {
  //   navigate("/editor/22", {
  //     state: {
  //       selectedTemplate: template,
  //     },
  //   });
  // };
  //

  const handleTemplateOpen = async (template) => {
    try {
      const token = localStorage.getItem("token");

      // Recent Templates Save
      const recentTemplates =
        JSON.parse(localStorage.getItem("recentTemplates")) || [];

      const updatedTemplates = [
        template,
        ...recentTemplates.filter((item) => item.id !== template.id),
      ];

      localStorage.setItem(
        "recentTemplates",
        JSON.stringify(updatedTemplates.slice(0, 10)),
      );

      const response = await axios.post(
        "/api/cloud-status",
        {
          title: template.title,
          template_id: template.id,
          width: template.width || 254,
          height: template.height || 242,
          type: "custom",
          design_data: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const designId = response.data.data.design_id;

      navigate(`/editor/${designId}`, {
        state: {
          selectedTemplate: template,
        },
      });
    } catch (err) {
      console.error("OPEN TEMPLATE ERROR", err);
    }
  };
  //still here

  //Checkbox counter

  const handleCheckbox = (e, item) => {
    if (e.target.checked) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i !== item));
    }
  };

  // Filter search input

  const handleFilterSearch = (e) => {
    const value = e.target.value;
    setFilterSearch(value);
    handleSearch(value); // trigger search
  };

  const typeFilters = [
    "Social Media Post",
    "Instagram Post",
    "Instagram Story",
    "Facebook Post",
    "YouTube Thumbnail",
    "Poster",
    "Business Card",
    "Resume",
    "Invitation",
    "Brochure",
    "Banner",
    "Certificate",
  ];
  const industryFilters = [
    "Education",
    "Corporate / Business",
    "Real Estate",
    "Healthcare",
    " Fashion",
    " Travel& Toursim",
    "Food& Restaurant",
    "Events",
    "Technology",
    "Fitness",
    "Finance",
    "Marketing Agency",
    "E-commerce",
    "Others",
  ];

  const styleFilters = [
    "Minimal",
    "Modern",
    "Bold",
    "Elegant",
    "Luxury",
    "Creative",
    "Professional",
    "Vintage",
    "Corporate",
    "Colorful",
    "Dark Theme",
    "Pastel",
    "Gradient",
  ];
  const sizeFilters = [
    " 1080 x 1080 px (Instagram Post)",
    "1080 x 1920 px (Story / Reels cover)",
    "1200 x 628 px (Facebook Post)",
    "1200 x 675 px (Linkdin Post)",
    "1280 x 720 px (Youtube Thumbnail)",
    "820 x 312 px (Facebook Cover)",
    "1500 x 500 px (Twitter/ X Heater)",
    "A4 (210 x 297 mm)",
    "A5 (148 x 210 mm)",
    "A3 (279 x 420 mm)",
    "Letter (8.5 x 11 in)",
    "DL Flyer (99 x 210 mm)",
    "Business Card (3.5 x 2 in)",
    "16:9 (1920 x 1080)",
    "4:3 (1024 x 768)",
    "1200 x 300 (Website Banner)",
    "300x 250 px (Display Ad)",
    "728 x 90 px (Leaderboard Ad)",
  ];
  const accessFilters = ["Free", "Premium"];
  const orientationFilters = ["Portrait", "Landscape", "Square"];
  const trending = [
    { id: 1, img: templatesInnerPage1 },
    { id: 2, img: templatesInnerPage2 },
    { id: 3, img: templatesInnerPage3 },
    { id: 4, img: templatesInnerPage4 },
    { id: 5, img: templatesInnerPage5 },
    { id: 6, img: templatesInnerPage6 },
    { id: 7, img: templatesInnerPage7 },
    { id: 8, img: templatesInnerPage8 },
    { id: 9, img: templatesInnerPage9 },
    { id: 10, img: templatesInnerPage10 },
  ];
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-body">
          <DashboardSidebar />
          <div className="dashboard-wrapper">
            <div className="background-frame">
              <h1 className="templates-title">
                Explore <span>Templates</span>
              </h1>
              {/* Search */}
              <div
                className={`search-wrapper ${showProjectSearch ? "active" : ""}`}
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
            </div>
            <div className="templates-inner-page">
              <div className="flex justify-between pb-[24px]">
                <div>
                  <h5 className="card-heading">Trending Templates</h5>
                </div>
                <div>
                  <div className="temp-filter-btn ">
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className={`fil-btn ${showFilter == false && selectedItems.length > 0 ? "" : "fil-btn-p"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="19"
                        viewBox="0 0 20 19"
                        fill="none"
                      >
                        <path
                          d="M19 9.287H6.645M2.284 9.287H0.5M2.284 9.287C2.284 8.70883 2.51368 8.15434 2.92251 7.74551C3.33134 7.33668 3.88583 7.107 4.464 7.107C5.04217 7.107 5.59666 7.33668 6.00549 7.74551C6.41432 8.15434 6.644 8.70883 6.644 9.287C6.644 9.86517 6.41432 10.4197 6.00549 10.8285C5.59666 11.2373 5.04217 11.467 4.464 11.467C3.88583 11.467 3.33134 11.2373 2.92251 10.8285C2.51368 10.4197 2.284 9.86517 2.284 9.287ZM19 15.894H13.252M13.252 15.894C13.252 16.4723 13.0218 17.0274 12.6128 17.4363C12.2039 17.8453 11.6493 18.075 11.071 18.075C10.4928 18.075 9.93834 17.8443 9.52951 17.4355C9.12068 17.0267 8.891 16.4722 8.891 15.894M13.252 15.894C13.252 15.3157 13.0218 14.7616 12.6128 14.3527C12.2039 13.9437 11.6493 13.714 11.071 13.714C10.4928 13.714 9.93834 13.9437 9.52951 14.3525C9.12068 14.7613 8.891 15.3158 8.891 15.894M8.891 15.894H0.5M19 2.68H15.895M11.534 2.68H0.5M11.534 2.68C11.534 2.10183 11.7637 1.54734 12.1725 1.13851C12.5813 0.729678 13.1358 0.5 13.714 0.5C14.0003 0.5 14.2838 0.556387 14.5483 0.665943C14.8127 0.775498 15.0531 0.936075 15.2555 1.13851C15.4579 1.34094 15.6185 1.58126 15.7281 1.84575C15.8376 2.11024 15.894 2.39372 15.894 2.68C15.894 2.96628 15.8376 3.24976 15.7281 3.51425C15.6185 3.77874 15.4579 4.01906 15.2555 4.22149C15.0531 4.42392 14.8127 4.5845 14.5483 4.69406C14.2838 4.80361 14.0003 4.86 13.714 4.86C13.1358 4.86 12.5813 4.63032 12.1725 4.22149C11.7637 3.81266 11.534 3.25817 11.534 2.68Z"
                          stroke="white"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                        />
                      </svg>
                      <span className="inline-block ml-1">
                        Filters{" "}
                        {selectedItems.length > 0 &&
                          `(${selectedItems.length})`}
                      </span>
                    </button>

                    {showFilter == false && selectedItems.length > 0 && (
                      <>
                        <span className="bar"> |</span>
                        <button
                          className="fil-close"
                          onClick={() => {
                            setSelectedItems([]);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M0.5 0.5L16.5 16.5M0.5 16.5L16.5 0.5"
                              stroke="white"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <div
                  className={`card-section ${
                    showFilter ? "basis-9/12" : "basis-12/12"
                  }`}
                >
                  <div className="flex flex-wrap ">
                    {trending.map((t) => (
                      // <div
                      //   key={t.id}
                      //   className={`relative ${showFilter ? "basis-1/4" : "basis-1/5"}`}
                      // >

                      <div // changed 3
                        key={t.id}
                        className={`relative ${showFilter ? "basis-1/4" : "basis-1/5"}`}
                        onDoubleClick={() => handleTemplateOpen(t)}
                        // style={{ cursor: "pointer" }}
                      >
                        <img src={t.img} alt="" />
                        <button className="premium-btn absolute left-0">
                          <svg
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
                                <stop offset="0.0561081" stop-color="#FFED9D" />
                                <stop offset="0.587114" stop-color="#FFD100" />
                                <stop offset="1" stop-color="#C29E00" />
                              </linearGradient>
                            </defs>
                          </svg>
                          Premium
                        </button>
                        {/* <p className="text-white">{t.img}</p> */}
                      </div>
                    ))}
                    {/* <div className={`${showFilter ? "basis-1/4" : "basis-1/5"}`}>
                asdasdasdsadsa
              </div>
              <div className={`${showFilter ? "basis-1/4" : "basis-1/5"}`}>
                asdfadsf
              </div>
              <div className={`${showFilter ? "basis-1/4" : "basis-1/5"}`}>
                dasasda
              </div>
              <div className={`${showFilter ? "basis-1/4" : "basis-1/5"}`}>
                asdasd
              </div> */}
                  </div>
                </div>

                {showFilter && (
                  <div className="basis-3/12 filter-section">
                    <aside className="filter-sidebar-L">
                      <div className="filter-header-L">
                        <h3>Filters</h3>
                        {selectedItems.length > 0 && (
                          <span
                            className="clear"
                            onClick={() => {
                              setSelectedItems([]);
                            }}
                          >
                            Clear All
                          </span>
                        )}
                      </div>

                      {/* Type */}
                      <details className="filter-box-L">
                        <summary>Type</summary>
                        {/* Search Bar */}
                        <div className="filter-search-L">
                          <FiSearch />
                          <input
                            type="text"
                            placeholder="Search"
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            className="placeholder-[#94A3B8]"
                          />
                          {filterSearch && (
                            <button
                              className="clear-btn"
                              onClick={() => setFilterSearch("")}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {typeFilters
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(filterSearch.toLowerCase()),
                          )
                          .map((item, index) => (
                            <label key={index}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => handleCheckbox(e, item)}
                              />
                              <span class="checkmark"></span>
                              {item}
                            </label>
                          ))}
                      </details>

                      {/* Industry */}
                      <details className="filter-box-L">
                        <summary>Industry</summary>
                        {/* Search Bar */}
                        <div className="filter-search-L">
                          <FiSearch />
                          <input
                            type="text"
                            placeholder="Search"
                            value={industrySearch}
                            onChange={(e) => setIndustrySearch(e.target.value)}
                            className="placeholder-[#94A3B8]"
                          />
                          {industrySearch && (
                            <button
                              className="clear-btn"
                              onClick={() => setIndustrySearch("")}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {industryFilters
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(industrySearch.toLowerCase()),
                          )
                          .map((item, index) => (
                            <label key={index}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => handleCheckbox(e, item)}
                              />
                              <span class="checkmark"></span>
                              {item}
                            </label>
                          ))}
                      </details>

                      {/* Style */}

                      <details className="filter-box-L">
                        <summary>Style</summary>

                        <div className="filter-search-L">
                          <FiSearch />
                          <input
                            type="text"
                            placeholder="Search"
                            value={styleSearch}
                            onChange={(e) => setStyleSearch(e.target.value)}
                            className="placeholder-[#94A3B8]"
                          />
                          {styleSearch && (
                            <button
                              className="clear-btn"
                              onClick={() => setStyleSearch("")}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {styleFilters
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(styleSearch.toLowerCase()),
                          )
                          .map((item, index) => (
                            <label key={index}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => handleCheckbox(e, item)}
                              />
                              <span class="checkmark"></span>
                              {item}
                            </label>
                          ))}
                      </details>

                      {/* Size */}
                      <details className="filter-box-L">
                        <summary>Size</summary>

                        <div className="filter-search-L">
                          <FiSearch />
                          <input
                            type="text"
                            placeholder="Search"
                            value={sizeSearch}
                            onChange={(e) => setSizeSearch(e.target.value)}
                            className="placeholder-[#94A3B8]"
                          />
                          {sizeSearch && (
                            <button
                              className="clear-btn"
                              onClick={() => setSizeSearch("")}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {sizeFilters
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(sizeSearch.toLowerCase()),
                          )
                          .map((item, index) => (
                            <label key={index}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => handleCheckbox(e, item)}
                              />
                              <span class="checkmark"></span>
                              {item}
                            </label>
                          ))}
                      </details>

                      {/* Access */}
                      <details className="filter-box-L">
                        <summary>Access</summary>

                        <div className="filter-search-L">
                          <FiSearch />
                          <input
                            type="text"
                            placeholder="Search"
                            value={accessSearch}
                            onChange={(e) => setAccessSearch(e.target.value)}
                            className="placeholder-[#94A3B8]"
                          />
                          {accessSearch && (
                            <button
                              className="clear-btn"
                              onClick={() => setAccessSearch("")}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {accessFilters
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(accessSearch.toLowerCase()),
                          )
                          .map((item, index) => (
                            <label key={index}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => handleCheckbox(e, item)}
                              />
                              <span class="checkmark"></span>
                              {item}
                            </label>
                          ))}
                      </details>
                      {/* Orientation */}
                      <details className="filter-box-L">
                        <summary>Orientation</summary>

                        <div className="filter-search-L">
                          <FiSearch />
                          <input
                            type="text"
                            placeholder="Search"
                            value={orientationSearch}
                            onChange={(e) =>
                              setOrientationSearch(e.target.value)
                            }
                            className="placeholder-[#94A3B8]"
                          />
                          {orientationSearch && (
                            <button
                              className="clear-btn"
                              onClick={() => setOrientationSearch("")}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {orientationFilters
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(orientationSearch.toLowerCase()),
                          )
                          .map((item, index) => (
                            <label key={index}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => handleCheckbox(e, item)}
                              />
                              <span class="checkmark"></span>
                              {item}
                            </label>
                          ))}
                      </details>
                    </aside>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TemplatesInner;
