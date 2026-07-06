import { create } from "zustand";
import { initialFiles } from "../data/fileData";

export const useFileStore = create((set) => ({
  files: initialFiles,

  setFiles: (files) =>
    set({
      files,
    }),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),
}));
