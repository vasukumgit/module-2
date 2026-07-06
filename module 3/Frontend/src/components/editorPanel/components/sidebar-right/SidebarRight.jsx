import React, { useState } from "react";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";
import LayersPanel from "../sidebar-right/layers-panel/LayersPanel";

function SidebarRight({
  elements,
  setElements,
  selectedIds,
  template,
  setTemplate,
  saveDesign,
  setSelectedIds,
  saveHistory,
}) {
  const [showProperties, setShowProperties] = useState(false);
  const [layers, setLayers] = useState(false);
  return (
    <>
      <div className="sidebar-right">
        <button
          onClick={() => setShowProperties(true)}
          className="cursor-pointer"
        >
          <svg
            width="64"
            height="32"
            viewBox="0 0 64 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 6.87891C32.1465 6.87891 32.2915 6.90695 32.4268 6.96094L32.5586 7.02344L39.7588 11.0234C40.1239 11.2263 40.3506 11.611 40.3506 12.0293V19.9697C40.3505 20.388 40.1239 20.7728 39.7588 20.9756L32.5586 24.9756C32.3879 25.0703 32.1953 25.1201 32 25.1201C31.8049 25.1201 31.613 25.0702 31.4424 24.9756L24.2422 20.9756C24.0628 20.876 23.9136 20.7296 23.8096 20.5527C23.7056 20.376 23.6504 20.1748 23.6504 19.9697V12.0293C23.6504 11.663 23.824 11.3226 24.1123 11.1074L24.2422 11.0234L31.4424 7.02344C31.613 6.92875 31.8049 6.87897 32 6.87891Z"
              stroke="#64748B"
            />
            <path
              d="M32 12.5C32.9283 12.5 33.8182 12.869 34.4746 13.5254C35.131 14.1818 35.5 15.0717 35.5 16C35.5 16.9283 35.131 17.8182 34.4746 18.4746C33.8182 19.131 32.9283 19.5 32 19.5C31.0717 19.5 30.1818 19.131 29.5254 18.4746C28.869 17.8182 28.5 16.9283 28.5 16C28.5 15.0717 28.869 14.1818 29.5254 13.5254C30.1818 12.869 31.0717 12.5 32 12.5Z"
              stroke="#64748B"
            />
          </svg>
          Properties
        </button>
        <button
          onClick={() => setLayers((prev) => !prev)}
          className="cursor-pointer"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.979 13.685C6.993 12.891 6 12.494 6 12C6 11.506 6.993 11.11 8.979 10.315L11.787 9.192C13.773 8.397 14.767 8 16 8C17.233 8 18.227 8.397 20.213 9.192L23.021 10.315C25.007 11.109 26 11.506 26 12C26 12.494 25.007 12.89 23.021 13.685L20.213 14.809C18.227 15.603 17.233 16 16 16C14.767 16 13.773 15.603 11.787 14.809L8.979 13.685Z"
              stroke="#64748B"
            />
            <path
              opacity="0.5"
              d="M9.766 14L8.979 14.315C6.993 15.109 6 15.507 6 16C6 16.493 6.993 16.89 8.979 17.685L11.787 18.809C13.773 19.603 14.767 20 16 20C17.233 20 18.227 19.603 20.213 18.809L23.021 17.685C25.007 16.891 26 16.493 26 16C26 15.507 25.007 15.11 23.021 14.315L22.234 14M9.766 18L8.979 18.315C6.993 19.109 6 19.507 6 20C6 20.493 6.993 20.89 8.979 21.685L11.787 22.809C13.773 23.603 14.767 24 16 24C17.233 24 18.227 23.603 20.213 22.808L23.021 21.685C25.007 20.891 26 20.494 26 20C26 19.507 25.007 19.11 23.021 18.315L22.234 18"
              stroke="#64748B"
            />
          </svg>
          Layers
        </button>
        <button className="cursor-pointer">
          <svg
            width="64"
            height="32"
            viewBox="0 0 64 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M35.8027 19.9453C38.7383 19.5547 41 17.0391 41 14C41 10.6875 38.3145 8 35 8C32.6445 8 30.6055 9.35547 29.623 11.332C29.2246 12.1367 29 13.043 29 14V14.0977C29.041 16.6484 30.6758 18.8125 32.9531 19.6406C33.5918 19.8711 34.2812 20 35 20C35.2715 20 35.541 19.9805 35.8027 19.9453Z"
              stroke="#64748B"
            />
            <path
              opacity="0.4"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M29 14C29 13.043 29.2246 12.1367 29.623 11.332C28.918 11.5859 28.2793 11.9844 27.7422 12.4883C27.2168 12.9766 26.7891 13.5703 26.4883 14.2344C26.1758 14.9258 26 15.6914 26 16.5C26 19.5391 28.4629 22 31.5 22C31.6758 22 31.8477 21.9922 32.0195 21.9766C32.7012 21.9141 33.3477 21.7266 33.9336 21.4336C34.5938 21.1055 35.1797 20.6523 35.6582 20.1016C35.7031 20.0469 35.7598 20 35.8027 19.9453C35.541 19.9805 35.2715 20 35 20C34.2812 20 33.5918 19.8711 32.9531 19.6406C30.6758 18.8125 29.041 16.6484 29 14.0977V14Z"
              stroke="#64748B"
            />
            <path
              opacity="0.4"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M26.4883 14.2344C26.1758 14.9258 26 15.6914 26 16.5C26 19.5391 28.4629 22 31.5 22C31.6758 22 31.8477 21.9922 32.0195 21.9766C31.1094 23.2031 29.6484 24 28 24C25.2383 24 23 21.7617 23 19C23 16.7656 24.4668 14.875 26.4883 14.2344Z"
              stroke="#64748B"
            />
          </svg>
          Animate
        </button>

        {/* Popup Panel */}
        <LayersPanel
          layers={layers}
          setLayers={setLayers}
          elements={elements}
          setElements={setElements}
          template={template}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          saveDesign={saveDesign}
          saveHistory={saveHistory}
        />

        {/* Popup Panel */}
        {showProperties && (
          <PropertiesPanel
            setShowProperties={setShowProperties}
            elements={elements}
            setTemplate={setTemplate}
            setElements={setElements}
            selectedIds={selectedIds}
            template={template}
            saveDesign={saveDesign}
            saveHistory={saveHistory}
          />
        )}
      </div>
    </>
  );
}

export default SidebarRight;
