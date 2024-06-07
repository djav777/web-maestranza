export interface ITipoDocumento{
    referencia: number;
    libro: "C" | "H" | "V" | '';
    codigo: number;
    cuenta: number;
    nombre: string;
    sigla: string;
    retencion: number;
    electronico: number;
}