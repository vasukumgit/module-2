import { create } from "zustand";

const brandAssetsImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300",
];

export const useFolderStore = create((set) => ({
  folders: [
    {
      name: "Brand Assets",
      items: brandAssetsImages,
      subFolders: [],
      type: "default-images",
    },
    {
      name: "Uploads",
      items: [],
      subFolders: [],
      type: "uploads",
    },
  ],

  setFolders: (folders) => set({ folders }),
}));