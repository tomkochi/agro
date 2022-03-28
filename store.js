import create from "zustand";

const useStore = create((set) => ({
  busy: false,
}));

export default useStore;
