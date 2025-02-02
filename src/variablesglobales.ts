export const API_MAESTRANZA = "http://localhost:5032/api";
export type ActionType = "UPDATE" | "CREATE" | "DELETE";
export const UPDATE_ACTION: ActionType = "UPDATE";
export const CREATE_ACTION: ActionType = "CREATE";
export const DELETE_ACTION: ActionType = "DELETE";

export const NO_OPTION: string = "NO_OPTION";
export const ERROR_CODE_EXISTS: string = "Código ya existe en la tabla";

export const SESSION_NAMES = {
  EMPRESA_ID: "EMPRESA_ID",
  EMPRESA_NAME: "EMPRESA_NAME",
  BODEGA_ID: "BODEGA_ID",
  USER_NAME: "USER_NAME"
}

export function formatNumber(number: number | string) {
  return number.toString().replace(/^(\d)(\d)(\d)(\d)$/, '$1-$2-$3$4');
}

export function formatToNumbersOnly(input: string): string {
  const numericCharacters = input.match(/\d/g);
  return numericCharacters ? numericCharacters.join('') : '';
}

export function formatToFloatOnly(input: string): string {
  const numericCharacters = input.match(/\d+(\.\d+)?/g);
  return numericCharacters ? numericCharacters.join('') : '';
}

export function formatRut(rut: string) {

  rut = rut.replace(/[^\dK]/gi, '');
  rut = rut.replace(/^(\d{1,10})(\w{1})$/, '$1-$2');

  return rut;
}

export function formatNumberWithPoints(inputNumber: string) {
  // Convert the input number to a string
  inputNumber = inputNumber.toString();

  // Remove leading zeros
  inputNumber = inputNumber.replace(/^0+/, '');

  // Check if the input is empty
  if (inputNumber === '') {
    return '0';
  }
  // Split the number into whole and decimal parts
  const [wholePart, decimalPart] = inputNumber.split('.');

  // Format the whole part with commas as thousands separators
  const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine the whole and decimal parts with commas and handle the case without decimals
  const formattedNumber = decimalPart
    ? `${formattedWholePart},${decimalPart.padEnd(2, '0')}`
    : formattedWholePart;

  return formattedNumber;
}

export function separateRut(rut: string) {
  const partes = rut.split('-');
  const frut = partes[0]; // Obtiene la primera parte del RUT
  const dv = partes[1]; // Obtiene la segunda parte del RUT
  return [frut, dv];
}

export function formatDate(inputDate: any) {

  if (inputDate === "") {
    return ""
  }
  // Split the input date into components
  const dateComponents = inputDate.split('/');

  // Create a Date object using the components
  const dateObject = new Date(dateComponents[2], dateComponents[0] - 1, dateComponents[1]);

  // Format the date as YYYY-MM-DD
  const formattedDate = dateObject.toISOString().split('T')[0];

  return formattedDate;
}