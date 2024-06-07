"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";
import secureLocalStorage from "react-secure-storage";
import { SESSION_NAMES } from "@/variablesglobales";

const SessionTitle = () => {
  const [localNombre, setLocalNombre] = useState("");
  const [bodega, setBodega] = useState(0);

  useEffect(() => {
    var nombreLocal = localStorage.getItem(SESSION_NAMES.EMPRESA_NAME);
    var bodegaID = localStorage.getItem(SESSION_NAMES.BODEGA_ID);
    setLocalNombre(
      nombreLocal !== null ? JSON.parse(String(nombreLocal)) : ""
    );
    setBodega(bodegaID !== null ? JSON.parse(String(bodegaID)) : 0);
  }, []);

  return (
    <p className="text-xs text-amber-800 dark:text-gray-300">
      <Link href="/dashboard/configuracion/parametros">
        <span className="flex">
          <UserIcon className="w-4 h-4" /> {localNombre}
        </span>
        <span>Bodega: {bodega}</span>
      </Link>
    </p>
  );
};

export default SessionTitle;
