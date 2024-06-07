"use client";
import { useEffect, createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { SESSION_NAMES } from "@/variablesglobales";
import axios from "axios";
import { IPermiso } from "@/interfaces/IPermiso";
import { IUsuario } from "@/interfaces/IUsuario";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "./RequestHeadersProvider";

// Definición del tipo de propiedades del componente CompanyParams
interface CompanyParamsProps {
  children: React.ReactNode;
}

// Definición del contexto de CompanyParams
interface CompanyParamsContextType {
  cambiosRealizados: number; // Contador de cambios realizados en los parámetros
  marcarCambios: () => void; // Función para marcar cambios en los parámetros
  cambiosItem: number; // Contador de cambios en los ítems de local
  itemCambios: () => void; // Función para marcar cambios en los ítems de local
  permisos: IPermiso[]; // Lista de permisos de usuario
  usuario: IUsuario | undefined; // Información del usuario actual
  updatePermisos: (editedPermiso: IPermiso) => void; // Función para actualizar los permisos de usuario
  datosCargados: Boolean; // Estado que indica si los datos han sido cargados
  local: string; // ID de la local seleccionada
  localNombre: string; // Nombre de la local seleccionada
  bodega: string; // bodega seleccionado
}

const CompanyParamsContext = createContext<
  CompanyParamsContextType | undefined
>(undefined);

interface CompanyParamsProviderProps {
  children: React.ReactNode;
}

export const CompanyParamsProvider: React.FC<CompanyParamsProviderProps> = ({ children }) => {
  const [cambiosRealizados, setCambiosRealizados] = useState(0);
  const [cambiosItem, setCambiosItem] = useState(0);
  const [permisos, setPermisos] = useState<IPermiso[]>([]);
  const [usuario, setUsuario] = useState<IUsuario>();
  const [local, setLocal] = useState("");
  const [bodega, setBodega] = useState("");
  const [localNombre, setLocalNombre] = useState("");

  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;
  const [datosCargados, setDatosCargados] = useState(false);

  // Función para marcar cambios en los parámetros
  const marcarCambios = () => {
    // Actualizar los estados de los parámetros
    setLocal(
      String(localStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, "")
    );
    setLocalNombre(
      String(localStorage.getItem(SESSION_NAMES.EMPRESA_NAME))!.replace(
        /"/g,
        ""
      )
    );
    setBodega(
      String(localStorage.getItem(SESSION_NAMES.BODEGA_ID))!.replace(
        /"/g,
        ""
      )
    );
    // Incrementar el contador eh indicar a la aplicacion que se realizaron cambios en los parametros
    setCambiosRealizados(cambiosRealizados + 1);
  };

  // Función para marcar cambios en los ítems de local
  const itemCambios = () => {
    setCambiosItem(cambiosItem + 1);
  };

  // Función para actualizar los permisos de usuario
  const updatePermisos = (editedPermiso: IPermiso) => {
    setPermisos((prevData: IPermiso[]) => {
      const updatedData = [...prevData];
      const permisoIndex = updatedData.findIndex(
        (permiso) =>
          permiso.menu === editedPermiso?.menu &&
          permiso.opcion === editedPermiso.opcion
      );

      if (Array.isArray(updatedData) && permisoIndex !== -1) {
        updatedData[permisoIndex] = editedPermiso;
      }

      return updatedData;
    });
  };

  // Hook para cargar los datos necesarios al montar el componente
  useEffect(() => {
    setLocal(
      String(localStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, "")
    );
    setLocalNombre(
      String(localStorage.getItem(SESSION_NAMES.EMPRESA_NAME))!.replace(
        /"/g,
        ""
      )
    );
    setBodega(
      String(localStorage.getItem(SESSION_NAMES.BODEGA_ID))!.replace(
        /"/g,
        ""
      )
    );

    const fetchData = async () => {
      const usuario = String(
        localStorage.getItem(SESSION_NAMES.USER_NAME)
      )!.replace(/"/g, "");
      console.log("permisos");
      await axios
        .get("/api/permisos", { headers: getHeaders() })
        .then((response) => {
          setPermisos(response.data);
        })
        .catch((err) => { });

      setDatosCargados(true);

      await axios
        .get("/api/usuarios/getUsuario", {
          params: { usuario: usuario },
          headers: getHeaders(),
        })
        .then((response) => {
          setUsuario(response.data);
        })
        .catch((err) => { });
    };

    if (permisos.length === 0) {
      fetchData();
    }
  }, []);

  // Aqui van todo lo que se le entrega a los hijos.
  return (
    <CompanyParamsContext.Provider
      value={{
        local,
        bodega,
        localNombre,
        cambiosItem,
        cambiosRealizados,
        permisos,
        usuario,
        itemCambios,
        updatePermisos,
        marcarCambios,
        datosCargados,
      }}
    >
      {children}
    </CompanyParamsContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de CompanyParams
export const useCompanyParamsContext = () => {
  const context = useContext(CompanyParamsContext);
  if (!context) {
    throw new Error(
      "useCompanyParamsContext debe ser utilizado dentro de CompanyParamsProvider"
    );
  }
  return context;
};

const CompanyParams: React.FC<CompanyParamsProps> = ({ children }) => {
  const router = useRouter();
  const path = usePathname();

  // Lógica para redireccionamiento si faltan parámetros
  useEffect(() => {
    const localId = localStorage.getItem(SESSION_NAMES.EMPRESA_ID);
    const localName = localStorage.getItem(SESSION_NAMES.EMPRESA_NAME);
    const bodega = localStorage.getItem(SESSION_NAMES.BODEGA_ID);

    const isCuentaOrConfiguracion =
      path.startsWith("/dashboard/cuentas/locals") ||
      path.startsWith("/dashboard/configuracion");

    if (
      (!localId ||
        !localName ||
        !bodega ||
        localId === '""' ||
        localName === '""' ||
        bodega === '""') &&
      !isCuentaOrConfiguracion
    ) {
      router.push("/dashboard/cuentas");
    }
  }, [path]);

  return <CompanyParamsProvider>{children}</CompanyParamsProvider>;
};

export default CompanyParams;
