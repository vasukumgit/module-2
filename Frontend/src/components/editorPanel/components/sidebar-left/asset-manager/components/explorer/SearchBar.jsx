import React from 'react'
import "../../styles/AssetsPanel.css"

export default function SearchBar() {
  return (
    <div>
      {/* SEARCH */}
        <div className="assets-search">
          <input type="text" placeholder="Search in Assets" />

          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L15.8 15.8M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
    </div>
  )
}
