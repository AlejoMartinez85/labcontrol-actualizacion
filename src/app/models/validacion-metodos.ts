export class ValidacionMetodo {
    nombre: string;
    niveles_de_adicion_por_muestra: string;
    recuperacion: string;
    cantidadBlancos: number;
    cantidadEstandares: number;
    cantidadMuestras: number;
    NivelesAdicionMuestra: string;
    NumeroDias: number;
    NumeroDuplicados: number;
    Recuperacion: boolean;
    linealidad: boolean;
    sencibilidad: boolean;
    limite_deteccion: boolean;
    limite_cuantificacion: boolean;
    exactitud: boolean;
    presicion_repetitibilidad: boolean;
    presicion_producivilidad: boolean;
    recuperacion_matriz: boolean;
    robustez: boolean;
    intervalodetrabajo: boolean;
    banco_muestras: boolean;
    estandar_medio: number;
    duplicados_por_dia: number;
    estandar_bajo: number;
    estandar_alto: number;
    recuperacion_M1ab: number;
    recuperacion_M1aa: number;
    recuperacion_M2ab: number;
    recuperacion_M2aa: number;
    recuperacion_M3ab: number;
    recuperacion_M3aa: number;
    nivel: number;
    Bk1: Variable[];
    Bk2: Variable[];
    Bk3: Variable[];
    Bk4: Variable[];
    Bk5: Variable[];
    Ea: Variable[];
    Eb: Variable[];
    Em: Variable[];
    M1: Variable[];
    M1Aa: Variable[];
    M1Ab: Variable[];
    M2: Variable[];
    M2Aa: Variable[];
    M2Ab: Variable[];
    M3: Variable[];
    M3Aa: Variable[];
    M3Ab: Variable[];
    tercero: string;
}

export class Variable {
    valor: number;
}