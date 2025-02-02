import { kMaxLength } from "buffer";
import { ChangeEvent, FC, InputHTMLAttributes } from "react";

interface InputProps {
  type: "text" | "number" | "email" | "password";
  label?: string;
  value: string | number | undefined;
  name: string;
  className?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  size?: string;
  readOnly?: boolean;
}

const Input: FC<InputProps> = ({
  className,
  type,
  label,
  value,
  name,
  placeholder = "",
  error,
  disabled,
  onChange,
  required,
  maxLength,
  size = "lg",
  readOnly,
}) => {
  const sizeTitleClass = size === "md" ? "mb-1" : "mb-2";
  const sizeInputClass = size === "md" ? "px-2 py-1 text-sm" : "px-3 py-2";

  const titleClass =
    "block text-gray-700 text-sm dark:text-yellow-200 font-bold " +
    sizeTitleClass;
  const inputClass =
    "shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " +
    sizeInputClass +
    (error ? " border-red-500" : "") +
    (className ? ` ${className}` : "");

  return readOnly ? (
    <div className="input-wrapper">
      <label className={titleClass} htmlFor={name}>
        {label}
      </label>

      <input
        className={inputClass}
        type={type}
        id={name}
        value={value ?? ""}
        name={name}
        onFocus={(evento) => evento.target.select()}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        readOnly
      />

      {error && (
        <p className="error text-right text-red-500">
          ¡Campo no puede estar vacio!
        </p>
      )}
    </div>
  ) : (
    <div className="input-wrapper">
      <label className={titleClass} htmlFor={name}>
        {label}
      </label>

      <input
        className={inputClass}
        type={type}
        id={name}
        value={value ?? ""}
        name={name}
        onFocus={(evento) => evento.target.select()}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
      />

      {error && (
        <p className="error text-right text-red-500">
          ¡Campo no puede estar vacio!
        </p>
      )}
    </div>
  );
};

export default Input;
