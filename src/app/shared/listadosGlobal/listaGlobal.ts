import { Injectable } from '@angular/core';

export interface OptionList {
  label: string;
  value: string;
  disabled: boolean;
}

const TIPO_DISTRIBUCION = [
  { label: 'Normal', value: 'Normal', disabled: false },
  { label: 'Triangular', value: 'Triangular', disabled: false },
  { label: 'Rectangular', value: 'Rectangular', disabled: false },
  { label: 'Otra', value: 'Otra', disabled: false }
];

const FRECUENCIA_CALIBRACION = [
  { label: 'Dias', value: 'Dias', disabled: false },
  { label: 'Semanas', value: 'Semanas', disabled: false },
  { label: 'Meses', value: 'Meses', disabled: false },
  { label: 'Año', value: 'Año', disabled: false }
];

const TIPO_INCERTIDUMBRE = [
  { label: 'Tipo A', value: 'Tipo A', disabled: false },
  { label: 'Tipo B', value: 'Tipo B', disabled: false }
];
const TIPO_CONDICION = [
  { label: 'Mayor', value: 'Mayor', disabled: false },
  { label: 'Menor', value: 'Menor', disabled: false },
  { label: 'Mayor igual', value: 'Mayor igual', disabled: false },
  { label: 'Menor igual', value: 'Menor igual', disabled: false },
  { label: 'Igual a', value: 'Igual a', disabled: false },
  { label: 'Diferente de', value: 'Diferente de', disabled: false },
  { label: 'Está entre', value: 'Está entre', disabled: false },
  { label: 'No está entre', value: 'No está entre', disabled: false }
];
const TIPO_RESULTADO = [
  { label: 'Entonces', value: 'Entonces', disabled: false },
  { label: 'y', value: 'y', disabled: false },
  { label: 'o', value: 'o', disabled: false }
];

@Injectable({
  providedIn: 'root'
})
export class ListaGlobal {
  getTipoDistribucion(): OptionList[] {
    return TIPO_DISTRIBUCION;
  }

  getFrecuenciaCalibracion(): OptionList[] {
    return FRECUENCIA_CALIBRACION;
  }

  getTipoIncertidumbre(): OptionList[] {
    return TIPO_INCERTIDUMBRE;
  }
  getTipocondicion(): OptionList[] {
    return TIPO_CONDICION;
  }
  getTipOResultado(): OptionList[] {
    return TIPO_RESULTADO;
  }

}
