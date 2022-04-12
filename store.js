import create from "zustand";

const useStore = create((set) => ({
	user: null,
	setUser: (u) => set((state) => ({ user: u })),
}));

export default useStore;
