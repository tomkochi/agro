import create from "zustand";

const useStore = create((set) => ({
  authRoutes: ["/dashboard"],
  busy: false,
  authkey: null,
  user: null,
  setBusy: (stat) =>
    set({
      busy: stat,
    }),
  setUser: (userInfo) =>
    set({
      user: userInfo,
    }),
  setAuthKey: (key) =>
    set({
      authkey: key,
    }),
}));

export default useStore;
