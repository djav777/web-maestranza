"use client";
import { useEffect, useState, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import ToastList from "./Utils/ToastList";
import { IToast } from "@/interfaces/IToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import axios from "axios";

import { KeyIcon } from "@heroicons/react/24/solid";


import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "./Providers/RequestHeadersProvider";
import { SESSION_NAMES } from "@/variablesglobales";

const Login = () => {
  const router = useRouter();
  const { getHeaders } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isRememember, setRememberMe] = useState(false);
  const [isFalied, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toasts, setToasts] = useState<IToast[]>([]);

  useEffect(() => {
    var password = secureLocalStorage.getItem("password");

    setPassword(password !== null ? JSON.parse(String(password)) : "");

    const token = secureLocalStorage.getItem("token");
    const user = String(localStorage.getItem("user"))!.replace(/"/g, "");
    const usuario_ = String(
      localStorage.getItem(SESSION_NAMES.USER_NAME)
    )!.replace(/"/g, "");

    if (user != undefined && user != null && user != "null" && user != "") {
      console.log(user);
      setUsuario(user);
    }

    if (!token || token === "" || token === null || token === "null") {
      router.push("/");
    }

    if (
      usuario_ != undefined &&
      usuario_ != null &&
      usuario_ != "" &&
      usuario_ != "null"
    ) {
      router.push("/dashboard/cuentas");
    }
  }, []);

  const ingresar = async () => {
    if (
      localStorage.getItem("user") != null &&
      usuario != String(localStorage.getItem("user"))!.replace(/"/g, "")
    ) {
      localStorage.removeItem(SESSION_NAMES.EMPRESA_ID);
      localStorage.removeItem(SESSION_NAMES.EMPRESA_NAME);
      localStorage.removeItem(SESSION_NAMES.BODEGA_ID);
    }

    if (isRememember) {
      localStorage.setItem("user", JSON.stringify(usuario));
      secureLocalStorage.setItem("password", JSON.stringify(password));
    }

    try {
      setLoading(true);
      console.log("hola");
      debugger;
      axios
        .post(
          "/api/login",
          {},
          {
            params: { codigo: usuario, clave: password },
            headers: getHeaders(),
          }
        )
        .then((response) => {
          if (response.data === true) {
            localStorage.setItem(
              SESSION_NAMES.USER_NAME,
              JSON.stringify(usuario)
            );
            setLoading(false);
            router.push("/dashboard/cuentas");
          } else {
            setPassword("");
            setFailed(true);
            const newToast: IToast = {
              id: Date.now(),
              message: "Usuario o contraseña incorrectos.",
              duration: 3000,
              type: "danger",
            };
            setLoading(false);
            setToasts([...toasts, newToast]);
          }
        })
        .catch((error) => {
          setPassword("");
          setFailed(true);
          const newToast: IToast = {
            id: Date.now(),
            message: "Error Conexion.",
            duration: 3000,
            type: "danger",
          };
          setLoading(false);
          setToasts([...toasts, newToast]);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRememberChange = () => {
    setRememberMe(!isRememember);
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md grid w-1/4">
      <div className="mb-4">
        <span className="text-xl">Acceso Usuario</span>
      </div>

      <div className="w-full md:w-full px-3 mb-6">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Usuario
        </label>
        <Input
          className="block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
          name="user"
          placeholder="Usuario"
          value={usuario}
          onChange={(evento) => {
            setUsuario(evento.target.value);
          }} // onchage responde con un evento
        />
      </div>

      <div className="w-full md:w-full px-3 mb-2">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Contraseña
        </label>
        <Input
          className="block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(evento) => {
            setPassword(evento.target.value);
          }} // onchage responde con un evento
        />
      </div>

      <div className="w-full flex items-center justify-between px-3 mb-3 ">
        <label htmlFor="remember" className="flex items-center w-1/2">
          <input
            onChange={handleRememberChange}
            type="checkbox"
            name=""
            id=""
            className="mr-1 bg-white shadow"
          />
          <span className="text-sm text-gray-700">Recuérdame</span>
        </label>
      </div>

      <ToastList
        toasts={toasts}
        position="bottom-right"
        setToasts={setToasts}
      />

      <div className="w-full md:w-full px-3 mb-2">
        <Button
          onClick={ingresar}
          className="text-white w-full bg-black hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-amber-300 text-sm px-5 py-2.5 text-center mt-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        ><KeyIcon className="w-4 h-4" />
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
          {!loading && <span className="text-lg font-semibold">Ingresar</span>}
        </Button>
      </div>
    </section>
  );
};

export default Login;
