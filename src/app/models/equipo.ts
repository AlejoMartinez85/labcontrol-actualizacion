export class Equipo {
    _id: number;
    nombre: String;
    variables: any;
    calibraciones: ArrConfig[];
    mantenimientos: ArrConfig[];
    fabricante: String;
    codigo: String;
    nserie: String;
    estado: String;
    fingreso: String;
    softwarefim: String;
    ubicacion: String;
    infoAdicional: String;
    infoAdicionalHeader: String;
    imagen:string;
    avisarCorreo: boolean;
    reparaciones:any;

}
export class ArrConfig {
    email: string;
    Rcada: number;
    tiempo: number;
}