import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./ChartsDropdown.css";

// Assets
import Drag from "../../../../../../assets/editor-panel/drag-icon.svg";
import Close from "../../../../../../assets/editor-panel/close.svg";
import Search from "../../../../../../assets/editor-panel/search.svg";

import Tables1 from "../../../../../../assets/editor-panel/charts-table-dropdown/tables1.png";
import Tables2 from "../../../../../../assets/editor-panel/charts-table-dropdown/tables2.png";
import Tables3 from "../../../../../../assets/editor-panel/charts-table-dropdown/tables3.png";

import Charts1 from "../../../../../../assets/editor-panel/charts-table-dropdown/charts1.png";
import Charts2 from "../../../../../../assets/editor-panel/charts-table-dropdown/charts2.png";
import Charts3 from "../../../../../../assets/editor-panel/charts-table-dropdown/charts3.png";
import Charts4 from "../../../../../../assets/editor-panel/charts-table-dropdown/charts4.png";
import Charts5 from "../../../../../../assets/editor-panel/charts-table-dropdown/charts5.png";
import Charts6 from "../../../../../../assets/editor-panel/charts-table-dropdown/charts6.png";

function ChartsDropdown({
  setOpen,
  setActiveMenu,
  addImage,
  addElement,
  designId,
}) {
  // =========================
  // API BASE URL
  // =========================
  const API_URL = "http://localhost:5050/api/chart-table";

  // =========================
  // STATES
  // =========================
  const [recentCharts, setRecentCharts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // FALLBACK TABLES
  // =========================
  const fallbackTables = [
    {
      id: 1,
      name: "table-1",
      image: Tables1,
      className: "table-img",
      item_type: "table",
    },

    {
      id: 2,
      name: "table-2",
      image: Tables2,
      className: "table-img",
      item_type: "table",
    },

    {
      id: 3,
      name: "table-3",
      image: Tables3,
      className: "table-img",
      item_type: "table",
    },
  ];

  // =========================
  // FALLBACK CHARTS
  // =========================
  const fallbackCharts = [
    {
      id: 4,
      name: "bar-chart",
      image: Charts1,
      className: "chart-img",
      item_type: "chart",
      chart_type: "bar",
    },

    {
      id: 5,
      name: "line-chart",
      image: Charts2,
      className: "chart-img",
      item_type: "chart",
      chart_type: "line",
    },

    {
      id: 6,
      name: "pie-chart",
      image: Charts3,
      className: "chart-img",
      item_type: "chart",
      chart_type: "pie",
    },
    {
      id: 7,
      name: "doughnut-chart",
      image: Charts4,
      className: "chart-img",
      item_type: "chart",
      chart_type: "doughnut",
    },
    {
      id: 8,
      name: "radar-chart",
      image: Charts5,
      className: "chart-img",
      item_type: "chart",
      chart_type: "radar",
    },
    {
      id: 9,
      name: "polar-area-chart",
      image: Charts6,
      className: "chart-img",
      item_type: "chart",
      chart_type: "polar-area",
    },
  ];

  // =========================
  // TABLES
  // =========================
  const [tables, setTables] = useState(fallbackTables);

  // =========================
  // CHARTS
  // =========================
  const [charts, setCharts] = useState(fallbackCharts);

  // =========================
  // FETCH EDITOR DATA
  // =========================
  useEffect(() => {
    fetchEditorData();
  }, [search]);

  const fetchEditorData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_URL}/editor/2`, {
        params: {
          search: search,
        },
      });

      console.log("GET API RESPONSE:", res.data);

      // =========================
      // API SUCCESS
      // =========================
      if (res.data && res.data.data && res.data.data.length > 0) {
        const formattedData = res.data.data.map((item, index) => ({
          id: item.id || index,

          name: item.name || `item-${index}`,

          image: item.asset_url,

          className: item.item_type === "table" ? "table-img" : "chart-img",

          item_type: item.item_type,

          chart_type: item.chart_type || null,
        }));

        // TABLES
        const apiTables = formattedData.filter(
          (item) => item.item_type === "table",
        );

        // CHARTS
        const apiCharts = formattedData.filter(
          (item) => item.item_type === "chart",
        );

        if (apiTables.length > 0) {
          setTables(apiTables);
        } else {
          setTables(fallbackTables);
        }

        if (apiCharts.length > 0) {
          setCharts(apiCharts);
        } else {
          setCharts(fallbackCharts);
        }
      } else {
        setTables(fallbackTables);
        setCharts(fallbackCharts);
      }
    } catch (error) {
      console.log("chart-table fetch error", error);

      setTables(fallbackTables);
      setCharts(fallbackCharts);

      setError("Failed to load charts");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DRAG CHART / TABLE
  // =========================
  const handleChartDragStart = (e, src) => {
    e.dataTransfer.setData("shapeSrc", src);
  };

  // =========================
  // CLICK CHART / TABLE
  // =========================
  const handleChartClick = (item) => {
    if (addImage) {
      addImage(item.image);
    }

    if (addElement) {
      addElement(item.image, item.item_type);
    }

    // RECENT UPDATE
    setRecentCharts((prev) => {
      const filtered = prev.filter((recent) => recent.id !== item.id);

      return [item, ...filtered].slice(0, 6);
    });

    // SAVE API
    if (item.item_type === "table") {
      saveTable(item);
    } else {
      saveChart(item);
    }
  };

  // =========================
  // SAVE TABLE API
  // =========================
  const saveTable = async (tableItem) => {
    try {
      const payload = {
        design_id: designId,

        table_data: JSON.stringify([
          ["Name", "Age", "City"],

          ["John", "25", "London"],

          ["Alex", "30", "Paris"],
        ]),

        x: 100,
        y: 100,
        width: 400,
        height: 200,
      };

      const response = await axios.post(`${API_URL}/save-table`, payload);

      console.log("TABLE POST RESPONSE:", response.data);
    } catch (error) {
      console.error("TABLE SAVE ERROR:", error);
    }
  };

  // =========================
  // SAVE CHART API
  // =========================
  const saveChart = async (chartItem) => {
    try {
      const payload = {
        design_id: designId,

        chart_type: chartItem.chart_type,

        chart_data: JSON.stringify([10, 20, 30, 40]),

        chart_labels: JSON.stringify(["Jan", "Feb", "Mar", "Apr"]),

        x: 120,
        y: 120,
        width: 500,
        height: 300,
      };

      const response = await axios.post(`${API_URL}/save-chart`, payload);

      console.log("CHART POST RESPONSE:", response.data);
    } catch (error) {
      console.error("CHART SAVE ERROR:", error);
    }
  };

  // =========================
  // FILTERED TABLES
  // =========================
  const filteredTables = useMemo(() => {
    return tables.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, tables]);

  // =========================
  // FILTERED CHARTS
  // =========================
  const filteredCharts = useMemo(() => {
    return charts.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, charts]);

  return (
    <div className="charts-dropdown-wrapper">
      <div className="charts-main-container">
        {/* HEADER */}
        <div className="charts-fixed-header-section">
          <div className="charts-ui-header">
            <div className="charts-title-grp">
              <img src={Drag} alt="drag" className="drag-handler" />

              <h2>Charts & Tables</h2>
            </div>

            <button
              className="charts-close-btn"
              onClick={() => {
                setOpen(false);

                setActiveMenu("objects");
              }}
            >
              <img src={Close} alt="close" />
            </button>
          </div>

          {/* SEARCH */}
          <div className="charts-search-area">
            <div className="charts-input-wrapper">
              <input
                type="text"
                placeholder="Search in Charts & Tables"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <img src={Search} alt="search" className="charts-search-icon" />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="charts-scroll-body">
          {/* LOADING */}
          {loading && (
            <p
              style={{
                padding: "10px",
              }}
            >
              Loading charts...
            </p>
          )}

          {/* ERROR */}
          {error && (
            <p
              style={{
                padding: "10px",
                color: "red",
              }}
            >
              {error}
            </p>
          )}

          {/* RECENTLY USED */}
          {recentCharts.length > 0 && (
            <div className="charts-section">
              <h4>Recently used</h4>

              <div className="charts-grid three-grid">
                {recentCharts.map((item) => (
                  <div
                    className="charts-card"
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleChartDragStart(e, item.image)}
                    onClick={() => handleChartClick(item)}
                  >
                    <img
                      src={item.image}
                      alt="recent"
                      className={item.className}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLES */}
          <div className="charts-section">
            <h4>Tables</h4>

            <div className="charts-grid three-grid">
              {filteredTables.map((item) => (
                <div
                  className="charts-card"
                  key={item.id}
                  draggable={true}
                  onDragStart={(e) => {
                    console.log("DIV DRAG START");
                    handleChartDragStart(e, item.image);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => handleChartClick(item)}
                >
                  <img
                    src={item.image}
                    alt="table"
                    className={item.className}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CHARTS */}
          <div className="charts-section">
            <h4>Charts</h4>

            <div className="charts-grid three-grid">
              {filteredCharts.map((item) => (
                <div
                  className="charts-card"
                  key={item.id}
                  draggable={true}
                  onDragStart={(e) => {
                    console.log("DIV DRAG START");
                    handleChartDragStart(e, item.image);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => handleChartClick(item)}
                >
                  <img
                    src={item.image}
                    alt="chart"
                    className={item.className}
                     draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsDropdown;
