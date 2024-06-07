"use client";
import React, { useState, useEffect, useContext } from "react";
import SidebarItem from "./SidebarItem";
import {
  BuildingLibraryIcon,
  CalculatorIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import logo from "../../../public/images/opencodeicon.png";
import { useCompanyParamsContext } from "../Providers/CompanyParameters";

export type sidebarProps = {
  onLogout?: () => void;
};

const Sidebar: React.FC<sidebarProps> = ({ onLogout }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const { permisos, usuario } = useCompanyParamsContext();

  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  const collapseClass = isCollapsed ? " w-[3.5rem] " : " w-56 shadow-lg ";

  const handleCollapseSidebar = () => {
    setCollapsed(!isCollapsed);
  };

  const sidebarItems = [
    {
      name: "Compras",
      namePermiso: "Compras",//nombre del campo menu
      href: "/compras",
      Icon: CircleStackIcon,
    },
    {
      name: "Existencias",
      namePermiso: "Existencias",
      href: "/existencia",
      Icon: CalculatorIcon,
    },
    {
      name: "Taller",
      namePermiso: "TALLER",
      href: "/taller",
      Icon: MagnifyingGlassIcon,
    },
    {
      name: "Mantenimiento",
      namePermiso: "Mantenimiento",
      href: "/mantenimiento",
      Icon: DocumentArrowDownIcon,
    },
    {
      name: "Indicadores",
      namePermiso: "Indicadores",
      href: "/indicadores",
      Icon: DocumentArrowUpIcon,
    },
  ];

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  const hasPermission = (menu: string, opcion: string): boolean => {
    const permiso = permisos.find(
      (p) => p.menu === menu && p.opcion === opcion
    );
    if (!permiso) return false;
    debugger;
    const perfilUsuario = usuario?.opciones;
    if (usuario?.codigo.trim().toUpperCase() == "ADMIN") {
      return true;
    } else {
      switch (perfilUsuario) {
        case 1:
          return permiso.acceso1 === "S";
        case 2:
          return permiso.acceso2 === "S";
        case 3:
          return permiso.acceso3 === "S";
        case 4:
          return permiso.acceso4 === "S";
        case 5:
          return permiso.acceso5 === "S";
        default:
          return false;
      }
    };
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className={
          "transition-all shadow-md duration-300 ease-in-out " +
          collapseClass +
          "sidebar h-full min-h-screen overflow-hidden bg-white dark:bg-slate-800 "
        }
      >
        <div className="flex h-screen flex-col justify-between pt-5 pb-6">
          <div>
            <div className="w-max p-1 flex" onClick={handleCollapseSidebar}>
              <Image src={logo} className="w-12" alt="" />
              <span className="font-semibold text-xl -mr-1 ml-5 mt-2.5 text-amber-800 dark:text-slate-400 flex">
                MAESTRANZA
              </span>
            </div>
            <ul className="mt-3 space-y-2 tracking-wide">
              {permisos &&
                sidebarItems.map(
                  (item, index) =>
                    hasPermission("_Sistema de Gestion", item.namePermiso) && (
                      <SidebarItem
                        key={index}
                        name={item.name}
                        href={item.href}
                        Icon={item.Icon}
                        active={activeItem === item.href}
                        onClick={() => handleItemClick(item.href)}
                      />
                    )
                )}
            </ul>
          </div>

          <div>
            <ul className="mt-3 space-y-2 tracking-wide">
              {hasPermission("_Sistema de Gestion", "Configuracion") && (
                <SidebarItem
                  name="Configuración"
                  href="/configuracion"
                  Icon={Cog6ToothIcon}
                  active={activeItem === "/configuracion"}
                  onClick={() => handleItemClick("/configuracion")}
                />
              )}

              <SidebarItem
                name="Cerrar Sesión"
                href="/"
                Icon={PowerIcon}
                onClick={onLogout}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
