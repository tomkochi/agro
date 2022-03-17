import create from "zustand";
import userData from "./components/login-response.json";

const useStore = create((set) => ({
  authRoutes: ["/dashboard"],
  busy: false,
  authKey: userData.data.authKey,
  user: userData.data.user,
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
