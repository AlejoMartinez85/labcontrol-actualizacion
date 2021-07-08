import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from '../../../shared/notification';
import { Ensayo } from '../../../models/ensayo';
import { FormGroup, FormBuilder, Validators, RadioControlValueAccessor } from '@angular/forms';
import { Muestra } from '../../../models/muestra';
import swal from 'sweetalert2';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { IOption } from 'ng-select';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EnsayoParametro } from '../../../models/ensayo_parametro';
import { templateSourceUrl } from '@angular/compiler';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { ActividadService } from '../../../services/actividad/actividad.service';
import { Actividad } from '../../../models/actividad';
import * as moment from 'moment';
import { ValueTransformer } from '@angular/compiler/src/util';
import { AgrupacionParametrosService } from '../../../services/agrupacion-parametros/agrupacion-parametros.service';
moment.locale('es-CO');
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss',
    '../../../theme/chart/radial/radial.component.scss',
    '../../../../assets/charts/radial/css/radial.scss']
})
export class SolicitudComponent implements OnInit {
  @Input() ensayo: any;
  muestraAdd: Muestra;
  form: FormGroup;
  parametros: any;
  parametronew: any;
  muestras: any;
  muestrasel: any;
  ensayos: any;
  columns: any[];
  buscarmuestra: boolean = false;
  @Output() reloaddata = new EventEmitter<string>();
  cliente: any;
  user: any;
  clientes: any[];
  usuarios: any;
  submited: boolean;
  agrupaciones: any;
  agrupacionsel: any;
  showNavegacion: boolean = false;
  EditarMuestra: boolean = false;
  muestraFinal = {
    imagen_perfil: '',
    codigo: '',
    descripcion: '',
    fecha_ingreso: new Date(),
    observaciones: ''
  };
  fechaHoy = new Date();
  nuevoclienteClickeado: boolean = false;
  nuevaagrupacionClieckeada: boolean = false;
  nuevoparametroClickeado: boolean = false;
  textoLupa : boolean = false;
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private muestraService: MuestraService,
    private clienteService: ClienteService,
    private actividadService: ActividadService,
    private agrupacionparametroService: AgrupacionParametrosService,) {
    this.columns = [{ name: 'Codigo Orden' },
    { name: 'Cliente' },
    { name: 'Tecnica analítica' },
    { name: 'Fecha Cotización' },
    { name: '# Muestras' },
    { name: '# Parametros' },
    { name: 'Valor Facturado' },
    { name: 'Estado' }];
    this.ensayo = new Ensayo();
    this.muestraAdd = new Muestra();
  }

  ngOnInit() {
    this.muestraAdd.fecha_ingreso = new Date().toISOString().split('T')[0];
    this.form = this.formBuilder.group({
      codigo: [null, Validators.required],
      estado: [null, Validators.required],
      numerofactura: [],
      fsolicitud: [null, Validators.required],
      cliente: [null, Validators.required],
      descripcion: [],
    });
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cargarEmpresa();
    this.cargarParametros();
    this.cargarMuestras();
    this.cargarAgrupacion();
    this.nuevoclienteClickeado = false;
    this.nuevoclienteClickeado = false;
    this.nuevaagrupacionClieckeada = false;
    this.nuevoparametroClickeado = false;
  }
  closeMyModal(event) {
    this.reloaddata.emit('hide');
  }
  cargarEmpresa() {
    this.clienteService.getById(this.user.tercero._id).subscribe((value: any) => {
      this.cliente = value.clientes;
      this.clientes = [];
      this.usuarios = [];
      for (let i = 0; i < this.cliente.clientes.length; i++) {
        let cliente = this.cliente.clientes[i];
        this.clientes.push({ value: cliente._id, label: cliente.nombre, disabled: false });


      }
      this.cliente.usuarios.forEach(user => {

        this.usuarios.push({ value: user._id, label: user.nombre + '(' + user.email + ')', disabled: false });

      });

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  recargarEmpresa(){
    this.cargarEmpresa();
    this.notificationService.addNotify({ title: 'Alerta', msg: 'Listado de clientes recargado', type: 'success' });
  }

  cargarAgrupacion() {
    this.agrupacionparametroService.getOptions(1).subscribe((value: any) => {
      this.agrupaciones = value.parametros;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  recargarAgrupacion(){
    this.cargarAgrupacion();
    this.notificationService.addNotify({ title: 'Alerta', msg: 'Listado de Agrupaciones recargado', type: 'success' });
  }
  editMuestra(muestra) {
    this.muestraService.update(muestra).subscribe( (resp: any) => {
      if(resp.success) {
        this.EditarMuestra = false;
      }
    });
  }
  guardarEnsayo(event) {
    // console.log('Guardar Cambios', this.ensayo);

    this.cargaActividades();
    this.clientes.forEach(element => {
      if(element.value === this.ensayo.cliente){
        this.ensayo.nombreCliente = element.label;
      }
    });
    this.submited = true;

    this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format();

    if (this.ensayo._id == undefined) {
      this.ensayo.creocli = false;
      this.ensayo.creolab = true;

      this.ensayo.paso = 1;
      this.ensayoservice.add(this.ensayo).subscribe((value: any) => {
        console.log('guardarEnsayo', value);
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo guardado con exito', type: 'success' });
        this.closeMyModal('effect-3');
        this.guardarActividades('Creo una nueva solicitud de ensayo', 'Ensayo', value.data._id);
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      // if (this.ensayo.estado == 'Cotización') {
      //   this.ensayo.estado = 'Esperando Confirmación';
      // }
      this.ensayoservice.update(this.ensayo).subscribe((value: any) => {
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo Actualizado con exito', type: 'success' });
        this.closeMyModal('effect-3');
        this.guardarActividades('Se actualizo un ensayo', 'Ensato', this.ensayo._id);
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }

  guardarMuestra(event) {
    if (this.muestraAdd.codigo === '') {
      alert('El codigo es necesario para crear una muestra');
      return;
    }
    if (this.muestraAdd.codigo !== undefined) {
      this.muestraFinal['codigo'] = `${this.muestraAdd.codigo}`;
      if (this.muestraAdd.nombre === undefined) {
        this.muestraFinal['descripcion'] = '';
      } else {
        this.muestraFinal['descripcion'] = `${this.muestraAdd.nombre}`;
      }
      if (this.muestraAdd.descripcion === undefined) {
        this.muestraFinal['observaciones'] = '';
      } else {
        this.muestraFinal['observaciones'] = `${this.muestraAdd.descripcion}`;
      }
      this.muestraFinal['fecha_ingreso'] = this.muestraAdd.fecha_ingreso;
      this.muestraFinal['imagen_perfil'] = './assets/images/unnamed.png';

      this.muestraService.add(this.muestraFinal).subscribe((value: any) => {
        if (this.ensayo.muestras === undefined) {
          this.ensayo.muestras = [];
        }
        if (value.success) {
          this.ensayo.muestras.push(value.muestraShared);
          this.agregarMuestrasPartametro(value.muestraShared);
          this.muestraAdd = new Muestra();
          this.muestraAdd.fecha_ingreso = new Date().toISOString().split('T')[0];
          this.notificationService.addNotify({ title: 'Alerta', msg: 'Muestra agregada con exito', type: 'success' });
        } else {
          alert(value.message);
          return;
        }
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
        return;
      });
    } else {
      alert('El codigo es necesario para crear una muestra');
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      return;
    }
  }


  celiminarMuestra(index) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar la muestra?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.eliminarMuestra(index);
      }

    );
  }
  eliminarMuestra(index) {
    this.ensayo.muestras.splice(index, 1);
    for (let i = 0; i < this.ensayo.parametros.length; i++) {
      this.ensayo.parametros[i].muestras.splice(index, 1);
    }
     this.guardarActividades("Eliminó la muestra de ensayo", 'Muestras', this.ensayo._id);
  }
  agregarrMuestra(index) {
    if (this.ensayo.muestras === undefined) {
      this.ensayo.muestras = [];
    }
    this.muestraService.getById(this.muestrasel).subscribe((value: any) => {
      this.ensayo.muestras.push(value.muestra);
      this.agregarMuestrasPartametro(value.muestras);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });

  }
  agregarMuestrasPartametro(muestra) {
    if (this.ensayo.parametros != undefined) {
      for (let i = 0; i < this.ensayo.parametros.length; i++) {
        let addmuestra = Object.assign({}, muestra);

        this.ensayo.parametros[i].muestras.push(addmuestra);
      }
    }
  }
  cargarParametros() {
    this.parametroService.get(1).subscribe((value: any) => {
      this.parametros = [];
      for (let i = 0; i < value.parametros.length; i++) {
        let parametro = value.parametros[i];
        this.parametros.push({ value: parametro._id, label: parametro.nombre, disabled: false });


      }

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  recargarParametros(){

    this.cargarParametros();
    this.notificationService.addNotify({ title: 'Alerta', msg: 'Parámetros recargados con exito ', type: 'Success' });
  }
  cargarMuestras() {
    this.muestraService.getOptions(1).subscribe((value: any) => {

      this.muestras = value.muestras;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargarEnsayos(tipo) {
    this.reloaddata.emit('cargar');
  }

  agregarparametro(muestra, parametro, event) {



    this.calcualrtotales();
  }
  calcularcolspan() {
    let col = 0;
    if (!this.user.analista && !this.user.infofinanciera && this.ensayo.muestras != undefined) {
      col = 5;
      return col + this.ensayo.muestras.length;
    } else if ((this.user.analista || this.user.infofinanciera) && this.ensayo.muestras != undefined) {
      col = 3;
      return col + this.ensayo.muestras.length;
    }
    return col;
  }
  calcualrtotales() {
    this.ensayo.subtotal = 0;
    for (let i = 0; i < this.ensayo.parametros.length; i++) {
      let parametro = this.ensayo.parametros[i];
      if (parametro.muestras != undefined) {
        const result = parametro.muestras.filter((muestra) => muestra.seleccionado == true);
        let subvalor = 0;
        if (result.length > 0) {
          subvalor = (parametro.valor_unit * result.length);
        }
        this.ensayo.subtotal += subvalor;
      }


    }
    //calcular iva
    let iva = 19;
    this.ensayo.piva = iva;
    this.ensayo.iva = this.ensayo.subtotal * (this.ensayo.piva / 100);
    this.ensayo.total = this.ensayo.iva + this.ensayo.subtotal;

  }
  calculatvalorparametro(parametro) {
    const result = parametro.muestras.filter((muestra) => muestra.seleccionado == true);

    if (result.length > 0) {
      return result.length;
    }
    return 0;
  }
  agregarParametro(event) {
    if (this.ensayo.parametros == undefined) {
      this.ensayo.parametros = [];
    }
    let ensayoparam = new EnsayoParametro();
    ensayoparam.muestras = [];
    for (let i = 0; i < this.ensayo.muestras.length; i++) {
      ensayoparam.muestras.push({
        valor: '',
        muestra: this.ensayo.muestras[i],
        seleccionado: true
      });
    }
    this.parametroService.getById(this.parametronew).subscribe((value: any) => {
      ensayoparam.parametro = value.parametros;
      ensayoparam.valor_unit = value.parametros.valor_unit;
      this.ensayo.parametros.push(ensayoparam);
      // this.guardarActividades("Se agrego un parametro");
      this.calcualrtotales();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarParametro(parametro) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el parametro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        let index = this.ensayo.parametros.indexOf(parametro);
        this.ensayo.parametros.splice(index, 1);
      }

    );
  }


  evaluarseleccionado(parametro, muestra) {

    if (parametro.muestras == undefined) {
      return false;
    }
    const result = parametro.muestras.filter(_muestra => _muestra._id == muestra._id);
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  guardarActividades(descripcion, tipoComentario, id) {
    let actividad = new Actividad();
    actividad.cliente = this.ensayo.cliente;
    actividad.descripcion = descripcion;
    actividad.ensayo = id;
    actividad.tercero = this.user.tercero;
    actividad.usuario = this.user.id;
    actividad.fecha = new Date().toISOString().split('T')[0];
    actividad.nombreUsuarioCreador = this.user.name;
    actividad.tipoComentario = tipoComentario;
    this.actividadService.add(actividad).subscribe((value) => {

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'No se pudo almacenar la audirotia ', type: 'error' });
    });
  }
  aplicarAgrupacion($event) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas aplicar la agrupación? ',
      showCancelButton: true,
      confirmButtonText: 'Si, aplicar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.crearParametrosAgrupacion();
      }

    );
  }
  crearParametrosAgrupacion() {
    if (this.ensayo.parametros == undefined) {
      this.ensayo.parametros = [];
    }
    let ensayoparam;
    this.agrupacionparametroService.getById(this.agrupacionsel).subscribe((value: any) => {
      value.parametros.parametros.forEach(parametro => {
        ensayoparam = new EnsayoParametro();
        ensayoparam.muestras = [];
        if (this.ensayo.muestras != undefined) {
          for (let i = 0; i < this.ensayo.muestras.length; i++) {
            ensayoparam.muestras.push({
              valor: '',
              muestra: this.ensayo.muestras[i],
              seleccionado: true
            });
          }
        }

        ensayoparam.parametro = parametro;
        ensayoparam.valor_unit = parametro.valor_unit;
        this.ensayo.parametros.push(ensayoparam);
      });

      // this.guardarActividades("Se aplico la agrupación de parameros con exito");
      this.calcualrtotales();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  pasarAEnProceso(event) {
    let estadocount = 0;
    this.ensayo.estado = 'En Proceso';
    this.ensayo.parametros.forEach(element => {
      element['muestras'].forEach(muestras => {
        if (estadocount === 0) {
          if (muestras['seleccionado']) {
            if (muestras['valor'] === null || muestras['valor'] === '') {
              this.ensayo.estado = 'En Proceso';
              estadocount = 1;
            } else {
              this.ensayo.estado = 'Completado';
            }
          }
        }
      });
    });
  }

  cargaActividades() {
    setTimeout( () => {
      const activityButton = document.getElementById('basic-addon2');
      activityButton.click();
    }, 5000)
  }

  guardarEnsayo2(event) {
    // console.log('pasarAEnProceso2', this.ensayo)
    this.clientes.forEach(element => {
      if(element.value === this.ensayo.cliente){
        this.ensayo.nombreCliente = element.label;
      }
    });
    this.submited = true;
    // if (this.form.invalid) {
    //   return false;
    // }
    this.cargaActividades();
    this.ensayo.paso = 2;
    this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format();
    this.ensayo.fEntrega = this.ensayo.fEntrega == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
    if (this.ensayo._id == undefined) {
      this.ensayo.creocli = false;
      this.ensayo.creolab = true;


      this.ensayoservice.add(this.ensayo).subscribe((value: any) => {
        console.log('guardarEnsayo2', value);
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Solicitud movida al Paso 2', type: 'success' });
        this.guardarActividades('Creo una nueva solicitud de ensayo', 'Ensayo', value.data._id);
      }, err => {

        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }
    else {
      if (this.ensayo.estado == 'Cotización') {
        this.ensayo.estado = 'Esperando Confirmación';
      }
      this.ensayoservice.update(this.ensayo).subscribe((value: any) => {
        console.log('guardarEnsayo2 id != undefined', value);

        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Solicitud movida al Paso 2', type: 'success' });
        this.guardarActividades('Movió la solicitud de en espera a En proceso de ensayo', 'Ensayo', this.ensayo._id);
        this.guardarActividades('Guardó cambios en la solicitud de ensayo', 'Ensayo', this.ensayo._id);
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }


  pasarAEnProceso2(event) {
    this.cargaActividades();
    if (this.ensayo.codigo.length <= 0) {
      return;
    } else if (this.ensayo.cliente.length <= 0) {
      return;
    } else if (this.ensayo.muestras.length <= 0) {
      return;
    } else if (this.ensayo.parametros.length <= 0) {
      return;
    } else {
      swal({
        title: 'Alerta!',
        text: 'Estas seguro que quieres continuar al Paso 2',
        showCancelButton: true,
        confirmButtonText: 'Si, Continuar!',
        cancelButtonText: 'No',
        useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
      }).then((result) => {
          this.pasarAEnProceso(event);
          this.guardarEnsayo2(event);
          this.closeMyModal('effect-3');
      });
    }

  }

  showContenidoNavegacion() {
    if (this.showNavegacion == false) { this.showNavegacion = true; }
    else if (this.showNavegacion == true) { this.showNavegacion = false }
  }
  uploadfile(value) {
    this.ensayo.archivos = value;
  }

  refrescarClientes(){
    this.cargarEmpresa();
    this.notificationService.addNotify({ title: 'Alerta', msg: 'lista de clientes recargados', type: 'succeess' });
  }
}


