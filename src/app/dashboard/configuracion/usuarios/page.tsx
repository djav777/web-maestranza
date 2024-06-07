"use client";
import React from "react";
import { CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import {
  BuildingOfficeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Modal from "@/components/Utils/Modal";
import DataTable from "react-data-table-component";
import {
  IToast,
  dangerToast,
  defaultDangerToast,
  defaultSuccessToast,
} from "@/interfaces/IToast";
import ToastList from "@/components/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";
import { IUsuario } from "@/interfaces/IUsuario";
import FormUsuarios from "./FormUsuarios";
import AsignacionEmpresas from "./AsignacionEmpresa";
import axios from "axios";
import { ThemeContext } from "@/components/Providers/darkModeContext";

export default function Usuarios() {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext);

  const [data, setData] = useState<IUsuario[]>([]);
  const [selectedId, setSelectedId] = useState(0);
  const [usuario, setUsuario] = useState<IUsuario>({
    referencia: 0,
    codigo: "",
    nombre: "",
    clave: "",
    rut: 0,
    dv: "",
    opciones: 0,
  });
  const [option, setOption] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [empresasModal, setEmpresasModal] = useState(false);
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [loading, setLoading] = useState(true);

  const [fixedHeaderScrollHeight, setFixedHeaderScrollHeight] = useState(0);

  useEffect(() => {
    // Efecto para ajustar la altura de la tabla
    const handleResize = () => {
      const percentage = 70;
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

  //Llamadas para obtener los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empresasResponse = await axios.get(`/api/empresas`, {
          params: {},
          headers: getHeaders(),
        });

        setEmpresas(
          empresasResponse.data.map((item: any) => {
            let newData = {
              referencia: item.codigo,
              nombre: item.nombre,
            };
            return newData;
          })
        );
        const usuarios = await axios.get(`/api/usuarios`, {
          params: {},
          headers: getHeaders(),
        });
        if (usuarios.data != "Error") {
          setData(usuarios.data);
          setLoading(false);
        } else {
          console.log("Error de conexion");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  // Columnas de la tabla
  const columns = [
    {
      id: "codigo",
      name: "Código",
      width: "6rem",
      sortable: true,
      selector: (row: any) => row.codigo,
    },
    { name: "Nombre", selector: (row: any) => row.nombre, wrap: true },
    { name: "Opciones", selector: (row: any) => row.opciones, wrap: true },
    {
      name: "Empresas",
      width: "6rem",
      center: true,
      cell: (row: any) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 rounded-full p-2 text-white"
          onClick={() => {
            setSelectedId(row.referencia);
            setUsuario(
              data.find(
                (item) => item["referencia"] === row.referencia
              ) as IUsuario
            );
            setEmpresasModal(true);
          }}
        >
          <BuildingOfficeIcon className={CLASS_TABLE_BUTTONS} />
        </button>
      ),
    },
    {
      name: "Editar",
      width: "5rem",
      center: true,
      cell: (row: any) => (
        <button
          className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white"
          onClick={() => {
            setOption(UPDATE_ACTION);
            setUsuario(
              data.find(
                (item) => item["referencia"] === row.referencia
              ) as IUsuario
            );
            setSelectedId(row.referencia);
            setEditModal(true);
          }}
        >
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS} />
        </button>
      ),
    },
    {
      name: "Eliminar",
      width: "5rem",
      center: true,
      cell: (row: any) => (
        <button
          className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
          onClick={() => {
            setSelectedId(row.referencia);
            setUsuario(
              data.find(
                (item) => item["referencia"] === row.referencia
              ) as IUsuario
            );
            setDeleteModal(true);
          }}
        >
          <TrashIcon className={CLASS_TABLE_BUTTONS} />
        </button>
      ),
    },
  ];

  // Funcion para eliminar un usuario
  const handleDelete = async (referencia: number) => {
    const response = await axios.delete(`/api/usuarios`, {
      params: { referencia: referencia },
      headers: getHeaders(),
    });

    if (response.data === "Error") {
      handleError();
      console.error("Error en la solicitud:");
    } else {
      setData(data.filter((item) => item["referencia"] !== referencia));
      setToasts([...toasts, defaultSuccessToast]);
    }
    setDeleteModal(false);
  };

  // Funcion para crear o eliminar un usuario (Se genera el modal)
  const handleSubmit = (type: string, object: IUsuario) => {
    if (type === CREATE_ACTION) {
      const newData = data.concat(object);
      setData(newData);
    } else if (type === UPDATE_ACTION) {
      setData(
        data.map((obj) => {
          if (obj["referencia"] === object.referencia) {
            obj = object;
          }
          return obj;
        })
      );
    }
    setToasts([...toasts, defaultSuccessToast]);
    setEditModal(false);
  };

  const handleError = (message: string = "") => {
    message === ""
      ? setToasts([...toasts, defaultDangerToast])
      : setToasts([...toasts, dangerToast(message)]);
  };

  return (
    <div>
      <div className="flex pr-5 text-center">
        <h1 className="text-xl dark:text-white">Usuarios</h1>
        <button
          onClick={() => {
            setOption(CREATE_ACTION);
            setEditModal(true);
          }}
          className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
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
      {!loading && (
        <div>
          <DataTable
            columns={columns}
            data={data}
            defaultSortFieldId={"codigo"}
            pagination
            fixedHeader={true}
            fixedHeaderScrollHeight={`${fixedHeaderScrollHeight}px`}
            striped
            theme={theme}
          />
        </div>
      )}

      {editModal && (
        <Modal
          title={option === CREATE_ACTION ? "Nuevo Usuario" : "Editar Usuario"}
          type="info"
          width={CLASS_MODAL}
          onClose={() => setEditModal(false)}
        >
          {option === CREATE_ACTION ? (
            <FormUsuarios
              onFormSubmit={handleSubmit}
              type={CREATE_ACTION}
              onError={handleError}
              codigoList={data.map((item) => item.codigo)}
            />
          ) : (
            <FormUsuarios
              onFormSubmit={handleSubmit}
              type={UPDATE_ACTION}
              Usuario={usuario}
              onError={handleError}
              codigoList={data.map((item) => item.codigo)}
            />
          )}
        </Modal>
      )}

      {deleteModal && (
        <Modal
          title="¡Alerta!"
          width={CLASS_MODAL}
          type="error"
          onConfirm={() => handleDelete(selectedId)}
          onClose={() => setDeleteModal(false)}
          menu
        >
          <span>¿Desea eliminar el usuario {usuario.codigo}?</span>
        </Modal>
      )}

      {empresasModal && (
        <Modal
          title={"Empresas asignadas a " + usuario.codigo}
          type="info"
          onClose={() => setEmpresasModal(false)}
          menu
        >
          <AsignacionEmpresas
            codigoUsuario={usuario.codigo}
            empresas={empresas}
          />
        </Modal>
      )}

      <ToastList toasts={toasts} setToasts={setToasts} />
    </div>
  );
}
