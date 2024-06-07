"use client";
import React from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Input from "@/components/Utils/Input";
import Select from "@/components/Utils/Select";
import { SESSION_NAMES } from "@/variablesglobales";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "@/components/Providers/RequestHeadersProvider";
import { Registro } from "@/interfaces/Registro";
import { useCompanyParamsContext } from "./Providers/CompanyParameters";
import DarkModeSwitcher from "@/components/Utils/darkModeSwitcher";
import ToastList from "@/components/Utils/ToastList";
import { IToast, defaultSuccessToast } from "@/interfaces/IToast";
import { ILocal } from "@/interfaces/ILocal";

interface ILocalList {
  value: string | number;
  text: string;
}
interface IBodegaList {
  value: string | number;
  text: string;
}
export default function paramsConfiguracion() {
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;

  const [localesList, setLocalesList] = useState<ILocalList[]>([]);
  const [bodegasList, setBodegasList] = useState<IBodegaList[]>([]);

  const [bodegaID, setBodegaID] = useState(0);
  const [bodegaName, setBodegaName] = useState("");

  const [localesTotales, setLocalesTotales] = useState<ILocal[]>([]);
  const [localID, setLocalID] = useState(0);
  const [localName, setLocalName] = useState("");
  //const [mesP, setMesP] = useState(0);
  //const [periodoP, setPeriodoP] = useState(0);
  const [usuario, setUsuario] = useState("");

  const {
    marcarCambios,
    cambiosItem,
    datosCargados,
    local,
    localNombre,
    bodega,
  } = useCompanyParamsContext();

  const [toasts, setToasts] = useState<IToast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stringValue = localStorage.getItem(
          SESSION_NAMES.USER_NAME
        ) as string;
        const usuario = stringValue.replace(/^"(.*)"$/, "$1");
        setUsuario(usuario);
        console.log("primer locales parametros");

        const localesResponse = await axios.get(`/api/locales`, {
          headers: getHeaders(),
        });
        console.log("primer locales usuarios parametros");
        setLocalesTotales(localesResponse.data);
        setLocalesList(
          localesResponse.data.map((item: any) => {
            let newData = {
              value: item.codigo,
              text: `(${item.codigo}) ${item.nombre}`,
            };
            return newData;
          })
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (datosCargados === true) {
      fetchData();
    }
  }, [datosCargados]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log("cambios item parametros");
  //     try {
  //       const localesResponse = await axios.get(`/api/locales`, {
  //         headers: getHeaders(),
  //       });
  //       setLocalesTotales(localesResponse.data);
  //       const localElegida = localesResponse.data.find(
  //         (index) => index.codigo === Number(localID)
  //       );
  //       localStorage.setItem(
  //         "ItemesLocal",
  //         JSON.stringify(localElegida?.usarItemsLocal)
  //       );
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };
  //   if (cambiosItem != 0) {
  //     fetchData();
  //   }
  // }, [cambiosItem]);

  useEffect(() => {
    if (
      Number(local) != 0 &&
      localNombre != "" &&
      Number(bodega) != 0 &&
      //Number(periodo) != 0 &&
      // Number(mes) != 0 &&
      local != "null" &&
      localNombre != "null" &&
      bodega != "null"
      //periodo != "null" &&
    ) {
      setLocalID(Number(local));
      setLocalName(localNombre);
      setBodegaID(Number(bodega));
      setBodegaName(bodegaName);
      // setMesP(Number(mes));
      // setPeriodoP(Number(periodo));
      return;
    }

    // const getDataRegistro = async () => {
    //   console.log("cambios localesList parametros");
    //   try {
    //     const lastRegistroResponse = await axios.get(
    //       `/api/usuarios/lastRegistro`,
    //       {
    //         params: { usuario: usuario },
    //         headers: getHeaders(),
    //       }
    //     );

    //     const lastRegistroData = lastRegistroResponse.data as Registro;

    //     if (lastRegistroData) {
    //       setLocalID(lastRegistroData.local);
    //       setPeriodoP(lastRegistroData.periodo);
    //       setMesP(lastRegistroData.mes);

    //       if (lastRegistroData.local !== 0) {
    //         const c_local = localesList.find(
    //           (value) =>
    //             String(value.value) === String(lastRegistroData.local)
    //         );
    //         setLocalName(c_local?.text || "");
    //       }
    //     } else {
    //       // Manejar el caso en que lastRegistroData es null
    //       console.error("Error: lastRegistroData is null");
    //     }
    //   } catch (error) {
    //     console.error("Fetch lastRegistro error:", error);
    //   }
    // };

    // if (localesList.length != 0) {
    //   getDataRegistro();
    // }
  }, [localesList]);

  const obtenerBodegas = async (localSeleccionado: string | number) => {
    await axios
      .get("/api/bodegas", {
        params: { local: localSeleccionado },
        headers: getHeaders(),
      })
      .then((response) => {
        setBodegasList(
          response.data.map((item: any) => {
            let newData = {
              value: item.codigo,
              text: `(${item.codigo}) ${item.nombre}`,
            };
            return newData;
          })
        );



      })
      .catch((err) => { });

    // try {
    //   const response = await axios.post(
    //     "/api/usuarios/addRegistro",
    //     { localSeleccionado },
    //     {
    //       headers: getHeaders(),
    //     }
    //   );
    //   if (response.data === "Error") {
    //     throw new Error("Error en la petición.");
    //   }
    // } catch (error) {
    //   throw error;
    // }

  };

  // async function sendRequest(data: any) {
  //   const fechaActual = new Date();

  //   const registro = {
  //     equipo: "equipo web",
  //     fecha: fechaActual,
  //     usuario: usuario,
  //     local: localID,
  //     sucursal: 0,
  //     periodo: periodoP,
  //     mes: mesP,
  //     menu: "Establecer perfil",
  //     opcion: "?",
  //   };

  //   try {
  //     const response = await axios.post(
  //       "/api/usuarios/addRegistro",
  //       { registro },
  //       {
  //         headers: getHeaders(),
  //       }
  //     );
  //     if (response.data === "Error") {
  //       throw new Error("Error en la petición.");
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    try {
      localStorage.setItem(SESSION_NAMES.EMPRESA_ID, String(localID));
      localStorage.setItem(SESSION_NAMES.EMPRESA_NAME, localName);
      localStorage.setItem(SESSION_NAMES.BODEGA_ID, String(bodega));

      const localElegida = localesTotales.find(
        (index) => index.codigo === localID
      );
      // localStorage.setItem(
      //   "ItemesLocal",
      //   String(localElegida?.usarItemsLocal)
      // );
      marcarCambios();
      setToasts([...toasts, defaultSuccessToast]);
      //await sendRequest(e);
    } catch (error) {
      console.error("Error en el envío de la solicitud:", error);
    }
  };

  return (
    <div className="flex w-full">
      <form className="grid grid-flow-col justify-between w-full gap-2">
        <div className="flex items-center mr-3 w-full">
          <label className=" mr-1 dark:text-white text-gray-700 text-l font-bold">
            Locales:
          </label>
          <Select
            name="Local"
            className="px-5 w-full"
            options={localesList}
            error={false}
            selected={localID}
            onChange={(e: any) => {
              setLocalID(e.target.value);
              setLocalName(e.target.selectedOptions[0].text);
              obtenerBodegas(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center mr-3 w-full">
          <label className=" mr-1 dark:text-white text-gray-700 text-l font-bold">
            Bodegas:
          </label>
          <Select
            name="Bodega"
            className="px-5 w-full"
            options={bodegasList}
            error={false}
            selected={bodegaID}
            onChange={(e: any) => {
              setBodegaID(e.target.value);
              setBodegaName(e.target.selectedOptions[0].text);
            }}
          />
        </div>
        <div className="flex items-center mr-3">
          {/* <label className=" mr-1 dark:text-white text-gray-700 text-l font-bold">
            Mes:
          </label>
          <Input
            type="number"
            name="month"
            className="w-20 mb-1 mr-3"
            value={mesP}
            onChange={(e) => {
              const inputValue = Math.max(
                1,
                Math.min(12, parseInt(e.target.value, 10))
              );
              setMesP(inputValue);
            }}
            error={false}
            required
          />
          <label className=" mr-1 dark:text-white text-gray-700 text-l font-bold">
            Año:
          </label>
          <Input
            type="number"
            className="w-20 mb-1 mr-3"
            name="year"
            value={periodoP}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Validar que solo sean números
              if (/^[0-9]*$/.test(inputValue)) {
                // Limitar la longitud del valor a 4 caracteres
                const truncatedValue = inputValue.slice(0, 4);
                setPeriodoP(Number(truncatedValue));
              }
            }}
            error={false}
            required
          /> */}
          <button
            onClick={handleSubmit}
            className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
            disabled={toasts.length > 0}
          >
            Guardar
          </button>
          <div className="bg-yellow-200 dark:bg-gray-900 p-1  ml-3 rounded-md shadow-md">
            <DarkModeSwitcher />
          </div>
        </div>
      </form>
      <ToastList toasts={toasts} setToasts={setToasts} />
    </div>
  );
}
