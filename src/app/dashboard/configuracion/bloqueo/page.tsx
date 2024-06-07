"use client";
import React from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { ThemeContext } from "@/components/Providers/darkModeContext";
import DataTable from "react-data-table-component";
import Modal from "../../../../components/Utils/Modal";
import { IToast, dangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "../../../../components/Utils/ToastList";
import { IPermiso } from "@/interfaces/IPermiso";
import gridStyleBoldHeader from "@/globals/tableStyles";
import Checkbox from "@/components/Utils/Checkbox";
import { useCompanyParamsContext } from "@/components/Providers/CompanyParameters";

export default function aperturaConfiguracion() {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;

  const { theme } = useContext(ThemeContext);
  const [editedPermiso, setEditedPermiso] = useState<IPermiso | null>(null);
  const [toasts, setToasts] = useState<IToast[]>([]);
  const { permisos, updatePermisos } = useCompanyParamsContext();
  const [fixedHeaderScrollHeight, setFixedHeaderScrollHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const percentage = 75;
      const calculatedHeight = (window.innerHeight * percentage) / 100;
      setFixedHeaderScrollHeight(calculatedHeight);
    };

    // Llamada inicial y suscripción a cambios en el tamaño de la ventana
    handleResize();
    window.addEventListener("resize", handleResize);

    // Limpiar la suscripción cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const guardarCambio = async () => {
    try {
      const response = await axios.put(
        "/api/permisos",
        {
          menu: editedPermiso?.menu,
          opcion: editedPermiso?.opcion,
          acceso1: editedPermiso?.acceso1,
          acceso2: editedPermiso?.acceso2,
          acceso3: editedPermiso?.acceso3,
          acceso4: editedPermiso?.acceso4,
          acceso5: editedPermiso?.acceso5,
        },
        { headers: getHeaders() }
      );
      if (response.data === "Error") {
        setToasts([...toasts, dangerToast("Error en la operación.")]);
        console.error("Error al guardar :");
      } else {
        if (editedPermiso != null) {
          updatePermisos(editedPermiso);
        }
        setToasts([...toasts, defaultSuccessToast]);
      }
    } catch (error) {
      setToasts([...toasts, dangerToast("Error en la operación.")]);
      console.error("Error al guardar cambios:", error);
    }

    setEditedPermiso(null);
  };

  const columns = [
    {
      id: "menu",
      name: "Menu",
      center: true,
      selector: (row: any) => row.menu,
    },
    {
      id: "opcion",
      name: "Opcion",
      center: true,
      selector: (row: any) => row.opcion,
      wrap: true,
    },
    {
      id: "acceso1",
      name: "Perfil 1",
      center: true,
      width: "8rem",
      selector: (row: any) => (
        <Checkbox name="acceso1" checked={row.acceso1 === "S"} />
      ),
      wrap: true,
    },
    {
      id: "acceso2",
      name: "Perfil 2",
      width: "8rem",
      selector: (row: any) => (
        <Checkbox name="acceso2" checked={row.acceso2 === "S"} />
      ),
      center: true,
    },
    {
      id: "acceso3",
      name: "Perfil 3",
      width: "8rem",
      selector: (row: any) => (
        <Checkbox name="acceso3" checked={row.acceso3 === "S"} />
      ),
      center: true,
    },
    {
      id: "acceso4",
      name: "Perfil 4",
      width: "8rem",
      selector: (row: any) => (
        <Checkbox name="acceso4" checked={row.acceso4 === "S"} />
      ),
      center: true,
    },
    {
      id: "acceso5",
      name: "Perfil 5",
      width: "8rem",
      selector: (row: any) => (
        <Checkbox name="acceso5" checked={row.acceso5 === "S"} />
      ),
      center: true,
    },
    {
      name: "Editar",
      width: "5rem",
      center: true,
      cell: (row: any) => (
        <button
          className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white"
          onClick={() => {
            setEditedPermiso(row);
          }}
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className=" mb-3 text-center">
        <h1 className="text-xl dark:text-white">
          Asignación de Permisos de Acceso a Perfiles
        </h1>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={permisos}
          dense
          customStyles={gridStyleBoldHeader}
          className="border dark:border-slate-900"
          theme={theme}
          fixedHeader={true}
          fixedHeaderScrollHeight={`${fixedHeaderScrollHeight}px`}
        />
      </div>
      {editedPermiso && (
        <Modal
          title="Editar Permiso"
          type="info"
          width="w-350"
          onClose={() => setEditedPermiso(null)}
        >
          <div className="mb-1">Menu: {editedPermiso.menu}</div>
          <div className="mb-3">Boton: {editedPermiso.opcion}</div>
          <form className="flex justify-center gap-2">
            <label>
              Perfil 1:
              <input
                type="checkbox"
                className=" ml-2 mt-2 w-4 h-4"
                checked={editedPermiso.acceso1 === "S"}
                onChange={(e) =>
                  setEditedPermiso((prevCierre: any) => ({
                    ...prevCierre,
                    acceso1: e.target.checked ? "S" : "N",
                  }))
                }
              />
            </label>
            <label>
              Perfil 2:
              <input
                type="checkbox"
                className=" ml-2 mt-2 w-4 h-4"
                checked={editedPermiso.acceso2 === "S"}
                onChange={(e) =>
                  setEditedPermiso((prevCierre: any) => ({
                    ...prevCierre,
                    acceso2: e.target.checked ? "S" : "N",
                  }))
                }
              />
            </label>
            <label>
              Perfil 3:
              <input
                type="checkbox"
                className=" ml-2 mt-2 w-4 h-4"
                checked={editedPermiso.acceso3 === "S"}
                onChange={(e) =>
                  setEditedPermiso((prevCierre: any) => ({
                    ...prevCierre,
                    acceso3: e.target.checked ? "S" : "N",
                  }))
                }
              />
            </label>
            <label>
              Perfil 4:
              <input
                type="checkbox"
                className=" ml-2 mt-2 w-4 h-4"
                checked={editedPermiso.acceso4 === "S"}
                onChange={(e) =>
                  setEditedPermiso((prevCierre: any) => ({
                    ...prevCierre,
                    acceso4: e.target.checked ? "S" : "N",
                  }))
                }
              />
            </label>
            <label>
              Perfil 5:
              <input
                type="checkbox"
                className=" ml-2 mt-2 w-4 h-4"
                checked={editedPermiso.acceso5 === "S"}
                onChange={(e) =>
                  setEditedPermiso((prevCierre: any) => ({
                    ...prevCierre,
                    acceso5: e.target.checked ? "S" : "N",
                  }))
                }
              />
            </label>
          </form>
          <div className="flex mt-4 justify-end">
            <button
              className="text-white w-auto h-10 mr-3 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none
              focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800 "
              onClick={() => {
                guardarCambio();
              }}
            >
              Guardar
            </button>
          </div>
        </Modal>
      )}
      <ToastList toasts={toasts} setToasts={setToasts} />
    </div>
  );
}
