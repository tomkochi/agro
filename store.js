import create from "zustand";

const useStore = create((set) => ({
  authRoutes: ["/dashboard"],
  busy: false,
  authKey: null,
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
      authKey: key,
    }),
}));

export default useStore;
