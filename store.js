import create from "zustand";

// implement later
export const globalStore = create((set) => ({
	selectedField: { _id: 0, name: "All" },
	setSelectedField: (f) => set((state) => ({ selectedField: f })),

	selectedCrop: { _id: 0, name: "All" },
	setSelectedCrop: (c) => set((state) => ({ selectedCrop: c })),
}));

export const userStore = create((set) => ({
	user: null,
	setUser: (u) => set((state) => ({ user: u })),
}));
