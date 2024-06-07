"use client";
import MenuButton from "@/components/Utils/MenuButton";
import {
  CubeIcon,
  DocumentIcon,
  IdentificationIcon,
  RectangleGroupIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  PresentationChartBarIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  PresentationChartLineIcon,
  BuildingOffice2Icon,
  KeyIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SESSION_NAMES } from "@/variablesglobales";
import { IToast, dangerToast } from "@/interfaces/IToast";
import ToastList from "../../../components/Utils/ToastList";
import { useCompanyParamsContext } from "@/components/Providers/CompanyParameters";

export default function Cuentas() {
  const path = usePathname();
  const [toasts, setToasts] = useState<IToast[]>([]);

  const { permisos, usuario } = useCompanyParamsContext();

  useEffect(() => {
    const empresaId = localStorage.getItem(SESSION_NAMES.EMPRESA_ID);
    const empresaName = localStorage.getItem(SESSION_NAMES.EMPRESA_NAME);
    const bodega = localStorage.getItem(SESSION_NAMES.BODEGA_ID);

    console.log(empresaId, empresaName, bodega);
    if (
      !empresaId ||
      !empresaName ||
      !bodega ||
      empresaId === '""' ||
      empresaName === '""' ||
      bodega === '""'
    ) {
      setToasts([
        ...toasts,
        dangerToast("Debe establecer Local y Bodega."),
      ]);
    }
  }, []);

  const hasPermission = (menu: string, opcion: string): boolean => {
    const permiso = permisos.find(
      (p) => p.menu === menu && p.opcion === opcion
    );
    // if (opcion === "Bancos") {
    //   return true;
    // }

    if (!permiso) return false;

    const perfilUsuario = usuario?.opciones;
    debugger;
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
    }
  };

  const buttons = [
    {
      name: "Ficha de Clientes",
      href: "/clientes",
      Icon: BuildingOfficeIcon,
      error: false,
    },
    { name: "Cotizaciones", href: "/cotizaciones", Icon: CubeIcon },
    { name: "Otes Activas", href: "/otesactivas", Icon: DocumentIcon },
    {
      name: "Guias de Despacho Otes",
      href: "/guiasdespachootes",
      Icon: RectangleGroupIcon,
    },
    { name: "Evaluación Clientes", href: "/evaluacioncliente", Icon: IdentificationIcon },
    { name: "Solicitudes de Cotizacion", href: "/solicitudcotizacion", Icon: DocumentIcon },
    { name: "VB Otes Termino", href: "/vistootestermino", Icon: BookOpenIcon },
    {
      name: "Facturacion Guias de Despacho",
      href: "/facuracionguiasdespacho",
      Icon: ChartPieIcon,
    },
    { name: "Cargos", href: "/cargos", Icon: BuildingStorefrontIcon },
    { name: "VB Comercial", href: "/vbcomercial", Icon: ChartBarSquareIcon },
    {
      name: "Otes Terminadas",
      href: "/otesterminadas",
      Icon: PresentationChartLineIcon,
    },
    { name: "Guias de Despacho Varios", href: "/guiasdespachovarios", Icon: PresentationChartBarIcon },

    { name: "Especialidades", href: "/especialidades", Icon: KeyIcon },

    { name: "Envio de Cotizaciones al Cliente", href: "/enviocotizacioncliente", Icon: BanknotesIcon },
    { name: "VB Reapertura Otes Terminadas", href: "/vbreaperturaotesterminada", Icon: BanknotesIcon },
    { name: "Facturas Varios", href: "/facturavarios", Icon: BanknotesIcon },
    { name: "Personal", href: "/personal", Icon: BanknotesIcon },
    { name: "Cotizacion en Espera de Respuesta", href: "/cotizacionesperarespuesta", Icon: BanknotesIcon },
    { name: "Avance Otes", href: "/avanceotes", Icon: BanknotesIcon },
    { name: "Verificación Documentos en SII", href: "/verificaciondocsii", Icon: BanknotesIcon },
    { name: "Tarifado Equipos", href: "/tarifadoequipos", Icon: BanknotesIcon },
    { name: "Cotizaciones Enviadas", href: "/cotizacionesenviadas", Icon: BanknotesIcon },
    { name: "Historico Otes Facturadas", href: "/historicootesfacturadas", Icon: BanknotesIcon },
    { name: "Horarios", href: "/horarios", Icon: BanknotesIcon },
    { name: "Procesos", href: "/procesos", Icon: BanknotesIcon },
    { name: "Generar OTs", href: "/generarotes", Icon: BanknotesIcon },
    { name: "Historico Otes", href: "/generarotes", Icon: BanknotesIcon },
    { name: "Fecha no trabajo", href: "/fechanotrabajo", Icon: BanknotesIcon },
    { name: "_", href: "/", Icon: BanknotesIcon },
    { name: "Ordenes de Trabajo", href: "/ordenesdetrabajo", Icon: BanknotesIcon },
    { name: "Historico Detallado Otes", href: "/historicodetalladootes", Icon: BanknotesIcon },


  ];
  return (
    <section>{
      permisos.length > 0 && usuario && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {buttons.map((item, index) => (
            <div className="md:mx-4 lg:mx-1" key={index}>
              {hasPermission("TALLER", item.name) && (
                <MenuButton
                  name={item.name}
                  href={path + item.href}
                  Icon={item.Icon}
                  error={item.error ? true : false}
                />
              )}

            </div>
          ))}
        </div>)}
      <ToastList position="center" toasts={toasts} setToasts={setToasts} />
    </section>
  );
}
