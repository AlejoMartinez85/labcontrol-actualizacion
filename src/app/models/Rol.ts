export class Rol {
    _id: string;
    nombre: string;
    tercero: string;
    __v: number;
}

export class Permisos {
    Ensayos: any[];
    Agrupacion: any[];
    Paramertros: any[];
    muestras: any[];
    usuarios: any[];
    validacion: any[];
    Equipos: any[];
    Datos: any[];
    Cartas: any[];
    Deriva: any[];
    clientes: any[];
    configReportes: any[];
    condiciones: any[];
    incertidumbre: any[];
    _id: string;
    id_role: string;
    __v: number;
}

class PermisosCampos {
    editar: boolean;
    eliminar: boolean;
    crear: boolean;
    ver: boolean;
}