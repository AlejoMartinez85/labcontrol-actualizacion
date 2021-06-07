import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ModuleWithComponentFactories } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import { Actividad } from '../../../models/actividad';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { Reporte } from '../../../models/reporte';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { ActividadService } from '../../../services/actividad/actividad.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  pdf = '';
  preloader = false;
  form: FormGroup;
  @Input() ensayo: Ensayo;
  @Output() reloaddata = new EventEmitter<string>();
  formp: FormGroup;
  cliente: any;
  clientes: any[];
  usuarios: any[];
  user: any;
  submited: boolean;
  showNavegacion: boolean = false;
  reporteManual: boolean = false;
  apiurl: string;
  estructuras: any;
  EstrusturaSeleccionada = '';
  estilos = { 'height': '0', 'overflow': 'auto', 'display': 'block' };

  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
  });
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private actividadService: ActividadService,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,) {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.ensayo = new Ensayo();
    this.cargarEmpresa();
    this.apiurl = environment.apiUrl;
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      estado: [],
    });
    this.formp = this.formBuilder.group({
      usufirma: [null, Validators.required],
      notificar: [],
      ver: [],
      estructura: [],
      codigoinforme: [],
      terminado: [],
      descripcioninforme: [],
      fpublicacion: [null],
    });
    if (this.ensayo.reporte === undefined) {
      this.ensayo.reporte = new Reporte();
    }
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.pdf = `${this.apiurl}upload/files_client/${JSON.parse(response).file.filename}`;
      this.estilos = { 'height': '500px', 'overflow': 'auto', 'display': 'block' };
    };
  }
  subirReposteManual() {
    this.reporteManual = true;
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
        const cliente = this.cliente.clientes[i];
        this.clientes.push({ value: cliente._id, label: cliente.nombre, disabled: false });
      }
      this.cliente.usuarios.forEach(user => {
        this.usuarios.push({ value: user._id, label: user.name + '(' + user.email + ')', disabled: false });
      });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargarEnsayos(event) {
    this.reloaddata.emit('cargar');
  }

  guardarEnsayo(event, formulario) {

    this.submited = true;
    if (this.form.invalid && formulario === 1) {
      return false;
    }
    if (this.formp.invalid && formulario === 2) {
      return false;
    }
    if (this.ensayo.estado !== 'En Reporte' && this.ensayo.reporte != undefined) {
      this.ensayo.reporte.terminado = false;
    }
    this.submited = false;
    if (this.ensayo._id === undefined) {
      this.ensayoservice.add(this.ensayo).subscribe((value) => {
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo guardado con exito', type: 'success' });
        this.closeMyModal('effect-3');
      }, err => {

        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      if (this.reporteManual) {
        this.ensayo.subidaPdfManual = true,
          this.ensayo.urlPdf = this.pdf;

      }
      // if (localStorage.getItem('header') && localStorage.getItem('footer')) {
      //   this.ensayo.encReporte = localStorage.getItem('header');
      //   this.ensayo.pieReporte = localStorage.getItem('footer');
      // }
      console.log(this.ensayo)
      this.ensayoservice.update(this.ensayo).subscribe((value) => {
        this.cargarEnsayos('Pendientes');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo Actualizado con exito', type: 'success' });
        this.closeMyModal('effect-3');
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }
  nosubirReposteManual() {
    this.reporteManual = false;
    this.ensayo.subidaPdfManual = false,
      this.ensayo.urlPdf = null;
  }
  calcularVigencia() {
    const now = moment();
    const b = moment(this.ensayo.fVencimiento);
    return b.diff(now, 'days');

  }

  uploadfile(value) {
    this.ensayo.archivos = value;
  }

  guardarActividades(descripcion, tipoComentario, id) {
    const actividad = new Actividad();
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
  publicar(event, formulario) {
   
      swal({
        title: 'Alerta!',
        text: `Al publicar se generará una versión final de tu informe de resultados y se dará por terminado el informe. Quieres continuar?`,
        showCancelButton: true,
        confirmButtonText: 'Si, Publicar',
        cancelButtonText: 'No',
        useRejections: true
      }).then((result) => {
        if (result) {
          console.log(event)
          if (this.reporteManual) {
            this.ensayo.subidaPdfManual = true;
            this.ensayo.urlPdf = this.pdf;
          }
          this.ensayo.reporte.terminado = true;
          this.ensayo.informPublicado = true;
          if (this.ensayo.fpublicacion === null) {
            this.ensayo.fpublicacion = moment().format('YYYY/MM/DD');
          }
          const btnVistaPrevia = document.getElementById('btnVistaPrevia');
          btnVistaPrevia.click();
          this.guardarEnsayo(event, formulario);
          this.guardarActividades('Ha publicado con éxito el registro de resultados de la solicitud', 'Reporte', this.ensayo._id);
        }
      }
      );
    
  }

  pasarAPublicar() {
    const selectEstructura = document.getElementById('estructura')['value'];
    console.log(selectEstructura)
    const btn = document.getElementById('btnPublicar');
    btn.click();
  }


  showContenidoNavegacion() {
    if (this.showNavegacion === false) {
      this.showNavegacion = true;
    } else if (this.showNavegacion === true) {
      this.showNavegacion = false;
    }
  }
  reloadensayo(event) {
    console.log(event)
    this.ensayo.encReporte = event[0];
    this.ensayo.pieReporte = event[1];
  }
}

