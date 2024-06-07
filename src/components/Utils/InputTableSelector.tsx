import { title } from "process";
import { ChangeEvent, FC } from "react";

interface InputTableSelectorProps {
  onClick: () => void;
  label: string;
  description?: any;
  deshabilitado?: boolean;
  error?: boolean;
  className?: string;
}

const InputTableSelector: FC<InputTableSelectorProps> = ({
  onClick,
  label,
  description = "",
  error = false,
  deshabilitado = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        className="block text-gray-700 dark:text-yellow-200  text-sm font-bold mb-2"
        htmlFor={label}
      >
        {label}
      </label>
      <div
        className={
          "rounded-md  text-sm dark:bg-slate-700" +
          (error ? " border border-red-500" : "")
        }
      >
        <div className="flex  w-full items-centers">
          <span className="shadow  w-full appearance-none border p-2 rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  flex-grow  whitespace-normal">
            {description}
          </span>
          <div className="p-2">
            <button
              className={`bg-blue-500  py-1 px-3 rounded-md text-white ${
                deshabilitado
                  ? "disabled:opacity-50 disabled:cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              disabled={deshabilitado}
              onClick={onClick}
            >
              ...
            </button>
          </div>
        </div>
      </div>
      {error && (
        <p className="error text-right text-red-500">
          ¡Campo no puede estar vacio!
        </p>
      )}
    </div>
  );
};

export default InputTableSelector;
