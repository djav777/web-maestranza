import { useEffect, useState, useContext } from "react";
import DataTable from "react-data-table-component";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";
import Modal from "@/components/Utils/Modal";
import { CLASS_MODAL } from "@/globals/CSSClasses";
import { TrashIcon } from "@heroicons/react/24/solid";
import { CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TableSelector from "@/components/Utils/TableSelector";
import { ThemeContext } from "@/components/Providers/darkModeContext";
import axios from "axios";

interface AsignacionEmpresasProps {
  codigoUsuario: string;
  empresas: any[];
}

const AsignacionEmpresas: React.FC<AsignacionEmpresasProps> = ({
  codigoUsuario,
  empresas,
}) => {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext);

  const [dataAsignacion, setDataAsignacion] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});

  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isEmpresaSelectorModal, setEmpresaSelectorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/usuarios/empresas`, {
          params: { usuario: codigoUsuario },
          headers: getHeaders(),
        });
        if (response.data !== "Error") {
          setDataAsignacion(response.data);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const columns = [
    {
      id: "codigo",
      name: "Código",
      width: "6rem",
      sortable: true,
      selector: (row: any) => row.empresa,
    },
    { name: "Nombre", selector: (row: any) => row.nempresa, wrap: true },
    {
      name: "Eliminar",
      width: "5rem",
      center: true,
      cell: (row: any) => (
        <button
          className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
          onClick={() => {
            setSelectedRow(
              dataAsignacion.find(
                (item) => item["referencia"] === row.referencia
              )
            );
            setDeleteModal(true);
          }}
        >
          <TrashIcon className={CLASS_TABLE_BUTTONS} />
        </button>
      ),
    },
  ];

  const tableSelectorColumns = [
    {
      id: "codigo",
      name: "Código",
      width: "6rem",
      sortable: true,
      selector: (row: any) => row.referencia,
    },
    { name: "Nombre", selector: (row: any) => row.nombre, wrap: true },
  ];

  const handleDelete = async (referencia: number) => {
    const response = await axios.delete(`/api/usuarios/empresas`, {
      params: { referencia: referencia },
      headers: getHeaders(),
    });

    if (response.data === "Error") {
      handleError();
      console.error("Error en la solicitud:");
    } else {
      handleSuccess();
      setDataAsignacion(
        dataAsignacion.filter((item) => item["referencia"] !== referencia)
      );
    }
    setDeleteModal(false);
  };

  const handleSelect = async (empresa: {
    referencia: number;
    nombre: string;
  }) => {
    const usuario = {
      codigo: codigoUsuario,
      empresa: empresa.referencia,
      nempresa: empresa.nombre,
    };

    const newData = dataAsignacion.concat(usuario);
    setDataAsignacion(newData);

    const response = await axios.post(
      `/api/usuarios/empresas`,
      { usuario },
      {
        headers: getHeaders(),
      }
    );

    if (response.data === "Error") {
      handleError();
    } else {
      handleSuccess();
    }

    setEmpresaSelectorModal(false);
  };

  const handleError = () => {
    console.log("Errorrr");
  };

  const handleSuccess = () => { };

  return (
    <section>
      <div className="flex flex-row-reverse">
        <button
          onClick={() => {
            setEmpresaSelectorModal(true);
          }}
          className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      {loading && (
        <div className="flex justify-center" role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      )}
      {!loading && (
        <div className="max-h-[540px] lg:max-h-[300px] xl:max-h-[360px] 2xl:max-h-[550px] overflow-y-auto">
          <DataTable columns={columns} data={dataAsignacion} theme={theme} />
        </div>
      )}

      {isDeleteModal && (
        <Modal
          title="¡Alerta!"
          width={CLASS_MODAL}
          type="error"
          onConfirm={() => handleDelete(selectedRow.referencia)}
          onClose={() => setDeleteModal(false)}
          menu
        >
          <span>¿Desea eliminar la empresa {selectedRow.empresa}?</span>
        </Modal>
      )}

      {isEmpresaSelectorModal && (
        <Modal
          title="Agregar Empresa"
          width={CLASS_MODAL}
          type="info"
          onClose={() => setEmpresaSelectorModal(false)}
          menu
        >
          <TableSelector
            data={empresas}
            columns={tableSelectorColumns}
            onSelect={handleSelect}
          />
        </Modal>
      )}
    </section>
  );
};

export default AsignacionEmpresas;
