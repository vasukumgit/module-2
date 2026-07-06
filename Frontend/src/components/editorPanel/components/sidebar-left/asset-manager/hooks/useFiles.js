import { useFileStore } from "../store/fileStore";

export const useFiles = () => {
  const files = useFileStore((state) => state.files);

  const setFiles = useFileStore((state) => state.setFiles);

  const addFileStore = useFileStore((state) => state.addFile);

  // RENAME FILE
  const renameFile = (fileId, newName) => {
    setFiles(
      files.map((file) =>
        file.id === fileId
          ? {
              ...file,
              name: newName,
            }
          : file,
      ),
    );
  };

  // DELETE FILE
  const deleteFiles = (fileIds) => {
    setFiles(files.filter((file) => !fileIds.includes(file.id)));
  };

  // MOVE FILE
  const moveFile = (fileId, targetFolderId) => {
    setFiles(
      files.map((file) =>
        file.id === fileId
          ? {
              ...file,
              folderId: targetFolderId,
            }
          : file,
      ),
    );
  };

  // DOWNLOAD FILE
  const downloadFile = async (file) => {
    const link = document.createElement("a");

    link.href = file.url;

    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // GET FILE
  const getFile = (fileId) => {
    return files.find((file) => file.id === fileId);
  };

  const addFile = (file) => {
    addFileStore(file);
  };

  return {
    files,
    setFiles,
    addFile,
    renameFile,
    deleteFiles,
    moveFile,
    downloadFile,
    getFile,
  };
};
