import { Muestra } from './muestra';
import { EnsayoParametro } from './ensayo_parametro';
import { Reporte } from './reporte';

export class Ensayo {
    _id: number;
    codigo: string;
    numerofactura: string;
    fsolicitud: any;
    cliente: any;
    nombreCliente: any;
    descripcion: string;
    logicalerasure: Boolean;
    muestras: Muestra[];
    subtotal: number;
    paso: number;
    informPublicado: boolean;
    fpublicacion: any;
    fpago: any;
    piva: number;
    iva: number;
    total: number;
    parametros: EnsayoParametro[];
    codigoOrden: string;
    fEnsayo: any;
    fEntrega: any;
    descripcionOrden: string;
    fFacturado: any;
    fVencimiento: any;
    ispago: Boolean;
    isradicado: Boolean;
    reporte: Reporte;
    tercero: any;
    vigente: Boolean;
    estado: string;
    archivos: any[];
    descripcionpago: string;
    creocli: Boolean;
    creolab: Boolean;
    descripcioninforme: string;
    fCompletado: any;
    totalmuestras: any;
    encReporte: string;
    pieReporte: string;
    urlPdf: string;
    subidaPdfManual: Boolean;
    Estructura: Boolean;
    editarBody:Boolean;
    bodyReporte:string;
}
