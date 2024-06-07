"use client";
import { useCompanyParamsContext } from "@/components/Providers/CompanyParameters";
import MenuButton from "@/components/Utils/MenuButton";
import {
  UserGroupIcon,
  BookOpenIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export default function Configuracion() {
  const path = usePathname();

  const { permisos, usuario } = useCompanyParamsContext();

  const hasPermission = (menu: string, opcion: string): boolean => {
    const permiso = permisos.find(
      (p) => p.menu === menu && p.opcion === opcion
    );
    if (!permiso) return false;

    const perfilUsuario = usuario?.opciones;

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

  const buttons = [
    { name: "Usuarios y Perfiles", href: "/usuarios", Icon: UserGroupIcon },
    {
      name: "Apertura y Cierre de periodos contables",
      href: "/apertura",
      Icon: BookOpenIcon,
    },
    { name: "Bloqueo de botones", href: "/bloqueo", Icon: NoSymbolIcon },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map((item, index) => (
          <div className="md:mx-10 lg:mx-14" key={item.name}>
            {hasPermission("Configuración", item.name) && (
              <MenuButton
                key={index}
                name={item.name}
                href={path + item.href}
                Icon={item.Icon}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
