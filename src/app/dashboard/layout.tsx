"use client";
import LoginProvider from "@/components/Providers/LoginProvider";
import Sidebar from "@/components/Utils/Sidebar";
import secureLocalStorage from "react-secure-storage";
import background from "../../../public/images/fondo.jpg";
import CompanyParams from "@/components/Providers/CompanyParameters";
import { SESSION_NAMES } from "@/variablesglobales";
import Parametros from "@/components/Parametros";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const onLogout = () => {
    // Funcion para el Cerrar Seccion
    if (typeof window !== "undefined") {
      // If para funcione el localStorage
      localStorage.removeItem(SESSION_NAMES.USER_NAME);
    }
    secureLocalStorage.removeItem("token");
  };

  const backgroundStyle = {
    backgroundImage: `url(${background.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <section className="flex">
      <LoginProvider>
        <CompanyParams>
          <Sidebar onLogout={onLogout} />

          <div style={backgroundStyle} className="p-4 max-h-screen grow">
            <div className="items-center shadow-md bg-gradient-to-t from-amber-400 to-yellow-400 dark:from-slate-800 dark:to-slate-800 p-2 px-4 rounded-md">
              <Parametros></Parametros>
            </div>
            <div className="bg-white w-full dark:bg-slate-800 shadow-md rounded-md mt-2 p-4">
              {children}
            </div>
          </div>
        </CompanyParams>
      </LoginProvider>
    </section>
  );
}
