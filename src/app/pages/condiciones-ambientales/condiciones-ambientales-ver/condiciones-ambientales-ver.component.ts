import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CondicionesAmbientalesService } from '../../../services/condiciones-ambientales/condiciones-ambientales.service';
import { CondicionesAmbientales } from '../../../models/condiciones_ambientales';
import * as ss from 'simple-statistics';
import { mean, sampleStandardDeviation, min, max, sum } from 'simple-statistics';
import { NotificationService } from '../../../shared/notification/notification.service';
import * as ApexCharts from 'apexcharts';
// import ApexCharts from 'apexcharts';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';

@Component({
  selector: 'app-condiciones-ambientales-ver',
  templateUrl: './condiciones-ambientales-ver.component.html',
  styleUrls: ['./condiciones-ambientales-ver.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})


export class CondicionesAmbientalesVerComponent implements OnInit {

  formObservaciones: FormGroup;
  formComentarios: FormGroup;
  formEditCondicionAmbiental: FormGroup;
  $identificador;
  condicionList: CondicionesAmbientales;
  metodosList;
  datosList;
  datosList2;
  datosListchart = [];
  datosListchart2 = [];
  promedio;
  desviacionestandar;
  maximo;
  minmo;
  columns;
  /**
   * Validaciones  Variables
   */
  ucl1: number;
  lcl1: number;
  alertasLimites: boolean = false;
  muestraReglasNelson: boolean = false;
  contadorMayor9: number = 0;
  datosMayor: number = 0;
  datosMenor: number = 0;
  datosMayorMenor14: number = 0;
  datos15conscutivo: number = 0;
  datos8conscutivo: number = 0;
  unsigma = 0;
  unginman = 0;
  cabeceras = ['Fecha', 'Ejecutor', 'Valor', 'Comentario'];
  datoCopypaste = [];
  displayedColumns: string[];
  preloader: boolean;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  user: any;
  constructor(
    private notificationService: NotificationService,
    private condicionesAmbientales: CondicionesAmbientalesService,
    private router: ActivatedRoute,
    private parametrosService: ParametroService,
    private rolesPermisosServices: RolesPermisosService) {
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.columns = [
      { name: 'Fecha', prop: 'Fecha' },
      { name: 'Ejecutor', prop: 'Ejecutor' },
      { name: 'Valor', prop: 'Valor' },
      { name: 'Comentario', prop: 'Comentario' },
      { name: 'alertas', prop: 'alertas' },
      { name: 'Opciones', prop: 'Opciones' }
    ];
    this.preloader = true;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.Permisos = new Permisos();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.condiciones[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.condiciones[0];
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
    const datos = [];
    this.preloader = true;
    const IPOfecha = new Date();
    const fecha = [];
    const fechaArr = [];
    this.datoCopypaste.forEach((element, index) => {
      fecha[index] = element[0].split('/');
      datos[index] = {
        fecha: moment(fecha[index][0] + fecha[index][1] + fecha[index][2], "DDMMYYYY").format(),
        ejecutor: element[1],
        valor: element[2],
        comentario: element[3],
        id_condicionesAmbientales: this.$identificador,
      };
    });
    let cantidad = 0;
    console.log(datos);
    // return;
    datos.forEach(element => {
      this.condicionesAmbientales.addDatos(element).subscribe((datoCreado: any) => {
        if (datoCreado.success) {
          cantidad = cantidad + 1;
          this.reloasMasivo(cantidad);
        }
      });
    });
  }
  reloasMasivo(cant: number) {
    console.log(this.datoCopypaste.length)
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
    this.cargarCondicionAmbiental();
    this.cargarFormularios();
    this.cargarDatos();
    this.cargarMetodosdeEnsayo();
    if (
      this.datosMayor >= 6 ||
      this.datosMenor >= 6 ||
      this.datosMayorMenor14 >= 14 ||
      this.datos15conscutivo >= 15 ||
      this.datos8conscutivo >= 8) {
      this.muestraReglasNelson = true;
    }
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.condiciones[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }

  }
  /**
   * Funciones Generales del sistema
   */

  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
  }
  closeModal(element) {
    document.querySelector('#' + element).classList.remove('md-show');
  }

  cargarFormularios() {
    this.formObservaciones = new FormGroup({
      ejecutor: new FormControl(null, Validators.required),
      valor: new FormControl(null, Validators.required)
    });
    this.formComentarios = new FormGroup({
      comentario: new FormControl(null),
      _id: new FormControl(null)
    });
    this.formEditCondicionAmbiental = new FormGroup({
      name: new FormControl(null),
      unidad: new FormControl(null),
      limite_superior: new FormControl(null),
      limite_inferior: new FormControl(null)
    });
  }

  /**
   * Funciones espesificas
   */

  modalComentarios(id) {
    this.condicionesAmbientales.getIdDato(id).subscribe(dato => {
      this.formComentarios.setValue({
        comentario: dato['dato'].comentario,
        _id: id
      });
    });
    document.querySelector('#modal-generico-comentarios').classList.add('md-show');
  }

  guardarFormObservaciones() {
    const newDate = moment().format();
    this.condicionList['ultimoIngreso'] = `${newDate}`;
    this.condicionesAmbientales.updateCondicionesAmbientales(this.$identificador, this.condicionList).subscribe( (resp => {
      this.notificaciones('Fecha de ingreso actualizada', 'Condiciónes Ambientales', 'success');
    }))
    if (!this.formObservaciones.valid) {
      this.notificaciones('Todos los campos son requeridos', 'Ingresar observación', 'error');
      return;
    }
    if (this.formObservaciones.value.valor < this.condicionList.limite_inferior) {
      this.condicionesAmbientales.updateEstadoCondicionesAmbientales(this.$identificador, { estado: false }).subscribe(condicion => {
        this.notificaciones(condicion['message'], 'Datos', 'success');
      });
    } else {
      this.condicionesAmbientales.updateEstadoCondicionesAmbientales(this.$identificador, { estado: true }).subscribe(condicion => {
        this.notificaciones(condicion['message'], 'Datos', 'success');
      });
    }
    if (this.formObservaciones.value.valor > this.condicionList.limite_superior) {
      this.condicionesAmbientales.updateEstadoCondicionesAmbientales(this.$identificador, { estado: false }).subscribe(condicion => {
        this.notificaciones(condicion['message'], 'Datos', 'success');
      });
    } else {
      this.condicionesAmbientales.updateEstadoCondicionesAmbientales(this.$identificador, { estado: true }).subscribe(condicion => {
        this.notificaciones(condicion['message'], 'Datos', 'success');
      });
    }
    const dato = {
      ejecutor: this.formObservaciones.value.ejecutor,
      valor: this.formObservaciones.value.valor,
      fecha: moment().format(),
      id_condicionesAmbientales: this.$identificador
    };
    this.condicionesAmbientales.addDatos(dato).subscribe(datoCreado => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }
  guardarFormComentarios() {
    if (!this.formComentarios.valid) {
      this.notificaciones('Todos los campos son requeridos', 'Ingresar observación', 'error');
      return;
    }
    const id = this.formComentarios.value._id;
    const datoedit = {
      comentario: this.formComentarios.value.comentario
    };
    this.condicionesAmbientales.updateDatos(id, datoedit).subscribe(dato => {
      this.notificaciones(dato['message'], 'Dato', 'success');
      this.cargarDatos();
    });
    document.querySelector('#modal-generico-comentarios').classList.remove('md-show');
  }

  /**
   * Cargar Condición ambiental
   */
  cargarCondicionAmbiental() {
    this.condicionesAmbientales.getIdCondicionesAmbientales(this.$identificador)
      .subscribe(condicion => {
        this.preloader = false;
        this.condicionList = condicion['condicio'];
        const newDate = moment().format();
        this.condicionList['ultimoIngreso'] = `${newDate}`;
        this.condicionesAmbientales.updateCondicionesAmbientales(this.$identificador, this.condicionList).subscribe( (resp => {
          this.notificaciones('Fecha de ingreso actualizada', 'Condiciónes Ambientales', 'success');
        }))
      });
  }

  cargarMetodosdeEnsayo() {
    this.condicionesAmbientales.getIdMethodosdeEnsayo(this.$identificador)
      .subscribe(metodos => {
        this.cargaMethodos(metodos['registros']);
      });
  }

  cargaMethodos(arr): any {
    const metodosArr = []
    arr.forEach(element => {
      this.parametrosService.getById(element.name).subscribe( (resp : any) => {
        metodosArr.push(resp['parametros']);
      });
    });
    this.metodosList =  metodosArr;
    console.log(this.metodosList);
  }
  cargarDatos() {
    const valoresMedicion = [];
    this.condicionesAmbientales.getIdDatos(this.$identificador).subscribe(datos => {
      this.datosList = datos['registros'];
      this.validaciones(this.datosList);
      if (this.datosList.length > 1) {
        this.datosList.forEach(valor => {
          valoresMedicion.push(valor['valor']);
          this.datosListchart.push(valor['valor']);
          this.datosListchart2.push(valor['fecha']);
        });
        const condicion = {
          promedio: parseFloat(mean(valoresMedicion).toFixed(2)),
          desviacion: parseFloat(sampleStandardDeviation(valoresMedicion).toFixed(2)),
          min: parseFloat(min(valoresMedicion).toFixed(2)),
          max: parseFloat(max(valoresMedicion).toFixed(2))
        };
        this.condicionesAmbientales.updateDatosEstadisticos(this.$identificador, condicion).subscribe(resp => {
          this.notificaciones(resp['message'], 'Condiciones ambientales', 'success');
          this.cargarCondicionAmbiental();
        });
        this.chartsInit();
      }
    });
  }

  /**
   * Eliminar datos
   */
  delete(id) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el dato?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

      this.condicionesAmbientales.deleteDatos(id).subscribe((resp: any) => {
        if (resp.success) {
          this.notificaciones(resp.message, 'Dato', 'success');
          // this.cargarDatos();
          location.reload();
        } else {
          this.notificaciones(resp.message, 'Dato', 'error');
        }
      });

    }
    );
  }
  editCondition() {
    this.formEditCondicionAmbiental.setValue({
      name: this.condicionList['name'],
      unidad: this.condicionList['unidad'],
      limite_superior: this.condicionList['limite_superior'],
      limite_inferior: this.condicionList['limite_inferior']
    });
    document.querySelector('#modal-generico-edit-condition-ambiental').classList.add('md-show');
  }
  editarCondicionAmbiental() {
    if (!this.formEditCondicionAmbiental.valid) {
      this.notificaciones('Los campos son requeridos', 'Control Ambiental', 'error');
      return;
    } else {
      if (this.formEditCondicionAmbiental.value.limite_inferior > this.formEditCondicionAmbiental.value.limite_superior) {
        this.notificaciones('El límite Inferiror no puede ser Mayor que el límite Superiror', 'Control Ambiental', 'error');
        return;
      }
      const condicion = {
        name: this.formEditCondicionAmbiental.value.name,
        unidad: this.formEditCondicionAmbiental.value.unidad,
        limite_superior: this.formEditCondicionAmbiental.value.limite_superior,
        limite_inferior: this.formEditCondicionAmbiental.value.limite_inferior
      }
      this.condicionesAmbientales.update(this.$identificador, condicion).subscribe(resp => {
        this.notificaciones(resp['message'], 'Control Ambiental', 'success');
        this.cargarCondicionAmbiental();
        document.querySelector('#modal-generico-edit-condition-ambiental').classList.remove('md-show');
      })
    }

  }
  /**
   * Notificaciones
   * @param msn String
   * @param titulo String
   * @param tipo String
   */
  notificaciones(msn, titulo, tipo) {
    return this.notificationService.addNotify(
      {
        title: titulo,
        msg: msn,
        type: tipo
      }
    );
  }

  /**
   * Grafica
   */

  chartsInit() {
    document.querySelector('#chart').innerHTML = '';
    document.querySelector('#chart-line2').innerHTML = '';
    document.querySelector('#chart-line').innerHTML = '';
    const datosRef = [];
    const datosReffecha = [];
    let idicacor = 0;
    const LL = [];
    const UL = [];
    this.datosList.forEach(element => {
      datosReffecha.push(moment(element['fecha']).format('YYYYMMDD'))
    });
    this.datosListchart.forEach((dato, index) => {
      idicacor = index + 1;
      datosRef.push('Dato: ' + idicacor);
      LL.push(this.condicionList['limite_inferior']);
      UL.push(this.condicionList['limite_superior']);
    });
    const options = {
      series: [{ data: this.datosListchart }],
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
      labels: datosRef,
      annotations: {
        yaxis: [{
          y: this.condicionList['limite_superior'],
          borderColor: '#800080',
          label: {
            borderColor: '#800080',
            style: {
              color: '#fff',
              background: '#800080',
            },
            text: 'Limite Superior',
          }
        }, {
          y: this.condicionList['limite_inferior'],
          borderColor: '#00E396',
          label: {
            borderColor: '#00E396',
            style: {
              color: '#fff',
              background: '#00E396',
            },
            text: 'Límite Inferior',
          }
        }]
      },
      xaxis: {
        type: 'string',
      },
    };
    const options2 = {
      series: [{ data: this.datosListchart }],
      chart: {
        id: 'chart2',
        type: 'line',
        height: 230,
        toolbar: {
          autoSelected: 'pan',
          show: false
        }
      },
      colors: ['#546E7A'],
      stroke: {
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0
      },
      labels: datosReffecha,
      xaxis: {
        type: 'number',
      },
    };

    const optionsLine = {
      series: [{ data: this.datosListchart }],
      chart: {
        id: 'chart1',
        height: 130,
        type: 'area',
        brush: {
          target: 'chart2',
          enabled: true
        },
        selection: {
          enabled: true,
          xaxis: {
            min: 1,
            max: this.datosListchart.length
          }
        },
      },
      colors: ['#008FFB'],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.91,
          opacityTo: 0.1,
        }
      },
      labels: datosReffecha,
      xaxis: {
        type: 'number',
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        tickAmount: 2
      }
    };
    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();

    const chart2 = new ApexCharts(document.querySelector('#chart-line2'), options2);
    chart2.render();

    const chartLine = new ApexCharts(document.querySelector('#chart-line'), optionsLine);
    chartLine.render();
  }


  validaciones(datosList) {
    const valoresMedicion = [];
    datosList.forEach(valor => {
      valoresMedicion.push(valor['valor']);
      if (valor['valor'] > this.condicionList['promedio']) {
        this.contadorMayor9 = this.contadorMayor9 + 1;
      } else {
        if (this.contadorMayor9 <= 9) {
          this.contadorMayor9 = 0;
        }
      }
    });
    this.ucl1 = this.condicionList.promedio + 3 * sampleStandardDeviation(valoresMedicion);
    this.lcl1 = this.condicionList.promedio - 3 * sampleStandardDeviation(valoresMedicion)
    this.unsigma = this.condicionList.promedio + this.condicionList.desviacion;
    this.unginman = this.condicionList.promedio - this.condicionList.desviacion;
    for (let e = 0; e < datosList.length; e++) {
      if (datosList[e]['valor'] > this.ucl1) {
        this.muestraReglasNelson = true;
      }
      if (datosList[e]['valor'] < this.lcl1) {
        this.muestraReglasNelson = true;
      }
    }
    for (let i = 0; i < datosList.length - 1; i++) {
      if (datosList[i]['valor'] > this.condicionList.limite_superior || datosList[i]['valor'] < this.condicionList.limite_inferior) {
        this.alertasLimites = true;
      }
      const d = i + 2;
      let a = i;
      if (i < datosList.length) {
        if (datosList[i]['valor'] > datosList[i + 1]['valor']) {
          this.datosMayor = this.datosMayor + 1;
        } else {
          this.datosMayor = 0;
        }
        if (datosList[i]['valor'] < datosList[i + 1]['valor']) {
          this.datosMenor = this.datosMenor + 1;
        } else {
          this.datosMenor = 0;
        }
        if (d < datosList.length) {
          if (
            datosList[a]['valor'] > datosList[a + 1]['valor'] &&
            datosList[a + 1]['valor'] < datosList[d]['valor'] ||
            datosList[a]['valor'] < datosList[a + 1]['valor'] &&
            datosList[a + 1]['valor'] > datosList[d]['valor']
          ) {
            a = d + 1;
            this.datosMayorMenor14 = this.datosMayorMenor14 + 1;
          } else {
            this.datosMayorMenor14 = 0;
          }
        }
        if (datosList[i]['valor'] < this.unsigma || datosList[i]['valor'] > this.unginman) {
          this.datos15conscutivo = this.datos15conscutivo + 1;
        } else {
          if (this.datos15conscutivo < 15) {
            this.datos15conscutivo = 0;
          }
        }
        if (datosList[i]['valor'] > this.unsigma || datosList[i]['valor'] < this.unginman) {
          this.datos8conscutivo = this.datos8conscutivo + 1;
        } else {
          if (this.datos8conscutivo < 8) {
            this.datos8conscutivo = 0;
          }
        }
      }
    }
  }
  EditarDato(dato) {
    this.condicionesAmbientales.updateValor(dato).subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Dato', msg: resp.message, type: 'success' });
        this.cargarDatos();
      } else {
        this.notificationService.addNotify({ title: 'Dato', msg: resp.message, type: 'error' });
      }
    })
  }
}
