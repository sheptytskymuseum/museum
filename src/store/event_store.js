import { create } from "zustand";

const useEventStore = create((set) => ({
    description: "",
    mainImage: null,
    images: [],

    setDescription: (description) => set({ description }),
    resetDescription: () => set({ description: "" }),

    setMainImage: (image) => set({ mainImage: image }),
    removeMainImage: () => set({ mainImage: null }),

    addImages: (newImages) =>
        set((state) => ({
            images: [...state.images, ...newImages].slice(0, 20),
        })),
    setImages: (images) => set({ images }),
    removeImage: (id) =>
        set((state) => ({
            images: state.images.filter((img) => img.id !== id),
        })),
    resetImages: () => set({ images: [] }),

    reset: () => set({ description: "", mainImage: null, images: [] }),
}));

export default useEventStore;
