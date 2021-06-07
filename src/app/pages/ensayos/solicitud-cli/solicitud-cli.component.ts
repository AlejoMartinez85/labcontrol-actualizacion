import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from '../../../shared/notification';
import { Ensayo } from '../../../models/ensayo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Muestra } from '../../../models/muestra';
import swal from 'sweetalert2';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { IOption } from 'ng-select';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EnsayoParametro } from '../../../models/ensayo_parametro';
import { templateSourceUrl } from '@angular/compiler';
import { ClienteService } from '../../../services/cliente/cliente.service';
import * as moment from 'moment';
moment.locale('es-CO');

@Component({
  selector: 'app-solicitud-cli',
  templateUrl: './solicitud-cli.component.html',
  styleUrls: ['./solicitud-cli.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class SolicitudCliComponent implements OnInit {

  @Input() ensayo: Ensayo;
  muestraAdd: Muestra;
  form: FormGroup;
  parametros: any;
  parametronew: any;
  muestras: any;
  muestrasel: any;
  ensayos: any;
  columns: any[];
  buscarmuestra: boolean;
  @Output() reloaddata = new EventEmitter<string>();
  cliente: any;
  user: any;
  clientes: any[];
  usuarios: any;
  laboratorios: any[];
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private muestraService: MuestraService,
    private clienteService: ClienteService, ) {
    this.columns = [{ name: 'Codigo Orden' },
    { name: 'Cliente' },
    { name: 'Tecnica analítica' },
    { name: 'Fecha Cotización' },
    { name: '# Muestras' },
    { name: '# Parametros' },
    { name: 'Valor Facturado' },
    { name: 'Estado' }];
    this.ensayo = new Ensayo();
    this.ensayo.estado = 'Cotización';
    this.muestraAdd = new Muestra();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      laboratorio: [null, Validators.required],
      descripcion: [],
      estado: [null, Validators.required],
    });
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cargarEmpresa();
    this.cargarParametros();
    // this.cargarMuestras();
    this.ensayo.estado = 'Cotización';
    this.ensayo.creocli = true;
    this.ensayo.creolab = false;
  }
  closeMyModal(event) {
    this.reloaddata.emit('hide');

  }
  cargarEmpresa() {
    this.clienteService.getById(this.user.tercero._id).subscribe((value) => {
      this.cliente = value.clientes;
      this.clientes = [];
      this.laboratorios = [];
      this.usuarios = [];
      for (let i = 0; i < this.cliente.clientes.length; i++) {
        let cliente = this.cliente.clientes[i];
        this.clientes.push({ value: cliente._id, label: cliente.nombre, disabled: false });


      }
      for (let i = 0; i < this.cliente.laboratorios.length; i++) {
        let laboratorio = this.cliente.laboratorios[i];
        this.laboratorios.push({ value: laboratorio._id, label: laboratorio.nombre, disabled: false });


      }
      this.cliente.usuarios.forEach(user => {

        this.usuarios.push({ value: user._id, label: user.nombre + '(' + user.email + ')', disabled: false });

      });

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  guardarEnsayo(event) {
    this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format();
    if (this.ensayo._id == undefined) {
      this.ensayo.estado = 'Cotización';
      this.ensayo.cliente = this.cliente._id;
      this.ensayo.creocli = true;
      this.ensayo.creolab = false;
      this.ensayo.paso = 1;
      this.ensayoservice.add(this.ensayo).subscribe((value) => {
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo guardado con exito', type: 'success' });
        this.closeMyModal('effect-3');
      }, err => {

        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      this.ensayoservice.update(this.ensayo).subscribe((value) => {
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo Actualizado con exito', type: 'success' });
        this.closeMyModal('effect-3');
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }

  guardarMuestra(event) {

    this.muestraService.add(this.muestraAdd).subscribe((value) => {
      if (this.ensayo.muestras == undefined) {
        this.ensayo.muestras = [];
      }
      this.ensayo.muestras.push(value.data);
      this.agregarMuestrasPartametro(value.data);
      this.muestraAdd = new Muestra();
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Muestra agregada con exito', type: 'success' });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
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
  }
  agregarrMuestra(index) {
    if (this.ensayo.muestras == undefined) {
      this.ensayo.muestras = [];
    }
    this.muestraService.getById(this.muestrasel).subscribe((value) => {
      this.ensayo.muestras.push(value.muestras);
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
    this.parametroService.get(1).subscribe((value) => {
      this.parametros = [];
      for (let i = 0; i < value.parametros.length; i++) {
        let parametro = value.parametros[i];
        this.parametros.push({ value: parametro._id, label: parametro.nombre, disabled: false });


      }

      console.log(this.parametros);

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  // cargarMuestras() {
  //   this.muestraService.getOptions(1).subscribe((value) => {

  //     this.muestras = value.muestras;


  //   }, err => {
  //     this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
  //   });
  // }
  cargarEnsayos(tipo) {
    this.reloaddata.emit('cargar');
  }

  agregarparametro(muestra, parametro, event) {

    this.calcualrtotales();
  }
  calcularcolspan() {
    let col = 5;
    if (this.ensayo.muestras != undefined) {
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
          subvalor = (parametro.parametro.valor_unit * result.length);
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
        valor: 0,
        muestra: this.ensayo.muestras[i],
        seleccionado: false
      });
    }
    this.parametroService.getById(this.parametronew).subscribe((value) => {
      ensayoparam.parametro = value.parametros;
      ensayoparam.valor_unit = value.parametros.valor_unit;
      this.ensayo.parametros.push(ensayoparam);
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
  aprobarEnsayo(event) {
    this.ensayo.estado = 'Aprobado';
    this.guardarEnsayo(event);
  }
  uploadfile(value) {
    this.ensayo.archivos = value;
  }

}
