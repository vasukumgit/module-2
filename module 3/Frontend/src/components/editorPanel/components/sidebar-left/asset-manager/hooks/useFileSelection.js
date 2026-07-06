import { useState } from "react";

export const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const toggleSelection = (id) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(
        selectedFiles.filter(
          (item) => item !== id
        )
      );
    } else {
      setSelectedFiles([
        ...selectedFiles,
        id,
      ]);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  const isSelected = (id) => {
    return selectedFiles.includes(id);
  };

  return {
    selectedFiles,
    toggleSelection,
    clearSelection,
    isSelected,
  };
};