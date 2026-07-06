import { useState, useRef, useEffect } from "react";
import Template from "./Templates/Template";
import ObjectDropdown from "./object-dropdown/ObjectDropdown";
import ShapesDropdown from "./object-dropdown/ShapesDropdown";
import PhotoDropdown from "./object-dropdown/photos-panel/PhotoDropdown";
import Graphics from "./object-dropdown/graphics-folder/Graphics";
import ChartsDropdown from "./object-dropdown/charts-dropdown/ChartsDropdown";
import TextStyles from "./Text-Styles/TextStyles";
import StarredPanel from "./starred-page/StarredPanel";
import AssetsPanel from "./asset-manager/pages/AssetsPanel";

import "./object-dropdown/objectdropdown.css";

function SidebarLeft({ addElements, template, templateId }) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("objects");
  const [openStarred, setOpenStarred] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [openStyle, setopenStyle] = useState(false);
  const [showAssetsDropdown, setShowAssetsDropdown] = useState(false);

  const ref = useRef();
  // const addImage = (url) => console.log("Image URL selected:", url);
  return (
    <div className="sidebar-left">
      <button className="cursor-pointer" onClick={() => setOpenTemplate(true)}>
        <svg
          width="72"
          height="40"
          viewBox="0 0 72 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 29L36.3494 21.7348C36.4291 21.6436 36.5709 21.6436 36.6506 21.7348L43 29M30 29H43M30 29C28.8954 29 28 28.0486 28 26.875V14.125C28 12.9514 28.8954 12 30 12L43 12C44.1046 12 45 12.9514 45 14.125V26.875C45 28.0486 44.1046 29 43 29M41.5 19.4375C41.5 19.7309 41.2761 19.9688 41 19.9688C40.7239 19.9688 40.5 19.7309 40.5 19.4375C40.5 19.1441 40.7239 18.9062 41 18.9062C41.2761 18.9062 41.5 19.1441 41.5 19.4375Z"
            stroke="#64748B"
            stroke-linecap="round"
          />
        </svg>
        Templates
      </button>

      <Template open={openTemplate} onClose={() => setOpenTemplate(false)} templateId={templateId} />

      <div
        className="editor-dropdown-wrapper"
        ref={ref}
        onMouseEnter={() => {
          if (activeMenu === "objects") {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (activeMenu === "objects") {
            setOpen(false);
            setActiveMenu("objects");
          }
        }}
      >
        <button className="cursor-pointer">
          <svg
            width="68"
            height="40"
            viewBox="0 0 68 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.4048 16C37.2701 14.3909 36.5707 12.8737 35.4202 11.7233C34.1343 10.4373 32.3901 9.71484 30.5715 9.71484C28.7529 9.71484 27.0087 10.4373 25.7228 11.7233C24.4368 13.0092 23.7144 14.7534 23.7144 16.572C23.7144 18.3906 24.4368 20.1348 25.7228 21.4207C26.8732 22.5712 28.3904 23.2706 29.9995 23.4052M31.4286 20.6434C31.4286 19.7909 31.7673 18.9734 32.3701 18.3706C32.9729 17.7678 33.7904 17.4291 34.6429 17.4291H41.0715C41.924 17.4291 42.7415 17.7678 43.3443 18.3706C43.9471 18.9734 44.2858 19.7909 44.2858 20.6434V27.072C44.2858 27.9245 43.9471 28.742 43.3443 29.3448C42.7415 29.9476 41.924 30.2863 41.0715 30.2863H34.6429C33.7904 30.2863 32.9729 29.9476 32.3701 29.3448C31.7673 28.742 31.4286 27.9245 31.4286 27.072V20.6434Z"
              stroke="#94A3B8"
              stroke-linecap="round"
            />
          </svg>
          Objects
        </button>

        {open && activeMenu === "objects" && (
          <ObjectDropdown setActiveMenu={setActiveMenu} />
        )}
      </div>

      {open && activeMenu === "shapes" && (
        <ShapesDropdown
          setOpen={setOpen}
          setActiveMenu={setActiveMenu}
          addElement={addElements}
          template={template}
        />
      )}
      {open && activeMenu === "photos" && (
        <PhotoDropdown
          setOpen={setOpen}
          setActiveMenu={setActiveMenu}
          addElement={addElements}
        />
      )}
      {open && activeMenu === "graphics" && (
        <Graphics
          setOpen={setOpen}
          setActiveMenu={setActiveMenu}
          addElements={addElements}
        />
      )}
      {open && activeMenu === "charts" && (
        <ChartsDropdown
          setOpen={setOpen}
          setActiveMenu={setActiveMenu}
          addElement={addElements}
        />
      )}

      <button className="cursor-pointer" onClick={() => setopenStyle(true)}>
        <svg
          width="72"
          height="32"
          viewBox="0 0 72 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36 7H32H29C28.4477 7 28 7.44772 28 8V9M36 7H40H43C43.5523 7 44 7.4471 44 7.99938C44 8.24126 44 8.56055 44 9M36 7V25M31 25H41"
            stroke="#64748B"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Styles
      </button>
      <TextStyles open={openStyle} onClose={() => setopenStyle(false)} />

      <button
        className={`cursor-pointer ${openStarred ? "starred-button" : ""}`}
        onClick={() => setOpenStarred(true)}
      >
        <svg
          width="72"
          height="32"
          viewBox="0 0 72 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.8223 9.6613C34.9423 9.46009 35.1142 9.29314 35.3208 9.1771C35.5275 9.06106 35.7617 9 36 9C36.2383 9 36.4725 9.06106 36.6792 9.1771C36.8858 9.29314 37.0577 9.46009 37.1777 9.6613L38.8299 12.4317C38.925 12.5916 39.0531 12.7304 39.2061 12.8392C39.3591 12.9481 39.5337 13.0246 39.7186 13.0639L42.9265 13.7423C43.1593 13.7917 43.3748 13.9 43.5515 14.0562C43.7282 14.2124 43.8599 14.4112 43.9334 14.6326C44.007 14.8541 44.0198 15.0905 43.9707 15.3183C43.9216 15.5461 43.8122 15.7574 43.6535 15.9311L41.468 18.3223C41.3419 18.4601 41.2466 18.6221 41.188 18.7979C41.1295 18.9737 41.1091 19.1595 41.1281 19.3434L41.458 22.5338C41.482 22.7655 41.4434 22.9994 41.3461 23.212C41.2487 23.4246 41.096 23.6086 40.9032 23.7455C40.7103 23.8825 40.4841 23.9676 40.2471 23.9924C40.01 24.0172 39.7705 23.9809 39.5523 23.887L36.5498 22.5942C36.3766 22.5195 36.1893 22.481 36 22.481C35.8107 22.481 35.6234 22.5195 35.4502 22.5942L32.4477 23.887C32.2295 23.9809 31.99 24.0172 31.7529 23.9924C31.5159 23.9676 31.2897 23.8825 31.0968 23.7455C30.904 23.6086 30.7513 23.4246 30.6539 23.212C30.5566 22.9994 30.518 22.7655 30.542 22.5338L30.8719 19.3434C30.891 19.1595 30.8707 18.9738 30.8124 18.798C30.754 18.6222 30.6589 18.4602 30.533 18.3223L28.3465 15.9311C28.1878 15.7574 28.0784 15.5461 28.0293 15.3183C27.9802 15.0905 27.993 14.8541 28.0666 14.6326C28.1401 14.4112 28.2718 14.2124 28.4485 14.0562C28.6252 13.9 28.8407 13.7917 29.0735 13.7423L32.2814 13.0639C32.4664 13.0248 32.6411 12.9485 32.7943 12.8398C32.9474 12.7311 33.0758 12.5924 33.1711 12.4326L34.8223 9.6613Z"
            stroke="#64748B"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Starred
      </button>
      {openStarred && <StarredPanel onClose={() => setOpenStarred(false)} />}
      <button
        className="cursor-pointer"
        onClick={() => setShowAssetsDropdown(true)}
      >
        <svg
          width="72"
          height="32"
          viewBox="0 0 72 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35.9998 15.4998V23.9998M35.9998 23.9998L38.9998 20.9998M35.9998 23.9998L32.9998 20.9998M31.9998 11.0358C32.7477 11.1439 33.4406 11.4913 33.9748 12.0258M41.4998 17.9998C43.0188 17.9998 43.9998 16.7688 43.9998 15.2498C43.9997 14.6484 43.8025 14.0637 43.4384 13.585C43.0743 13.1064 42.5633 12.7603 41.9838 12.5998C41.8946 11.4783 41.4298 10.4196 40.6645 9.59491C39.8991 8.77024 38.878 8.22778 37.7663 8.05525C36.6545 7.88271 35.517 8.09018 34.5378 8.64411C33.5585 9.19804 32.7947 10.0661 32.3698 11.1078C31.4752 10.8598 30.5188 10.9774 29.7108 11.4346C28.9029 11.8918 28.3097 12.6512 28.0618 13.5458C27.8138 14.4404 27.9313 15.3968 28.3886 16.2047C28.8458 17.0127 29.6052 17.6058 30.4998 17.8538"
            stroke="#64748B"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Assets
      </button>
      {showAssetsDropdown && (
        <AssetsPanel onClose={() => setShowAssetsDropdown(false)} />
      )}
    </div>
  );
}

export default SidebarLeft;
