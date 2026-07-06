import { useFolderStore } from "../store/folderStore";

export const useFolders = () => {
  const folders = useFolderStore((state) => state.folders);
  const setFolders = useFolderStore((state) => state.setFolders);

  // CREATE FOLDER
  const createFolder = (folderName) => {
    if (!folderName.trim()) return;

    const newFolder = {
      name: folderName,
      items: [],
      subFolders: [],
    };

    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  // OPEN FOLDER
  const folderOpen = (folder) => {
    return folders.find((f) => f.name === folder.name);
  };

  // DELETE FOLDERS
  const deleteFolders = (folderNames) => {
    setFolders(folders.filter((folder) => !folderNames.includes(folder.name)));
  };

  // MOVE FOLDER
  const moveFolder = (movingFolder, targetFolder) => {
    if (!movingFolder || !targetFolder) return;

    const updatedFolders = folders.map((folder) => {
      if (folder.name === targetFolder.name) {
        return {
          ...folder,
          subFolders: [...(folder.subFolders || []), movingFolder],
        };
      }

      return folder;
    });

    const filteredFolders = updatedFolders.filter(
      (folder) => folder.name !== movingFolder.name,
    );

    setFolders(filteredFolders);
  };

  // RENAME FOLDER
  const renameFolder = (oldName, newName) => {
    if (!newName?.trim()) return;

    const updatedFolders = folders.map((folder) =>
      folder.name === oldName
        ? {
            ...folder,
            name: newName,
          }
        : folder,
    );

    setFolders(updatedFolders);
  };

  // SHARE FOLDER
  const shareFolder = async (folder) => {
    try {
      await navigator.clipboard.writeText(`Folder Name: ${folder.name}`);

      alert("Folder copied successfully");
    } catch (error) {
      console.error(error);
    }
  };

  // DOWNLOAD FOLDER
  const downloadFolder = async (folder) => {
    const JSZip = (await import("jszip")).default;

    const zip = new JSZip();

    if (folder.items?.length > 0) {
      for (let i = 0; i < folder.items.length; i++) {
        const item = folder.items[i];

        if (typeof item === "string") {
          const response = await fetch(item);
          const blob = await response.blob();

          zip.file(`image-${i + 1}.jpg`, blob);
        } else {
          zip.file(item.name, item);
        }
      }
    }

    if (folder.subFolders?.length > 0) {
      folder.subFolders.forEach((subFolder) => {
        const subZip = zip.folder(subFolder.name);

        subFolder.items?.forEach((item) => {
          if (typeof item !== "string") {
            subZip.file(item.name, item);
          }
        });
      });
    }

    const content = await zip.generateAsync({
      type: "blob",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(content);
    link.download = `${folder.name}.zip`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return {
    folders,
    setFolders,
    createFolder,
    folderOpen,
    deleteFolders,
    moveFolder,
    downloadFolder,
    renameFolder,
    shareFolder,
  };
};
