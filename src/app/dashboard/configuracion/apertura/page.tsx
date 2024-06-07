"use client";
import React from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SESSION_NAMES } from "@/variablesglobales";
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
import { useCompanyParamsContext } from "../../../../components/Providers/CompanyParameters";
import { Cierres } from "@/interfaces/ICierre";
import gridStyleBoldHeader from "@/globals/tableStyles";

export default function aperturaConfiguracion() {
  // Contextos y estados necesarios
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;
  const { marcarCambios } = useCompanyParamsContext();
  const { theme } = useContext(ThemeContext);
  const [cierres, setCierres] = useState<Cierres[]>([]);
  const [editedCierre, setEditedCierre] = useState<Cierres | null>(null);
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [countReferencia, setCountReferencia] = useState(0);
  const [denegar, setDenegar] = useState(0);
  const { cambiosRealizados, empresa, periodo, mes } =
    useCompanyParamsContext();
  const [loading, setLoading] = useState(true);
  const [fixedHeaderScrollHeight, setFixedHeaderScrollHeight] = useState(0);

  useEffect(() => {
    // Efecto para ajustar la altura de la tabla
    const handleResize = () => {
      const percentage = 70; // Porcentaje de la altura de la ventana
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

  // Efecto para cargar los datos de los cierres al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cierres = await axios.get(`/api/cierres/getAllCierres`, {
          headers: getHeaders(),
          params: {
            empresa: empresa,
            periodo: periodo,
          },
        });
        if (cierres.data != "Error") {
          let referencia = 0;
          const cierresConReferencia = cierres.data.map((cierre: Cierres) => {
            referencia = referencia + 1;
            return { ...cierre, referencia: referencia - 1 };
          });

          setCountReferencia(referencia);
          setCierres(cierresConReferencia);
          setLoading(false);
        } else {
          console.error("Fetch error:", cierres.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [denegar, cambiosRealizados]);

  // Función para agregar un nuevo cierre
  const agregarCierre = () => {
    const nuevoCierre: Cierres = {
      periodo: Number(periodo),
      mes: Number(mes),
      empresa: Number(empresa),
      libro: "G",
      estado: "A",
      referencia: countReferencia + 1,
    };
    setCountReferencia(countReferencia + 1);
    setCierres((prevData: Cierres[]) => {
      const updatedData = [nuevoCierre, ...prevData];
      return updatedData;
    });
  };

  // Función para guardar los cambios realizados en la base de datos
  const guardarCambios = async () => {
    const cierresSinReferencia = cierres.map((cierre: Cierres) => {
      return {
        periodo: cierre.periodo,
        mes: cierre.mes,
        empresa: cierre.empresa,
        libro: cierre.libro,
        estado: cierre.estado,
      };
    });

    try {
      const response = await axios.post(
        "/api/cierres/editCierres",
        {
          Empresa: empresa,
          Periodo: periodo,
          NuevosCierres: cierresSinReferencia,
        },
        {
          headers: getHeaders(),
        }
      );

      if (response.data === "Error") {
        setToasts([...toasts, dangerToast("Error en la operación.")]);
        console.error("Error al guardar cambios:");
      } else {
        marcarCambios();
        console.log("Cambios guardados exitosamente");
        setToasts([...toasts, defaultSuccessToast]);
      }
    } catch (error) {
      setToasts([...toasts, dangerToast("Error en la operación.")]);
      console.error("Error de Conexion:", error);
    }
  };

  // Función para denegar los cambios realizados
  const denegarCambios = () => {
    setDenegar(denegar + 1);
  };

  // Columnas de la tabla
  const columns = [
    {
      id: "periodo",
      name: "Periodo",
      width: "6rem",
      center: true,
      selector: (row: any) => row.periodo,
    },
    {
      id: "mes",
      name: "Mes",
      center: true,
      selector: (row: any) => row.mes,
      wrap: true,
    },
    {
      id: "libro",
      name: "Libros",
      center: true,
      selector: (row: any) => row.libro,
      wrap: true,
    },
    {
      id: "estado",
      name: "Estado",
      width: "6rem",
      selector: (row: any) => row.estado,
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
            setEditedCierre(row);
          }}
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className=" mb-3 text-center">
        <h1 className="text-xl dark:text-white">
          Apertura y Cierre de Comprobantes contables
        </h1>
      </div>
      {!loading && (
        <div>
          <button
            className="border p-1 m-2 bg-slate-600 text-white"
            onClick={guardarCambios}
          >
            Guardar Cambios
          </button>
          <button
            className="border p-1 m-2 bg-slate-600 text-white"
            onClick={agregarCierre}
          >
            Agregar Nuevo Cierre
          </button>
          <button
            className="border p-1 m-2 bg-slate-600 text-white"
            onClick={denegarCambios}
          >
            Denegar Cambios
          </button>
          <div className="">
            <DataTable
              columns={columns}
              data={cierres}
              dense
              customStyles={gridStyleBoldHeader}
              className="border dark:border-slate-900"
              theme={theme}
              fixedHeader={true}
              fixedHeaderScrollHeight={`${fixedHeaderScrollHeight}px`}
            />
          </div>
        </div>
      )}

      {editedCierre && (
        <Modal
          title="Editar Cierre"
          type="info"
          width="w-200"
          onClose={() => setEditedCierre(null)}
        >
          <form className="grid grid-rows-2">
            <div className="flex justify-center gap-2">
              <div className="flex">
                <label className="mr-2">Mes:</label>
                <input
                  className="bg-gray-50 border h-6 w-12 text-end border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  px-2  mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500  "
                  type="number"
                  value={Number(editedCierre.mes)}
                  onFocus={(evento) => evento.target.select()}
                  onChange={(e) => {
                    const inputValue = Math.max(
                      1,
                      Math.min(12, parseInt(e.target.value, 10))
                    );

                    setEditedCierre((prevCierre: any) => ({
                      ...prevCierre,
                      mes: inputValue,
                    }));
                  }}
                />
              </div>

              <div className="flex justify-center">
                <label className="mr-2">Libro:</label>
                <select
                  value={String(editedCierre.libro)}
                  className="bg-gray-50 border h-6 w-12 text-end border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 px-2 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) =>
                    setEditedCierre((prevCierre: any) => ({
                      ...prevCierre,
                      libro: e.target.value,
                    }))
                  }
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                  <option value="I">I</option>
                  <option value="J">J</option>
                  <option value="K">K</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="T">T</option>
                  <option value="Z">Z</option>
                  <option value="O">O</option>
                  <option value="P">P</option>
                  <option value="R">R</option>
                  <option value="L">L</option>
                  <option value="M">M</option>
                  <option value="S">S</option>
                  <option value="V">V</option>
                  <option value="X">X</option>
                </select>
              </div>
              <div className="flex justify-center">
                <label className="mr-2">Estado:</label>
                <input
                  type="checkbox"
                  className=" w-5 h-5"
                  checked={editedCierre.estado === "A"}
                  onChange={(e) =>
                    setEditedCierre((prevCierre: any) => ({
                      ...prevCierre,
                      estado: e.target.checked ? "A" : "C",
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="text-white w-auto h-10 mr-3 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none
                   focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800 "
                onClick={() => {
                  setCierres((prevData: Cierres[]) => {
                    const updatedData = [...prevData];
                    const cierreIndex = updatedData.findIndex(
                      (c) => c.referencia === editedCierre.referencia
                    );

                    if (Array.isArray(updatedData) && cierreIndex !== -1) {
                      updatedData[cierreIndex] = editedCierre;
                    }

                    return updatedData;
                  });
                  setEditedCierre(null); // Cierra el modal después de guardar los cambios
                }}
              >
                Aceptar
              </button>
            </div>
          </form>
        </Modal>
      )}
      <ToastList toasts={toasts} setToasts={setToasts} />
    </div>
  );
}
