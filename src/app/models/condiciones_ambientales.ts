export class CondicionesAmbientales {

    _id: string;
    name: string;
    unidad: string;
    estado: boolean;
    limite_superior: number;
    limite_inferior: number;
    promedio: number;
    desviacion: number;
    min: number;
    max: number;
    ultimoIngreso: any;
    fechaCreacion: Date;
};

export class CondicionEdit {
    name: string;
    unidad: string;
    limite_superior: number;
    limite_inferior: number;
};