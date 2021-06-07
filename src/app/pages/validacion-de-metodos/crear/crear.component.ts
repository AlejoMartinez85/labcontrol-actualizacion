import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { mean, sampleStandardDeviation, min, max } from 'simple-statistics';

import { ActivatedRoute } from '@angular/router';
import { ValidacionMetodosConfigService } from '../../../services/validacion-demetodos/validacion-metodos-config.service';
import { Validacion } from '../../../models/validacion';
import { NotificationService } from '../../../shared/notification';
import { RecuperacionService } from '../../../services/validacion-demetodos/recuperacion.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class CrearComponent implements OnInit {
  // variables Calculos
  bks1 = []; CVbks1 = 0; prombks1 = 0; Smbks1 = 0; bks2 = []; CVbks2 = 0; prombks2 = 0; Smbks2 = 0; bks3 = []; CVbks3 = 0; prombks3 = 0;
  Smbks3 = 0; bks4 = []; CVbks4 = 0; prombks4 = 0; Smbks4 = 0; bks5 = []; CVbks5 = 0; prombks5 = 0; Smbks5 = 0; Ebs = []; CVEbs = 0;
  promEbs = 0; SmEbs = 0; Ems = []; CVEms = 0; promEms = 0; SmEms = 0; Eas = []; CVEas = 0; promEas = 0; SmEas = 0; Ms1 = []; CVMs1 = 0;
  promMs1 = 0; SmMs1 = 0; Ms1Ab = []; CVMs1Ab = 0; promMs1Ab = 0; SmMs1Ab = 0; Ms1Aa = []; CVMs1Aa = 0; promMs1Aa = 0; SmMs1Aa = 0;
  Ms2 = []; CVMs2 = 0; promMs2 = 0; SmMs2 = 0; Ms2Ab = []; CVMs2Ab = 0; promMs2Ab = 0; SmMs2Ab = 0; Ms2Aa = []; CVMs2Aa = 0; promMs2Aa = 0;
  SmMs2Aa = 0; Ms3 = []; CVMs3 = 0; promMs3 = 0; SmMs3 = 0; Ms3Ab = []; CVMs3Ab = 0; promMs3Ab = 0; SmMs3Ab = 0; Ms3Aa = []; CVMs3Aa = 0;
  promMs3Aa = 0; SmMs3Aa = 0; porcentajeRaABm1 = []; porcentajeRaAAm1 = []; porcentajeRaABm2 = []; porcentajeRaAAm2 = [];
  porcentajeRaABm3 = []; porcentajeRaAAm3 = [];
  /**
   *
   * Variables de validación
   *
   */
  exactitudb = 0; exactitudbpor = 0; exactitudr = 0; exactitudrpor = 0; arrayCalc = []; promrecnM1 = 0;
  promrecnM1Aa = 0; promrecnM1Ab = 0; promrecnM2 = 0; promrecnM2Aa = 0; promrecnM2Ab = 0; promrecnM3 = 0; promrecnM3Aa = 0;
  promrecnM3Ab = 0; op1 = false; op2 = false; op3 = false; exactitudb2 = 0; exactitudbpor2 = 0; exactitudr2 = 0; promMetoidoref = 0;
  muestraData = false; calculaMatrix = true; errorEb = 0; errorEm = 0; errorEa = 0; muestraData2 = false;

  selectrecuperacion = false; pormedios = false; mostrar2 = false; mostrar3 = false; nAlto = false; nBajo = false; Ebajo = false;
  Emedio = false; EAlto = false; recuperacion = false; muestra1Aa = false; muestra1Ab = false; muestra2Aa = false;
  muestra2Ab = false; muestra3Aa = false; muestra3Ab = false; numeroDias: number; numeroBlancos: number; numeroMuestras: number;
  numeroRepeticiones: number; formaTablaBancoMuestras: FormGroup; formainformacion: FormGroup; porM1Aa = []; porM1Ab = [];
  porM2Aa = []; porM2Ab = []; porM3Aa = []; porM3Ab = []; datosArray = []; muestraTabla = false; ValorAtipoco = false;
  pendienteLinealidad = 0; interceptoLinealidad = 0; RquadradoLinealidad = 0; NB = false;

  formaBancoDeMuestras: FormGroup;
  formaLinealidad: FormGroup;
  // Datos Atipicos
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
  valoresDeConfianza = 0;
  /**
   * EB
   */

  GCEbMaximo = 0; GCEbMinimo = 0; GCEb = 0; valorAtipocoEB = 0;
  /**
   * EM
   */

  GCEMMaximo = 0; GCEMMinimo = 0; GCEM = 0; valorAtipocoEM = 0;
  /**
   * EA
   */

  GCEAMaximo = 0; GCEAMinimo = 0; GCEA = 0; valorAtipocoEA = 0;

  /**
   * M1
   */

  GCM1Maximo = 0; GCM1Minimo = 0; GCM1 = 0; valorAtipocoM1 = 0;
  /**
   * M1Ab
   */

  GCM1AbMaximo = 0; GCM1AbMinimo = 0; GCM1Ab = 0; valorAtipocoM1Ab = 0;
  /**
   * M1Aa
   */

  GCM1AaMaximo = 0; GCM1AaMinimo = 0; GCM1Aa = 0; valorAtipocoM1Aa = 0;
  /**
   * M2
   */

  GCM2Maximo = 0; GCM2Minimo = 0; GCM2 = 0; valorAtipocoM2 = 0;
  /**
   * M2Ab
   */

  GCM2AbMaximo = 0; GCM2AbMinimo = 0; GCM2Ab = 0; valorAtipocoM2Ab = 0;
  /**
   * M2Aa
   */

  GCM2AaMaximo = 0; GCM2AaMinimo = 0; GCM2Aa = 0; valorAtipocoM2Aa = 0;
  /**
   * M3
   */

  GCM3Maximo = 0; GCM3Minimo = 0; GCM3 = 0; valorAtipocoM3 = 0;
  /**
   * M3Ab
   */

  GCM3AbMaximo = 0; GCM3AbMinimo = 0; GCM3Ab = 0; valorAtipocoM3Ab = 0;
  /**
   * M3Aa
   */

  GCM3AaMaximo = 0; GCM3AaMinimo = 0; GCM3Aa = 0; valorAtipocoM3Aa = 0;
  /**
   * Limite de detenciò y cuantificación
   */
  calculos = false; matrizBk1 = false; matrizBk2 = false; matrizBk3 = false; matrizBk4 = false; matrizBk5 = false;
  matrizEb = false; matrizEm = false; matrizEa = false; matrizM1 = false; matrizM2 = false; matrizM3 = false;
  matrizM1Ab = false; matrizM1Aa = false; matrizM2Ab = false; matrizM2Aa = false; matrizM3Ab = false; matrizM3Aa = false;
  calcularMatriz = []; fLdeteccion = 0; fLquantificacion = 0;


  /**
   * Variables de validación
   */

  linealidad = false; sencibilidad = false; limite_deteccion = false; limite_cuantificacion = false; exactitud = false;
  presicion_repetitibilidad = false; presicion_producivilidad = false; recuperacion_matriz = false; robustez = false;
  intervalodetrabajo = false;
  $identificador: string = '';
  ArrValores = {
    Bk1: [],
    Bk2: [],
    Bk3: [],
    Bk4: [],
    Bk5: [],
    Ea: [],
    Eb: [],
    Em: [],
    M1: [],
    M1Aa: [],
    M1Ab: [],
    M2: [],
    M2Aa: [],
    M2Ab: [],
    M3: [],
    M3Aa: [],
    M3Ab: []
  };
  btnValores: boolean = false;
  preloader: boolean = true;
  matricesBlancos = {
    limiteTecion: false,
    exactitud: false,
    presision: false,
    recuperacion: false
  };
  btnLOD_LOQ: boolean = false;

  btnExactitud: boolean = false;

  btnPresision: boolean = false;

  validacion: Validacion = new Validacion();
  formaRecuperacion: FormGroup;
  RecuperacionMuestras = {
    m1: false,
    m2: false,
    m3: false,
  };
  Ralto: boolean = false;
  Rbajo: boolean = false;
  ArrRecuperacion = {
    _id: '',
    CantidadMuestras: 0,
    RecuperacionAm1: 0,
    RecuperacionAm2: 0,
    RecuperacionAm3: 0,
    RecuperacionBm1: 0,
    RecuperacionBm2: 0,
    RecuperacionBm3: 0,
    nivelesAdicion: '',
    unidad: '',
    RMs1: [],
    RMs1Ab: [],
    RMs1Aa: [],
    RMs2: [],
    RMs2Ab: [],
    RMs2Aa: [],
    RMs3: [],
    RMs3Ab: [],
    RMs3Aa: [],
    id_validacionMetodo: ''
  };
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  user: any;
  edit: boolean;
  ArrayGeneralSubModulos = {
    linealidad : {
      view: false,
      arr: []
    },
    sensibilidad : {
      view: false,
      arr:[]
    },
    limites : {
      view: false,
      arr:[]
    },
    exactitud : {
      view: false,
      arr:[]
    },
    presicion : {
      view: false,
      arr:[]
    },
    recuperacion : {
      view: false,
      arr:{}
    },
    intervaloTrabajo : {
      view: false,
      arr: []
    },
    robustez: {
      view: false,
      arr: []
    }
  }
  reporte: boolean = false;
  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private ValidacionMetodoService: ValidacionMetodosConfigService,
    private notificationService: NotificationService,
    private recuperacionService: RecuperacionService,
    private rolesPermisosServices: RolesPermisosService
  ) {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.edit = false;
    this.$identificador = this.router.snapshot.paramMap.get('id');
    if (localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.validacion[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  edicion() {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Cartas[0];
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  ngOnInit() {

    this.initForm();
    this.ValidacionMetodoService.getId(this.$identificador).subscribe((resp: any) => {
      if (resp.success) {
        this.validacion = resp.validacion;
        if (this.validacion['banco_muestras']) {
          this.matricesBlancos.limiteTecion = true;
          this.matricesBlancos.exactitud = true;
          this.matricesBlancos.presision = true;
          this.matricesBlancos.recuperacion = true;
        }
        this.llenadoForm(this.validacion);
        this.cargarSubModulos(this.$identificador)
      } else {
        this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
      }
    });
  }
  clickBoton(id: string) {
    document.getElementById(id).click();
  }
  guardarPDF(event) {
    // if (event) {
    //   this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras);
    // } else {
    //   return;
    // }
  }
  guardadoLinealidad(event) {
    this.ArrayGeneralSubModulos.linealidad = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.linealidad = {
      view : event.linealidad,
      arr : event.arr
    };
    if (event.guardado) {
      this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras);
    } else {
      return;
    }
  }
  guardadoSensibilidad(event) {
    this.ArrayGeneralSubModulos.sensibilidad = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.sensibilidad = {
      view : event.sensibilidad,
      arr : event.arr
    };
    if (event.guardado) {
      this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras);
    } else {
      return;
    }
  }
  guardadoLimites(event) {  
    this.ArrayGeneralSubModulos.limites = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.limites = {
      view : event.LOD_LOQ,
      arr : event.arr
    };
    if (event.guardado) {
      this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras);
    } else {
      return;
    }
  }
  guardadoExactitud(event) {
    // console.log(event)
    this.ArrayGeneralSubModulos.exactitud = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.exactitud = {
      view : event.exactitud,
      arr : event.arr
    };
    if (event.guardado) {
      this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras);
    } else {
      return;
    }
  }
  guardadoPresiciones(event) {
    this.ArrayGeneralSubModulos.presicion = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.presicion = {
      view : event.presociones,
      arr : event.arr
    };
  }
  guardadoRobustez(event) {
    this.ArrayGeneralSubModulos.robustez = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.robustez = {
      view : event.robstez,
      arr : event.arr
    };
    if (event.guardado) {
      this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras);
    } else {
      return;
    }
  }
  guardadoIntervaloTrabajo(event) {
    this.ArrayGeneralSubModulos.intervaloTrabajo = {
      view : false,
      arr : []
    };
    this.ArrayGeneralSubModulos.intervaloTrabajo = {
      view : event.intervalos,
      arr : event.arr
    };
  }
  cargaReporte() {
    this.reporte = true;
  }
  cargarSubModulos(id: string) {
    this.recuperacionService.get(id).subscribe((resp: any) => {
      this.preloader = true;
      if (resp.success) {
        if (resp.recupereciones.length > 0) {
          this.ArrRecuperacion = resp.recupereciones[0];
          console.log(this.ArrRecuperacion)
          this.formaRecuperacion.setValue({
            CantidadMuestras: this.ArrRecuperacion['CantidadMuestras'],
            RecuperacionAm1: this.ArrRecuperacion['RecuperacionAm1'],
            RecuperacionAm2: this.ArrRecuperacion['RecuperacionAm2'],
            RecuperacionAm3: this.ArrRecuperacion['RecuperacionAm3'],
            RecuperacionBm1: this.ArrRecuperacion['RecuperacionBm1'],
            RecuperacionBm2: this.ArrRecuperacion['RecuperacionBm2'],
            RecuperacionBm3: this.ArrRecuperacion['RecuperacionBm3'],
            nivelesAdicion: this.ArrRecuperacion['nivelesAdicion'],
            unidad: this.ArrRecuperacion['unidad'],
            RMs1: [],
            RMs1Ab: [],
            RMs1Aa: [],
            RMs2: [],
            RMs2Ab: [],
            RMs2Aa: [],
            RMs3: [],
            RMs3Ab: [],
            RMs3Aa: [],
          });
          this.llenadoArreglo('RM1', this.ArrRecuperacion['RMs1']);
          this.llenadoArreglo('RM2', this.ArrRecuperacion['RMs2']);
          this.llenadoArreglo('RM3', this.ArrRecuperacion['RMs3']);
          this.llenadoArreglo('RM1Ab', this.ArrRecuperacion['RMs1Ab']);
          this.llenadoArreglo('RM1Aa', this.ArrRecuperacion['RMs1Aa']);
          this.llenadoArreglo('RM2Ab', this.ArrRecuperacion['RMs2Ab']);
          this.llenadoArreglo('RM2Aa', this.ArrRecuperacion['RMs2Aa']);
          this.llenadoArreglo('RM3Ab', this.ArrRecuperacion['RMs3Ab']);
          this.llenadoArreglo('RM3Aa', this.ArrRecuperacion['RMs3Aa']);
          this.matricesBlancos.recuperacion = false;
          this.selectCantMuestras(this.ArrRecuperacion['CantidadMuestras'].toString());
          this.selectCantMuestras(this.ArrRecuperacion['nivelesAdicion'].toString());
          this.calculoRecuperacion();

        }
      }
      this.preloader = false;

    });
  }
  llenadoForm(validacion): void {
    // console.log(validacion)
    this.preloader = true;
    let recuperacion = 'no';
    if (validacion.recuperacion_matriz) {
      recuperacion = 'si';
      this.recuperacion = true;
      this.selectrecuperacion = true;
    }
    this.formaBancoDeMuestras.setValue({
      cantidad_de_blancos: validacion.cantidadBlancos.toString(),
      cantidad_de_estandares: validacion.cantidadEstandares.toString(),
      cantidad_de_muestras: validacion.cantidadMuestras.toString(),
      recuperacion: recuperacion,
      niveles_de_adicion_por_muestra: validacion.niveles_de_adicion_por_muestra,
      numero_de_dias: validacion.NumeroDias.toString(),
      duplicados_por_dia: validacion.NumeroDuplicados.toString(),
      Linealidad: validacion.linealidad,
      Sensibilidad: validacion.sencibilidad,
      Limite_de_deteccion: validacion.limite_deteccion,
      Limite_de_cuantificacion: validacion.limite_cuantificacion,
      Exactitud: validacion.exactitud,
      Precision_Repetibi: validacion.presicion_repetitibilidad,
      Precision_Reproduc: validacion.presicion_producivilidad,
      Recuperacon_en_matriz: validacion.recuperacion_matriz,
      Intervalo_de_trabaj: validacion.intervalodetrabajo,
      Robustez: validacion.robustez,
      nombre_banco_muestras: validacion.nombre,
      Banco_muestras: validacion.banco_muestras,
    });
    this.formainformacion.setValue({
      estandar_medio: validacion.estandar_medio,
      estandar_bajo: validacion.estandar_bajo,
      estandar_alto: validacion.estandar_alto,
      recuperacion_M1ab: validacion.recuperacion_M1aa,
      recuperacion_M1aa: validacion.recuperacion_M1ab,
      recuperacion_M2ab: validacion.recuperacion_M2ab,
      recuperacion_M2aa: validacion.recuperacion_M2aa,
      recuperacion_M3ab: validacion.recuperacion_M3ab,
      recuperacion_M3aa: validacion.recuperacion_M3aa,
      nivel: validacion.nivel
    });
    this.clickBoton('calcular-fomr-init');
    setTimeout(() => {
      if (this.validacion['banco_muestras']) {

        this.calcularForm();
        if (validacion['Bk1'].length > 0) {
          this.llenadoArreglo('bk1', validacion['Bk1']);
        }
        if (validacion['Bk2'].length > 0) {
          this.llenadoArreglo('bk2', validacion['Bk2']);
        }
        if (validacion['Bk3'].length > 0) {
          this.llenadoArreglo('bk3', validacion['Bk3']);
        }
        if (validacion['Bk4'].length > 0) {
          this.llenadoArreglo('bk4', validacion['Bk4']);
        }
        if (validacion['Bk5'].length > 0) {
          this.llenadoArreglo('bk5', validacion['Bk5']);
        }
        if (validacion['Ea'].length > 0) {
          this.llenadoArreglo('Ea', validacion['Ea']);
        }
        if (validacion['Eb'].length > 0) {
          this.llenadoArreglo('Eb', validacion['Eb']);
        }
        if (validacion['Em'].length > 0) {
          this.llenadoArreglo('Em', validacion['Em']);
        }
        if (validacion['M1'].length > 0) {
          this.llenadoArreglo('M1', validacion['M1']);
        }
        if (validacion['M1Aa'].length > 0) {
          this.llenadoArreglo('M1Aa', validacion['M1Aa']);
        }
        if (validacion['M1Ab'].length > 0) {
          this.llenadoArreglo('M1Ab', validacion['M1Ab']);
        }
        if (validacion['M2'].length > 0) {
          this.llenadoArreglo('M2', validacion['M2']);
        }
        if (validacion['M2Aa'].length > 0) {
          this.llenadoArreglo('M2Aa', validacion['M2Aa']);
        }
        if (validacion['M2Ab'].length > 0) {
          this.llenadoArreglo('M2Ab', validacion['M2Ab']);
        }
        if (validacion['M3'].length > 0) {
          this.llenadoArreglo('M3', validacion['M3']);
        }
        if (validacion['M3Aa'].length > 0) {
          this.llenadoArreglo('M3Aa', validacion['M3Aa']);
        }
        if (validacion['M3Ab'].length > 0) {
          this.llenadoArreglo('M3Ab', validacion['M3Ab']);
        }
      }
    }, 3000);
    this.preloader = false;
  }
  initForm() {
    this.formainformacion = new FormGroup({
      estandar_medio: new FormControl(''),
      estandar_bajo: new FormControl(''),
      estandar_alto: new FormControl(''),
      recuperacion_M1ab: new FormControl(''),
      recuperacion_M1aa: new FormControl(''),
      recuperacion_M2ab: new FormControl(''),
      recuperacion_M2aa: new FormControl(''),
      recuperacion_M3ab: new FormControl(''),
      recuperacion_M3aa: new FormControl(''),
      nivel: new FormControl('95', [Validators.required]),
    });
    this.formaBancoDeMuestras = new FormGroup({
      cantidad_de_blancos: new FormControl('0', Validators.required),
      cantidad_de_estandares: new FormControl('0', Validators.required),
      cantidad_de_muestras: new FormControl('0', Validators.required),
      recuperacion: new FormControl('si', Validators.required),
      niveles_de_adicion_por_muestra: new FormControl('', Validators.required),
      numero_de_dias: new FormControl('2', Validators.required),
      duplicados_por_dia: new FormControl('1', Validators.required),
      Linealidad: new FormControl(true, Validators.required),
      Sensibilidad: new FormControl(true, Validators.required),
      Limite_de_deteccion: new FormControl(true, Validators.required),
      Limite_de_cuantificacion: new FormControl(true, Validators.required),
      Exactitud: new FormControl(true, Validators.required),
      Precision_Repetibi: new FormControl(true, Validators.required),
      Precision_Reproduc: new FormControl(true, Validators.required),
      Recuperacon_en_matriz: new FormControl(true, Validators.required),
      Intervalo_de_trabaj: new FormControl(true, Validators.required),
      Robustez: new FormControl(true, Validators.required),
      Banco_muestras: new FormControl(true, Validators.required),
      nombre_banco_muestras: new FormControl('', Validators.required),
    });
    this.formaTablaBancoMuestras = new FormGroup({
      bks1: this.fb.array([]),
      bks2: this.fb.array([]),
      bks3: this.fb.array([]),
      bks4: this.fb.array([]),
      bks5: this.fb.array([]),
      Ebs: this.fb.array([]),
      Ems: this.fb.array([]),
      Eas: this.fb.array([]),
      Ms1: this.fb.array([]),
      Ms1Ab: this.fb.array([]),
      Ms1Aa: this.fb.array([]),
      Ms2: this.fb.array([]),
      Ms2Ab: this.fb.array([]),
      Ms2Aa: this.fb.array([]),
      Ms3: this.fb.array([]),
      Ms3Ab: this.fb.array([]),
      Ms3Aa: this.fb.array([]),
    });
    this.formaRecuperacion = new FormGroup({
      CantidadMuestras: new FormControl(''),
      RecuperacionAm1: new FormControl(''),
      RecuperacionAm2: new FormControl(''),
      RecuperacionAm3: new FormControl(''),
      RecuperacionBm1: new FormControl(''),
      RecuperacionBm2: new FormControl(''),
      RecuperacionBm3: new FormControl(''),
      nivelesAdicion: new FormControl(''),
      unidad: new FormControl(''),
      RMs1: this.fb.array([]),
      RMs1Ab: this.fb.array([]),
      RMs1Aa: this.fb.array([]),
      RMs2: this.fb.array([]),
      RMs2Ab: this.fb.array([]),
      RMs2Aa: this.fb.array([]),
      RMs3: this.fb.array([]),
      RMs3Ab: this.fb.array([]),
      RMs3Aa: this.fb.array([]),
    });
  }
  data2(event: ClipboardEvent, array: string) {
    this.datosArray = [];
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    row_data.forEach((valor, index) => {
      valor = valor.replace(',', '.');
      if (valor !== '') {
        this.datosArray.push(parseFloat(valor));
      }
    });
    this.llenadoArreglo(array, this.datosArray);
  }
  data(event: ClipboardEvent, array: string) {
    this.datosArray = [];
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    row_data.forEach((valor, index) => {
      if (index <= (this.numeroRepeticiones - 1)) {
        valor = valor.replace(',', '.');
        if (valor !== '') {
          this.datosArray.push(parseFloat(valor));
        }
      } else {
        return;
      }
    });
    this.llenadoArreglo(array, this.datosArray);
  }
  removeDato(index: number, array: string) {
    this.eliminarPosicon(index, array);
  }
  validacionesDeListadoCheck() {
    if (this.formaBancoDeMuestras.value.Linealidad) {
      this.linealidad = true;
    }
    if (this.formaBancoDeMuestras.value.Sensibilidad) {
      this.sencibilidad = true;
    }
    if (this.formaBancoDeMuestras.value.Limite_de_deteccion) {
      this.limite_deteccion = true;
    }
    if (this.formaBancoDeMuestras.value.Limite_de_cuantificacion) {
      this.limite_cuantificacion = true;
    }
    if (this.formaBancoDeMuestras.value.Exactitud) {
      this.exactitud = true;
    }
    if (this.formaBancoDeMuestras.value.Precision_Repetibi) {
      this.presicion_repetitibilidad = true;
    }
    if (this.formaBancoDeMuestras.value.Precision_Reproduc) {
      this.presicion_producivilidad = true;
    }
    if (this.formaBancoDeMuestras.value.Recuperacon_en_matriz) {
      this.recuperacion_matriz = true;
    }
    if (this.formaBancoDeMuestras.value.Intervalo_de_trabaj) {
      this.intervalodetrabajo = true;
    }
    if (this.formaBancoDeMuestras.value.Robustez) {
      this.robustez = true;
    }
  }
  cargar() {
    this.limpiezaArray();
    this.llenadoDeArray();
    this.valoresDeConfianza = parseFloat(this.formainformacion.value.nivel);
    if (this.bks1.length > 1) {
      this.matrizBk1 = true;
      this.Smbks1 = sampleStandardDeviation(this.bks1);
      this.prombks1 = mean(this.bks1);
      this.CVbks1 = (this.Smbks1 / this.prombks1);
    }
    if (this.bks2.length > 1) {
      this.matrizBk2 = true;
      this.Smbks2 = sampleStandardDeviation(this.bks2);
      this.prombks2 = mean(this.bks2);
      this.CVbks2 = (this.Smbks2 / this.prombks2);
    }
    if (this.bks3.length > 1) {
      this.matrizBk3 = true;
      this.Smbks3 = sampleStandardDeviation(this.bks3);
      this.prombks3 = mean(this.bks3);
      this.CVbks3 = (this.Smbks3 / this.prombks3);
    }
    if (this.bks4.length > 1) {
      this.matrizBk4 = true;
      this.Smbks4 = sampleStandardDeviation(this.bks4);
      this.prombks4 = mean(this.bks4);
      this.CVbks4 = (this.Smbks4 / this.prombks4);
    }
    if (this.bks5.length > 1) {
      this.matrizBk5 = true;
      this.Smbks5 = sampleStandardDeviation(this.bks5);
      this.prombks5 = mean(this.bks5);
      this.CVbks5 = (this.Smbks5 / this.prombks5);
    }
    if (this.Ebs.length > 1) {
      this.matrizEb = true;
      this.valorAtipocoEB = 0;
      this.SmEbs = sampleStandardDeviation(this.Ebs);
      this.promEbs = mean(this.Ebs);
      this.CVEbs = (this.SmEbs / this.promEbs);
      this.GCEbMinimo = Math.abs(min(this.Ebs) - this.promEbs) / this.SmEbs;
      this.GCEbMaximo = Math.abs(max(this.Ebs) - this.promEbs) / this.SmEbs;
      this.errorEb = Math.abs(this.promEbs - parseFloat(this.formainformacion.value.estandar_bajo)) / parseFloat(this.formainformacion.value.estandar_bajo);
      if (this.valoresDeConfianza === 90) {
        this.GCEb = this.dataTable[this.Ebs.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCEb = this.dataTable[this.Ebs.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCEb = this.dataTable[this.Ebs.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCEb = this.dataTable[this.Ebs.length][3];
      }
      if (this.GCEbMinimo > this.GCEb) {
        this.valorAtipocoEB = min(this.Ebs);
        this.ValorAtipoco = true;
      }
      if (this.GCEbMaximo > this.GCEb) {
        this.valorAtipocoEB = max(this.Ebs);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ems.length > 1) {
      this.matrizEm = true;
      this.valorAtipocoEM = 0;
      this.SmEms = sampleStandardDeviation(this.Ems);
      this.promEms = mean(this.Ems);
      this.CVEms = (this.SmEms / this.promEms);
      this.GCEMMinimo = Math.abs(min(this.Ems) - this.promEms) / this.SmEms;
      this.GCEMMaximo = Math.abs(max(this.Ems) - this.promEms) / this.SmEms;
      this.errorEm = Math.abs(this.promEms - parseFloat(this.formainformacion.value.estandar_medio)) / parseFloat(this.formainformacion.value.estandar_medio);
      if (this.valoresDeConfianza === 90) {
        this.GCEM = this.dataTable[this.Ems.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCEM = this.dataTable[this.Ems.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCEM = this.dataTable[this.Ems.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCEM = this.dataTable[this.Ems.length][3];
      }
      if (this.GCEMMinimo > this.GCEM) {
        this.valorAtipocoEM = min(this.Ems);
        this.ValorAtipoco = true;
      }
      if (this.GCEMMaximo > this.GCEM) {
        this.valorAtipocoEM = max(this.Ems);
        this.ValorAtipoco = true;
      }
    }
    if (this.Eas.length > 1) {
      this.matrizEa = true;
      this.valorAtipocoEA = 0;
      this.SmEas = sampleStandardDeviation(this.Eas);
      this.promEas = mean(this.Eas);
      this.CVEas = (this.SmEas / this.promEas);
      this.GCEAMinimo = Math.abs(min(this.Eas) - this.promEas) / this.SmEas;
      this.GCEAMaximo = Math.abs(max(this.Eas) - this.promEas) / this.SmEas;
      this.errorEa = Math.abs(this.promEas - parseFloat(this.formainformacion.value.estandar_alto)) / parseFloat(this.formainformacion.value.estandar_alto);
      if (this.valoresDeConfianza === 90) {
        this.GCEA = this.dataTable[this.Eas.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCEA = this.dataTable[this.Eas.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCEA = this.dataTable[this.Eas.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCEA = this.dataTable[this.Eas.length][3];
      }
      if (this.GCEAMinimo > this.GCEA) {
        this.valorAtipocoEA = min(this.Eas);
        this.ValorAtipoco = true;
      }
      if (this.GCEAMaximo > this.GCEA) {
        this.valorAtipocoEA = max(this.Eas);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms1.length > 1) {
      this.matrizM1 = true;
      this.valorAtipocoM1 = 0;
      this.SmMs1 = sampleStandardDeviation(this.Ms1);
      this.promMs1 = mean(this.Ms1);
      this.CVMs1 = (this.SmMs1 / this.promMs1);
      this.GCM1Minimo = Math.abs(min(this.Ms1) - this.promMs1) / this.SmMs1;
      this.GCM1Maximo = Math.abs(max(this.Ms1) - this.promMs1) / this.SmMs1;
      if (this.valoresDeConfianza === 90) {
        this.GCM1 = this.dataTable[this.Ms1.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM1 = this.dataTable[this.Ms1.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM1 = this.dataTable[this.Ms1.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM1 = this.dataTable[this.Ms1.length][3];
      }
      if (this.GCM1Minimo > this.GCM1) {
        this.valorAtipocoM1 = min(this.Ms1);
        this.ValorAtipoco = true;
      }
      if (this.GCM1Maximo > this.GCM1) {
        this.valorAtipocoM1 = max(this.Ms1);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms1Ab.length > 1) {
      this.matrizM1Ab = true;
      this.valorAtipocoM1Ab = 0;
      this.SmMs1Ab = sampleStandardDeviation(this.Ms1Ab);
      this.promMs1Ab = mean(this.Ms1Ab);
      this.CVMs1Ab = (this.SmMs1Ab / this.promMs1Ab);
      for (let i = 0; i <= this.Ms1.length - 1; i++) {
        this.porcentajeRaABm1.push(Math.abs(this.Ms1[i] - this.Ms1Ab[i]) / parseFloat(this.formainformacion.value.recuperacion_M1ab));
      }
      this.GCM1AbMinimo = Math.abs(min(this.Ms1Ab) - this.promMs1Ab) / this.SmMs1Ab;
      this.GCM1AbMaximo = Math.abs(max(this.Ms1Ab) - this.promMs1Ab) / this.SmMs1Ab;
      if (this.valoresDeConfianza === 90) {
        this.GCM1Ab = this.dataTable[this.Ms1Ab.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM1Ab = this.dataTable[this.Ms1Ab.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM1Ab = this.dataTable[this.Ms1Ab.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM1Ab = this.dataTable[this.Ms1Ab.length][3];
      }
      if (this.GCM1AbMinimo > this.GCM1Ab) {
        this.valorAtipocoM1Ab = min(this.Ms1Ab);
        this.ValorAtipoco = true;
      }
      if (this.GCM1AbMaximo > this.GCM1Ab) {
        this.valorAtipocoM1Ab = max(this.Ms1Ab);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms1Aa.length > 1) {
      this.matrizM1Aa = true;
      this.valorAtipocoM1Aa = 0;
      this.SmMs1Aa = sampleStandardDeviation(this.Ms1Aa);
      this.promMs1Aa = mean(this.Ms1Aa);
      this.CVMs1Aa = (this.SmMs1Aa / this.promMs1Aa);
      for (let i = 0; i <= this.Ms1.length - 1; i++) {
        this.porcentajeRaAAm1.push(Math.abs(this.Ms1[i] - this.Ms1Aa[i]) / parseFloat(this.formainformacion.value.recuperacion_M1aa));
      }
      this.GCM1AaMinimo = Math.abs(min(this.Ms1Aa) - this.promMs1Aa) / this.SmMs1Aa;
      this.GCM1AaMaximo = Math.abs(max(this.Ms1Aa) - this.promMs1Aa) / this.SmMs1Aa;
      if (this.valoresDeConfianza === 90) {
        this.GCM1Aa = this.dataTable[this.Ms1Aa.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM1Aa = this.dataTable[this.Ms1Aa.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM1Aa = this.dataTable[this.Ms1Aa.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM1Aa = this.dataTable[this.Ms1Aa.length][3];
      }
      if (this.GCM1AaMinimo > this.GCM1Aa) {
        this.valorAtipocoM1Aa = min(this.Ms1Aa);
        this.ValorAtipoco = true;
      }
      if (this.GCM1AaMaximo > this.GCM1Aa) {
        this.valorAtipocoM1Aa = max(this.Ms1Aa);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms2.length > 1) {
      this.matrizM2 = true;
      this.valorAtipocoM2 = 0;
      this.SmMs2 = sampleStandardDeviation(this.Ms2);
      this.promMs2 = mean(this.Ms2);
      this.CVMs2 = (this.SmMs2 / this.promMs2);
      this.GCM2Minimo = Math.abs(min(this.Ms2) - this.promMs2) / this.SmMs2;
      this.GCM2Maximo = Math.abs(max(this.Ms2) - this.promMs2) / this.SmMs2;
      if (this.valoresDeConfianza === 90) {
        this.GCM2 = this.dataTable[this.Ms2.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM2 = this.dataTable[this.Ms2.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM2 = this.dataTable[this.Ms2.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM2 = this.dataTable[this.Ms2.length][3];
      }
      if (this.GCM2Minimo > this.GCM2) {
        this.valorAtipocoM2 = min(this.Ms2);
        this.ValorAtipoco = true;
      }
      if (this.GCM2Maximo > this.GCM2) {
        this.valorAtipocoM2 = max(this.Ms2);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms2Ab.length > 1) {
      this.matrizM2Ab = true;
      this.valorAtipocoM2Ab = 0;
      this.SmMs2Ab = sampleStandardDeviation(this.Ms2Ab);
      this.promMs2Ab = mean(this.Ms2Ab);
      this.CVMs2Ab = (this.SmMs2Ab / this.promMs2Ab);
      for (let i = 0; i <= this.Ms2.length - 1; i++) {
        this.porcentajeRaABm2.push(Math.abs(this.Ms2[i] - this.Ms2Ab[i]) / parseFloat(this.formainformacion.value.recuperacion_M2ab));
      }
      this.GCM2AbMinimo = Math.abs(min(this.Ms2Ab) - this.promMs2Ab) / this.SmMs2Ab;
      this.GCM2AbMaximo = Math.abs(max(this.Ms2Ab) - this.promMs2Ab) / this.SmMs2Ab;
      if (this.valoresDeConfianza === 90) {
        this.GCM2Ab = this.dataTable[this.Ms2Ab.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM2Ab = this.dataTable[this.Ms2Ab.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM2Ab = this.dataTable[this.Ms2Ab.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM2Ab = this.dataTable[this.Ms2Ab.length][3];
      }
      if (this.GCM2AbMinimo > this.GCM2Ab) {
        this.valorAtipocoM2Ab = min(this.Ms2Ab);
        this.ValorAtipoco = true;
      }
      if (this.GCM2AbMaximo > this.GCM2Ab) {
        this.valorAtipocoM2Ab = max(this.Ms2Ab);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms2Aa.length > 1) {
      this.matrizM2Aa = true;
      this.valorAtipocoM2Aa = 0;
      this.SmMs2Aa = sampleStandardDeviation(this.Ms2Aa);
      this.promMs2Aa = mean(this.Ms2Aa);
      this.CVMs2Aa = (this.SmMs2Aa / this.promMs2Aa);
      for (let i = 0; i <= this.Ms2.length - 1; i++) {
        this.porcentajeRaAAm2.push(Math.abs(this.Ms2[i] - this.Ms2Aa[i]) / parseFloat(this.formainformacion.value.recuperacion_M2aa));
      }
      this.GCM2AaMinimo = Math.abs(min(this.Ms2Aa) - this.promMs2Aa) / this.SmMs2Aa;
      this.GCM2AaMaximo = Math.abs(max(this.Ms2Aa) - this.promMs2Aa) / this.SmMs2Aa;
      if (this.valoresDeConfianza === 90) {
        this.GCM2Aa = this.dataTable[this.Ms2Aa.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM2Aa = this.dataTable[this.Ms2Aa.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM2Aa = this.dataTable[this.Ms2Aa.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM2Aa = this.dataTable[this.Ms2Aa.length][3];
      }
      if (this.GCM2AaMinimo > this.GCM2Aa) {
        this.valorAtipocoM2Aa = min(this.Ms2Aa);
        this.ValorAtipoco = true;
      }
      if (this.GCM2AaMaximo > this.GCM2Aa) {
        this.valorAtipocoM2Aa = max(this.Ms2Aa);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms3.length > 1) {
      this.matrizM3 = true;
      this.valorAtipocoM3 = 0;
      this.SmMs3 = sampleStandardDeviation(this.Ms3);
      this.promMs3 = mean(this.Ms3);
      this.CVMs3 = (this.SmMs3 / this.promMs3);
      this.GCM3Minimo = Math.abs(min(this.Ms3) - this.promMs3) / this.SmMs3;
      this.GCM3Maximo = Math.abs(max(this.Ms3) - this.promMs3) / this.SmMs3;
      if (this.valoresDeConfianza === 90) {
        this.GCM3 = this.dataTable[this.Ms3.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM3 = this.dataTable[this.Ms3.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM3 = this.dataTable[this.Ms3.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM3 = this.dataTable[this.Ms3.length][3];
      }
      if (this.GCM3Minimo > this.GCM3) {
        this.valorAtipocoM3 = min(this.Ms3);
        this.ValorAtipoco = true;
      }
      if (this.GCM3Maximo > this.GCM3) {
        this.valorAtipocoM3 = max(this.Ms3);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms3Ab.length > 1) {
      this.matrizM3Ab = true;
      this.valorAtipocoM3Ab = 0;
      this.SmMs3Ab = sampleStandardDeviation(this.Ms3Ab);
      this.promMs3Ab = mean(this.Ms3Ab);
      this.CVMs3Ab = (this.SmMs3Ab / this.promMs3Ab);
      for (let i = 0; i <= this.Ms2.length - 1; i++) {
        this.porcentajeRaABm3.push(Math.abs(this.Ms3[i] - this.Ms3Ab[i]) / parseFloat(this.formainformacion.value.recuperacion_M3ab));
      }
      this.GCM3AbMinimo = Math.abs(min(this.Ms3Ab) - this.promMs3Ab) / this.SmMs3Ab;
      this.GCM3AbMaximo = Math.abs(max(this.Ms3Ab) - this.promMs3Ab) / this.SmMs3Ab;
      if (this.valoresDeConfianza === 90) {
        this.GCM3Ab = this.dataTable[this.Ms3Ab.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM3Ab = this.dataTable[this.Ms3Ab.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM3Ab = this.dataTable[this.Ms3Ab.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM3Ab = this.dataTable[this.Ms3Ab.length][3];
      }
      if (this.GCM3AbMinimo > this.GCM3Ab) {
        this.valorAtipocoM3Ab = min(this.Ms3Ab);
        this.ValorAtipoco = true;
      }
      if (this.GCM3AbMaximo > this.GCM3Ab) {
        this.valorAtipocoM3Ab = max(this.Ms3Ab);
        this.ValorAtipoco = true;
      }
    }
    if (this.Ms3Aa.length > 1) {
      this.matrizM3Aa = true;
      this.valorAtipocoM3Aa = 0;
      this.SmMs3Aa = sampleStandardDeviation(this.Ms3Aa);
      this.promMs3Aa = mean(this.Ms3Aa);
      this.CVMs3Aa = (this.SmMs3Aa / this.promMs3Aa);
      for (let i = 0; i <= this.Ms2.length - 1; i++) {
        this.porcentajeRaAAm3.push(Math.abs(this.Ms3[i] - this.Ms3Aa[i]) / parseFloat(this.formainformacion.value.recuperacion_M1aa));
      }
      this.GCM3AaMinimo = Math.abs(min(this.Ms3Aa) - this.promMs3Aa) / this.SmMs3Aa;
      this.GCM3AaMaximo = Math.abs(max(this.Ms3Aa) - this.promMs3Aa) / this.SmMs3Aa;
      if (this.valoresDeConfianza === 90) {
        this.GCM3Aa = this.dataTable[this.Ms3Aa.length][0];
      }
      if (this.valoresDeConfianza === 92.5) {
        this.GCM3Aa = this.dataTable[this.Ms3Aa.length][1];
      }
      if (this.valoresDeConfianza === 95) {
        this.GCM3Aa = this.dataTable[this.Ms3Aa.length][2];
      }
      if (this.valoresDeConfianza === 97.5) {
        this.GCM3Aa = this.dataTable[this.Ms3Aa.length][3];
      }
      if (this.GCM3AaMinimo > this.GCM3Aa) {
        this.valorAtipocoM3Aa = min(this.Ms3Aa);
        this.ValorAtipoco = true;
      }
      if (this.GCM3AaMaximo > this.GCM3Aa) {
        this.valorAtipocoM3Aa = max(this.Ms3Aa);
        this.ValorAtipoco = true;
      }
    }
    this.pormedios = true;
    this.calculos = true;
    this.btnValores = true;
    this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras)
  }
  llenadoVariableValidacion(formainformacion: FormGroup, formaTablaBancoMuestras: FormGroup): void {
    // console.log(this.formaBancoDeMuestras.value.Recuperacon_en_matriz)
    this.preloader = true;
    this.validacion['estandar_alto'] = parseFloat(formainformacion.value.estandar_alto);
    this.validacion['estandar_bajo'] = parseFloat(formainformacion.value.estandar_bajo);
    this.validacion['estandar_medio'] = parseFloat(formainformacion.value.estandar_medio);
    this.validacion['nivel'] = parseFloat(formainformacion.value.nivel);
    this.validacion['recuperacion_M1ab'] = parseFloat(formainformacion.value.recuperacion_M1ab);
    this.validacion['recuperacion_M1aa'] = parseFloat(formainformacion.value.recuperacion_M1aa);
    this.validacion['recuperacion_M2ab'] = parseFloat(formainformacion.value.recuperacion_M2ab);
    this.validacion['recuperacion_M2aa'] = parseFloat(formainformacion.value.recuperacion_M2aa);
    this.validacion['recuperacion_M3ab'] = parseFloat(formainformacion.value.recuperacion_M3ab);
    this.validacion['recuperacion_M3aa'] = parseFloat(formainformacion.value.recuperacion_M3aa);
    this.validacion['recuperacion_matriz'] = this.formaBancoDeMuestras.value.Recuperacon_en_matriz;

    // if (formainformacion.value.recuperacion_matriz === 'si') {
    //   this.validacion['recuperacion_matriz'] = true;
    // } else {
    //   this.validacion['recuperacion_matriz'] = false;
    // }
    // console.log('----------------------------------');
    // console.log({ formainformacion, formaTablaBancoMuestras });
    // console.log('----------------------------------');
    if (formaTablaBancoMuestras.value.bks1.length > 0) {
      this.validacion['Bk1'] = [];
      this.formaTablaBancoMuestras.value.bks1.forEach(element => {
        this.validacion['Bk1'].push(element['bk1']);
      });
    }
    if (formaTablaBancoMuestras.value.bks2.length > 0) {
      this.validacion['Bk2'] = [];
      this.formaTablaBancoMuestras.value.bks2.forEach(element => {
        this.validacion['Bk2'].push(element['bk2']);
      });
    }
    if (formaTablaBancoMuestras.value.bks3.length > 0) {
      this.validacion['Bk3'] = [];
      this.formaTablaBancoMuestras.value.bks3.forEach(element => {
        this.validacion['Bk3'].push(element['bk3']);
      });
    }
    if (formaTablaBancoMuestras.value.bks4.length > 0) {
      this.validacion['Bk4'] = [];
      this.formaTablaBancoMuestras.value.bks4.forEach(element => {
        this.validacion['Bk4'].push(element['bk4']);
      });
    }
    if (formaTablaBancoMuestras.value.bks5.length > 0) {
      this.validacion['Bk5'] = [];
      this.formaTablaBancoMuestras.value.bks5.forEach(element => {
        this.validacion['Bk5'].push(element['bk5']);
      });
    }
    if (formaTablaBancoMuestras.value.Eas.length > 0) {
      this.validacion['Ea'] = [];
      this.formaTablaBancoMuestras.value.Eas.forEach(element => {
        this.validacion['Ea'].push(element['Ea']);
      });
    }
    if (formaTablaBancoMuestras.value.Ebs.length > 0) {
      this.validacion['Eb'] = [];
      this.formaTablaBancoMuestras.value.Ebs.forEach(element => {
        this.validacion['Eb'].push(element['Eb']);
      });
    }
    if (formaTablaBancoMuestras.value.Ems.length > 0) {
      this.validacion['Em'] = [];
      this.formaTablaBancoMuestras.value.Ems.forEach(element => {
        this.validacion['Em'].push(element['Em']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms1.length > 0) {
      this.validacion['M1'] = [];
      this.formaTablaBancoMuestras.value.Ms1.forEach(element => {
        this.validacion['M1'].push(element['M1']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms1Aa.length > 0) {
      this.validacion['M1Aa'] = [];
      this.formaTablaBancoMuestras.value.Ms1Aa.forEach(element => {
        this.validacion['M1Aa'].push(element['M1Aa']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms1Ab.length > 0) {
      this.validacion['M1Ab'] = [];
      this.formaTablaBancoMuestras.value.Ms1Ab.forEach(element => {
        this.validacion['M1Ab'].push(element['M1Ab']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms2.length > 0) {
      this.validacion['M2'] = [];
      this.formaTablaBancoMuestras.value.Ms2.forEach(element => {
        this.validacion['M2'].push(element['M2']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms2Aa.length > 0) {
      this.validacion['M2Aa'] = [];
      this.formaTablaBancoMuestras.value.Ms2Aa.forEach(element => {
        this.validacion['M2Aa'].push(element['M2Aa']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms2Ab.length > 0) {
      this.validacion['M2Ab'] = [];
      this.formaTablaBancoMuestras.value.Ms2Ab.forEach(element => {
        this.validacion['M2Ab'].push(element['M2Ab']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms3.length > 0) {
      this.validacion['M3'] = [];
      this.formaTablaBancoMuestras.value.Ms3.forEach(element => {
        this.validacion['M3'].push(element['M3']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms3Aa.length > 0) {
      this.validacion['M3Aa'] = [];
      this.formaTablaBancoMuestras.value.Ms3Aa.forEach(element => {
        this.validacion['M3Aa'].push(element['M3Aa']);
      });
    }
    if (formaTablaBancoMuestras.value.Ms3Ab.length > 0) {
      this.validacion['M3Ab'] = [];
      this.formaTablaBancoMuestras.value.Ms3Ab.forEach(element => {
        this.validacion['M3Ab'].push(element['M3Ab']);
      });
    }
    // console.log(this.validacion)
    // return;
    this.ValidacionMetodoService.edit(this.validacion).subscribe((resp: any) => {
      if (resp.success) {
        // console.log(resp)
        this.btnValores = true;
        this.preloader = false;
        this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
      }
    });
  }
  iniciarVsariables() {
    this.nBajo = false;
    this.nAlto = false;
    this.muestra1Aa = false;
    this.muestra1Ab = false;
    this.muestra2Aa = false;
    this.muestra2Ab = false;
    this.muestra3Aa = false;
    this.muestra3Ab = false;
    this.Ebajo = false;
    this.Emedio = false;
    this.EAlto = false;
    this.numeroDias = 0;
    this.numeroBlancos = 0;
    this.numeroMuestras = 0;
  }
  llenadoDeArrayCalculos(forma, tipoCalculo: string) {
    // console.log(forma.value);
    this.calcularMatriz = [];
    switch (forma.value.matriz) {
      case 'Bk1':
        this.formaTablaBancoMuestras.value.bks1.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['bk1']));
        });
        break;
      case 'Bk2':
        this.formaTablaBancoMuestras.value.bks2.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['bk2']));
        });
        break;
      case 'Bk3':
        this.formaTablaBancoMuestras.value.bks3.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['bk3']));
        });
        break;
      case 'Bk4':
        this.formaTablaBancoMuestras.value.bks4.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['bk4']));
        });
        break;
      case 'Bk5':
        this.formaTablaBancoMuestras.value.bks5.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['bk5']));
        });
        break;
      case 'Eb':
        this.formaTablaBancoMuestras.value.Ebs.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['Eb']));
        });
        break;
      case 'Em':
        this.formaTablaBancoMuestras.value.Ems.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['Em']));
        });
        break;
      case 'Ea':
        this.formaTablaBancoMuestras.value.Eas.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['Ea']));
        });
        break;
      case 'M1':
        this.formaTablaBancoMuestras.value.Ms1.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M1']));
        });
        break;
      case 'M2':
        this.formaTablaBancoMuestras.value.Ms2.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M2']));
        });
        break;
      case 'M3':
        this.formaTablaBancoMuestras.value.Ms3.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M3']));
        });
        break;
      case 'M1Ab':
        this.formaTablaBancoMuestras.value.Ms1Ab.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M1Ab']));
        });
        break;
      case 'M1Aa':
        this.formaTablaBancoMuestras.value.Ms1Aa.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M1Aa']));
        });
        break;
      case 'M2Ab':
        this.formaTablaBancoMuestras.value.Ms2Ab.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M2Ab']));
        });
        break;
      case 'M2Aa':
        this.formaTablaBancoMuestras.value.Ms2Aa.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M2Aa']));
        });
        break;
      case 'M3Ab':
        this.formaTablaBancoMuestras.value.Ms3Ab.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M3Ab']));
        });
        break;
      case 'M3Aa':
        this.formaTablaBancoMuestras.value.Ms3Aa.forEach(element => {
          this.calcularMatriz.push(parseFloat(element['M3Aa']));
        });
        break;
    }

  }

  calcularForm() {
    this.validacionesDeListadoCheck();
    this.iniciarVsariables();
    this.numeroRepeticiones = parseInt(this.formaBancoDeMuestras.value.numero_de_dias) * parseInt(this.formaBancoDeMuestras.value.duplicados_por_dia);
    const numeroDias = parseInt(this.formaBancoDeMuestras.value.numero_de_dias);
    const numerobalcos = parseInt(this.formaBancoDeMuestras.value.cantidad_de_blancos);
    const numeromuestras = parseInt(this.formaBancoDeMuestras.value.cantidad_de_muestras);
    const numeroestandares = parseInt(this.formaBancoDeMuestras.value.cantidad_de_estandares);
    for (let i = 0; i <= numeroDias - 1; i++) {
      this.numeroDias = this.numeroDias + 1;
    }
    if (this.formaBancoDeMuestras.value.duplicados_por_dia === '2') {
      this.mostrar2 = true;
    }
    if (this.formaBancoDeMuestras.value.duplicados_por_dia === '3') {
      this.mostrar2 = true;
      this.mostrar3 = true;
    }
    if (numerobalcos !== 0) {
      for (let i = 0; i <= numerobalcos - 1; i++) {
        this.numeroBlancos = this.numeroBlancos + 1;
      }
    }
    if (numeromuestras !== 0) {
      for (let i = 0; i <= numeromuestras - 1; i++) {
        this.numeroMuestras = this.numeroMuestras + 1;
      }
    }

    if (numeroestandares === 0) {
      this.Ebajo = true;
    }
    if (numeroestandares === 1) {
      this.Emedio = true;
    }
    if (numeroestandares === 2) {
      this.EAlto = true;
    }
    if (numeroestandares === 3) {
      this.EAlto = true;
      this.Ebajo = true;
    }
    if (numeroestandares === 4) {
      this.Emedio = true;
      this.EAlto = true;
      this.Ebajo = true;
    }
    this.validacionMuestras();
    this.muestraTabla = true;
    this.validacion['niveles_de_adicion_por_muestra'] = this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra;
    this.validacion['recuperacion'] = this.formaBancoDeMuestras.value.recuperacion;
    this.validacion['cantidadBlancos'] = parseInt(this.formaBancoDeMuestras.value.cantidad_de_blancos);
    this.validacion['cantidadEstandares'] = parseInt(this.formaBancoDeMuestras.value.cantidad_de_estandares);
    this.validacion['cantidadMuestras'] = parseInt(this.formaBancoDeMuestras.value.cantidad_de_muestras);
    this.validacion['NumeroDuplicados'] = parseInt(this.formaBancoDeMuestras.value.duplicados_por_dia);
    this.validacion['NumeroDias'] = parseInt(this.formaBancoDeMuestras.value.numero_de_dias);
  }
  validacionMuestras() {
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Alto' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '1') {
      this.muestra1Aa = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Bajo' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '1') {
      this.muestra1Ab = true;

    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Alto-y-Bajo' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '1') {
      this.muestra1Aa = true;
      this.muestra1Ab = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Alto' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '2') {
      this.muestra2Aa = true;
      this.muestra1Aa = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Bajo' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '2') {
      this.muestra2Ab = true;
      this.muestra1Ab = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Alto-y-Bajo' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '2') {
      this.muestra2Ab = true;
      this.muestra2Aa = true;
      this.muestra1Aa = true;
      this.muestra1Ab = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Alto' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '3') {
      this.muestra3Aa = true;
      this.muestra2Aa = true;
      this.muestra1Aa = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Bajo' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '3') {
      this.muestra3Ab = true;
      this.muestra2Ab = true;
      this.muestra1Ab = true;
    }
    if (this.formaBancoDeMuestras.value.niveles_de_adicion_por_muestra === 'Alto-y-Bajo' &&
      this.formaBancoDeMuestras.value.cantidad_de_muestras === '3') {
      this.muestra3Aa = true;
      this.muestra3Ab = true;
      this.muestra2Ab = true;
      this.muestra2Aa = true;
      this.muestra1Aa = true;
      this.muestra1Ab = true;
    }
  }
  validaRecuperacion(event) {
    if (event.target.value === 'no') {
      this.selectrecuperacion = false;
    } else {
      this.selectrecuperacion = true;
    }
  }
  validaMuestra(event) {
    let variable = parseInt(event.target.value);
    if (variable > 0) {
      // console.log(variable);
      this.recuperacion = true;
      this.selectrecuperacion = true;
    } else {
      // console.log(variable);
      this.recuperacion = false;
    }
  }

  addinput(index, data, data2) {
    switch (data) {
      case 'RM1':

        const control1 = <FormArray>this.formaRecuperacion.controls['RMs1'];
        control1.insert(index + 1, this.fb.group({ RM1: [``] }));

        break;
      case 'RM2':

        const control2 = <FormArray>this.formaRecuperacion.controls['RMs2'];
        control2.insert(index + 1, this.fb.group({ RM2: [``] }));

        break;
      case 'RM3':

        const control3 = <FormArray>this.formaRecuperacion.controls['RMs3'];
        control3.insert(index + 1, this.fb.group({ RM3: [``] }));

        break;
      case 'RM1Ab':

        const control4 = <FormArray>this.formaRecuperacion.controls['RMs1Ab'];
        control4.insert(index + 1, this.fb.group({ RM1Ab: [``] }));

        break;
      case 'RM1Aa':

        const control5 = <FormArray>this.formaRecuperacion.controls['RMs1Aa'];
        control5.insert(index + 1, this.fb.group({ RM1Aa: [``] }));

        break;
      case 'RM2Ab':

        const control6 = <FormArray>this.formaRecuperacion.controls['RMs2Ab'];
        control6.insert(index + 1, this.fb.group({ RM2Ab: [``] }));

        break;
      case 'RM2Aa':

        const control7 = <FormArray>this.formaRecuperacion.controls['RMs2Aa'];
        control7.insert(index + 1, this.fb.group({ RM2Aa: [``] }));

        break;
      case 'RM3Ab':

        const control8 = <FormArray>this.formaRecuperacion.controls['RMs3Ab'];
        control8.insert(index + 1, this.fb.group({ RM3Ab: [``] }));

        break;
      case 'RM3Aa':
        const control9 = <FormArray>this.formaRecuperacion.controls['RMs3Aa'];
        control9.insert(index + 1, this.fb.group({ RM3Aa: [``] }));
        break;
    }

  }


  llenadoArreglo(arreglo, valores) {

    const row_modific = document.getElementById('row-modific');
    switch (arreglo) {
      case 'bk1':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['bks1'];
          control.push(this.fb.group({ bk1: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'bk2':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['bks2'];
          control.push(this.fb.group({ bk2: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'bk3':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['bks3'];
          control.push(this.fb.group({ bk3: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'bk4':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['bks4'];
          control.push(this.fb.group({ bk4: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'bk5':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['bks5'];
          control.push(this.fb.group({ bk5: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'Eb':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ebs'];
          control.push(this.fb.group({ Eb: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'Em':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ems'];
          control.push(this.fb.group({ Em: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'Ea':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Eas'];
          control.push(this.fb.group({ Ea: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'RM1':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs1'];
          control.push(this.fb.group({ RM1: [`${element}`] }));
        });
        break;
      case 'RM2':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs2'];
          control.push(this.fb.group({ RM2: [`${element}`] }));
        });
        break;
      case 'RM3':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs3'];
          control.push(this.fb.group({ RM3: [`${element}`] }));
        });
        break;
      case 'RM1Ab':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs1Ab'];
          control.push(this.fb.group({ RM1Ab: [`${element}`] }));
        });
        break;
      case 'RM1Aa':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs1Aa'];
          control.push(this.fb.group({ RM1Aa: [`${element}`] }));
        });
        break;
      case 'RM2Ab':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs2Ab'];
          control.push(this.fb.group({ RM2Ab: [`${element}`] }));
        });
        break;
      case 'RM2Aa':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs2Aa'];
          control.push(this.fb.group({ RM2Aa: [`${element}`] }));
        });
        break;
      case 'RM3Ab':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs3Ab'];
          control.push(this.fb.group({ RM3Ab: [`${element}`] }));
        });
        break;
      case 'RM3Aa':
        valores.forEach(element => {
          const control = <FormArray>this.formaRecuperacion.controls['RMs3Aa'];
          control.push(this.fb.group({ RM3Aa: [`${element}`] }));
        });
        break;
      case 'M1':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms1'];
          control.push(this.fb.group({ M1: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'M2':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms2'];
          control.push(this.fb.group({ M2: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'M3':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms3'];
          control.push(this.fb.group({ M3: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'M1Ab':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms1Ab'];
          control.push(this.fb.group({ M1Ab: [`${element}`] }));
        });
        row_modific.scrollLeft = 1100;
        break;
      case 'M1Aa':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms1Aa'];
          control.push(this.fb.group({ M1Aa: [`${element}`] }));
        });
        row_modific.scrollLeft = 2100;
        break;
      case 'M2Ab':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms2Ab'];
          control.push(this.fb.group({ M2Ab: [`${element}`] }));
        });
        row_modific.scrollLeft = 2100;
        break;
      case 'M2Aa':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms2Aa'];
          control.push(this.fb.group({ M2Aa: [`${element}`] }));
        });
        row_modific.scrollLeft = 2100;
        break;
      case 'M3Ab':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms3Ab'];
          control.push(this.fb.group({ M3Ab: [`${element}`] }));
        });
        row_modific.scrollLeft = 2100;
        break;
      case 'M3Aa':
        valores.forEach(element => {
          const control = <FormArray>this.formaTablaBancoMuestras.controls['Ms3Aa'];
          control.push(this.fb.group({ M3Aa: [`${element}`] }));
        });
        row_modific.scrollLeft = 3100;
        break;
      default:
        // console.log(arreglo);
        break;
    }
  }
  eliminarPosicon(index: number, array: string) {
    let control;
    switch (array) {
      case 'Bk1':
        control = <FormArray>this.formaTablaBancoMuestras.controls['bks1'];
        control.removeAt(index);
        break;
      case 'Bk2':
        control = <FormArray>this.formaTablaBancoMuestras.controls['bks2'];
        control.removeAt(index);
        break;
      case 'Bk3':
        control = <FormArray>this.formaTablaBancoMuestras.controls['bks3'];
        control.removeAt(index);
        break;
      case 'Bk4':
        control = <FormArray>this.formaTablaBancoMuestras.controls['bks4'];
        control.removeAt(index);
        break;
      case 'Bk5':
        control = <FormArray>this.formaTablaBancoMuestras.controls['bks5'];
        control.removeAt(index);
        break;
      case 'Eb':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ebs'];
        control.removeAt(index);
        break;
      case 'Em':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ems'];
        control.removeAt(index);
        break;
      case 'Ea':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Eas'];
        control.removeAt(index);
        break;
      case 'M1':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms1'];
        control.removeAt(index);
        break;
      case 'M2':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms2'];
        control.removeAt(index);
        break;
      case 'M3':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms3'];
        control.removeAt(index);
        break;
      case 'M1Ab':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms1Ab'];
        control.removeAt(index);
        break;
      case 'M1Aa':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms1Aa'];
        control.removeAt(index);
        break;
      case 'M2Ab':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms2Ab'];
        control.removeAt(index);
        break;
      case 'M2Aa':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms2Aa'];
        control.removeAt(index);
        break;
      case 'M3Ab':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms3Ab'];
        control.removeAt(index);
        break;
      case 'M3Aa':
        control = <FormArray>this.formaTablaBancoMuestras.controls['Ms3Aa'];
        control.removeAt(index);
        break;
      case 'RM1':
        control = <FormArray>this.formaRecuperacion.controls['RMs1'];
        control.removeAt(index);
        break;
      case 'RM2':
        control = <FormArray>this.formaRecuperacion.controls['RMs2'];
        control.removeAt(index);
        break;
      case 'RM3':
        control = <FormArray>this.formaRecuperacion.controls['RMs3'];
        control.removeAt(index);
        break;
      case 'RM1Ab':
        control = <FormArray>this.formaRecuperacion.controls['RMs1Ab'];
        control.removeAt(index);
        break;
      case 'RM1Aa':
        control = <FormArray>this.formaRecuperacion.controls['RMs1Aa'];
        control.removeAt(index);
        break;
      case 'RM2Ab':
        control = <FormArray>this.formaRecuperacion.controls['RMs2Ab'];
        control.removeAt(index);
        break;
      case 'RM2Aa':
        control = <FormArray>this.formaRecuperacion.controls['RMs2Aa'];
        control.removeAt(index);
        break;
      case 'RM3Ab':
        control = <FormArray>this.formaRecuperacion.controls['RMs3Ab'];
        control.removeAt(index);
        break;
      case 'RM3Aa':
        control = <FormArray>this.formaRecuperacion.controls['RMs3Aa'];
        control.removeAt(index);
        break;
      default:
        // console.log(array);
        break;
    }
  }
  usaBlanco(valr: string) {
    if (valr === 'Si') {
      this.NB = true;
    } else {
      this.NB = false;
    }
  }

  get Bk1() {
    return this.formaTablaBancoMuestras.get('bks1') as FormArray;
  }
  get Bk2() {
    return this.formaTablaBancoMuestras.get('bks2') as FormArray;
  }
  get Bk3() {
    return this.formaTablaBancoMuestras.get('bks3') as FormArray;
  }
  get Bk4() {
    return this.formaTablaBancoMuestras.get('bks4') as FormArray;
  }
  get Bk5() {
    return this.formaTablaBancoMuestras.get('bks5') as FormArray;
  }
  get Eb() {
    return this.formaTablaBancoMuestras.get('Ebs') as FormArray;
  }
  get Em() {
    return this.formaTablaBancoMuestras.get('Ems') as FormArray;
  }
  get Ea() {
    return this.formaTablaBancoMuestras.get('Eas') as FormArray;
  }
  get M1() {
    return this.formaTablaBancoMuestras.get('Ms1') as FormArray;
  }
  get M2() {
    return this.formaTablaBancoMuestras.get('Ms2') as FormArray;
  }
  get M3() {
    return this.formaTablaBancoMuestras.get('Ms3') as FormArray;
  }
  get M1Ab() {
    return this.formaTablaBancoMuestras.get('Ms1Ab') as FormArray;
  }
  get M1Aa() {
    return this.formaTablaBancoMuestras.get('Ms1Aa') as FormArray;
  }
  get M2Ab() {
    return this.formaTablaBancoMuestras.get('Ms2Ab') as FormArray;
  }
  get M2Aa() {
    return this.formaTablaBancoMuestras.get('Ms2Aa') as FormArray;
  }
  get M3Ab() {
    return this.formaTablaBancoMuestras.get('Ms3Ab') as FormArray;
  }
  get M3Aa() {
    return this.formaTablaBancoMuestras.get('Ms3Aa') as FormArray;
  }
  get RM1() {
    return this.formaRecuperacion.get('RMs1') as FormArray;
  }
  get RM2() {
    return this.formaRecuperacion.get('RMs2') as FormArray;
  }
  get RM3() {
    return this.formaRecuperacion.get('RMs3') as FormArray;
  }
  get RM1Ab() {
    return this.formaRecuperacion.get('RMs1Ab') as FormArray;
  }
  get RM1Aa() {
    return this.formaRecuperacion.get('RMs1Aa') as FormArray;
  }
  get RM2Ab() {
    return this.formaRecuperacion.get('RMs2Ab') as FormArray;
  }
  get RM2Aa() {
    return this.formaRecuperacion.get('RMs2Aa') as FormArray;
  }
  get RM3Ab() {
    return this.formaRecuperacion.get('RMs3Ab') as FormArray;
  }
  get RM3Aa() {
    return this.formaRecuperacion.get('RMs3Aa') as FormArray;
  }


  limpiezaArray() {
    this.bks1 = [];
    this.bks2 = [];
    this.bks3 = [];
    this.bks4 = [];
    this.bks5 = [];
    this.Ebs = [];
    this.Ems = [];
    this.Eas = [];
    this.Ms1 = [];
    this.Ms1Ab = [];
    this.Ms1Aa = [];
    this.Ms2 = [];
    this.Ms2Ab = [];
    this.Ms2Aa = [];
    this.Ms3 = [];
    this.Ms3Ab = [];
    this.Ms3Aa = [];
    this.porcentajeRaAAm1 = [];
    this.porcentajeRaAAm2 = [];
    this.porcentajeRaAAm3 = [];
    this.porcentajeRaABm1 = [];
    this.porcentajeRaABm2 = [];
    this.porcentajeRaABm3 = [];
  }
  llenadoDeArray() {

    if (this.formaTablaBancoMuestras.value.bks1.length > 0) {
      this.formaTablaBancoMuestras.value.bks1.forEach(element => {
        this.bks1.push(parseFloat(element['bk1']));
      });
    }
    if (this.formaTablaBancoMuestras.value.bks2.length > 0) {
      this.formaTablaBancoMuestras.value.bks2.forEach(element => {
        this.bks2.push(parseFloat(element['bk2']));
      });
    }
    if (this.formaTablaBancoMuestras.value.bks3.length > 0) {
      this.formaTablaBancoMuestras.value.bks3.forEach(element => {
        this.bks3.push(parseFloat(element['bk3']));
      });
    }
    if (this.formaTablaBancoMuestras.value.bks4.length > 0) {
      this.formaTablaBancoMuestras.value.bks4.forEach(element => {
        this.bks4.push(parseFloat(element['bk4']));
      });
    }
    if (this.formaTablaBancoMuestras.value.bks5.length > 0) {
      this.formaTablaBancoMuestras.value.bks5.forEach(element => {
        this.bks5.push(parseFloat(element['bk5']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ebs.length > 0) {
      this.formaTablaBancoMuestras.value.Ebs.forEach(element => {
        this.Ebs.push(parseFloat(element['Eb']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ems.length > 0) {
      this.formaTablaBancoMuestras.value.Ems.forEach(element => {
        this.Ems.push(parseFloat(element['Em']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Eas.length > 0) {
      this.formaTablaBancoMuestras.value.Eas.forEach(element => {
        this.Eas.push(parseFloat(element['Ea']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms1.length > 0) {
      this.formaTablaBancoMuestras.value.Ms1.forEach(element => {
        this.Ms1.push(parseFloat(element['M1']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms1Ab.length > 0) {
      this.formaTablaBancoMuestras.value.Ms1Ab.forEach(element => {
        this.Ms1Ab.push(parseFloat(element['M1Ab']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms1Aa.length > 0) {
      this.formaTablaBancoMuestras.value.Ms1Aa.forEach(element => {
        this.Ms1Aa.push(parseFloat(element['M1Aa']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms2.length > 0) {
      this.formaTablaBancoMuestras.value.Ms2.forEach(element => {
        this.Ms2.push(parseFloat(element['M2']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms2Ab.length > 0) {
      this.formaTablaBancoMuestras.value.Ms2Ab.forEach(element => {
        this.Ms2Ab.push(parseFloat(element['M2Ab']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms2Aa.length > 0) {
      this.formaTablaBancoMuestras.value.Ms2Aa.forEach(element => {
        this.Ms2Aa.push(parseFloat(element['M2Aa']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms3.length > 0) {
      this.formaTablaBancoMuestras.value.Ms3.forEach(element => {
        this.Ms3.push(parseFloat(element['M3']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms3Ab.length > 0) {
      this.formaTablaBancoMuestras.value.Ms3Ab.forEach(element => {
        this.Ms3Ab.push(parseFloat(element['M3Ab']));
      });
    }
    if (this.formaTablaBancoMuestras.value.Ms3Aa.length > 0) {
      this.formaTablaBancoMuestras.value.Ms3Aa.forEach(element => {
        this.Ms3Aa.push(parseFloat(element['M3Aa']));
      });
    }
  }


  guardarRecuperacion(): void {
    this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras)
    // console.log(this.ArrRecuperacion)
    if (this.ArrRecuperacion._id === '') {
      this.recuperacionService.create(this.ArrRecuperacion).subscribe((resp: any) => {
        if (resp.success) {
          this.notificationService.addNotify({ title: 'Recuperación En matriz', msg: resp.message, type: 'success' });
          this.ArrRecuperacion = resp.RecuperacionStored;
          // console.log(this.ArrRecuperacion)
        } else {
          this.notificationService.addNotify({ title: 'Recuperación En matriz', msg: resp.error, type: 'error' });
        }
      });
    } else {
      this.recuperacionService.edit(this.ArrRecuperacion).subscribe((resp: any) => {
        if (resp.success) {
          this.ArrRecuperacion = {
            _id: '',
            CantidadMuestras: 0,
            RecuperacionAm1: 0,
            RecuperacionAm2: 0,
            RecuperacionAm3: 0,
            RecuperacionBm1: 0,
            RecuperacionBm2: 0,
            RecuperacionBm3: 0,
            nivelesAdicion: '',
            unidad : '',
            RMs1: [],
            RMs1Ab: [],
            RMs1Aa: [],
            RMs2: [],
            RMs2Ab: [],
            RMs2Aa: [],
            RMs3: [],
            RMs3Ab: [],
            RMs3Aa: [],
            id_validacionMetodo: ''
          };
          this.notificationService.addNotify({ title: 'Recuperación En matriz', msg: resp.message, type: 'success' });
          this.ArrRecuperacion = resp.recuperecion;
          // console.log(this.ArrRecuperacion)
        } else {
          this.notificationService.addNotify({ title: 'Recuperación En matriz', msg: resp.error, type: 'error' });
        }
      });
    }
  }

  /**
   * Metodos Re utilizables
   */
  usaMatrisBlancos(elemento, variable) {
    // console.log(this.matricesBlancos)
    switch (variable) {
      case 'presision':
        if (elemento) {
          this.matricesBlancos.presision = false;
        } else {
          this.matricesBlancos.presision = true;
        }
        break;
      case 'recuperacion':
        if (elemento) {
          this.matricesBlancos.recuperacion = false;
        } else {
          this.matricesBlancos.recuperacion = true;
        }
        break;
    }
  }

  /**
   * Recuperación en matriz
   */

  selectCantMuestras(element: string) {
    switch (element) {
      case '1':
        this.RecuperacionMuestras.m1 = true;
        this.RecuperacionMuestras.m2 = false;
        this.RecuperacionMuestras.m3 = false;
        break;
      case '2':
        this.RecuperacionMuestras.m1 = true;
        this.RecuperacionMuestras.m2 = true;
        this.RecuperacionMuestras.m3 = false;
        break;
      case '3':
        this.RecuperacionMuestras.m1 = true;
        this.RecuperacionMuestras.m2 = true;
        this.RecuperacionMuestras.m3 = true;
        break;
      case 'alto':
        this.Ralto = true;
        this.Rbajo = false;
        break;
      case 'bajo':
        this.Ralto = false;
        this.Rbajo = true;
        break;
      case 'alto-bajo':
        this.Rbajo = true;
        this.Ralto = true;
        break;
    }
  }
  calculoRecuperacion() {
    this.ArrRecuperacion['CantidadMuestras'] = parseInt(this.formaRecuperacion.value.CantidadMuestras);
    this.ArrRecuperacion['RecuperacionAm1'] = this.formaRecuperacion.value.RecuperacionAm1;
    this.ArrRecuperacion['RecuperacionAm2'] = this.formaRecuperacion.value.RecuperacionAm2;
    this.ArrRecuperacion['RecuperacionAm3'] = this.formaRecuperacion.value.RecuperacionAm3;
    this.ArrRecuperacion['RecuperacionBm1'] = this.formaRecuperacion.value.RecuperacionBm1;
    this.ArrRecuperacion['RecuperacionBm2'] = this.formaRecuperacion.value.RecuperacionBm2;
    this.ArrRecuperacion['RecuperacionBm3'] = this.formaRecuperacion.value.RecuperacionBm3;
    this.ArrRecuperacion['nivelesAdicion'] = this.formaRecuperacion.value.nivelesAdicion;
    this.ArrRecuperacion['unidad'] = this.formaRecuperacion.value.unidad;
    if (this.RecuperacionMuestras.m1) {
      this.ArrRecuperacion['RMs1'] = [];
      this.formaRecuperacion.value.RMs1.forEach(element => {
        this.ArrRecuperacion['RMs1'].push(parseFloat(element['RM1']));
      });
      if (this.Ralto) {
        this.ArrRecuperacion['RMs1Aa'] = [];
        this.formaRecuperacion.value.RMs1Aa.forEach(element => {
          this.ArrRecuperacion['RMs1Aa'].push(parseFloat(element['RM1Aa']));
        });
      }
      if (this.Rbajo) {
        this.ArrRecuperacion['RMs1Ab'] = [];
        this.formaRecuperacion.value.RMs1Ab.forEach(element => {
          this.ArrRecuperacion['RMs1Ab'].push(parseFloat(element['RM1Ab']));
        });
      }
    }
    if (this.RecuperacionMuestras.m2) {
      this.ArrRecuperacion['RMs2'] = [];
      this.formaRecuperacion.value.RMs2.forEach(element => {
        this.ArrRecuperacion['RMs2'].push(parseFloat(element['RM2']))
      })
      if (this.Ralto) {
        this.ArrRecuperacion['RMs2Aa'] = [];
        this.formaRecuperacion.value.RMs2Aa.forEach(element => {
          this.ArrRecuperacion['RMs2Aa'].push(parseFloat(element['RM2Aa']))
        })
      }
      if (this.Rbajo) {
        this.ArrRecuperacion['RMs2Ab'] = [];
        this.formaRecuperacion.value.RMs2Ab.forEach(element => {
          this.ArrRecuperacion['RMs2Ab'].push(parseFloat(element['RM2Ab']))
        })
      }
    }
    if (this.RecuperacionMuestras.m3) {
      this.ArrRecuperacion['RMs3'] = [];
      this.formaRecuperacion.value.RMs3.forEach(element => {
        this.ArrRecuperacion['RMs3'].push(parseFloat(element['RM3']));
      })
      if (this.Ralto) {
        this.ArrRecuperacion['RMs3Aa'] = [];
        this.formaRecuperacion.value.RMs3Aa.forEach(element => {
          this.ArrRecuperacion['RMs3Aa'].push(parseFloat(element['RM3Aa']));
        })
      }
      if (this.Rbajo) {
        this.ArrRecuperacion['RMs3Ab'] = [];
        this.formaRecuperacion.value.RMs3Ab.forEach(element => {
          this.ArrRecuperacion['RMs3Ab'].push(parseFloat(element['RM3Ab']));
        })
      }
    }
    this.ArrRecuperacion['id_validacionMetodo'] = this.$identificador;
    const porcentajeMAa1 = [];
    const porcentajeMAa2 = [];
    const porcentajeMAa3 = [];
    const porcentajeMBb1 = [];
    const porcentajeMBb2 = [];
    const porcentajeMBb3 = [];
    if (this.ArrRecuperacion['CantidadMuestras'] >= 1) {
      for (let i = 0; i <= this.ArrRecuperacion['RMs1'].length - 1; i++) {
        // tslint:disable-next-line: max-line-length
        porcentajeMAa1.push(Math.abs(this.ArrRecuperacion['RMs1'][i] - this.ArrRecuperacion['RMs1Aa'][i]) / this.formaRecuperacion.value.RecuperacionAm1);
      }
      for (let i = 0; i <= this.ArrRecuperacion['RMs1'].length - 1; i++) {
        // tslint:disable-next-line: max-line-length
        porcentajeMBb1.push(Math.abs(this.ArrRecuperacion['RMs1'][i] - this.ArrRecuperacion['RMs1Ab'][i]) / this.ArrRecuperacion['RecuperacionBm1']);
      }
      this.promrecnM1 = mean([mean(porcentajeMBb1), mean(porcentajeMAa1)]);
      this.promrecnM1Aa = mean(porcentajeMAa1);
      this.promrecnM1Ab = mean(porcentajeMBb1);
    }
    if (this.ArrRecuperacion['CantidadMuestras'] >= 2) {
      for (let i = 0; i <= this.ArrRecuperacion['RMs2'].length - 1; i++) {
        // tslint:disable-next-line: max-line-length
        porcentajeMAa2.push(Math.abs(this.ArrRecuperacion['RMs2'][i] - this.ArrRecuperacion['RMs2Aa'][i]) / this.ArrRecuperacion['RecuperacionAm2']);
      }
      for (let i = 0; i <= this.ArrRecuperacion['RMs2'].length - 1; i++) {
        // tslint:disable-next-line: max-line-length
        porcentajeMBb2.push(Math.abs(this.ArrRecuperacion['RMs2'][i] - this.ArrRecuperacion['RMs2Ab'][i]) / this.ArrRecuperacion['RecuperacionBm2']);
      }
      this.promrecnM2 = mean([mean(porcentajeMBb2), mean(porcentajeMAa2)]);
      this.promrecnM2Aa = mean(porcentajeMAa2);
      this.promrecnM2Ab = mean(porcentajeMBb2);
    }
    if (this.ArrRecuperacion['CantidadMuestras'] >= 3) {
      for (let i = 0; i <= this.ArrRecuperacion['RMs3'].length - 1; i++) {
        // tslint:disable-next-line: max-line-length
        porcentajeMAa3.push(Math.abs(this.ArrRecuperacion['RMs3'][i] - this.ArrRecuperacion['RMs3Aa'][i]) / this.ArrRecuperacion['RecuperacionAm3']);
      }
      for (let i = 0; i <= this.ArrRecuperacion['RMs3'].length - 1; i++) {
        // tslint:disable-next-line: max-line-length
        porcentajeMBb3.push(Math.abs(this.ArrRecuperacion['RMs3'][i] - this.ArrRecuperacion['RMs3Ab'][i]) / this.ArrRecuperacion['RecuperacionBm3']);
      }
      this.promrecnM3 = mean([mean(porcentajeMBb3), mean(porcentajeMAa3)]);
      this.promrecnM3Aa = mean(porcentajeMAa3);
      this.promrecnM3Ab = mean(porcentajeMBb3);
    }
    const array = {...this.ArrRecuperacion}
    array['promrecnM1'] = this.promrecnM1;
    array['promrecnM1Aa'] = this.promrecnM1Aa;
    array['promrecnM1Ab'] = this.promrecnM1Ab;
    array['promrecnM2'] = this.promrecnM2;
    array['promrecnM2Aa'] = this.promrecnM2Aa;
    array['promrecnM2Ab'] = this.promrecnM2Ab;
    array['promrecnM3'] = this.promrecnM3;
    array['promrecnM3Aa'] = this.promrecnM3Aa;
    array['promrecnM3Ab'] = this.promrecnM3Ab;
    this.ArrayGeneralSubModulos.recuperacion = {
      view: true,
      arr: array
    }
  }

  async updateValidation(key: string): Promise<void> {
    try {
      const response = await this.ValidacionMetodoService.patchValidation(this.$identificador, key, this.validacion[key]);
    } catch (error) {
      console.warn('Error@crear.component@updateValidation', error);
    }
  }
}

