import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ModuleWithComponentFactories } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import * as moment from 'moment';
import { Reporte } from '../../../models/reporte';
import { ClienteService } from '../../../services/cliente/cliente.service';

@Component({
  selector: 'app-pago-cli',
  templateUrl: './pago-cli.component.html',
  styleUrls: ['./pago-cli.component.scss']
})
export class PagoCliComponent implements OnInit {
  form: FormGroup;
  @Input() ensayo: Ensayo;
  @Output() reloaddata = new EventEmitter<string>();
  formp: FormGroup;
  cliente: any;
  clientes: any[];
  usuarios: any[];
  user: any;
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService, ) {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.ensayo = new Ensayo();
    this.cargarEmpresa();

  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      fFacturado: [null, Validators.required],
      fVencimiento: [null, Validators.required],
      ispago: [],
      isradicado: [],
    });
    this.formp = this.formBuilder.group({
      usufirma: [null, Validators.required],
      notificar: [],
      ver: [],
      terminado: [],
    });
    if (this.ensayo.reporte == undefined) {
      this.ensayo.reporte = new Reporte();
    }
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

        this.usuarios.push({ value: user._id, label: user.name + '(' + user.email + ')', disabled: false });

      });

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargarEnsayos(tipo) {
    this.reloaddata.emit('cargar');
  }

  guardarEnsayo(event) {

    if (this.ensayo._id == undefined) {

    } else {
      console.log(this.ensayo)
      this.ensayoservice.update(this.ensayo).subscribe((value) => {

        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo Actualizado con exito', type: 'success' });

      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }
  calcularVigencia() {
    let now = moment();
    let b = moment(this.ensayo.fVencimiento);
    return b.diff(now, 'days');

  }
  uploadfile(value) {
    this.ensayo.archivos = value;
    this.guardarEnsayo(null);
  }

}
