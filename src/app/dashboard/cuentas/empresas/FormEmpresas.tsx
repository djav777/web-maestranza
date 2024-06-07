import { useRef, useState, useContext } from "react";
import {
  ActionType,
  CREATE_ACTION,
  UPDATE_ACTION,
  formatToNumbersOnly,
  ERROR_CODE_EXISTS,
} from "@/variablesglobales";
import Input from "@/components/Utils/Input";
import { IEmpresa } from "@/interfaces/IEmpresa";
import { formatRut } from "@/variablesglobales";
import Button from "@/components/Utils/Button";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";
import axios from "axios";
import Modal from "@/components/Utils/Modal";
import { useCompanyParamsContext } from "@/components/Providers/CompanyParameters";
import Select from "@/components/Utils/Select";
import EmailButton from "@/components/Utils/TestEmail";

//Definicion de los datos que espera el componente
interface FormEmpresasProps {
  Empresa?: IEmpresa;
  type: ActionType;
  onFormSubmit: (type: string, empresa: IEmpresa) => void;
  onError: (message?: string) => void;
  codigoList: number[];
  empresasList: any[];
}

const FormEmpresas: React.FC<FormEmpresasProps> = ({
  // Parametros del componente
  Empresa,
  type,
  onFormSubmit,
  onError,
  codigoList,
  empresasList,
}) => {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEmailCorpModalOpen, setIsEmailCorpModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const { itemCambios } = useCompanyParamsContext();

  // Funciones para abrir y cerrar, el modal de Email, EmailCorp y el de los datos para la base de datos
  const handleEmailModalOpen = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailModalClose = () => {
    setIsEmailModalOpen(false);
  };

  const handleEmailCorpModalOpen = () => {
    setIsEmailCorpModalOpen(true);
  };

  const handleEmailCorpModalClose = () => {
    setIsEmailCorpModalOpen(false);
  };

  const handleDatabaseModalOpen = () => {
    setIsDatabaseModalOpen(true);
  };

  const handleDatabaseModalClose = () => {
    setIsDatabaseModalOpen(false);
  };

  // Funcion para formatear la fecha dada
  const formatDate = (dateString: any) => {
    const originalDate = new Date(dateString);

    if (isNaN(originalDate.getTime())) {
      console.error(`Error al convertir la fecha: ${dateString}`);
      return "";
    }

    // Formatear la fecha como "yyyy-MM-dd"
    const date = originalDate.toISOString().split("T")[0];

    if (
      date === "2001-01-01" ||
      date === "01/01/2001" ||
      date === "01/01/0001"
    ) {
      return "";
    }
    const formattedDate = date;

    return formattedDate;
  };

  // Valores iniciales del form
  const [formValues, setFormValues] = useState({
    codigo: Empresa?.codigo || "",
    rut: Empresa?.rut !== undefined ? Empresa?.rut + "-" + Empresa?.dv : "",
    dv: "",
    nombre: Empresa?.nombre || "",
    direccion: Empresa?.direccion || "",
    ciudad: Empresa?.ciudad || "",
    comuna: Empresa?.comuna || "",
    giro: Empresa?.giro || "",
    replegal: Empresa?.replegal || "",
    rutreplegal:
      Empresa?.rutreplegal !== undefined
        ? Empresa?.rutreplegal + "-" + Empresa?.dvrutreplegal
        : "",
    dvrutreplegal: "",
    controlila: Empresa?.controlila || 0,
    email: Empresa?.email || "",
    password: Empresa?.password || "",
    passwordcorp: Empresa?.passwordcorp || "",
    smtp: Empresa?.smtp || "",
    smtpcorp: Empresa?.smtpcorp || "",
    imap: Empresa?.imap || "",
    imapcorp: Empresa?.imapcorp || "",
    emailcorp: Empresa?.emailcorp || "",
    puerto: Empresa?.puerto || 0,
    puertocorp: Empresa?.puertocorp || 0,
    telefono: Empresa?.telefono || 0,
    rutusuariosii:
      Empresa?.rutusuariosii !== undefined
        ? Empresa?.rutusuariosii + "-" + Empresa?.dvusuariosii
        : "",
    dvusuariosii: "",
    codacteco: Empresa?.codacteco || 0,
    codsucsii: Empresa?.codsucsii || 0,
    vbegresos: Empresa?.vbegresos || 0,
    nomsucsii: Empresa?.nomsucsii || "",
    fechares:
      Empresa?.fechares !== undefined
        ? formatDate(Empresa?.fechares?.split("T")[0])
        : "",
    numerores: Empresa?.numerores || 0,
    baseCmaf: Empresa?.baseCmaf || "",
    ppm: Empresa?.ppm || 0,
    foliomensual: Empresa?.foliomensual || 0,
    pop: Empresa?.pop || "",
    popcorp: Empresa?.popcorp || "",
    centralizaManual: Empresa?.centralizaManual || 0,
    firmador: Empresa?.firmador || "",
    claveCert: Empresa?.claveCert || "",
    smtpAuthenticate: Empresa?.smtpAuthenticate || 0,
    smtpAuthenticatecorp: Empresa?.smtpAuthenticatecorp || 0,
    smtpUseSSL: Empresa?.smtpUseSSL || 0,
    smtpUseSSLcorp: Empresa?.smtpUseSSLcorp || 0,
    bd: Empresa?.bd || "",
    membrete: Empresa?.membrete || 0,
    bdPassword: Empresa?.bdPassword || "",
    bdUser: Empresa?.bdUser || "",
    bdPort: Empresa?.bdPort || "",
    bdIp: Empresa?.bdIp || "",
    usarItemsEmpresa: Empresa?.usarItemsEmpresa || 0,
  });

  const [tried, setTried] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);

  // Funcion para guadar la nueva empresa o la empresa editada.
  const handleSubmit = async () => {
    if (
      formValues.codigo === "" ||
      formValues.nombre === "" ||
      formValues.rut === ""
    ) {
      setTried(true);
      startRef.current?.firstElementChild?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    if (
      type === CREATE_ACTION &&
      codigoList.includes(Number(formValues.codigo))
    ) {
      onError(ERROR_CODE_EXISTS);
      startRef.current?.firstElementChild?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    // Formateamos los datos obtenidos y generamos los datos que espera la api
    const empresa = {
      codigo: Number(formValues.codigo),
      rut: parseInt(formValues.rut.split("-")[0]),
      dv: formValues.rut.split("-")[1],
      nombre: formValues.nombre,
      direccion: formValues.direccion,
      ciudad: formValues.ciudad,
      comuna: formValues.comuna,
      giro: formValues.giro,
      replegal: formValues.replegal,
      rutreplegal: formValues.rutreplegal
        ? parseInt(formValues.rutreplegal.split("-")[0])
        : 0,
      dvrutreplegal: formValues.rutreplegal
        ? formValues.rutreplegal.split("-")[1]
        : "",
      controlila: formValues.controlila,
      email: formValues.email,
      password: formValues.password,
      passwordcorp: formValues.passwordcorp,
      smtp: formValues.smtp,
      smtpcorp: formValues.smtpcorp,
      imap: formValues.imap,
      imapcorp: formValues.imapcorp,
      emailcorp: formValues.emailcorp,
      puerto: formValues.puerto,
      puertocorp: formValues.puertocorp,
      telefono: formValues.telefono,
      rutusuariosii: formValues.rutusuariosii
        ? parseInt(formValues.rutusuariosii.split("-")[0])
        : 0,
      dvusuariosii: formValues.rutusuariosii.split("-")[1] || "",
      codacteco: formValues.codacteco,
      codsucsii: formValues.codsucsii,
      vbegresos: formValues.vbegresos,
      nomsucsii: formValues.nomsucsii,
      fechares:
        formValues.fechares === ""
          ? "0000-00-00"
          : formatDate(formValues.fechares),
      numerores: formValues.numerores,
      baseCmaf: formValues.baseCmaf,
      ppm: formValues.ppm,
      foliomensual: formValues.foliomensual,
      pop: formValues.pop,
      popcorp: formValues.popcorp,
      centralizaManual: formValues.centralizaManual,
      firmador: formValues.firmador,
      claveCert: formValues.claveCert,
      smtpAuthenticate: formValues.smtpAuthenticate,
      smtpAuthenticatecorp: formValues.smtpAuthenticatecorp,
      smtpUseSSL: formValues.smtpUseSSL,
      smtpUseSSLcorp: formValues.smtpUseSSLcorp,
      bd: formValues.bd,
      membrete: formValues.membrete,
      bdPassword: formValues.bdPassword,
      bdUser: formValues.bdUser,
      bdPort: formValues.bdPort,
      bdIp: formValues.bdIp,
      usarItemsEmpresa: formValues.usarItemsEmpresa,
    };
    try {
      if (type === UPDATE_ACTION) {
        await sendRequest(empresa, "PUT");
      } else if (type === CREATE_ACTION) {
        await sendRequest(empresa, "POST");
      }
      onFormSubmit(type, empresa);
    } catch (e) {
      onError();
    }
  };

  async function sendRequest(data: IEmpresa, method: string) {
    if (method === "PUT") {
      try {
        const response = await axios.put(
          `/api/empresas`,
          { data },
          {
            headers: getHeaders(),
          }
        );

        if (response.data == "Error") {
          throw new Error("Error en la petición.");
        } else {
          itemCambios();
        }
      } catch (error) {
        throw error;
      }
    } else {
      try {
        const response = await axios.post(
          `/api/empresas`,
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
    <div className="grid grid-col" ref={startRef}>
      <div className="grid grid-row gap-2">
        <div className="grid grid-cols-8 w-full gap-2">
          <div className="col-span-2 ">
            <Input
              type="number"
              label="Código"
              name="codigo"
              className="w-full "
              value={formValues.codigo}
              onChange={(e: any) => {
                // Removiendo los caracteres no numericos
                const numericValue = e.target.value.replace(/\D/g, "");
                const truncatedValue = numericValue.slice(0, 11);
                setFormValues({
                  ...formValues,
                  codigo: Number(truncatedValue),
                });
              }}
              placeholder="1000"
              error={tried && formValues.codigo === ""}
              disabled={type === UPDATE_ACTION}
            />
          </div>
          <div className="col-span-6 ">
            <Input
              type="text"
              label="Nombre"
              name="nombre"
              className="w-full "
              placeholder="Nombre"
              error={tried && formValues.nombre === ""}
              value={formValues.nombre}
              maxLength={50}
              onChange={(e) =>
                setFormValues({ ...formValues, nombre: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <Input
              type="text"
              label="RUT"
              className="w-full "
              name="rut"
              placeholder="11.111.111-1"
              error={tried && formValues.rut === ""}
              value={formValues.rut}
              maxLength={10}
              onChange={(e: any) =>
                setFormValues({ ...formValues, rut: formatRut(e.target.value) })
              }
            />
          </div>

          <div className="col-span-3">
            <Input
              type="text"
              className="w-full "
              label="Ciudad"
              placeholder="Concepción"
              name="ciudad"
              value={formValues.ciudad}
              maxLength={25}
              onChange={(e) =>
                setFormValues({ ...formValues, ciudad: e.target.value })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              className="w-full "
              label="Comuna"
              name="comuna"
              placeholder="Concepción"
              value={formValues.comuna}
              maxLength={25}
              onChange={(e) =>
                setFormValues({ ...formValues, comuna: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-9">
            <Input
              type="text"
              label="Dirección"
              name="direccion"
              className="w-full "
              placeholder="Av. Avenida 123"
              value={formValues.direccion}
              maxLength={50}
              onChange={(e) =>
                setFormValues({ ...formValues, direccion: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-9">
            <Input
              type="text"
              label="Giro"
              className="w-full "
              name="giro"
              placeholder="Giro"
              maxLength={100}
              value={formValues.giro}
              onChange={(e) =>
                setFormValues({ ...formValues, giro: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <Input
              type="text"
              className="w-full "
              label="Teléfono"
              placeholder="949999999"
              name="telefono"
              maxLength={11}
              value={formValues.telefono}
              onChange={(e: any) =>
                setFormValues({
                  ...formValues,
                  telefono: Number(formatToNumbersOnly(e.target.value)),
                })
              }
            />
          </div>

          <div className="col-span-6 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-center text-gray-700 text-sm dark:text-slate-200 font-bold ">
                Comprobantes parte con mes
              </p>
              <input
                type="checkbox"
                className=" mt-2 w-4 h-4"
                checked={formValues.foliomensual === 1}
                onChange={(e) =>
                  setFormValues((prevCierre: any) => ({
                    ...prevCierre,
                    foliomensual: e.target.checked ? 1 : 0,
                  }))
                }
              />
            </div>

            <div className="flex flex-col items-center">
              <p className="text-center text-gray-700 text-sm dark:text-slate-200 font-bold ">
                Egreso con membrete
              </p>
              <input
                type="checkbox"
                className=" mt-2 w-4 h-4"
                checked={formValues.membrete === 1}
                onChange={(e) =>
                  setFormValues((prevCierre: any) => ({
                    ...prevCierre,
                    membrete: e.target.checked ? 1 : 0,
                  }))
                }
              />
            </div>

            <div className="flex flex-col items-center">
              <p className="text-center text-gray-700 text-sm dark:text-slate-200 font-bold ">
                Crontol ILA
              </p>
              <input
                type="checkbox"
                className=" mt-2 w-4 h-4"
                checked={formValues.controlila === 1}
                onChange={(e) =>
                  setFormValues((prevCierre: any) => ({
                    ...prevCierre,
                    controlila: e.target.checked ? 1 : 0,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-9 items-center gap-2 my-2">
          <div className="col-span-3 flex items-center justify-center">
            <Button
              className="text-md"
              type="primary"
              onClick={handleEmailCorpModalOpen}
              text="Configuración Email de intercambio"
            />
          </div>

          <div className="col-span-3 flex items-center justify-center">
            <Button
              className="text-md"
              type="primary"
              onClick={handleEmailModalOpen}
              text="Configuración Email de intercambio"
            />
          </div>

          <div className="col-span-3 flex items-center justify-center">
            <Button
              className="text-md"
              type="primary"
              onClick={handleDatabaseModalOpen}
              text="Configuración BD"
            />
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <Input
              type="text"
              label="Representante Legal"
              className="w-full "
              name="replegal"
              placeholder="open Code"
              maxLength={50}
              value={formValues.replegal}
              onChange={(e) =>
                setFormValues({ ...formValues, replegal: e.target.value })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              className="w-full "
              type="text"
              label="RUT Representante Legal"
              placeholder="11111111-1"
              name="rutreplegal"
              maxLength={10}
              value={formValues.rutreplegal}
              onChange={(e: any) =>
                setFormValues({
                  ...formValues,
                  rutreplegal: formatRut(e.target.value),
                })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              className="w-full "
              label="Firma"
              placeholder="firma"
              name="firmador"
              maxLength={20}
              value={formValues.firmador}
              onChange={(e: any) =>
                setFormValues({ ...formValues, firmador: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <Input
              type="number"
              className="w-full "
              label="Código Actividad Económica"
              placeholder="1000"
              name="codacteco"
              maxLength={10}
              value={formValues.codacteco}
              onChange={(e: any) =>
                setFormValues({
                  ...formValues,
                  codacteco: Number(formatToNumbersOnly(e.target.value)),
                })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              label="Código Sucursal SII"
              className="w-full "
              placeholder="1000"
              name="codsucsii"
              maxLength={11}
              value={formValues.codsucsii}
              onChange={(e: any) =>
                setFormValues({
                  ...formValues,
                  codsucsii: Number(formatToNumbersOnly(e.target.value)),
                })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              label="Nombre Sucursal SII"
              className="w-full "
              placeholder="Sucursal"
              name="nomsucsii"
              maxLength={30}
              value={formValues.nomsucsii}
              onChange={(e) =>
                setFormValues({ ...formValues, nomsucsii: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <Input
              type="text"
              label="RUT Usuario SII"
              className="w-full "
              placeholder="11111111-1"
              name="rutusuariosii"
              maxLength={10}
              value={formValues.rutusuariosii}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  rutusuariosii: formatRut(e.target.value),
                })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              className="w-full "
              placeholder="123"
              label="Número Resolución SII"
              name="numerores"
              maxLength={6}
              value={formValues.numerores}
              onChange={(e: any) =>
                setFormValues({
                  ...formValues,
                  numerores: Number(formatToNumbersOnly(e.target.value)),
                })
              }
            />
          </div>
          <div className="col-span-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fechares"
            >
              Fecha de Resolucion SII
            </label>

            <input
              type="date"
              placeholder="12-12-2222"
              className="border shadow w-full px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="fechares"
              value={formValues.fechares}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  fechares: formatDate(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <Input
              type="text"
              label="Clave Certificado"
              className="w-full "
              placeholder="****"
              name="claveCert"
              maxLength={30}
              value={formValues.claveCert}
              onChange={(e: any) =>
                setFormValues({ ...formValues, claveCert: e.target.value })
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              label="PPM %%"
              placeholder="0"
              className="w-full "
              name="ppm"
              value={formValues.ppm}
              onChange={(e: any) => {
                // Remover caracteres no permitidos
                const sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");

                // Limitar a dos dígitos antes y después del punto decimal
                const formattedValue = sanitizedValue.replace(
                  /^(\d{0,2})\.?(\d{0,2}).*$/,
                  "$1.$2"
                );
                setFormValues({ ...formValues, ppm: formattedValue });
              }}
            />
          </div>
          <div className="col-span-3">
            <Select
              name="cuenta"
              className="w-full mt-1.5"
              title="Usar itemes de empresa"
              error={false}
              selected={formValues.usarItemsEmpresa}
              options={empresasList}
              onChange={(e: any) =>
                setFormValues({
                  ...formValues,
                  usarItemsEmpresa: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {isEmailCorpModalOpen && (
        <Modal
          title="Email Corporativo"
          type="info"
          onClose={handleEmailCorpModalClose}
        >
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-3">
              <Input
                type="text"
                label="Email Corporativo"
                className="w-full "
                placeholder="email@email.com"
                name="emailcorp"
                maxLength={50}
                value={formValues.emailcorp}
                onChange={(e) =>
                  setFormValues({ ...formValues, emailcorp: e.target.value })
                }
              />
            </div>
            <div className="col-span-3">
              <Input
                type="password"
                className="w-full "
                label="Password"
                placeholder="123"
                name="password"
                maxLength={30}
                value={formValues.passwordcorp}
                onChange={(e) =>
                  setFormValues({ ...formValues, passwordcorp: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-9 mt-2 gap-2">
            <div className="col-span-3">
              <Input
                type="text"
                className="w-full "
                label="Pop"
                placeholder="pop.pop.cl"
                name="pop"
                maxLength={50}
                value={formValues.popcorp}
                onChange={(e) =>
                  setFormValues({ ...formValues, popcorp: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Input
                type="text"
                label="IMAP"
                className="w-full "
                name="imap"
                placeholder="imap.imap.cl"
                maxLength={50}
                value={formValues.imapcorp}
                onChange={(e) =>
                  setFormValues({ ...formValues, imapcorp: e.target.value })
                }
              />
            </div>
            <div className="col-span-3">
              <Input
                type="text"
                placeholder="smtp.smtp.cl"
                className="w-full "
                label="SMTP"
                name="smtp"
                maxLength={30}
                value={formValues.smtpcorp}
                onChange={(e) =>
                  setFormValues({ ...formValues, smtpcorp: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-9 mt-2 gap-2">
            <div className="col-span-3">
              <Input
                type="number"
                label="Puerto"
                placeholder="443"
                name="puerto"
                value={formValues.puertocorp}
                onChange={(e: any) => {
                  // Remover caracteres no permitidos
                  const numericValue = e.target.value.replace(/\D/g, "");
                  const truncatedValue = numericValue.slice(0, 6);
                  setFormValues({
                    ...formValues,
                    puertocorp: Number(truncatedValue),
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-6 col-span-6">
              <div className="col-span-2 mt-3 ">
                <p className=" text-gray-700 text-sm dark:text-slate-200 font-bold ">
                  AUTH
                </p>
                <input
                  type="checkbox"
                  className=" ml-2 mt-2 w-4 h-4"
                  checked={formValues.smtpAuthenticatecorp === 1}
                  onChange={(e) =>
                    setFormValues((prevCierre: any) => ({
                      ...prevCierre,
                      smtpAuthenticatecorp: e.target.checked ? 1 : 0,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 mt-3 ">
                <p className=" text-gray-700 text-sm dark:text-slate-200 font-bold ">
                  USESSL
                </p>
                <input
                  type="checkbox"
                  className=" ml-2 mt-2 w-4 h-4"
                  checked={formValues.smtpUseSSLcorp === 1}
                  onChange={(e) =>
                    setFormValues((prevCierre: any) => ({
                      ...prevCierre,
                      smtpUseSSLcorp: e.target.checked ? 1 : 0,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 ">
                <EmailButton
                  className="mt-5"
                  email={formValues.emailcorp}
                  password={formValues.passwordcorp}
                  pop={formValues.popcorp}
                  imap={formValues.imapcorp}
                  smtp={formValues.smtpcorp}
                  puerto={formValues.puertocorp}
                ></EmailButton>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isEmailModalOpen && (
        <Modal
          title="Email de intercambio"
          type="info"
          onClose={handleEmailModalClose}
        >
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-3">
              <Input
                className="w-full "
                type="text"
                placeholder="correo@correo.com"
                label="Email Intercambio"
                name="email"
                maxLength={90}
                value={formValues.email}
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
              />
            </div>
            <div className="col-span-3">
              <Input
                type="password"
                className="w-full "
                label="Password"
                placeholder="123"
                name="password"
                maxLength={30}
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({ ...formValues, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-9 mt-2 gap-2">
            <div className="col-span-3">
              <Input
                type="text"
                className="w-full "
                label="Pop"
                placeholder="pop.pop.cl"
                name="pop"
                maxLength={50}
                value={formValues.pop}
                onChange={(e) =>
                  setFormValues({ ...formValues, pop: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Input
                type="text"
                label="IMAP"
                className="w-full "
                name="imap"
                placeholder="imap.imap.cl"
                maxLength={50}
                value={formValues.imap}
                onChange={(e) =>
                  setFormValues({ ...formValues, imap: e.target.value })
                }
              />
            </div>
            <div className="col-span-3">
              <Input
                type="text"
                placeholder="smtp.smtp.cl"
                className="w-full "
                label="SMTP"
                name="smtp"
                maxLength={30}
                value={formValues.smtp}
                onChange={(e) =>
                  setFormValues({ ...formValues, smtp: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-9 mt-2 gap-2">
            <div className="col-span-3">
              <Input
                type="number"
                label="Puerto"
                placeholder="443"
                name="puerto"
                value={formValues.puerto}
                onChange={(e: any) => {
                  // Remover caracteres no permitidos
                  const numericValue = e.target.value.replace(/\D/g, "");
                  const truncatedValue = numericValue.slice(0, 6);
                  setFormValues({
                    ...formValues,
                    puerto: Number(truncatedValue),
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-6 col-span-6">
              <div className="col-span-2 mt-3 ">
                <p className=" text-gray-700 text-sm dark:text-slate-200 font-bold ">
                  AUTH
                </p>
                <input
                  type="checkbox"
                  className=" ml-2 mt-2 w-4 h-4"
                  checked={formValues.smtpAuthenticate === 1}
                  onChange={(e) =>
                    setFormValues((prevCierre: any) => ({
                      ...prevCierre,
                      smtpAuthenticate: e.target.checked ? 1 : 0,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 mt-3 ">
                <p className=" text-gray-700 text-sm dark:text-slate-200 font-bold ">
                  USESSL
                </p>
                <input
                  type="checkbox"
                  className=" ml-2 mt-2 w-4 h-4"
                  checked={formValues.smtpUseSSL === 1}
                  onChange={(e) =>
                    setFormValues((prevCierre: any) => ({
                      ...prevCierre,
                      smtpUseSSL: e.target.checked ? 1 : 0,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 ">
                <EmailButton
                  className="mt-5"
                  email={formValues.email}
                  password={formValues.password}
                  pop={formValues.pop}
                  imap={formValues.imap}
                  smtp={formValues.smtp}
                  puerto={formValues.puerto}
                ></EmailButton>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isDatabaseModalOpen && (
        <Modal
          title="Conexion con base de datos"
          type="info"
          onClose={handleDatabaseModalClose}
        >
          <div className="grid grid-cols-9 mb-3 gap-2">
            <div className="col-span-3">
              <Input
                type="text"
                label="Base de datos"
                className="w-full "
                placeholder="datos"
                name="bd"
                maxLength={30}
                value={formValues.bd}
                onChange={(e: any) =>
                  setFormValues({ ...formValues, bd: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Input
                type="text"
                label="IP Servidor"
                className="w-full "
                placeholder="ip"
                maxLength={15}
                name="bdIp"
                value={formValues.bdIp}
                onChange={(e: any) =>
                  setFormValues({ ...formValues, bdIp: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Input
                type="text"
                label="Puerto BD"
                className="w-full "
                placeholder="opencode"
                maxLength={15}
                name="bdPort"
                value={formValues.bdPort}
                onChange={(e: any) =>
                  setFormValues({ ...formValues, bdPort: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-3">
              <Input
                type="text"
                label="Usuario Bd"
                className="w-full "
                placeholder="opencode"
                maxLength={15}
                name="bdUser"
                value={formValues.bdUser}
                onChange={(e: any) =>
                  setFormValues({ ...formValues, bdUser: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Input
                type="text"
                className="w-full "
                label="Contraseña"
                placeholder="****"
                maxLength={15}
                name="bdPassword"
                value={formValues.bdPassword}
                onChange={(e: any) =>
                  setFormValues({ ...formValues, bdPassword: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>
      )}

      <div className="flex mt-2 justify-end">
        <Button type="primary" onClick={handleSubmit} text="Guardar" />
      </div>
    </div>
  );
};

export default FormEmpresas;
