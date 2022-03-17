import { useEffect } from "react";
import Router from "next/router";
import useStore from "../store";

export function useAuthSession() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setAuthKey = useStore((state) => state.setAuthKey);
  useEffect(() => {
    if (!user) {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const key = JSON.parse(localStorage.getItem("authKey"));
      setUser(userInfo);
      setAuthKey(key);
      if (!userInfo) Router.push("/");
    }
  }, []);
  return user;
}
