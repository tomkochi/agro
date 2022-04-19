import create from "zustand";

// implement later
export const globalStore = create((set) => ({}));

export const userStore = create((set) => ({
	user: null,
	setUser: (u) => set((state) => ({ user: u })),
}));

export const dashboardStore = create((set) => ({
	tst: null,
}));
