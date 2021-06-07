import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartasControlService } from '../../../services/cartas-control/cartas-control.service';
import { Carta } from '../../../models/carta.model';
import { DatosService } from '../../../services/cartas-control/datos.service';
import { Datos } from '../../../models/datos.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification/notification.service';
import * as ss from 'simple-statistics';
import { mean, sampleStandardDeviation, min, max } from 'simple-statistics';
import ApexCharts from 'apexcharts';
import { ParametroService } from '../../../services/parametro/parametro.service';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
@Component({
  selector: 'app-cartas-control-ver',
  templateUrl: './cartas-control-ver.component.html',
  styleUrls: ['./cartas-control-ver.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class CartasControlVerComponent implements OnInit {
  titulo: string;
  $identificador;
  cartaEspesifica: Carta;
  datos;
  formDatosComentario: FormGroup;
  formDatos: FormGroup;
  formAlertasCartas: FormGroup;
  formaEditCarta: FormGroup;
  chart1;
  chart2;
  chart3;
  options;
  options2;
  optionsLimite;
  options2Limite;
  decimales: number;
  parametros;
  columns;
  limiteEInf: number;
  limiteEsup: number;
  /**
   * Variables Valor
   */
  contador: number = 0;
  muestraReglasNelson: boolean = false;
  val9omas: boolean = false;
  datosMayor: number = 0;
  datosMenor: number = 0;
  datosMayorMenor14: number = 0;
  datos2conscutivo: number = 0;
  datos4conscutivo: number = 0;
  datos15conscutivo: number = 0;
  datos8conscutivo: number = 0;
  /**
   * Variables Rango
   */
  muestraReglasNelsonRango: boolean = false;
  valorMayor3Sigma: number = 0;
  val9omasRango: boolean = false;
  contadorRango: number = 0;
  datosMayorRango: number = 0;
  datosMenorRango: number = 0;
  datosMayorMenor14Rango: number = 0;
  /**
   * Limites
   */
  alertasLimites: boolean = false;
  /**
   * Cp -Cpk
   */
  Cp: number;
  Cpk: number;
  graficaCpCpk: boolean = false;
  /**
   * Datos Máximo y Mínimo
   */
  DatosMax: number = 0;
  DatosMin: number = 0;
  cabeceras = ['Fecha', 'Ejecutor', 'Valor de observación', 'Comentario'];
  datoCopypaste = [];
  displayedColumns: string[];
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  user: any;
  constructor(
    private router: ActivatedRoute,
    private CartasControl: CartasControlService,
    private datosServices: DatosService,
    private parametroService: ParametroService,
    private notificationService: NotificationService,
    private rolesPermisosServices: RolesPermisosService) {
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.columns = [
      { name: 'Fecha', prop: 'Fecha' },
      { name: 'Ejecutor', prop: 'Ejecutor' },
      { name: '	Valor de observación', prop: '	Valor de observación' },
      { name: 'Rango', prop: 'Rango' },
      { name: 'Comentarios', prop: 'Comentarios' },
      { name: 'Acciones', prop: 'Acciones' },
    ];
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.Permisos = new Permisos();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Cartas[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

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
  copypaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    this.datoCopypaste = [];
    this.displayedColumns = row_data[0].split('\t');
    row_data.forEach(row_data => {
      this.datoCopypaste.push(row_data.split('\t'));
    });
  }
  formMasivo() {
    console.log(this.datoCopypaste)
    let cantidad = 0;
    const fecha = [];
    this.datoCopypaste.forEach((element, index) => {
      fecha[index] = element[0].split('/');
      console.log(this.datos)
      let datosRango  = 0;
      let valor = 0;
        if (this.datos.length > 1 ) {
          datosRango = this.datos[this.datos.length - 1];
          valor = Math.abs(datosRango['valor'] - parseFloat(element[2]));
        } else {
          datosRango = 0;
          valor = datosRango;
        }
          const data = {
            fecha: moment(fecha[index][0] + fecha[index][1] + fecha[index][2], "DDMMYYYY").format(),
            ejecutor: element[1],
            valor: parseFloat(element[2]),
            rango: valor,
            id_cartacontrol: this.formDatos.value.id_cartacontrol
          };
          // if (this.datos.push(data)) {
            this.datosServices.create(data).subscribe((dato: Datos) => {
              this.datos.push(dato['Dato'])
              this.notificationService.addNotify({ title: 'Dato', msg: dato['message'], type: 'success' });
              cantidad = cantidad + 1;
              this.reloasMasivo(cantidad);
            });
          // }
    });

  }
  reloasMasivo(cant: number) {
    if (cant === this.datoCopypaste.length) {
      location.reload();
    }
  }
  editar(id) {
    const campos = [];
    this.datoCopypaste[id].forEach((element, index) => {
      campos.push(document.getElementById('campo-' + index + '-' + id)['value']);
    });
    this.datoCopypaste.splice(id, 1);
    this.datoCopypaste.push(campos);
  }
  eliminar(id) {
    this.datoCopypaste.splice(id, 1);
  }

  ngOnInit() {
    this.cargarCarta();
    this.cargarDatos();
    this.cargarFormaDatos();
    if (
      this.val9omas ||
      this.datosMayor >= 6 ||
      this.datosMenor >= 6 ||
      this.datosMayorMenor14 >= 14 ||
      this.datos2conscutivo >= 2 ||
      this.datos4conscutivo >= 4 ||
      this.datos15conscutivo >= 15 ||
      this.datos8conscutivo >= 8) {
      this.muestraReglasNelson = true;
    }
    if (
      this.val9omasRango ||
      this.datosMayorRango >= 6 ||
      this.datosMenorRango >= 6 ||
      this.datosMayorMenor14Rango >= 14) {
      this.muestraReglasNelsonRango = true;
    }
  }

  cargarFormaDatos() {
    this.formDatosComentario = new FormGroup({
      comentarios: new FormControl(null),
      _id: new FormControl(null)
    });
    this.formDatos = new FormGroup({
      ejecutor: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
      valor2: new FormControl(''),
      id_cartacontrol: new FormControl(this.$identificador)
    });
    this.formAlertasCartas = new FormGroup({
      dias: new FormControl(null),
      rangoSleccionado: new FormControl(null),
      decimales: new FormControl(null),
      limiteSuperiro: new FormControl(null),
      limiteInferior: new FormControl(null),
      limiteEInf: new FormControl(null),
      limiteEsup: new FormControl(null)
    });
    this.formaEditCarta = new FormGroup({
      nombre: new FormControl(''),
      unidad: new FormControl(''),
      methodoEnsallo: new FormControl(''),
      observaciones: new FormControl(''),
      tipoCarta: new FormControl('')
    });
  }

  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
    if (element === 'modal-generico-configuraciones') {
      if (this.cartaEspesifica.limiteSup !== undefined) {
        this.formAlertasCartas.setValue({
          dias: this.cartaEspesifica.dias,
          rangoSleccionado: 1,
          decimales: this.decimales,
          limiteSuperiro: this.cartaEspesifica.limiteSup,
          limiteInferior: this.cartaEspesifica.limiteInf,
          limiteEInf: this.cartaEspesifica.limiteEInf,
          limiteEsup: this.cartaEspesifica.limiteEsup
        })
      }
    }
  }
  closeModal(element) {
    document.querySelector('#'+element).classList.remove('md-show');
  }
  modalalertas() {
    const fecha = new Date(this.cartaEspesifica['creacion']);
    const dias = this.formAlertasCartas.value.dias * parseInt(this.formAlertasCartas.value.rangoSleccionado);
    fecha.setDate(fecha.getDate() + dias);
    if (this.formAlertasCartas.value.limiteEsup < this.formAlertasCartas.value.limiteEInf) {
      alert('EL limite inferior no debe ser mayor al superior');
      return;
    }
    const datosCarta = {
      finPeriodo: fecha,
      decimales: this.formAlertasCartas.value.decimales,
      limiteSup: this.formAlertasCartas.value.limiteSuperiro,
      limiteInf: this.formAlertasCartas.value.limiteInferior,
      limiteEInf: this.formAlertasCartas.value.limiteEInf,
      limiteEsup: this.formAlertasCartas.value.limiteEsup,
      rangoSleccionado: this.formAlertasCartas.value.rangoSleccionado,
      dias: this.formAlertasCartas.value.dias
    };
    console.log(datosCarta)
    this.CartasControl.updateModalAjustes(this.$identificador, datosCarta).subscribe(carta => {
      location.reload();
    });
  }

  /**Datos */
  cargarDatos() {
    this.datosServices.getAll(this.$identificador).subscribe((datosRetorno) => {
      const valores = []
      this.datos = datosRetorno;
      console.log(datosRetorno)
      if (datosRetorno.length >2) {
        this.datos.forEach( element => {
          valores.push(element['valor']);
        });
        this.DatosMax = max(valores);
        this.DatosMin = min(valores);
        if (this.datos.length >= 3) {
          this.edicionCartaControl();
          setTimeout(() => {
            this.chartsDatos();
          }, 1000)
        } else {
          alert('Tiene que cargar como minimo 3 datos');
          this.openModal('modal-generico-ingresar-observaciones');
        }
      }
      /**
       * Valriables Valor
       */
      const unsigma = this.cartaEspesifica.desviacion + this.cartaEspesifica.promedio;
      const unginman = this.cartaEspesifica.promedio - this.cartaEspesifica.desviacion;
      for (let e = 0; e < this.datos.length; e++) {
        if (this.datos[e]['valor'] > this.cartaEspesifica.ucl1) {
          this.muestraReglasNelson = true;
        }
        if (this.datos[e]['valor'] < this.cartaEspesifica.lcl1) {
          this.muestraReglasNelson = true;
        }
        if (this.datos[e]['rango'] > this.cartaEspesifica.ucl2) {
          this.muestraReglasNelsonRango = true;
        }
      }
      for (let i = 0; i < this.datos.length - 1; i++) {
        const d = i + 2;
        let a = i;
        const dRango = i + 2;
        let aRango = i;
        if (this.datos[i]['valor'] < unsigma || this.datos[i]['valor'] > unginman) {
          this.datos15conscutivo = this.datos15conscutivo + 1;
        } else {
          if (this.datos15conscutivo < 15) {
            this.datos15conscutivo = 0;
          }
        }
        if (this.datos[i]['valor'] > unsigma || this.datos[i]['valor'] < unginman) {
          this.datos8conscutivo = this.datos8conscutivo + 1;
        } else {
          if (this.datos8conscutivo < 8) {
            this.datos8conscutivo = 0;
          }
        }

        if (this.datos[i]['valor'] > this.cartaEspesifica.uwl1) {
          this.datos2conscutivo = this.datos2conscutivo + 1;
        } else {
          if (this.datos2conscutivo <= 2) {
            this.datos2conscutivo = 0;
          }
        }
        if (this.datos[i]['valor'] > unsigma) {
          this.datos4conscutivo = this.datos4conscutivo + 1;
        } else {
          if (this.datos4conscutivo < 4) {
            this.datos4conscutivo = 0;
          }
        }
        if (i < this.datos.length) {
          if (this.datos[i]['valor'] > this.datos[i + 1]['valor']) {
            this.datosMayor = this.datosMayor + 1;
          } else {
            this.datosMayor = 0;
          }
          if (this.datos[i]['valor'] < this.datos[i + 1]['valor']) {
            this.datosMenor = this.datosMenor + 1;
          } else {
            this.datosMenor = 0;
          }
          if (d < this.datos.length) {
            if (
              this.datos[a]['valor'] > this.datos[a + 1]['valor'] &&
              this.datos[a + 1]['valor'] < this.datos[d]['valor'] ||
              this.datos[a]['valor'] < this.datos[a + 1]['valor'] &&
              this.datos[a + 1]['valor'] > this.datos[d]['valor']
            ) {
              a = d + 1;
              this.datosMayorMenor14 = this.datosMayorMenor14 + 1;
            } else {
              this.datosMayorMenor14 = 0;
            }
          }
        }
        this.datos.forEach(resp => {
          if (resp.valor > this.cartaEspesifica.promedio) {
            this.contador = this.contador + 1;
          } else {
            this.contador = 0;
          }
        });
        if (this.contador >= 9) {
          this.val9omas = true;
        }
        /**
         * Variables Rango
         */
        this.datos.forEach(resp => {
          if (resp.rango > this.cartaEspesifica.rango) {
            this.contadorRango = this.contadorRango + 1;
          } else {
            this.contadorRango = 0;
          }
        });
        if (this.contadorRango >= 9) {
          this.val9omasRango = true;
        }
        if (i < this.datos.length) {
          if (this.datos[i]['rango'] > this.datos[i + 1]['rango']) {
            this.datosMayorRango = this.datosMayorRango + 1;
          } else {
            this.datosMayorRango = 0;
          }
          if (this.datos[i]['rango'] < this.datos[i + 1]['rango']) {
            this.datosMenorRango = this.datosMenorRango + 1;
          } else {
            this.datosMenorRango = 0;
          }
        }
        if (dRango < this.datos.length) {
          if (
            this.datos[aRango]['rango'] > this.datos[aRango + 1]['rango'] &&
            this.datos[aRango + 1]['rango'] < this.datos[dRango]['rango'] ||
            this.datos[aRango]['rango'] < this.datos[aRango + 1]['rango'] &&
            this.datos[aRango + 1]['rango'] > this.datos[dRango]['rango']
          ) {
            a = d + 1;
            this.datosMayorMenor14Rango = this.datosMayorMenor14Rango + 1;
          } else {
            this.datosMayorMenor14Rango = 0;
          }
        }
        /**
         * Validaciones de limites
         */
        if (this.datos[i]['valor'] > this.cartaEspesifica.limiteSup || this.datos[i]['valor'] < this.cartaEspesifica.limiteInf) {
          this.alertasLimites = true;
        }
      }
    });
  }
  edicionCartaControl() {
    const valoresMedicion = [];
    const valoresMedicionrangos = [];
    this.datos.forEach(data => {
      valoresMedicion.push(data['valor']);
      valoresMedicionrangos.push(data['rango']);
    });
    valoresMedicionrangos.splice(0, 1);
    let LIA2 = mean(valoresMedicionrangos) - (2 * sampleStandardDeviation(valoresMedicionrangos));
    if (LIA2 < 0) {
      LIA2 = 0;
    }
    const data = {
      promedio: parseFloat(mean(valoresMedicion).toFixed(this.decimales)),
      desviacion: parseFloat(sampleStandardDeviation(valoresMedicion).toFixed(this.decimales)),
      desviacionRango: parseFloat(sampleStandardDeviation(valoresMedicionrangos).toFixed(2)),
      rango: parseFloat(mean(valoresMedicionrangos).toFixed(this.decimales)),
      ucl1: mean(valoresMedicion) + 3 * (sampleStandardDeviation(valoresMedicion)),
      uwl1: mean(valoresMedicion) + 2 * (sampleStandardDeviation(valoresMedicion)),
      lwl1: mean(valoresMedicion) - 2 * (sampleStandardDeviation(valoresMedicion)),
      lcl1: mean(valoresMedicion) - 3 * (sampleStandardDeviation(valoresMedicion)),
      ucl2: 3.27 * mean(valoresMedicionrangos),
      uwl2: mean(valoresMedicionrangos) + (2 * sampleStandardDeviation(valoresMedicionrangos)),
      lwl2: LIA2,
      lcl2: 0
    };

    this.CartasControl.updateValores(this.$identificador, data).subscribe(resp => {
      this.notificationService.addNotify({ title: 'Dato', msg: resp['message'], type: 'success' });

    });
  }
  crearDato() {
    if (!this.formDatos.valid) {
      this.notificationService.addNotify({ title: 'Dato', msg: 'Los campos son requeridos', type: 'error' });
    } else {
      if (this.datos.length > 0) {
        const datosRango = this.datos[this.datos.length - 1];
        const valor = Math.abs(datosRango['valor'] - this.formDatos.value.valor);
        const data = {
          ejecutor: this.formDatos.value.ejecutor,
          valor: this.formDatos.value.valor,
          rango: valor,
          id_cartacontrol: this.formDatos.value.id_cartacontrol
        };
        this.incertarDato(data);
      } else {
        const data = {
          ejecutor: this.formDatos.value.ejecutor,
          valor: this.formDatos.value.valor,
          id_cartacontrol: this.formDatos.value.id_cartacontrol
        };
        this.incertarDato(data);
      }
      const newDate = moment().format();
      this.cartaEspesifica['actualizacion'] = `${newDate}`;
      this.CartasControl.update(this.$identificador, this.cartaEspesifica).subscribe( resp => {
        console.log(resp);
      });
    }
    // Clera campos modal
  }
  incertarDato(data) {
    if (this.formDatos.value.valor2) {
      this.datosServices.create(data).subscribe((dato: Datos) => {
        const valor = Math.abs(dato['Dato']['valor'] - this.formDatos.value.valor2);
        let data = {
          ejecutor: this.formDatos.value.ejecutor,
          valor: this.formDatos.value.valor2,
          rango: valor,
          id_cartacontrol: this.formDatos.value.id_cartacontrol
        };
        this.datosServices.create(data).subscribe((dato: Datos) => {
          this.cargarDatos();
          this.notificationService.addNotify({ title: 'Dato', msg: dato['message'], type: 'success' });
        });
      });
    } else {
      this.datosServices.create(data).subscribe((dato: Datos) => {
        this.cargarDatos();
        this.notificationService.addNotify({ title: 'Dato', msg: dato['message'], type: 'success' });
      });
    }
    const ndatos = {
      numeroDatos: this.datos.length
    };
    this.CartasControl.updateNuneroDatos(this.$identificador, ndatos).subscribe(resp => {
      this.notificationService.addNotify({ title: 'Carta', msg: resp['message'], type: 'success' });
    });
    location.reload();
  }
  deleteDato(id) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el parametro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
      this.datosServices.delete(id).subscribe(resp => {
        this.notificationService.addNotify({ title: 'Dato', msg: resp['message'], type: 'success' });
        this.cargarDatos();
      });
    });

  }
  modalComentarios(id) {
    this.datosServices.getOne(id).subscribe((dato: Datos) => {
      console.log((dato));
      this.formDatosComentario.setValue({
        comentarios: dato.comentarios,
        _id: dato._id
      });
      document.querySelector('#modal-generico-comentario').classList.add('md-show');
    });
  }
  guardarComentario() {
    const id = this.formDatosComentario.value._id;
    const comentario = {
      comentarios: this.formDatosComentario.value.comentarios
    };
    this.datosServices.update(id, comentario).subscribe(resp => {
      this.notificationService.addNotify({ title: 'Dato', msg: resp['message'], type: 'success' });
      this.cargarDatos();
      document.querySelector('#modal-generico-comentario').classList.remove('md-show');
    });
  }


  /**Carta */
  cargarCarta() {
    let sigma = 0;
    let Cpu = 0;
    let Cpl = 0;
    this.CartasControl.getId(this.$identificador).subscribe((carta: Carta) => {
      this.cartaEspesifica = carta;
      
      this.titulo = carta['nombre'];
      this.decimales = carta['decimales'];
      sigma = this.cartaEspesifica['rango'] / 1.128;
      if (
        this.cartaEspesifica['limiteEInf'] !== undefined &&
        this.cartaEspesifica['limiteEInf'] !== null &&
        this.cartaEspesifica['limiteEsup'] !== undefined &&
        this.cartaEspesifica['limiteEsup'] !== null) {
        Cpu = (this.cartaEspesifica['promedio'] - this.cartaEspesifica['limiteEInf']) / (3 * sigma);
        Cpl = (this.cartaEspesifica['limiteEsup'] - this.cartaEspesifica['promedio']) / (3 * sigma);
        this.Cp = (this.cartaEspesifica['limiteEsup'] - this.cartaEspesifica['limiteEInf']) / (6 * sigma);
        this.Cpk = min([Cpu, Cpl]);
        // setTimeout(() => {
        //   this.graficaCp_Cpk(this.datos);
        // }, 2000);
      }
    });
  }

  chardata(x, u, s) {
    const exp = -((Math.pow(x - u, 2)) / (2 * Math.pow(s, 2)));
    const data = (1 / Math.sqrt( 2 * Math.PI * s)) * Math.pow(Math.E, exp);
    return data;
  }
  graficaCp_Cpk(arr) {
    document.querySelector('#grafica').innerHTML = '';
    const datos = {
      dato: [],
      desc: []
    };
    const valores = [];
    arr.forEach( element => {
      valores.push(element['valor']);
    });
    const minimo = min(valores);
    const maximo = max(valores);
    const promedio = mean(valores);
    const desviacionDatos = sampleStandardDeviation(valores);
    datos['dato'][0] = null;
    let contador = 0;
    for (let i = minimo; i <= maximo; i += 0.1) {
      datos['dato'][contador + 1] = this.chardata(i, promedio, desviacionDatos);
      contador++;
    }
    const options = {
      series: [
        {
          name: 'curva',
          data: datos['dato']
        }
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },
      title: {
        text: '',
        align: 'left'
      },
      // labels: datos['desc'],
      annotations: {
        // yaxis: [
        //   {
        //     y: limitesup,
        //     borderColor: '#00E396',
        //     label: {
        //       borderColor: '#00E396',
        //       style: {
        //         color: '#fff',
        //         background: '#00E396',
        //       },
        //       text: 'Limite Superior',
        //     }
        //   }, {
        //     y: limiteinf,
        //     borderColor: '#00E396',
        //     label: {
        //       borderColor: '#00E396',
        //       style: {
        //         color: '#fff',
        //         background: '#00E396',
        //       },
        //       text: 'Límite Inferior',
        //     }
        //   }],
        // xaxis: [
        //   {
        //     x: this.cartaEspesifica['limiteEInf'],
        //     x2: this.cartaEspesifica['limiteEsup'],
        //     fillColor: '#B3F7CA',
        //     opacity: 0.4,
        //     label: {
        //       borderColor: '#B3F7CA',
        //       style: {
        //         fontSize: '10px',
        //         color: '#fff',
        //         background: '#00E396'
        //       },
        //       offsetY: -10,
        //       text: 'Rango de Limites'
        //     }
        //   }
        // ],
      }
    };
    const chart = new ApexCharts(document.querySelector('#grafica'), options);
    chart.render();
    this.graficaCpCpk = true;
  }
  chartsDatos() {
    const dataValores = [];
    const dataValore2 = [];
    const numerodatos = [];
    const LSA = [];
    const valoresMedicionrangos = [];
    const LSC = [];
    const LIA = [];
    const LIC = [];
    const LSA2 = [];
    const LSC2 = [];
    const LIA2 = [];
    const LIC2 = [];
    const promedio = [];
    const promedio2 = [];
    const LSUP = [];
    const LINF = [];
    const LESUP = [];
    const LEINF = [];
    this.datos.forEach((dato, index) => {
      valoresMedicionrangos.push(dato['rango']);
    });
    valoresMedicionrangos.splice(0, 1);
    promedio2.push(mean(valoresMedicionrangos).toFixed(2));
    this.datos.forEach((dato, index) => {
      dataValores.push(dato['valor']);
      numerodatos.push(index + 1);
      LSC.push(this.cartaEspesifica['ucl1'].toFixed(2));
      LSA.push(this.cartaEspesifica['uwl1'].toFixed(2));
      LIA.push(this.cartaEspesifica['lwl1'].toFixed(2));
      LIC.push(this.cartaEspesifica['lcl1'].toFixed(2));
      if (this.cartaEspesifica['limiteSup'] !== undefined && this.cartaEspesifica['limiteSup'] !== null) {
        LSUP.push(this.cartaEspesifica['limiteSup']);
      }
      if (this.cartaEspesifica['limiteInf'] !== undefined && this.cartaEspesifica['limiteInf'] !== null) {
        LINF.push(this.cartaEspesifica['limiteInf']);
      }
      if (this.cartaEspesifica['limiteEsup'] !== undefined && this.cartaEspesifica['limiteEsup'] !== null) {
        LESUP.push(this.cartaEspesifica['limiteEsup']);
      }
      if (this.cartaEspesifica['limiteEInf'] !== undefined && this.cartaEspesifica['limiteEInf'] !== null) {
        LEINF.push(this.cartaEspesifica['limiteEInf']);
      }
      if (dato['rango'] != null) {
        dataValore2.push(dato['rango']);
        LSC2.push(this.cartaEspesifica['ucl2'].toFixed(2));
        LSA2.push(this.cartaEspesifica['uwl2'].toFixed(2));
        LIA2.push(this.cartaEspesifica['lwl2'].toFixed(2));
        LIC2.push(this.cartaEspesifica['lcl2'].toFixed(2));
      }
      promedio.push(this.cartaEspesifica['promedio'].toFixed(2));
    });

    this.options = {
      series: [
        {
          name: 'LSC',
          data: LSC
        },
        {
          name: 'LSA',
          data: LSA
        },
        {
          name: 'Valores',
          data: dataValores
        },
        {
          name: 'Promedio',
          data: promedio
        },
        {
          name: 'LIA',
          data: LIA
        },
        {
          name: 'LIC',
          data: LIC
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [3, 3, 5, 1, 3, 3],
        curve: 'straight',
        dashArray: [0, 0, 0, 5, 0, 0]
      },
      title: {
        text: '',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: numerodatos,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + ' (mins)';
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + ' per session';
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    };
    this.options2 = {
      series: [
        {
          name: 'LSC',
          data: LSC2
        },
        {
          name: 'LSA',
          data: LSA2
        },
        {
          name: 'Valores',
          data: dataValore2
        },
        {
          name: 'Promedio',
          data: promedio2
        },
        {
          name: 'LIA',
          data: LIA2
        },
        {
          name: 'LIC',
          data: LIC2
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [3, 3, 5, 1, 3, 3],
        curve: 'straight',
        dashArray: [0, 0, 0, 5, 0, 0]
      },
      title: {
        text: '',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: numerodatos,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + ' (mins)';
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + ' per session';
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    };
    if (this.cartaEspesifica['limiteSup'] !== undefined && this.cartaEspesifica['limiteSup'] !== null) {
      this.options.series.push({
        name: 'Limite Superior',
        data: LSUP
      });
      this.options2.series.push({
        name: 'Limite Superior',
        data: LSUP
      });
    }
    if (this.cartaEspesifica['limiteInf'] !== undefined && this.cartaEspesifica['limiteInf'] !== null) {
      this.options.series.push(
        {
          name: 'Limite Inferior',
          data: LINF
        });
      this.options2.series.push(
        {
          name: 'Limite Inferior',
          data: LINF
        });
    }
    if (this.cartaEspesifica['limiteEInf'] !== undefined && this.cartaEspesifica['limiteEInf'] !== null) {
      this.options.series.push(
        {
          name: 'Limite Inferior de Espesificación',
          data: LEINF
        });
      this.options2.series.push(
        {
          name: 'Limite Inferior de Espesificación',
          data: LEINF
        });
    }
    if (this.cartaEspesifica['limiteEsup'] !== undefined && this.cartaEspesifica['limiteEsup'] !== null) {
      this.options.series.push(
        {
          name: 'Limite Superior de Espesificación',
          data: LESUP
        });
      this.options2.series.push(
        {
          name: 'Limite Superior de Espesificación',
          data: LESUP
        });
    }
    if (this.cartaEspesifica['tipoCarta'] === 'Carta de control exactitud') {
      this.chart1 = new ApexCharts(document.querySelector('#chart'), this.options);
      document.querySelector('#chart').innerHTML = '';
      this.chart1.render();
    } else {
      document.querySelector('#chart2').innerHTML = '';
      this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.options2);
      this.chart2.render();
    }
  }

  /**
   * Modal de eitar carta
   */
  modalEditcarta() {
    document.querySelector('#modal-generico-editarCarta').classList.add('md-show');
    this.parametroService.get(1).subscribe(parametros => this.parametros = parametros['parametros']);
    this.formaEditCarta.setValue({
      nombre: this.cartaEspesifica['nombre'],
      unidad: this.cartaEspesifica['unidad'],
      methodoEnsallo: null,
      observaciones: this.cartaEspesifica['observaciones'],
      tipoCarta: null
    });

  }

  GuardarEdicion() {
    if (!this.formaEditCarta.valid) {
      this.notificationService.addNotify({ title: 'Carta Control', msg: 'Los campos son requerido', type: 'error' });
    } else {
      const datos = {
        nombre: this.formaEditCarta.value.nombre,
        unidad: this.formaEditCarta.value.unidad,
        methodoEnsallo: this.formaEditCarta.value.methodoEnsallo,
        observaciones: this.formaEditCarta.value.observaciones,
        tipoCarta: this.formaEditCarta.value.tipoCarta
      };
      this.CartasControl.update(this.$identificador, datos).subscribe(resp => {
        this.cargarCarta();
        document.querySelector('#modal-generico-editarCarta').classList.remove('md-show');
      });
    }

  }

  edit(id: string): void {
    console.log(id)
  }
  EditarDato(dato) {
    let posicion = 0;
    this.datos.forEach((element, index) => {
      if (element._id === dato._id) {
        posicion = index;
      }
    });
    if (posicion === 0) {
      dato.rango = null;
      const datosRango = this.datos[1];
      datosRango.rango = Math.abs(datosRango.valor - dato.valor);

      this.datosServices.updateDatosValor(dato).subscribe((resp: any) => {
        if (resp.success) {
          this.notificationService.addNotify({ title: 'Datos', msg: resp.message, type: 'success' });
          this.datosServices.updateDatosValor(datosRango).subscribe((resp2: any) => {
            if (resp2.success) {
              this.notificationService.addNotify({ title: 'Datos', msg: resp2.message, type: 'success' });
              location.reload();
            } else {
              this.notificationService.addNotify({ title: 'Datoser', msg: resp.message, type: 'error' });
            }
          });
        } else {
          this.notificationService.addNotify({ title: 'Datos er', msg: resp.message, type: 'error' });
        }
      });
    } else {
      const posSiguiente = posicion + 1;
      const datosRango = this.datos[posicion - 1];
      dato.rango = Math.abs(dato.valor - datosRango.valor);
      this.datosServices.updateDatosValor(dato).subscribe((resp: any) => {
        if (resp.success) {
          this.notificationService.addNotify({ title: 'Datos', msg: resp.message, type: 'success' });
          if (posSiguiente < this.datos.length) {
            const datoRangoSiginte = this.datos[posSiguiente];
            datoRangoSiginte.rango = Math.abs(datoRangoSiginte.valor - dato.valor);
            this.datosServices.updateDatosValor(datoRangoSiginte).subscribe((resp2: any) => {
              if (resp2.success) {
                this.notificationService.addNotify({ title: 'Datos', msg: resp2.message, type: 'success' });
                location.reload();
              } else {
                this.notificationService.addNotify({ title: 'Datoser', msg: resp.message, type: 'error' });
              }
            });
          } else {
            location.reload();
          }
        } else {
          this.notificationService.addNotify({ title: 'Datoser', msg: resp.message, type: 'error' });
        }
      });
    }
  }
}
