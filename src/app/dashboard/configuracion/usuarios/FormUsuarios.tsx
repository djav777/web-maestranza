import { useState, useContext } from "react";
import {
  ActionType,
  CREATE_ACTION,
  UPDATE_ACTION,
  ERROR_CODE_EXISTS,
} from "@/variablesglobales";
import Input from "@/components/Utils/Input";
import Button from "@/components/Utils/Button";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";
import { IUsuario } from "@/interfaces/IUsuario";
import axios from "axios";

interface FormUsuariosProps {
  Usuario?: IUsuario;
  type: ActionType;
  onFormSubmit: (type: string, grupoCuentas: any) => void;
  onError: (message?: string) => void;
  codigoList: string[];
}

const FormUsuarios: React.FC<FormUsuariosProps> = ({
  Usuario,
  type,
  onFormSubmit,
  onError,
  codigoList,
}) => {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;

  const [codigo, setCodigo] = useState(Usuario?.codigo || "");
  const [nombre, setNombre] = useState(Usuario?.nombre || "");
  const [clave, setClave] = useState(Usuario?.clave || "");
  const [opciones, setOpcion] = useState(Usuario?.opciones || 0);

  const [tried, setTried] = useState(false);

  const handleSubmit = async () => {
    if (codigo === "" || nombre === "") {
      setTried(true);
      return;
    }

    if (type === CREATE_ACTION && codigoList.includes(codigo)) {
      onError(ERROR_CODE_EXISTS);
      return;
    }

    let codigoFlujo = {
      referencia: Usuario?.referencia || 0,
      codigo: codigo,
      nombre: nombre,
      clave: clave,
      opciones: Number(opciones),
    };
    try {
      if (type === UPDATE_ACTION) {
        await sendRequest(codigoFlujo, "PUT");
      }

      if (type === CREATE_ACTION) {
        await sendRequest(codigoFlujo, "POST");
      }
      onFormSubmit(type, codigoFlujo);
    } catch (error) {
      onError();
    }
  };

  async function sendRequest(data: any, method: string) {
    if (method === "PUT") {
      try {
        const response = await axios.put(
          `/api/usuarios`,
          { data },
          {
            headers: getHeaders(),
          }
        );

        if (response.data == "Error") {
          throw new Error("Error en la petición.");
        }
      } catch (error) {
        throw error;
      }
    } else {
      try {
        const response = await axios.post(
          `/api/usuarios`,
          { data },
          {
            headers: getHeaders(),
          }
        );

        if (response.data == "Error") {
          throw new Error("Error en la petición.");
        }
      } catch (error) {
        throw error;
      }
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          label="Código"
          name="Código"
          error={tried && codigo === ""}
          placeholder="USR"
          maxLength={4}
          value={codigo}
          onChange={(e: any) => setCodigo(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          type="text"
          label="Nombre"
          name="Nombre"
          error={tried && nombre === ""}
          maxLength={50}
          placeholder="Nombre"
          value={nombre}
          onChange={(e: any) => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          type="password"
          label="Clave"
          name="clave-usr"
          error={tried && nombre === ""}
          maxLength={50}
          placeholder=""
          value={clave}
          onChange={(e: any) => setClave(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          type="text"
          label="Opciones"
          name="Nombre"
          error={tried && opciones === 0}
          maxLength={50}
          placeholder=""
          value={opciones}
          onChange={(e: any) => setOpcion(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button text="Guardar" onClick={handleSubmit} type="primary" />
      </div>
    </div>
  );
};

export default FormUsuarios;
