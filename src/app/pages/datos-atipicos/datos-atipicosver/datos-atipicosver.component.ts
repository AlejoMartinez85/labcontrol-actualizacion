import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosAtipicosService } from '../../../services/datos-atipicos/datos-atipicos.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import { DatosAtipicos } from '../../../models/datos-atipicos';
import { mean, sampleStandardDeviation, min, max } from 'simple-statistics';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-datos-atipicosver',
  templateUrl: './datos-atipicosver.component.html',
  styleUrls: ['./datos-atipicosver.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class DatosAtipicosverComponent implements OnInit {

  $identificador;
  datoAtipico: DatosAtipicos;
  valoresDatoAtipico = [];
  tituloListado = '';
  preloader = true;
  columns;
  activaGuardar = false;
  promedio = 0;
  desviacion = 0;
  Gmin = 0;
  Gmax = 0;
  Gcrit = 0;
  ValoresNew = [];
  dataTable = {
    3: [1.15, 1.15, 1.15, 1.15],
    4: [1.42, 1.44, 1.46, 1.48],
    5: [1.6, 1.64, 1.67, 1.71],
    6: [1.73, 1.77, 1.82, 1.89],
    7: [1.83, 1.88, 1.94, 2.02],
    8: [1.91, 1.96, 2.03, 2.13],
    9: [1.98, 2.04, 2.11, 2.21],
    10: [2.03, 2.1, 2.18, 2.29],
    11: [2.09, 2.14, 2.23, 2.36],
    12: [2.13, 2.2, 2.29, 2.41],
    13: [2.17, 2.24, 2.33, 2.46],
    14: [2.21, 2.28, 2.37, 2.51],
    15: [2.25, 2.32, 2.41, 2.55],
    16: [2.28, 2.35, 2.44, 2.59],
    17: [2.31, 2.38, 2.47, 2.62],
    18: [2.34, 2.41, 2.5, 2.65],
    19: [2.36, 2.44, 2.53, 2.68],
    20: [2.38, 2.46, 2.56, 2.71],
    21: [0, 0, 2.58, 2.73],
    22: [0, 0, 2.6, 2.76],
    23: [0, 0, 2.62, 2.78],
    24: [0, 0, 2.64, 2.8],
    25: [0, 0, 2.66, 2.82],
    26: [0, 0, 2.68, 2.84],
    27: [0, 0, 2.7, 2.86],
    28: [0, 0, 2.72, 2.88],
    29: [0, 0, 2.73, 2.9],
    30: [0, 0, 2.75, 2.91],
    31: [0, 0, 2.76, 2.93],
    32: [0, 0, 2.78, 2.95],
    33: [0, 0, 2.79, 2.96],
    34: [0, 0, 2.81, 2.97],
    35: [0, 0, 2.82, 2.98],
    36: [0, 0, 2.83, 2.992],
    37: [0, 0, 2.84, 3.004],
    38: [0, 0, 2.85, 3.016],
    39: [0, 0, 2.86, 3.028],
    40: [0, 0, 2.87, 3.04],
    41: [0, 0, 2.88, 3.05],
    42: [0, 0, 2.89, 3.06],
    43: [0, 0, 2.9, 3.07],
    44: [0, 0, 2.91, 3.08],
    45: [0, 0, 2.92, 3.09],
    46: [0, 0, 2.928, 3.098],
    47: [0, 0, 2.936, 3.106],
    48: [0, 0, 2.944, 3.114],
    49: [0, 0, 2.952, 3.122],
    51: [0, 0, 2.967, 3.137],
    52: [0, 0, 2.974, 3.144],
    53: [0, 0, 2.981, 3.151],
    54: [0, 0, 2.988, 3.158],
    55: [0, 0, 2.995, 3.165],
    56: [0, 0, 3.002, 3.172],
    57: [0, 0, 3.009, 3.179],
    58: [0, 0, 3.016, 3.186],
    59: [0, 0, 3.023, 3.193],
    60: [0, 0, 3.03, 3.2],
    61: [0, 0, 3.036, 3.206],
    62: [0, 0, 3.042, 3.212],
    63: [0, 0, 3.048, 3.218],
    64: [0, 0, 3.054, 3.224],
    65: [0, 0, 3.06, 3.23],
    66: [0, 0, 3.066, 3.236],
    67: [0, 0, 3.072, 3.242],
    68: [0, 0, 3.078, 3.248],
    69: [0, 0, 3.084, 3.254],
    70: [0, 0, 3.09, 3.26],
    71: [0, 0, 3.095, 3.265],
    72: [0, 0, 3.1, 3.27],
    73: [0, 0, 3.105, 3.275],
    74: [0, 0, 3.11, 3.28],
    75: [0, 0, 3.115, 3.285],
    76: [0, 0, 3.12, 3.29],
    77: [0, 0, 3.125, 3.295],
    78: [0, 0, 3.13, 3.3],
    79: [0, 0, 3.135, 3.305],
    80: [0, 0, 3.14, 3.31],
    81: [0, 0, 3.144, 3.314],
    82: [0, 0, 3.148, 3.318],
    83: [0, 0, 3.152, 3.322],
    84: [0, 0, 3.156, 3.326],
    85: [0, 0, 3.16, 3.33],
    86: [0, 0, 3.164, 3.334],
    87: [0, 0, 3.168, 3.338],
    88: [0, 0, 3.172, 3.342],
    89: [0, 0, 3.176, 3.346],
    90: [0, 0, 3.18, 3.35],
    91: [0, 0, 3.183, 3.353],
    92: [0, 0, 3.186, 3.356],
    93: [0, 0, 3.189, 3.359],
    94: [0, 0, 3.192, 3.362],
    95: [0, 0, 3.195, 3.365],
    96: [0, 0, 3.198, 3.368],
    97: [0, 0, 3.201, 3.371],
    98: [0, 0, 3.204, 3.374],
    99: [0, 0, 3.207, 3.377],
    100: [0, 0, 3.21, 3.38],
  };
  eliminar = true;
  constructor(
    private router: ActivatedRoute,
    private datosAtipicos: DatosAtipicosService,
    private notificationService: NotificationService) {
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.columns = [
      { name: 'Valor', prop: 'Valor' },
      { name: 'Opciones', prop: 'Opciones' }
    ];
  }
  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
  }
  closeModal(element) {
    document.querySelector('#' + element).classList.remove('md-show');
  }
  ngOnInit() {
    this.cargarDatosAtipicos();
  }
  addValorCampo(valor) {
    const valorModific = valor.value.replace(',', '.');
    this.ValoresNew.push(parseFloat(valorModific));
  }

  removeValor(index: number) {
    const i = this.ValoresNew.indexOf(index);
    this.ValoresNew.splice(i, 1);
  }
  data(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');

    row_data.forEach(valor => {
      valor = valor.replace(',', '.');
      this.ValoresNew.push(parseFloat(valor));
    });
  }
  editarDato(row) {
    this.preloader = true;
    const valor = {
      valor: parseFloat(row.valor)
    }
    this.datosAtipicos.updateValorDatosAtipicos(row._id, valor).subscribe(resp => {
      if (resp.success) {
        this.calcular();
      }
    })
  }
  deleteDato(row) {
    this.preloader = true;
    this.datosAtipicos.deleteValorDatosAtipicos(row).subscribe(resp => {
      if (resp.success) {
        this.calcular();
      }
    });
  }
  cargarDatosAtipicos() {
    this.valoresDatoAtipico = [];
    this.datosAtipicos.getAllDatosAtipicosID(this.$identificador).subscribe(dato => {
      this.datoAtipico = dato['dato'];
      this.notificationService.addNotify({ title: 'Datos Atípicos', msg: dato['message'], type: 'success' });
      this.preloader = false;
    });
    this.datosAtipicos.getAllValorDatosAtipicos(this.$identificador).subscribe(valores => {
      this.tituloListado = valores['message'];
      this.valoresDatoAtipico = valores['datos'];
      if (this.valoresDatoAtipico.length <= 3) {
        this.eliminar = false;
      }
    });
  }
  calcular() {
    const valores = [];
    this.valoresDatoAtipico.forEach(element => {
      valores.push(element.valor)
    });
    this.promedio = parseFloat(mean(valores).toFixed(2));
    this.desviacion = parseFloat(sampleStandardDeviation(valores).toFixed(2));
    this.Gmin = (Math.abs(min(valores) - this.promedio)) / this.desviacion;
    this.Gmax = (Math.abs(max(valores) - this.promedio)) / this.desviacion;
    if (this.datoAtipico.niverConfianza === 90) {
      this.Gcrit = this.dataTable[this.valoresDatoAtipico.length][0];
    }
    if (this.datoAtipico.niverConfianza === 92.5) {
      this.Gcrit = this.dataTable[this.valoresDatoAtipico.length][1];
    }
    if (this.datoAtipico.niverConfianza === 95) {
      this.Gcrit = this.dataTable[this.valoresDatoAtipico.length][2];
    }
    if (this.datoAtipico.niverConfianza === 97.5) {
      this.Gcrit = this.dataTable[this.valoresDatoAtipico.length][3];
    }
    const datoAtipico = {
      nombre: this.datoAtipico.nombre,
      niverConfianza: this.datoAtipico.niverConfianza,
      promedio: this.promedio,
      desviacion: this.desviacion,
      n: this.valoresDatoAtipico.length,
      Gmin: this.Gmin,
      Gmax: this.Gmax,
      Gcrit: this.Gcrit
    };
    this.datosAtipicos.updateDatosAtipicos(this.$identificador, datoAtipico).subscribe(valor => {
      this.cargarDatosAtipicos();
    });
  }
  guardar() {
    this.ValoresNew.forEach(resp => {
      this.datosAtipicos.addValorDatosAtipicos({ valor: resp, id_datoAtipico: this.$identificador }).subscribe(valorAtipicoDato => {
        this.cargarDatosAtipicos();
      });
    });
  }
}
