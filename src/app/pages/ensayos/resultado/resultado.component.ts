import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ModuleWithComponentFactories } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import * as moment from 'moment';
import { Reporte } from '../../../models/reporte';
import { ClienteService } from '../../../services/cliente/cliente.service';

@Component({
  selector: 'app-enayoresultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {
  form: FormGroup;
  @Input() ensayo: Ensayo;
  @Output() reloaddata = new EventEmitter<string>();
  formp: FormGroup;
  cliente: any;
  clientes: any[];
  usuarios: any[];
  user: any;
  submited: boolean;
  paga = false;
  radicado = false;
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService, ) {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.ensayo = new Ensayo();
    this.cargarEmpresa();

  }
  pago(event) {
    if (event.target.checked) {
      if(this.ensayo.fpago == (undefined || null)){
        this.ensayo.fpago = new Date().toISOString().split('T')[0];
      }
      
      this.paga = true;
    } else {
      // this.ensayo.fpago = null;
      this.paga = false;
    }
  }
  fradicado(event) {
    if (event.target.checked) {
      if(this.ensayo.fFacturado == (undefined || null)){
        this.ensayo.fFacturado = new Date().toISOString().split('T')[0];
      }
      
      this.radicado = true;
    } else {
      // this.ensayo.fFacturado = null;
      this.radicado = false;
    }
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      fFacturado: [null],
      fVencimiento: [null],
      ispago: [],
      isradicado: [],
      fpago: [],
      descripcionpago: [],
      numerofactura: [],
      estado: [],
    });
    this.formp = this.formBuilder.group({
      fFacturado: [null],
      fVencimiento: [null],
      ispago: [],
      isradicado: [],
      fpago: [],
      descripcionpago: [],
      numerofactura: [],
      estado: [],
    });
    console.log(this.ensayo)
  }
  closeMyModal(event) {
    this.reloaddata.emit('hide');

  }


  cargarEmpresa() {
    this.clienteService.getById(this.user.tercero._id).subscribe((value) => {
      this.cliente = value.clientes;
      this.clientes = [];
      this.usuarios = [];
      for (let i = 0; i < this.cliente.clientes.length; i++) {
        let cliente = this.cliente.clientes[i];
        this.clientes.push({ value: cliente._id, label: cliente.nombre, disabled: false });


      }
      this.cliente.usuarios.forEach(user => {

        this.usuarios.push({ value: user._id, label: user.name + '(' + user.email + ')', disabled: false });

      });

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargarEnsayos(tipo) {
    this.reloaddata.emit('cargar');
  }

  guardarEnsayo(event, formulario) {

    this.submited = true;
    if (this.form.invalid && formulario == 1) {
      return false;
    }
    if (this.formp.invalid && formulario == 2) {
      return false;
    }
    if (this.ensayo.estado != 'En Reporte' && this.ensayo.reporte != undefined) {
      this.ensayo.reporte.terminado = false;
    }
    this.submited = false;
    if (this.ensayo._id == undefined) {
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
  calcularVigencia() {
    let now = moment();
  
    var fvencimiento = moment(this.ensayo.fVencimiento, 'YYYY/MM/DD');

    var dayHoy   = now.format('D');
    var dayVencimiento   = fvencimiento.format('D');

    var difDias= parseInt(dayVencimiento) - parseInt(dayHoy);

    if (isNaN(difDias)) {
      return 0;
    }

    return difDias;

  }

  uploadfile(value) {
    console.log(value)
    this.ensayo.archivos = value;
  }


}
