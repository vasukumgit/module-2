import React from "react";
import Shapes from "../../../../../assets/editor-panel/shapes.png";
import Graphics from "../../../../../assets/editor-panel/graphics.svg";
import Photos from "../../../../../assets/editor-panel/photos.svg";
import Chart from "../../../../../assets/editor-panel/charts.svg";

function ObjectDropdown({ setActiveMenu }) {
  return (
    <div className="dropdown-menu object-menu">
      <div
        className="flex items-center gap-[12px] !p-[12px] cursor-pointer hover:bg-slate-50"
        onClick={() => setActiveMenu("shapes")}
      >
        <div>
          <img src={Shapes} alt="" />
        </div>
        <div>
          <h6>Shapes</h6>
          <p>Basic geometric elements like rectangles, circles, arrows.</p>
        </div>
      </div>

      <div
        className="flex items-center gap-[12px] !p-[12px] cursor-pointer hover:bg-slate-50"
        onClick={() => setActiveMenu("graphics")}
      >
        <div>
          <img src={Graphics} alt="" />
        </div>
        <div>
          <h6>Graphics</h6>
          <p>Icons, illustrations, stickers, and design elements.</p>
        </div>
      </div>

      <div
        className="flex items-center gap-[12px] !p-[12px] cursor-pointer hover:bg-slate-50"
        onClick={() => setActiveMenu("photos")}
      >
        <div>
          <img src={Photos} alt="Photos" />
        </div>
        <div>
          <h6 className="text-[14px] font-semibold text-[#0F172A]">Photos</h6>
          <p className="text-[12px] text-[#64748B]">Stock images</p>
        </div>
      </div>

      <div
        className="flex items-center gap-[12px] !p-[12px] cursor-pointer hover:bg-slate-50"
        onClick={() => setActiveMenu("charts")}
      >
        <div>
          <img src={Chart} alt="" />
        </div>
        <div>
          <h6>Charts & Tables</h6>
          <p>Data visualizations and structured tables.</p>
        </div>
      </div>
    </div>
  );
}

export default ObjectDropdown;
