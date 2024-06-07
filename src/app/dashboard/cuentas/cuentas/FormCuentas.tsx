import { useState, useContext } from "react";
import {
  ActionType,
  CREATE_ACTION,
  UPDATE_ACTION,
  formatToNumbersOnly,
  formatNumber,
  ERROR_CODE_EXISTS,
} from "@/variablesglobales";
import { ICuenta } from "@/interfaces/ICuenta";
import Input from "@/components/Utils/Input";
import Checkbox from "@/components/Utils/Checkbox";
import TableSelector from "@/components/Utils/TableSelector";
import Modal from "@/components/Utils/Modal";
import InputTableSelector from "@/components/Utils/InputTableSelector";
import axios from "axios";
import Button from "@/components/Utils/Button";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";

interface FormCuentasProps {
  Cuenta?: ICuenta;
  type: ActionType;
  onFormSubmit: (type: string, cuenta: ICuenta) => void;
  grupoList: any[];
  codFinList: any[];
  ifrsList: any[];
  flujoList: any[];
  onError: (message?: string) => void;
  codigoList: number[];
}

const FormCuentas: React.FC<FormCuentasProps> = ({
  Cuenta,
  type,
  onFormSubmit,
  grupoList,
  codFinList,
  ifrsList,
  onError,
  codigoList,
  flujoList,
}) => {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;

  const [codigo, setCodigo] = useState(Cuenta?.codigo || 0);
  const [nombre, setNombre] = useState(Cuenta?.nombre || "");
  const [ngrupo, setNombreGrupo] = useState(Cuenta?.nGrupo || "");

  const [centroSelected, setCentroSelected] = useState(
    Cuenta?.centro === "S" ? true : false
  );
  const [itemSelected, setItemSelected] = useState(
    Cuenta?.item === "S" ? true : false
  );
  const [nroRefSelected, setNroRefSelected] = useState(
    Cuenta?.nroRef === "S" ? true : false
  );
  const [rutSelected, setRutSelected] = useState(
    Cuenta?.rut === "S" ? true : false
  );
  const [efectivoSelected, setEfectivoSelected] = useState(
    Cuenta?.efectivo === "S" ? true : false
  );

  const [grupo, setGrupo] = useState(Cuenta?.grupo || 0);
  const [codFin, setCodfin] = useState(Cuenta?.codfin || 0);
  const [ifrs, setIfrs] = useState(Cuenta?.ifrs || 0);

  const [flujo, setFlujo] = useState(Cuenta?.flujo || 0);
  const [ppto, setPpto] = useState(Cuenta?.ppto || 0);
  const [pptc, setPptc] = useState(Cuenta?.pptc || 0);

  // Establece la vista de modals de tablas
  const [isGrupoSelectorVisible, setGrupoSelectorVisible] = useState(false);
  const [isCodFinSelectorVisible, setCodFinSelectorVisible] = useState(false);
  const [isIfrsSelectorVisible, setIfrsSelectorVisible] = useState(false);
  const [isFlujoSelectorVisible, setFlujoSelectorVisible] = useState(false);

  // Grupo de textos que acompañan a los botones
  const [textGrupo, setTextGrupo] = useState(Cuenta?.grupo || "");
  const [textIFRS, setTextIFRS] = useState(Cuenta?.ifrs || "");
  const [textCodFin, setTextCodFin] = useState(Cuenta?.codfin || "");
  const [textFlujo, setTextFlujo] = useState(Cuenta?.flujo || "");

  const [tried, setTried] = useState(false);

  const handleSubmit = async () => {
    if (codigo === 0 || nombre === "") {
      setTried(true);
      return;
    }

    if (type === CREATE_ACTION && codigoList.includes(Number(codigo))) {
      onError(ERROR_CODE_EXISTS);
      return;
    }

    let obj = {
      referencia: Cuenta?.referencia || 0,
      nombre: nombre,
      codigo: codigo,
      nGrupo: ngrupo,
      centro: centroSelected ? "S" : "N",
      item: itemSelected ? "S" : "N",
      nroRef: nroRefSelected ? "S" : "N",
      rut: rutSelected ? "S" : "N",
      efectivo: efectivoSelected ? "S" : "N",
      grupo: grupo,
      codfin: codFin,
      ifrs: ifrs,
      flujo: flujo,
      ppto: ppto,
      pptc: pptc,
    };

    try {
      if (type === CREATE_ACTION) {
        await sendRequest(obj, "POST");
      }
      if (type === UPDATE_ACTION) {
        await sendRequest(obj, "PUT");
      }

      onFormSubmit(type, obj);
    } catch (error) {
      onError();
    }
  };

  const colums_data = [
    {
      name: "Código",
      width: "6rem",
      selector: (row: any) => row.codigo,
      format: (row: any) => formatNumber(row.codigo),
    },
    {
      name: "Nombre",
      width: "15rem",
      selector: (row: any) => row.nombre,
      wrap: true,
    },
  ];

  async function sendRequest(data: any, method: string) {
    if (method === "PUT") {
      try {
        const response = await axios.put(
          `/api/cuentas`,
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
          `/api/cuentas`,
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
      <div className="mb-4 grid grid-cols-3 w-full gap-2">
        <div className=" col-span-1">
          <Input
            type="text"
            label="Código"
            value={formatNumber(codigo)}
            placeholder="codigo"
            className="w-full"
            name="Codigo"
            error={tried && codigo === 0}
            onChange={(e: any) =>
              setCodigo(Number(formatToNumbersOnly(e.target.value)))
            }
            maxLength={4}
          />
        </div>
        <div className=" col-span-2">
          <Input
            type="text"
            label="Nombre"
            value={nombre}
            placeholder="Nombre"
            className="w-full"
            maxLength={250}
            name="nombre"
            error={tried && nombre === ""}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
      </div>

      <div className="flex input-wrapper  mb-4 gap-6">
        <label
          className="block text-gray-700 dark:text-slate-200 mr-5  text-sm font-bold mb-2"
          htmlFor="opcion"
        >
          {" "}
          Opciones{" "}
        </label>
        <div className="grid grid-cols-5 gap-2">
          <div className="flex flex-col">
            <Checkbox
              label={"Centro"}
              checked={centroSelected}
              value={"" + centroSelected}
              name="centro"
              onChange={() => setCentroSelected(!centroSelected)}
            />
          </div>
          <div className="flex flex-col">
            <Checkbox
              label={"Item"}
              checked={itemSelected}
              value={"" + itemSelected}
              name="item"
              onChange={() => setItemSelected(!itemSelected)}
            />
          </div>
          <div className="flex flex-col">
            <Checkbox
              label={"Rut"}
              checked={rutSelected}
              value={"" + rutSelected}
              name="rut"
              onChange={() => setRutSelected(!rutSelected)}
            />
          </div>
          <div className="flex flex-col">
            <Checkbox
              label={"NroRef"}
              checked={nroRefSelected}
              value={"" + nroRefSelected}
              name="nroref"
              onChange={() => setNroRefSelected(!nroRefSelected)}
            />
          </div>
          <div className="flex flex-col">
            <Checkbox
              label={"Efectivo"}
              checked={efectivoSelected}
              value={"" + efectivoSelected}
              name="efectivo"
              onChange={() => setEfectivoSelected(!efectivoSelected)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <InputTableSelector
          label="Grupo"
          description={textGrupo}
          onClick={() => setGrupoSelectorVisible(true)}
        />

        <InputTableSelector
          label="CodFin"
          description={textCodFin}
          onClick={() => setCodFinSelectorVisible(true)}
        />

        <InputTableSelector
          label="IFRS"
          description={textIFRS}
          onClick={() => setIfrsSelectorVisible(true)}
        />

        <InputTableSelector
          label="Flujo"
          description={textFlujo}
          onClick={() => setFlujoSelectorVisible(true)}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Input
          type="text"
          label="PPTO"
          value={ppto}
          placeholder="Nombre"
          className="w-full"
          maxLength={4}
          name=""
          error={false}
          onChange={(e: any) =>
            setPpto(Number(formatToNumbersOnly(e.target.value)))
          }
        />
        <Input
          type="text"
          label="PPTC"
          value={pptc}
          className="w-full"
          placeholder="Nombre"
          maxLength={4}
          name=""
          error={false}
          onChange={(e: any) =>
            setPptc(Number(formatToNumbersOnly(e.target.value)))
          }
        />
      </div>

      <div className="flex justify-end">
        <Button type="primary" text="Guardar" onClick={handleSubmit} />
      </div>

      {isGrupoSelectorVisible && (
        <Modal
          type="info"
          width=""
          title="Selecionar Grupo"
          onClose={() => setGrupoSelectorVisible(false)}
        >
          <TableSelector
            columns={colums_data}
            data={grupoList}
            onSelect={(grupoSelected: any) => {
              setGrupo(grupoSelected.codigo);
              setNombreGrupo(grupoSelected.nombre);
              setTextGrupo(grupoSelected.codigo + " - " + grupoSelected.nombre);
              setGrupoSelectorVisible(false);
            }}
            title="Selector"
          />
        </Modal>
      )}

      {isCodFinSelectorVisible && (
        <Modal
          type="info"
          width=""
          title="Selecionar Código Financiero"
          onClose={() => setCodFinSelectorVisible(false)}
        >
          <TableSelector
            columns={colums_data}
            data={codFinList}
            onSelect={(codfinSelected: any) => {
              setCodfin(codfinSelected.codigo);
              setTextCodFin(
                codfinSelected.codigo + " - " + codfinSelected.nombre
              );
              setCodFinSelectorVisible(false);
            }}
            title="Selector"
          />
        </Modal>
      )}

      {isIfrsSelectorVisible && (
        <Modal
          type="info"
          title="Selecionar IFRS"
          width=""
          onClose={() => setIfrsSelectorVisible(false)}
        >
          <TableSelector
            columns={colums_data}
            data={ifrsList}
            onSelect={(ifrsSelected: any) => {
              setIfrs(ifrsSelected.codigo);
              setTextIFRS(ifrsSelected.codigo + " - " + ifrsSelected.nombre);
              setIfrsSelectorVisible(false);
            }}
            title="Selector"
          />
        </Modal>
      )}

      {isFlujoSelectorVisible && (
        <Modal
          type="info"
          width=""
          title="Selecionar Flujo"
          onClose={() => setFlujoSelectorVisible(false)}
        >
          <TableSelector
            columns={colums_data}
            data={flujoList}
            onSelect={(flujoSelected: any) => {
              setFlujo(flujoSelected.codigo);
              setTextFlujo(flujoSelected.codigo + " - " + flujoSelected.nombre);
              setFlujoSelectorVisible(false);
            }}
            title="Selector"
          />
        </Modal>
      )}
    </div>
  );
};

export default FormCuentas;
