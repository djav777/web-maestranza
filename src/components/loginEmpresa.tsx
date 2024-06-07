"use client";
import { useEffect, useState, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import ToastList from "./Utils/ToastList";
import { IToast } from "@/interfaces/IToast";
import axios from "axios";
import {
  RequestHeadersContext,
  RequestHeadersContextType,
} from "./Providers/RequestHeadersProvider";
import logo from "../../public/images/opencodeicon.png";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { Mail } from "lucide-react"
const LoginEmpresa = () => {
  const router = useRouter();
  const { setToken } = useContext(
    RequestHeadersContext
  ) as RequestHeadersContextType;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememember, setRememberMe] = useState(false);
  const [isFailed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<IToast[]>([]);

  useEffect(() => {
    var user = localStorage.getItem("user-cmp");
    var password = secureLocalStorage.getItem("password-cmp");
    setEmail(user !== null ? JSON.parse(user) : "");
    setPassword(password !== null ? JSON.parse(String(password)) : "");
    const token = String(secureLocalStorage.getItem("token"))!.replace(
      /"/g,
      ""
    );
    console.log(token);
    if (token != "" && token != undefined && token != null && token != "null") {
      router.push("/login");
    }
  }, []);

  const ingresar = async () => {
    if (isRememember) {
      localStorage.setItem("user-cmp", JSON.stringify(email));
      secureLocalStorage.setItem("password-cmp", JSON.stringify(password));
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/loginEmpresa",
        {},
        {
          params: { email: email, password: password },
        }
      );

      if (response.data === "Error login Empresa") {
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
      } else {
        setToken(response.data);
        setLoading(false);

        router.push("/login");
      }
    } catch (error) {
      // Manejar errores de axios o cualquier error que ocurra durante la solicitud
      console.error("Error durante la solicitud:", error);

      setPassword("");
      setFailed(true);
      const newToast: IToast = {
        id: Date.now(),
        message: "Error al realizar la solicitud.",
        duration: 3000,
        type: "danger",
      };
      setToasts([...toasts, newToast]);
      setLoading(false);
    }
  };

  const handleRememberChange = () => {
    setRememberMe(!isRememember);
  };

  const handleOnClose = () => {
    setFailed(false);
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md grid w-1/4">
      <div className="flex justify-center">
        <Image src={logo} alt="Opencode logo" className="w-40" />
      </div>

      <div className="mb-4 text-center">
        <span className="text-xl">Iniciar Sesión</span>
      </div>

      <div className="w-full md:w-full px-3 mb-6">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Correo
        </label>

        <Input
          className="block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
          name="user"
          placeholder="correo@dominio.com"
          value={email}
          onChange={(evento) => {
            setEmail(evento.target.value);
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

      <div className="w-full md:w-full px-3 mb-2">
        <Button className="text-white w-full bg-amber-500 hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-amber-300"
          onClick={ingresar}>
          <Mail className="mr-2 h-4 w-4" />
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

      <ToastList
        toasts={toasts}
        setToasts={setToasts}
        position="bottom-right"
      />
    </section>
  );
};

export default LoginEmpresa;
