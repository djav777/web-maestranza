"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SESSION_NAMES } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";

interface LoginProviderProps {
  children: React.ReactNode;
}

const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem(SESSION_NAMES.USER_NAME);
    const token = secureLocalStorage.getItem("token");
    if (!token || token === "" || token === "null" || token === null) {
      router.push("/");
    }

    if (!user || user === "" || user === "null" || user === null) {
      router.push("/login");
    }
  }, []);

  return <>{children}</>;
};

export default LoginProvider;
