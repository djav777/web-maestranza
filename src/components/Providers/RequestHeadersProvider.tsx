"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export interface RequestHeadersContextType {
  updateHeaders: (newHeaders: Record<string, string>) => void;
  getHeaders: () => Record<string, string>;
  setToken: (newToken: string) => void;
}

export const RequestHeadersContext = createContext<
  RequestHeadersContextType | undefined
>(undefined);

interface RequestHeadersProviderProps {
  children: ReactNode;
}

export const RequestHeadersProvider: React.FC<RequestHeadersProviderProps> = ({
  children,
}) => {
  const initialToken =
    typeof secureLocalStorage !== "undefined"
      ? secureLocalStorage.getItem("token") || ""
      : "";
  const defaultHeaders = {
    Authorization: `Bearer ${initialToken}`,
    "Content-Type": "application/json",
  };

  const dynamicHeaders: Record<string, string> = {};
  const [token, setToken] = useState(initialToken);

  const updateHeaders = (newHeaders: Record<string, string>) => {
    Object.assign(dynamicHeaders, newHeaders);
  };

  const getHeaders = () => {
    return {
      ...defaultHeaders,
      ...dynamicHeaders,
    };
  };

  useEffect(() => {
    // Update headers whenever the token changes
    defaultHeaders.Authorization = `Bearer ${token}`;
    secureLocalStorage.setItem("token", token);
  }, [token]);

  return (
    <RequestHeadersContext.Provider
      value={{ updateHeaders, getHeaders, setToken }}
    >
      {children}
    </RequestHeadersContext.Provider>
  );
};
